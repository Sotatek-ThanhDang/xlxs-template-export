import type { ConfigurationSchema } from "@/feature/xlsx-preview/schema/configXlxsDownloadSchema";

export const useCalculateSprintDuration = ({
  sprintEachMonth,
  totalMonth,
}: ConfigurationSchema) => {
  const manMonth = totalMonth - 1;
  return {
    manMonth,
    sprintEachMonth: sprintEachMonth,
    totalSprintWithMonthZero: manMonth * sprintEachMonth,
    totalSprint: totalMonth * sprintEachMonth,
    totalManMonth: totalMonth,
  };
};
