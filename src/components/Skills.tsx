import {
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Link } from "@tanstack/react-router";
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { cases, type CaseSlug } from "@/content/cases";
import {
  casesUsingSkill,
  skillClusters,
  type Skill,
} from "@/content/skills";
import { useViewTransitionEnabled } from "@/lib/use-view-transition";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const VIEW_W = 880;
const VIEW_H = 540;

const CLUSTER_CENTERS: Record<string, { x: number; y: number }> = {
  "agent-runtime": { x: 250, y: 175 },
  "frontend-craft": { x: 620, y: 175 },
  "infra-data": { x: 620, y: 380 },
  "eval-quality": { x: 250, y: 380 },
};

const PROJECT_CENTER = { x: 440, y: 280 };

type SkillNode = {
  id: string;
  kind: "skill";
  cluster: string;
  name: string;
  slugs: readonly CaseSlug[];
  cx: number;
  cy: number;
  /** d3-force writes these */
  x?: number;
  y?: number;
};

type ProjectNode = {
  id: string;
  kind: "project";
  slug: CaseSlug;
  /** Short glyph used inside the badge (first letter of the slug). */
  glyph: string;
  cx: number;
  cy: number;
  x?: number;
  y?: number;
};

type GraphNode = SkillNode | ProjectNode;
type GraphEdge = { source: string; target: string };

/**
 * Build the constellation once at module load. Layout is deterministic so
 * SSR/prerender and client render produce identical positions — no
 * post-mount layout shift.
 */
const { nodes: GRAPH_NODES, edges: GRAPH_EDGES } = buildGraph();
const NODE_BY_ID = new Map<string, GraphNode>(
  GRAPH_NODES.map((n) => [n.id, n]),
);

function buildGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Project nodes, evenly placed on a small ring around PROJECT_CENTER.
  const projectSlugs = cases.map((c) => c.slug);
  projectSlugs.forEach((slug, i) => {
    const angle = (i / projectSlugs.length) * Math.PI * 2 - Math.PI / 2;
    nodes.push({
      id: `project:${slug}`,
      kind: "project",
      slug,
      glyph: glyphFor(slug),
      cx: PROJECT_CENTER.x,
      cy: PROJECT_CENTER.y,
      x: PROJECT_CENTER.x + Math.cos(angle) * 60,
      y: PROJECT_CENTER.y + Math.sin(angle) * 60,
    });
  });

  // Skill nodes, scattered on a ring around their cluster center.
  for (const cluster of skillClusters) {
    const center =
      CLUSTER_CENTERS[cluster.key] ?? { x: VIEW_W / 2, y: VIEW_H / 2 };
    cluster.skills.forEach((skill, i) => {
      const angle = (i / cluster.skills.length) * Math.PI * 2;
      const node: SkillNode = {
        id: `${cluster.key}:${skill.name}`,
        kind: "skill",
        cluster: cluster.key,
        name: skill.name,
        slugs: casesUsingSkill(skill as Skill),
        cx: center.x,
        cy: center.y,
        x: center.x + Math.cos(angle) * 70,
        y: center.y + Math.sin(angle) * 70,
      };
      nodes.push(node);
      for (const slug of node.slugs) {
        edges.push({ source: node.id, target: `project:${slug}` });
      }
    });
  }

  // Settle with d3-force. No randomness involved — we seeded all positions.
  const sim = forceSimulation(nodes as Array<GraphNode & { x: number; y: number }>)
    .force(
      "link",
      forceLink<GraphNode, GraphEdge>(edges)
        .id((d) => d.id)
        .distance(80)
        .strength(0.25),
    )
    .force("charge", forceManyBody().strength(-220))
    .force(
      "x",
      forceX<GraphNode>((d) => d.cx).strength((d) =>
        d.kind === "project" ? 0.22 : 0.11,
      ),
    )
    .force(
      "y",
      forceY<GraphNode>((d) => d.cy).strength((d) =>
        d.kind === "project" ? 0.22 : 0.11,
      ),
    )
    .force(
      "collide",
      forceCollide<GraphNode>((d) => (d.kind === "project" ? 38 : 24)),
    )
    .stop();

  sim.tick(400);

  // Clamp into the viewBox so labels don't get clipped at the edges.
  for (const n of nodes) {
    n.x = Math.max(60, Math.min(VIEW_W - 60, n.x ?? 0));
    n.y = Math.max(46, Math.min(VIEW_H - 46, n.y ?? 0));
  }

  return { nodes, edges };
}

