import { cases, type CaseSlug } from "./cases";

export type Skill = {
  /** Display name shown in the chip. */
  name: string;
  /**
   * Alternate spellings that may appear in a case's `stack` array.
   * Used for matching when computing which projects ship a given skill.
   */
  aliases?: readonly string[];
};

export type SkillCluster = {
  /** i18n key suffix under `career.skills.clusters`. */
  key: string;
  skills: readonly Skill[];
};

/**
 * Skills grouped by *intent*, not by category. The point is to communicate
 * what each tool gets reached for, so a reader can see the shape of the
 * work, not just an inventory of badges.
 *
 * A skill may appear in more than one cluster when it's genuinely used
 * across intents (e.g., TypeScript anchors both the agent-runtime and
 * frontend-craft work).
 */
export const skillClusters: readonly SkillCluster[] = [
  {
    key: "agent-runtime",
    skills: [
      { name: "TypeScript" },
      { name: "Node.js", aliases: ["Node"] },
      { name: "Python" },
      { name: "Claude SDK" },
      { name: "MCP" },
      { name: "PostgreSQL", aliases: ["Postgres trigram"] },
      { name: "TimescaleDB" },
      { name: "Neo4j" },
      { name: "ts-morph" },
      { name: "Bash" },
    ],
  },
  {
    key: "frontend-craft",
    skills: [
      { name: "React" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "Vite" },
      { name: "TanStack Router" },
      { name: "MDX" },
      { name: "Motion" },
    ],
  },
  {
    key: "infra-data",
    skills: [
      { name: "Railway" },
      { name: "Docker" },
      { name: "Nest.js" },
      { name: "GraphQL" },
      { name: "REST" },
    ],
  },
  {
    key: "eval-quality",
    skills: [
      { name: "Playwright" },
      { name: "Claude Code hooks" },
      { name: "Sonnet" },
      { name: "Vitest" },
    ],
  },
];

/**
 * Return the slugs of cases whose `stack` array contains the skill's name
 * or any of its aliases. Used to surface which projects ship each skill
 * when the chip is hovered/focused on /career.
 */
export function casesUsingSkill(skill: Skill): readonly CaseSlug[] {
  const matchers = new Set<string>([skill.name, ...(skill.aliases ?? [])]);
  return cases
    .filter((c) => c.stack.some((s) => matchers.has(s)))
    .map((c) => c.slug);
}
