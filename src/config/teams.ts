export const TEAM_IDS = ["FAC", "WH", "SAMYAN"] as const;
export type TeamId = (typeof TEAM_IDS)[number];

export type Team = {
  id: TeamId;
  name: string;
  /** ชื่อ CSS variable จาก brief ข้อ 8.2 */
  color: string;
  bg: string;
};

export const TEAMS: Record<TeamId, Team> = {
  FAC: { id: "FAC", name: "โรงงาน", color: "var(--team-fac)", bg: "var(--team-fac-bg)" },
  WH: { id: "WH", name: "คลัง", color: "var(--team-wh)", bg: "var(--team-wh-bg)" },
  SAMYAN: { id: "SAMYAN", name: "สามย่าน", color: "var(--team-samyan)", bg: "var(--team-samyan-bg)" },
};
