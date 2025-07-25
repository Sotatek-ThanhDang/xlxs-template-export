import { arrayPadEnd, convertToOrdinal } from "@/lib/formatter";
import XLSX, { type WorkBook, type WorkSheet } from "xlsx-js-style";
import { processData, processDataSprintDefMaps } from "../mock/data";
import type { ConfigurationSchema } from "@/feature/xlsx-preview/schema/configXlxsDownloadSchema";
import { useCalculateSprintDuration } from "./useCaculateSprintDuration";

// ----------------------------------
// Types
// ----------------------------------
type CellValue = string | number | boolean;
type Style = XLSX.CellStyle;

interface CellObject {
  v: CellValue;
  s: Style;
}

// ----------------------------------
// Styles
// ----------------------------------

const baseBorder: XLSX.CellStyle["border"] = {
  top: { style: "thin", color: { rgb: "000000" } },
  bottom: { style: "thin", color: { rgb: "000000" } },
  left: { style: "thin", color: { rgb: "000000" } },
  right: { style: "thin", color: { rgb: "000000" } },
};

const centerStyle: Style = {
  alignment: { vertical: "center", horizontal: "center", wrapText: true },
  border: baseBorder,
};

const headerStyle: Style = {
  ...centerStyle,
  font: { bold: true, color: { rgb: "FFFFFF" } },
  fill: { fgColor: { rgb: "2F75B5" } },
};

// ----------------------------------
// Utility Functions
// ----------------------------------

function createCell(value: CellValue, style: Style = centerStyle): CellObject {
  return { v: value ?? "", s: style };
}

function applyStylesToSheet(sheet: WorkSheet, data: CellObject[][]): void {
  data.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellRef = XLSX.utils.encode_cell({ c: colIndex, r: rowIndex });
      sheet[cellRef] = {
        v: cell.v,
        s: cell.s,
        t: typeof cell.v === "number" ? "n" : "s",
      };
    });
  });

  sheet["!ref"] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: data.length - 1, c: data[0].length - 1 },
  });

  sheet["!cols"] = Array.from({ length: data[0].length }, (_, idx) => ({
    wch: idx === 1 ? 30 : 10,
  }));
}

// ----------------------------------
// Hook: useDownloadEstimateExcel
// ----------------------------------

export function useDownloadEstimateExcel(configuration: ConfigurationSchema) {
  const { totalManMonth, totalSprintWithMonthZero, sprintEachMonth } =
    useCalculateSprintDuration(configuration);

  function exportToExcel({
    teamData: rawTeamData,
    teamEstimationColorMapping,
  }: {
    teamData: string[][];
    teamEstimationColorMapping: any;
  }): void {
    const processData = getProcessData(
      totalManMonth,
      sprintEachMonth,
      totalSprintWithMonthZero
    );
    const teamData = getTeamData(
      rawTeamData,
      totalManMonth,
      sprintEachMonth,
      totalSprintWithMonthZero
    );

    const fullData: CellObject[][] = [];

    // Style and transform processData
    processData.forEach((row) => {
      const styledRow = row.map((value, colIndex) => {
        if (typeof value === "object") {
          return value;
        }

        const rowKey = row[0];
        const colorMapping =
          processDataSprintDefMaps[
            rowKey as unknown as keyof typeof processDataSprintDefMaps
          ];

        let style = { ...centerStyle };

        const hasColorMapping =
          colorMapping &&
          colIndex - 4 >= colorMapping.start &&
          colIndex - 4 <= colorMapping.end;

        if (hasColorMapping) {
          style = { ...style, fill: { fgColor: { rgb: colorMapping.color } } };
        }

        return createCell(value, style);
      });

      fullData.push(styledRow);
    });

    const processMerges = getProcessMerges();

    // Space between tables
    fullData.push([], [], []);

    const teamStartRow = fullData.length;

    // Style and transform teamData
    teamData.forEach((row) => {
      const styledRow = row.map((value, colIndex) => {
        if (typeof value === "object") {
          return value;
        }

        const rowKey = row[0];
        const colorMapping =
          teamEstimationColorMapping[
            rowKey as unknown as keyof typeof teamEstimationColorMapping
          ];

        let style = { ...centerStyle };

        if (colorMapping) {
          const found = colorMapping.find(
            (mapping: any) =>
              colIndex - 4 >= mapping.start && colIndex - 4 <= mapping.end
          );

          if (found) {
            style = {
              ...style,
              fill: { fgColor: { rgb: found.color } },
            };
          }
        }

        return createCell(value, style);
      });

      fullData.push(styledRow);
    });

    const teamMerges = getTeamMerges(teamStartRow);

    const sheet: WorkSheet = XLSX.utils.aoa_to_sheet([]);
    applyStylesToSheet(sheet, fullData);
    sheet["!merges"] = [...processMerges, ...teamMerges];

    const workbook: WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
    XLSX.writeFile(workbook, "bao_gia.xlsx");
  }

  return { exportToExcel };
}

