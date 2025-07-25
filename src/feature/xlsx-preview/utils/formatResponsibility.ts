import {
  Responsibility,
  type ResponsibilityType,
} from "../schema/configXlxsDownloadSchema";

export function formatResponsibility(data: ResponsibilityType) {
  switch (data) {
    case Responsibility.RESPONSIBLE:
      return "○";
    case Responsibility.NOT_APPLICABLE:
      return "-";
    case Responsibility.SUPPORT:
      return "△";
  }
}
