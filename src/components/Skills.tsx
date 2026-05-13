import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { type CaseSlug } from "@/content/cases";
import {
  casesUsingSkill,
  skillClusters,
  type Skill,
} from "@/content/skills";
import { useViewTransitionEnabled } from "@/lib/use-view-transition";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type ActiveSkill = {
  /** Cluster key the active chip belongs to. */
  cluster: string;
  /** Skill display name (matches `Skill.name`). */
  name: string;
  /** Slugs of cases whose `stack` ships this skill. */
  slugs: readonly CaseSlug[];
};

type SkillsProps = {
  /** Motion entrance delay, in seconds. Caller controls staggering. */
  delay?: number;
};

/**
 * Stack section for /career — A) skills clustered by intent (agent
 * runtime, frontend craft, infra, eval), B) each chip exposes which
 * Frontier projects ship that skill on hover/focus/tap. The project
 * strip below the clusters is a single aria-live region so screen
 * readers hear the cross-reference instead of guessing at the chip's
 * decorative state.
 *
 * Hover and focus both activate a chip; click toggles (for touch + a11y
 * users without a hover surface). Leaving with the mouse or losing focus
 * deactivates — so the strip never sticks to a stale selection.
 */
export function Skills({ delay = 0 }: SkillsProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const viewTransition = useViewTransitionEnabled();
  const [active, setActive] = useState<ActiveSkill | null>(null);

  return (
    <motion.section
      aria-labelledby="skills-heading"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
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

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {skillClusters.map((cluster) => (
          <article
            key={cluster.key}
            className="text-plate p-6 md:p-8"
          >
            <h3 className="font-mono text-xs uppercase tracking-widest text-ink-muted">
              {t(`career.skills.clusters.${cluster.key}`)}
            </h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {cluster.skills.map((skill) => (
                <SkillChip
                  key={`${cluster.key}-${skill.name}`}
                  cluster={cluster.key}
                  skill={skill}
                  active={active}
                  setActive={setActive}
                />
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div
        aria-live="polite"
        className="mt-8 flex min-h-[2.5rem] flex-wrap items-baseline gap-x-3 gap-y-2"
      >
        {active ? (
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
        ) : (
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            {t("career.skills.selectPrompt")}
          </span>
        )}
      </div>
    </motion.section>
  );
}

type SkillChipProps = {
  cluster: string;
  skill: Skill;
  active: ActiveSkill | null;
  setActive: (next: ActiveSkill | null) => void;
};

function SkillChip({ cluster, skill, active, setActive }: SkillChipProps) {
  const { t } = useTranslation();
  const slugs = casesUsingSkill(skill);
  const isActive = active?.cluster === cluster && active.name === skill.name;
  const next: ActiveSkill = { cluster, name: skill.name, slugs };

  const labelSuffix =
    slugs.length > 0
      ? `. Ships in ${slugs
          .map((slug) => t(`work.cases.${slug}.title`))
          .join(", ")}.`
      : ".";

  return (
    <li>
      <button
        type="button"
        aria-pressed={isActive}
        aria-label={`${skill.name}${labelSuffix}`}
        className={`rounded-full border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-widest transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          isActive
            ? "border-accent text-accent"
            : "border-border text-ink-muted hover:border-accent hover:text-accent"
        }`}
        onMouseEnter={() => setActive(next)}
        onMouseLeave={() => setActive(null)}
        onFocus={() => setActive(next)}
        onBlur={() => setActive(null)}
      >
        {skill.name}
      </button>
    </li>
  );
}
