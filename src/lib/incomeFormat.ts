export type FormattedIncomeInput = {
  /** Digits-only value — the parseable form the form submits. */
  digits: string;
  /** Digits with thousands separators, for display. */
  formatted: string;
  /** Cursor position to restore in the formatted string, in code units. */
  cursorPos: number;
};

/**
 * Re-formats a raw (possibly comma-containing) input value with thousands
 * separators, keeping the cursor visually anchored to the same digit.
 *
 * The standard technique: count how many digits sit left of the cursor in
 * the raw value, strip to digits-only, re-insert commas, then walk the
 * formatted string to find the position right after that many digits.
 * Commas themselves are cursor-transparent — deleting one collapses it
 * without removing a digit, matching how most comma-formatted inputs behave.
 */
export function reformatIncomeInput(rawValue: string, cursorPos: number): FormattedIncomeInput {
  const digitsBeforeCursor = countDigits(rawValue.slice(0, cursorPos));
  const digits = rawValue.replace(/\D/g, "");
  const formatted = formatThousands(digits);
  return { digits, formatted, cursorPos: positionAfterNthDigit(formatted, digitsBeforeCursor) };
}

function countDigits(text: string): number {
  return (text.match(/\d/g) ?? []).length;
}

function formatThousands(digits: string): string {
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
}

function positionAfterNthDigit(formatted: string, n: number): number {
  if (n <= 0) return 0;
  let digitsSeen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      digitsSeen++;
      if (digitsSeen === n) return i + 1;
    }
  }
  return formatted.length;
}
