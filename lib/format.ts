export function formatCompactNumber(value: number | null | undefined) {
  if (value == null) {
    return "0";
  }

  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatPercent(value: number | null | undefined) {
  if (value == null) {
    return "0%";
  }

  return `${Number(value).toFixed(2)}%`;
}

export function formatCurrencyRange(min?: number | null, max?: number | null) {
  if (min == null && max == null) {
    return "Contact for pricing";
  }

  if (min != null && max != null) {
    return `$${formatCompactNumber(min)} - $${formatCompactNumber(max)}`;
  }

  return min != null ? `From $${formatCompactNumber(min)}` : `Up to $${formatCompactNumber(max)}`;
}

export function titleCase(value: string) {
  return value
    .replaceAll("_", " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