function glyphFor(slug: CaseSlug): string {
  if (slug === "memory-pkg") return "M";
  if (slug === "sylphie-pkg") return "P";
  if (slug === "enforcement-hooks") return "E";
  return slug[0].toUpperCase();
}

type ActiveSelection =
  | { kind: "skill"; id: string; name: string; slugs: readonly CaseSlug[] }
  | { kind: "project"; id: string; slug: CaseSlug }
  | null;

type SkillsProps = {
  /** Motion entrance delay, in seconds. Caller controls staggering. */
  delay?: number;
};

/**
 * Stack section for /career — skills and featured projects rendered as a
 * force-directed constellation. Edges connect each skill to the projects
 * that ship it; cluster gravity groups the four intent clusters (agent
 * runtime, frontend craft, infra & data, eval & quality). Hovering or
 * focusing any node highlights its connections and dims the rest.
 *
 * Layout is settled at module load so SSR/prerender and hydration emit
 * the same coordinates — no layout shift on mount. A visually hidden
 * definition list mirrors the graph for assistive tech; sighted users
 * with reduced-motion preferences get the settled layout without idle
 * drift.
 */
export function Skills({ delay = 0 }: SkillsProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const viewTransition = useViewTransitionEnabled();
  const [active, setActive] = useState<ActiveSelection>(null);
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * Clear `active` on blur only if focus is leaving the whole section.
   * Without this, tabbing from a node to the project Link in the
   * aria-live strip below would unmount the link before focus reaches it.
   */
  const handleNodeBlur = (e: FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (next && sectionRef.current?.contains(next)) return;
    setActive(null);
  };

  const { connectedNodeIds, connectedEdgeKeys } = useMemo(
    () => connectednessOf(active, GRAPH_EDGES),
    [active],
  );

  const dimmed = active !== null;

  return (
    <motion.section
      ref={sectionRef}
      aria-labelledby="skills-heading"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
      onMouseLeave={() => setActive(null)}
      className="border-t border-border pt-10"
    >
      <div className="text-plate max-w-3xl p-8 md:p-10">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm">
          {t("career.skills.eyebrow")}
        </p>
        <h2
          id="skills-heading"
          className="mt-6 font-display text-3xl leading-[1.1] tracking-tight md:text-4xl"
        >
          {t("career.skills.title")}
        </h2>
        <p className="mt-6 max-w-2xl text-base text-ink-muted md:text-lg">
          {t("career.skills.intro")}
        </p>
      </div>

      {/* Visually-hidden semantic mirror for screen readers — gives them the
          same skill-to-project mapping the SVG presents visually. */}
      <ul className="sr-only">
        {skillClusters.map((cluster) => (
          <li key={cluster.key}>
            {t(`career.skills.clusters.${cluster.key}`)}:
            <ul>
              {cluster.skills.map((skill) => {
                const slugs = casesUsingSkill(skill);
                return (
                  <li key={`${cluster.key}-${skill.name}`}>
                    {skill.name}
                    {slugs.length > 0
                      ? ` — ${t("career.skills.shipsInPrefix")} ${slugs
                          .map((s) => t(`work.cases.${s}.title`))
                          .join(", ")}`
                      : ""}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>

      <div className="text-plate relative mt-10 p-6 md:p-8">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          width="100%"
          aria-label={t("career.skills.graphLabel")}
          className="block h-auto w-full select-none"
        >
          {/* Edges */}
          <g>
            {GRAPH_EDGES.map((e) => {
              const a = NODE_BY_ID.get(e.source);
              const b = NODE_BY_ID.get(e.target);
              if (!a || !b) return null;
              const key = `${e.source}->${e.target}`;
              const isLit = connectedEdgeKeys.has(key);
              return (
                <line
                  key={key}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={
                    isLit ? "var(--color-accent)" : "var(--color-border)"
                  }
                  strokeOpacity={dimmed && !isLit ? 0.25 : 1}
                  strokeWidth={isLit ? 1.25 : 0.75}
                  style={{ transition: "stroke 200ms, stroke-opacity 200ms" }}
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g>
            {GRAPH_NODES.map((n, i) =>
              n.kind === "project" ? (
                <ProjectNodeMark
                  key={n.id}
                  node={n}
                  index={i}
                  active={active}
                  setActive={setActive}
                  onBlur={handleNodeBlur}
                  isConnected={connectedNodeIds.has(n.id)}
                  dimmed={dimmed}
                  reduced={!!reduced}
                />
              ) : (
                <SkillNodeMark
                  key={n.id}
                  node={n}
                  index={i}
                  active={active}
                  setActive={setActive}
                  onBlur={handleNodeBlur}
                  isConnected={connectedNodeIds.has(n.id)}
                  dimmed={dimmed}
                  reduced={!!reduced}
                />
              ),
            )}
          </g>
        </svg>
      </div>

      <div
        aria-live="polite"
        className="mt-6 flex min-h-[2.5rem] flex-wrap items-baseline gap-x-3 gap-y-2"
      >
        {active?.kind === "skill" ? (
          active.slugs.length > 0 ? (
            <>
              <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
                {t("career.skills.shipsInPrefix")} · {active.name} →
              </span>
              {active.slugs.map((slug) => (
                <Link
                  key={slug}
                  to="/cutting-edge-tech/$slug"
                  params={{ slug }}
                  viewTransition={viewTransition}
                  className="font-display text-lg tracking-tight transition-colors hover:text-accent md:text-xl"
                >
                  {t(`work.cases.${slug}.title`)}
                </Link>
              ))}
            </>
          ) : (
            <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
              {t("career.skills.noProjects", { name: active.name })}
            </span>
          )
        ) : active?.kind === "project" ? (
          <>
            <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
              {t("career.skills.projectPrefix")} ·{" "}
              {t(`work.cases.${active.slug}.title`)} →
            </span>
            <Link
              to="/cutting-edge-tech/$slug"
              params={{ slug: active.slug }}
              viewTransition={viewTransition}
              className="font-display text-lg tracking-tight transition-colors hover:text-accent md:text-xl"
            >
              {t("career.skills.openCase")}
            </Link>
          </>
        ) : (
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            {t("career.skills.selectPrompt")}
          </span>
        )}
      </div>
    </motion.section>
  );
}

function connectednessOf(
  active: ActiveSelection,
  edges: readonly GraphEdge[],
) {
  const nodes = new Set<string>();
  const edgeKeys = new Set<string>();
  if (!active) return { connectedNodeIds: nodes, connectedEdgeKeys: edgeKeys };
  nodes.add(active.id);
  for (const e of edges) {
    if (e.source === active.id || e.target === active.id) {
      edgeKeys.add(`${e.source}->${e.target}`);
      nodes.add(e.source);
      nodes.add(e.target);
    }
  }
  return { connectedNodeIds: nodes, connectedEdgeKeys: edgeKeys };
}

type MarkProps<N> = {
  node: N;
  index: number;
  active: ActiveSelection;
  setActive: (next: ActiveSelection) => void;
  /** Containment-aware blur — keeps active set when focus moves to the
      aria-live Link below, so keyboard users can reach it. */
  onBlur: (e: FocusEvent) => void;
  isConnected: boolean;
  dimmed: boolean;
  reduced: boolean;
};

/**
 * Small dot + label. Hover/focus surfaces the skill's projects in the
 * aria-live region below. On reduced-motion the idle drift is suppressed.
 */
function SkillNodeMark({
  node,
  index,
  active,
  setActive,
  onBlur,
  isConnected,
  dimmed,
  reduced,
}: MarkProps<SkillNode>) {
  const isActive = active?.id === node.id;
  const x = node.x ?? node.cx;
  const y = node.y ?? node.cy;

  const handleEnter = () =>
    setActive({
      kind: "skill",
      id: node.id,
      name: node.name,
      slugs: node.slugs,
    });
  const handleKey = (e: ReactKeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleEnter();
    }
  };

  // Per-node drift — deterministic phase so SSR/client match. Drift is
  // ±2.5px on each axis over a 14–20s cycle, staggered by index.
  const driftDuration = 14 + (index % 7);
  const driftDx = ((index * 13) % 5) - 2;
  const driftDy = ((index * 17) % 5) - 2;

  const opacity = dimmed && !isConnected ? 0.25 : 1;

  return (
    <motion.g
      tabIndex={0}
      role="button"
      aria-label={node.name}
      style={{ cursor: "pointer", outline: "none" }}
      onMouseEnter={handleEnter}
      onFocus={handleEnter}
      onBlur={onBlur}
      onClick={handleEnter}
      onKeyDown={handleKey}
      initial={{ x, y, opacity: 1 }}
      animate={
        reduced
          ? { x, y, opacity }
          : {
              x: [x, x + driftDx, x, x - driftDx, x],
              y: [y, y + driftDy, y, y - driftDy, y],
              opacity,
            }
      }
      transition={
        reduced
          ? { duration: 0.25 }
          : {
              x: { duration: driftDuration, repeat: Infinity, ease: "easeInOut" },
              y: {
                duration: driftDuration + 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
              opacity: { duration: 0.25 },
            }
      }
    >
      <circle
        r={3}
        fill={isActive || isConnected ? "var(--color-accent)" : "var(--color-ink)"}
        style={{ transition: "fill 200ms" }}
      />
      {/* Generous transparent hit target — small dots are hard to hover. */}
      <circle r={20} fill="transparent" />
      <text
        x={6}
        y={3}
        className="pointer-events-none font-mono"
        style={{
          fontSize: 9.5,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fill:
            isActive || isConnected
              ? "var(--color-accent)"
              : "var(--color-ink-muted)",
          transition: "fill 200ms",
        }}
      >
        {node.name}
      </text>
      {isActive && (
        <circle
          r={9}
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity={0.4}
          strokeWidth={1}
        />
      )}
    </motion.g>
  );
}

/**
 * Larger badged node with a serif glyph + project title underneath. Hover
 * or focus lights up every skill that ships in this project.
 */
function ProjectNodeMark({
  node,
  index,
  active,
  setActive,
  onBlur,
  isConnected,
  dimmed,
  reduced,
}: MarkProps<ProjectNode>) {
  const { t } = useTranslation();
  const isActive = active?.id === node.id;
  const x = node.x ?? node.cx;
  const y = node.y ?? node.cy;

  const handleEnter = () =>
    setActive({ kind: "project", id: node.id, slug: node.slug });
  const handleKey = (e: ReactKeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleEnter();
    }
  };

  const driftDuration = 22 + (index % 5);
  const driftDx = ((index * 11) % 4) - 1.5;
  const driftDy = ((index * 7) % 4) - 1.5;

  const opacity = dimmed && !isConnected && !isActive ? 0.3 : 1;

  return (
    <motion.g
      tabIndex={0}
      role="button"
      aria-label={t(`work.cases.${node.slug}.title`)}
      style={{ cursor: "pointer", outline: "none" }}
      onMouseEnter={handleEnter}
      onFocus={handleEnter}
      onBlur={onBlur}
      onClick={handleEnter}
      onKeyDown={handleKey}
      initial={{ x, y, opacity: 1 }}
      animate={
        reduced
          ? { x, y, opacity }
          : {
              x: [x, x + driftDx, x, x - driftDx, x],
              y: [y, y + driftDy, y, y - driftDy, y],
              opacity,
            }
      }
      transition={
        reduced
          ? { duration: 0.25 }
          : {
              x: { duration: driftDuration, repeat: Infinity, ease: "easeInOut" },
              y: {
                duration: driftDuration + 3,
                repeat: Infinity,
                ease: "easeInOut",
              },
              opacity: { duration: 0.25 },
            }
      }
    >
      <circle
        r={20}
        fill="var(--color-bg)"
        stroke={
          isActive || isConnected
            ? "var(--color-accent)"
            : "var(--color-ink)"
        }
        strokeWidth={isActive ? 1.75 : 1}
        style={{ transition: "stroke 200ms, stroke-width 200ms" }}
      />
      <text
        x={0}
        y={6}
        textAnchor="middle"
        className="pointer-events-none font-display"
        style={{
          fontSize: 22,
          fill:
            isActive || isConnected
              ? "var(--color-accent)"
              : "var(--color-ink)",
          transition: "fill 200ms",
        }}
      >
        {node.glyph}
      </text>
      <text
        x={0}
        y={40}
        textAnchor="middle"
        className="pointer-events-none font-mono"
        style={{
          fontSize: 9.5,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fill: "var(--color-ink-muted)",
        }}
      >
        {t(`work.cases.${node.slug}.title`)}
      </text>
    </motion.g>
  );
}
