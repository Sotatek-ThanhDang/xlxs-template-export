import { HotTable } from "@handsontable/react-wrapper";
import "./reset.css";
import { convertToOrdinal } from "@/lib/formatter";
import Handsontable from "handsontable";
import { useMemo, type ComponentProps } from "react";
import { useDownloadEstimateExcel } from "../hooks/useDownloadEstimateExcel";
import { Button } from "@/components/ui/button";
import { useCalculateSprintDuration } from "../hooks/useCaculateSprintDuration";
import { SPRINT_COLOR } from "@/feature/xlsx-preview/constants/sprintColor";
import { useXlsxSettingsState } from "../context/XlsxSettingsContext";
import { transformJsonDataToAoaXlxsData } from "../utils/transformJsonDataToAoaXlxsData";

type NestedHeaderProps = ComponentProps<typeof HotTable>["nestedHeaders"];
type CellProps = ComponentProps<typeof HotTable>["cell"];

export default function PreviewTable({
  onPrevious,
}: {
  onPrevious: () => void;
}) {
  const { xlsxSettings } = useXlsxSettingsState();
  const { exportToExcel } = useDownloadEstimateExcel(
    xlsxSettings.configuration
  );

  const {
    totalManMonth,
    totalSprintWithMonthZero,
    totalSprint,
    sprintEachMonth,
  } = useCalculateSprintDuration(xlsxSettings.configuration);

  const data = transformJsonDataToAoaXlxsData(
    xlsxSettings.teamEstimation,
    totalSprint
  );

  const teamEstimationColorMapping = useMemo(() => {
    return xlsxSettings.teamEstimation.reduce(
      (pre, curr, idx) => ({
        ...pre,
        [idx + 1]: curr.process.map((p) => ({
          start: p.start,
          end: p.end,
          color: SPRINT_COLOR[p.processType],
        })),
      }),
      {}
    );
  }, [xlsxSettings.teamEstimation]);

  const nestedHeaders: NestedHeaderProps = [
    [
      { label: "", colspan: 1, headerClassName: "hidden" },
      { label: "", colspan: 1, headerClassName: "hidden" },
      { label: "", colspan: 1, headerClassName: "hidden" },
      { label: "", colspan: 1, headerClassName: "hidden" },
      ...Array.from({ length: totalManMonth }).map((_, idx) => ({
        label: `Month ${idx}`,
        colspan: sprintEachMonth,
      })),
      { label: "", colspan: 1, headerClassName: "hidden" },
      { label: "", colspan: 1, headerClassName: "hidden" },
      { label: "", colspan: 1, headerClassName: "hidden" },
    ],
    [
      { label: "#", colspan: 0, headerClassName: "table-header-row-span" },
      {
        label: "Position",
        colspan: 0,
        headerClassName: "table-header-row-span",
      },
      {
        label: "Sotatek",
        colspan: 0,
        headerClassName: "table-header-row-span",
      },
      { label: "Client", colspan: 0, headerClassName: "table-header-row-span" },
      ...Array.from({ length: sprintEachMonth }, () => ""),
      ...Array.from(
        { length: totalSprintWithMonthZero },
        (_, idx) => `${convertToOrdinal(idx + 1)} sprint`
      ),
      {
        label: "man-month",
        colspan: 0,
        headerClassName: "table-header-row-span",
      },
      {
        label: "unit price ($)",
        colspan: 0,
        headerClassName: "table-header-row-span",
      },
      {
        label: "total ($)",
        colspan: 0,
        headerClassName: "table-header-row-span",
      },
    ],
  ];

  console.log(nestedHeaders);

  const columnColorStyle: CellProps = (
    Object.values(teamEstimationColorMapping) as Array<
      { start: number; end: number; color: string }[]
    >
  ).flatMap((arrSprintConfig, rowIdx) =>
    arrSprintConfig.flatMap((mapping) => {
      const cells: CellProps = [];
      for (let i = mapping.start; i <= mapping.end; i++) {
        cells.push({
          row: rowIdx,
          col: i + 4,
          renderer: (instance, td, ...rest) => {
            Handsontable.renderers.TextRenderer(instance, td, ...rest);
            td.style.backgroundColor = `#${mapping.color}`;
          },
        });
      }
      return cells;
    })
  );

  return (
    <div className="w-full h-full">
      <div
        className="w-full max-w-full h-[800px]"
        style={{ zIndex: 0, position: "relative", overflowX: "auto" }}
      >
        <div className="text-right">
          <Button
            variant="outline"
            className="mb-4"
            onClick={() =>
              exportToExcel({
                teamData: data as string[][],
                teamEstimationColorMapping,
              })
            }
          >
            Download Excel
          </Button>
        </div>

        <HotTable
          className="table-with-rowspan"
          data={data}
          nestedHeaders={nestedHeaders}
          licenseKey="non-commercial-and-evaluation"
          autoWrapRow
          autoWrapCol
          stretchH="all"
          themeName="ht-theme-main"
          autoColumnSize
          autoRowSize
          manualColumnResize
          manualRowResize
          cell={columnColorStyle}
          afterGetColHeader={(_, TH) => {
            if (!TH.innerText && !TH.classList.contains("border-b-0")) {
              TH.classList.add("border-b-0");
            }
          }}
          manualRowMove
        />
      </div>
      <Button variant="outline" onClick={onPrevious}>
        Previous
      </Button>
    </div>
  );
}