// ----------------------------------
// Table Data Generators
// ----------------------------------

const generateHeader = ({
  type,
  totalManMonth,
  sprintEachMonth,
  totalSprint,
}: {
  type: "by_process" | "composition_of_team";
  totalManMonth: number;
  sprintEachMonth: number;
  totalSprint: number;
}) => {
  const extendCols = {
    by_process: ["", "", ""],
    composition_of_team: ["man-month", "unit price ($)", "subtotal ($)"],
  }[type];

  const headerTitle = {
    by_process: "By Process",
    composition_of_team: "Composition of the team",
  }[type];

  const subHeaderTitle = {
    by_process: "Process",
    composition_of_team: "Position",
  }[type];

  const applyHeaderStyle = (
    headers: string[],
    hasBackgroundColor: boolean = false
  ) =>
    headers.map((header) =>
      createCell(header, hasBackgroundColor ? headerStyle : centerStyle)
    );

  return [
    applyHeaderStyle([
      headerTitle,
      "",
      "",
      "",
      ...Array.from({ length: totalManMonth }, (_, idx) =>
        arrayPadEnd([`Month ${idx}`], sprintEachMonth, "")
      ).flat(),
      ...extendCols,
    ]),
    applyHeaderStyle(
      [
        "#",
        subHeaderTitle,
        "SotaTek",
        "Client",
        ...Array.from({ length: sprintEachMonth }, () => ""),
        ...Array.from(
          { length: totalSprint },
          (_, idx) => `${convertToOrdinal(idx + 1)} sprint`
        ),
      ],
      true
    ),
  ];
};

function getProcessData(
  totalManMonth: number,
  sprintEachMonth: number,
  totalSprint: number
): (CellObject | CellValue)[][] {
  const totalColumn = processData[0].length + totalManMonth * sprintEachMonth;

  return [
    ...generateHeader({
      type: "by_process",
      totalManMonth,
      sprintEachMonth,
      totalSprint,
    }),
    ...processData.map((row) => arrayPadEnd(row, totalColumn, "")),
  ];
}

function getTeamData(
  teamData: string[][],
  totalManMonth: number,
  sprintEachMonth: number,
  totalSprint: number
): (CellObject | CellValue)[][] {
  return [
    ...generateHeader({
      type: "composition_of_team",
      totalManMonth,
      sprintEachMonth,
      totalSprint,
    }),
    ...teamData,
  ];
}

// ----------------------------------
// Merge Cell Logic
// ----------------------------------
// TODO: write merge cell logic with dynamic sprint, dynamic man month
function getProcessMerges(): XLSX.Range[] {
  return [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
    { s: { r: 0, c: 4 }, e: { r: 0, c: 5 } },
    { s: { r: 0, c: 6 }, e: { r: 0, c: 7 } },
    { s: { r: 0, c: 8 }, e: { r: 0, c: 9 } },
    { s: { r: 0, c: 10 }, e: { r: 0, c: 11 } },
  ];
}

// TODO: write merge cell logic with dynamic sprint, dynamic man month
function getTeamMerges(startRow: number): XLSX.Range[] {
  return [
    { s: { r: startRow, c: 0 }, e: { r: startRow, c: 3 } },
    { s: { r: startRow, c: 4 }, e: { r: startRow, c: 5 } },
    { s: { r: startRow, c: 6 }, e: { r: startRow, c: 7 } },
    { s: { r: startRow, c: 8 }, e: { r: startRow, c: 9 } },
    { s: { r: startRow, c: 10 }, e: { r: startRow, c: 11 } },
  ];
}
