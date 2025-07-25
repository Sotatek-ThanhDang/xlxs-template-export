const XLSX = require("xlsx-js-style");

// Helper style
const baseBorder = {
  top: { style: "thin", color: { rgb: "000000" } },
  bottom: { style: "thin", color: { rgb: "000000" } },
  left: { style: "thin", color: { rgb: "000000" } },
  right: { style: "thin", color: { rgb: "000000" } },
};

const centerStyle = {
  alignment: { vertical: "center", horizontal: "center", wrapText: true },
  border: baseBorder,
};

const headerStyle = {
  ...centerStyle,
  font: { bold: true, color: { rgb: "FFFFFF" } },
  fill: { fgColor: { rgb: "2F75B5" } }, // Dark blue
};

const sprintColor = {
  1: "FFF2CC", // light yellow
  2: "FFF2CC",
  3: "FFF2CC",
  4: "DDEBF7", // light blue
  5: "BDD7EE", // slightly darker blue
  6: "FCE4D6", // light red/orange
};

function cell(value, style = centerStyle) {
  return { v: value, s: style };
}

// Bảng 1: Process
const processData = [
  [
    "#",
    "Process",
    "SotaTek",
    "Client",
    "Month 0",
    "",
    "Month 1",
    "",
    "",
    "",
    "Month 2",
    "",
    "",
    "",
    "Month 3",
    "",
    "",
  ],
  [
    "",
    "",
    "",
    "",
    "1st sprint",
    "2nd sprint",
    "3rd sprint",
    "4th sprint",
    "5th sprint",
    "6th sprint",
  ],
  [
    1,
    "Requirement definition/requirement analysis/management",
    "○",
    "○",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  [2, "Design and development (coding)*", "○", "○", "", "", "", "", "", ""],
  [3, "Testing", "○", "○", "", "", "", "", "", ""],
  [4, "User Acceptance Test", "-", "-", "", "", "", "", "", ""],
  [5, "Feedback to UAT", "○", "-", "", "", "", "", "", ""],
  [6, "Production release", "○", "△", "", "", "", "", "", ""],
];

const processSheet = [];

// Fill headers
processData.forEach((row, rowIndex) => {
  const rowCells = row.map((val, colIndex) => {
    if (rowIndex === 0 || rowIndex === 1 || colIndex < 4) {
      return cell(val, headerStyle);
    }

    return cell(val || "", centerStyle);
  });
  processSheet.push(rowCells);
});

// Bảng 2: Team
const teamData = [
  [
    "#",
    "Position",
    "SotaTek",
    "Client",
    "Month 0",
    "",
    "Month 1",
    "",
    "",
    "",
    "Month 2",
    "",
    "",
    "",
    "Month 3",
    "",
    "",
    "man-month",
    "unit price ($)",
    "subtotal ($)",
  ],
  [
    "",
    "",
    "",
    "",
    "1st sprint",
    "2nd sprint",
    "3rd sprint",
    "4th sprint",
    "5th sprint",
    "6th sprint",
  ],
  [
    1,
    "PM cum BA",
    "○",
    "-",
    1,
    1,
    1,
    0.5,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    2.75,
    "",
    "",
  ],
  [
    2,
    "Designer",
    "○",
    "-",
    1,
    1,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    1,
    "",
    "",
  ],
  [
    3,
    "Frontend dev",
    "○",
    "-",
    "",
    1,
    1,
    1,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    2,
    "",
    "",
  ],
  [
    4,
    "Backend dev",
    "○",
    "-",
    "",
    1,
    1,
    1,
    "",
    0.5,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    2.25,
    "",
    "",
  ],
  [
    5,
    "Tester",
    "○",
    "-",
    "",
    "",
    2,
    2,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    3.5,
    "",
    "",
  ],
  [
    6,
    "Korean Communicator",
    "○",
    "-",
    "",
    1,
    1,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    2.5,
    "",
    "",
  ],
  [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  [
    "Efforts per sprint",
    "",
    "",
    "",
    2,
    2,
    4,
    5,
    5,
    4.5,
    0.5,
    0,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  [
    "Efforts per month",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    11.5,
    "",
    "",
  ],
  [
    "Total effort",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    13.75,
    "",
    "",
  ],
];

teamData.forEach((row, rowIndex) => {
  const styledRow = row.map((val, colIndex) => {
    let style = centerStyle;

    // Apply header style
    if (rowIndex === 0 || rowIndex === 1 || colIndex < 4) {
      style = headerStyle;
    }

    // Apply sprint colors for Month 1/2/3 if value is number
    const isSprintCol = colIndex >= 4 && colIndex <= 13;
    if (isSprintCol && typeof val === "number") {
      const sprintIndex = ((colIndex - 4) % 6) + 1;
      style = {
        ...centerStyle,
        fill: { fgColor: { rgb: sprintColor[sprintIndex] || "FFFFFF" } },
      };
    }

    return cell(val || "", style);
  });
  processSheet.push(styledRow); // Append team table to same sheet
});

// Build worksheet
const ws = XLSX.utils.aoa_to_sheet([]);

// Assign styled cells
processSheet.forEach((row, rowIndex) => {
  row.forEach((cellData, colIndex) => {
    const cellRef = XLSX.utils.encode_cell({ c: colIndex, r: rowIndex });
    ws[cellRef] = {
      v: cellData.v,
      s: cellData.s,
      t: typeof cellData.v === "number" ? "n" : "s",
    };
  });
});

// Define sheet range
ws["!ref"] = XLSX.utils.encode_range({
  s: { c: 0, r: 0 },
  e: { c: processSheet[0].length - 1, r: processSheet.length - 1 },
});

// Optional: column widths
ws["!cols"] = Array(processSheet[0].length).fill({ wch: 15 });

// Workbook
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

// Save
XLSX.writeFile(wb, "team_structure.xlsx");
