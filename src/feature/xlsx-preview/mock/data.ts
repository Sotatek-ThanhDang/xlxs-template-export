import { SPRINT_COLOR } from "@/feature/xlsx-preview/constants/sprintColor";

export const processData = [
  [1, "Requirement definition/requirement analysis/management", "○", "○"],
  [2, "Design and development (coding)*", "○", "○"],
  [3, "Testing", "○", "○"],
  [4, "User Acceptance Test", "-", "-"],
  [5, "Feedback to UAT", "-", "-"],
  [6, "Production release", "○", "△"],
];

export const processDataSprintDefMaps: Record<
  number,
  { start: number; end: number; color: string }
> = {
  1: { start: 0, end: 5, color: SPRINT_COLOR.DEFINE },
  2: { start: 2, end: 5, color: SPRINT_COLOR.DESIGN_AND_CODE },
  3: { start: 2, end: 5, color: SPRINT_COLOR.TESTING },
  4: { start: 4, end: 5, color: SPRINT_COLOR.UAT },
  5: { start: 4, end: 5, color: SPRINT_COLOR.UAT },
  6: { start: 6, end: 6, color: SPRINT_COLOR.RELEASE },
};

export const teamData = [
  [1, "PM cum BA", "○", "-", 1, 1, 1, 1, 1, 0.5, "", "", 2.75, "", ""],
  [2, "Designer", "○", "-", 1, 1, "", "", "", "", "", "", 2, "", ""],
  [3, "Frontend dev", "○", "-", "", "", 1, 1, 1, 1, "", "", 2, "", ""],
  [4, "Backend dev", "○", "-", "", "", 1, 1, 1, 1, 0.5, "", 2.25, "", ""],
  [5, "Tester", "○", "-", "", "", 1, 2, 2, 2, 2, "", 3.5, "", ""],
  [6, "Korean Communicator", "○", "-", "", 1, 1, 1, 1, "", "", "", 2.5, "", ""],
];
