import type { TeamEstimationSchema } from "../schema/configXlxsDownloadSchema";
import { formatResponsibility } from "./formatResponsibility";

function distributeManMonth(
  manMonth: number,
  totalSprint: number,
  processes: TeamEstimationSchema["process"]
): (number | string)[] {
  const result: (number | string)[] = Array(totalSprint).fill("");
  let remainingManMonth = manMonth;

  // Calculate the total number of available slots based on processes
  let totalAvailableSlots = 0;
  for (const p of processes) {
    totalAvailableSlots += p.end - p.start + 1;
  }

  // Handle cases where totalAvailableSlots is 0 to avoid division by zero
  if (totalAvailableSlots === 0) {
    return result;
  }

  // Calculate the initial value to distribute
  let baseValue = remainingManMonth / totalAvailableSlots;

  // Round baseValue down to the nearest multiple of 0.25
  baseValue = Math.floor(baseValue * 4) / 4;

  // Distribute the baseValue
  for (const p of processes) {
    for (let i = p.start; i <= p.end; i++) {
      if (remainingManMonth >= baseValue && baseValue > 0) {
        result[i] = baseValue;
        remainingManMonth -= baseValue;
      } else {
        // If remainingManMonth is less than baseValue or baseValue is 0,
        // we can't fill with baseValue anymore for this slot.
        // This scenario is mostly for cases where baseValue becomes 0
        // after initial rounding for very small manMonth values.
        result[i] = "";
      }
    }
  }

  // Distribute the remainingManMonth as 0.25 until it's exhausted
  // Prioritize filling existing baseValue slots first, then empty slots
  for (let i = 0; i < totalSprint && remainingManMonth > 0.0001; i++) {
    const originalIndex = i; // Store original index

    // Find the next available slot within the process ranges
    let foundSlot = false;
    for (const p of processes) {
      if (originalIndex >= p.start && originalIndex <= p.end) {
        foundSlot = true;
        break;
      }
    }

    if (!foundSlot) {
      continue; // Skip if the current index is not within any process range
    }

    const quarter = 0.25;
    if (remainingManMonth >= quarter) {
      // If the slot is empty or already has a number
      if (
        typeof result[originalIndex] === "string" ||
        result[originalIndex] === 0
      ) {
        result[originalIndex] = quarter;
      } else {
        result[originalIndex] = (result[originalIndex] as number) + quarter;
      }
      remainingManMonth -= quarter;
    } else if (remainingManMonth > 0) {
      // If remainingManMonth is less than 0.25, add it to the current slot
      if (
        typeof result[originalIndex] === "string" ||
        result[originalIndex] === 0
      ) {
        result[originalIndex] = remainingManMonth;
      } else {
        result[originalIndex] =
          (result[originalIndex] as number) + remainingManMonth;
      }
      remainingManMonth = 0;
    }
  }

  // Clean up any small floating point inaccuracies by rounding to 2 decimal places
  for (let i = 0; i < result.length; i++) {
    if (typeof result[i] === "number") {
      result[i] = Math.round((result[i] as number) * 100) / 100;
    }
  }

  return result;
}

export function transformJsonDataToAoaXlxsData(
  inputData: TeamEstimationSchema[],
  totalSprint: number
): (string | number)[][] {
  const result: (string | number)[][] = [];

  // Iterate over each position in the input data
  inputData.forEach((employee, index) => {
    const {
      position,
      manMonth,
      sotatekResponsibility,
      clientResponsibility,
      process,
    } = employee;

    // Create a row to hold the transformed data
    const row = [];

    // Column 1: id, which is index + 1
    row.push(index + 1);

    // Column 2: position
    row.push(position);

    // Column 3: sotatekResponsibility (ResponsibilityType mapping)
    row.push(formatResponsibility(sotatekResponsibility));

    // Column 4: clientResponsibility (ResponsibilityType mapping)
    row.push(formatResponsibility(clientResponsibility));

    // Columns 5 to 12: Process values spread across the manMonth
    const processValues = distributeManMonth(manMonth, totalSprint, process);

    // Append the process values from column 5 to 12
    row.push(...processValues);

    // Column 13: manMonth
    row.push(manMonth);

    // Columns 14 and 15: Empty
    row.push("");
    row.push("");

    // Add the row to the result
    result.push(row);
  });

  return result;
}
