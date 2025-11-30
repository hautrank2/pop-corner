export interface FormatNumberOptions {
  emptyText?: string;
  character?: boolean; // dùng K, M
  decimal?: number;
}

export function formatNumber(
  value: number | string | undefined | null,
  option: FormatNumberOptions = {}
): string {
  const _isNumber = isNumber(value);

  if (!_isNumber || !isFinite(Number(value))) {
    return option.emptyText !== undefined ? option.emptyText : "--";
  }

  let num = Number(value);
  let suffix = "";
  let { character = false } = option;
  let decimal = 2;

  // Shorten (K, M)
  if (character) {
    if (num >= 1_000_000) {
      num = num / 1_000_000;
      suffix = "M";
    } else if (num >= 1_000) {
      num = num / 1_000;
      suffix = "K";
    }
  }

  // Auto adjust decimals
  if (num < 10) decimal = 3;
  else if (num < 100) decimal = 2;
  else if (num < 1000) decimal = 1;
  else decimal = 0;

  // Override decimals if provided
  const finalDecimal = option.decimal !== undefined ? option.decimal : decimal;

  return `${toDecimal(num, finalDecimal)}${suffix}`;
}

function toDecimal(value: number, decimal = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: decimal,
  }).format(value);
}

// Safer version of isNumber
export function isNumber(value: any): boolean {
  if (value === undefined || value === null) return false;

  if (typeof value === "number") return !isNaN(value);

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return false;
    return !isNaN(Number(trimmed));
  }

  return false;
}
