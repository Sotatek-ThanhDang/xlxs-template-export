export function convertToOrdinal(num: number) {
  let suffix = "th";
  if (num % 10 === 1 && num % 100 !== 11) {
    suffix = "st";
  } else if (num % 10 === 2 && num % 100 !== 12) {
    suffix = "nd";
  } else if (num % 10 === 3 && num % 100 !== 13) {
    suffix = "rd";
  }
  return num + suffix;
}

export function arrayPadEnd<T>(arr: T[], targetLength: number, padItem: T) {
  const result = arr.slice();
  while (result.length < targetLength) {
    result.push(padItem);
  }
  return result;
}
