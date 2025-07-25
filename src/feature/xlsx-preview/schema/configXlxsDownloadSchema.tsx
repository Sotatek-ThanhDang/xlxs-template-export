/* eslint-disable react-refresh/only-export-components */
import z from "zod";

export const ProcessType = {
  NONE: "NONE",
  DEFINE: "DEFINE",
  DESIGN_AND_CODE: "DESIGN_AND_CODE",
  TESTING: "TESTING",
  UAT: "UAT",
  RELEASE: "RELEASE",
} as const;
export type ProcessType = (typeof ProcessType)[keyof typeof ProcessType];

export const Responsibility = {
  RESPONSIBLE: "RESPONSIBLE",
  NOT_APPLICABLE: "NOT_APPLICABLE",
  SUPPORT: "SUPPORT",
} as const;
export type ResponsibilityType =
  (typeof Responsibility)[keyof typeof Responsibility];

export const configurationSchema = z.object({
  totalMonth: z.number(),
  sprintEachMonth: z.number(),
});

export type ConfigurationSchema = z.infer<typeof configurationSchema>;

export const teamEstimationSchema = z.object({
  position: z.string().min(1, "Required"),
  manMonth: z.number(),
  sotatekResponsibility: z.nativeEnum(Responsibility),
  clientResponsibility: z.nativeEnum(Responsibility),
  process: z
    .array(
      z
        .object({
          processType: z.nativeEnum(ProcessType),
          start: z.number(),
          end: z.number(),
        })
        .refine((data) => data.start <= data.end, {
          message: "Start must be less than End",
          path: ["start"],
        })
    )
    .min(1, { message: "At least one proccess is required" }),
});

export type TeamEstimationSchema = z.infer<typeof teamEstimationSchema>;

export const xlxsDownloadSchema = z.object({
  configuration: configurationSchema,
  teamEstimation: z
    .array(teamEstimationSchema)
    .min(1, { message: "At least one team estimation is required" }),
});

export type XlxsDownload = z.infer<typeof xlxsDownloadSchema>;
