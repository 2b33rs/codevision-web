export const formatIBAN = (iban: string) => {
  const cleanIBAN = iban.replace(/[^a-zA-Z0-9]/g, "");

  const formattedIBAN = cleanIBAN.replace(/(.{4})/g, "$1 ").trim();

  return formattedIBAN.toUpperCase();
};

export function formatNumberSimple(value: number) {
  return Intl.NumberFormat("de-DE", {
    useGrouping: false,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value / 100);
}

export const formatMoney = (
  value?: number,
  currency?: string,
): string | undefined => {
  if (value === undefined) {
    return undefined;
  }
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency || "EUR",
  }).format(value / 100);
};

export function formatNumberFancy(value: number) {
  return Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value / 100);
}

export function parseNumber(value: string | number) {
  const strValue = value.toString();
  const v = Math.round(parseFloat(strValue.replace(/,/g, ".")) * 100);
  if (isNaN(v)) {
    return 0;
  }
  return v;
}

export function parseQuantity(value: string | number) {
  const strValue = value.toString();

  const v = parseFloat(strValue.replace(/,/g, "."));
  if (isNaN(v)) {
    return "0";
  }
  return v.toString();
}

export const calculateCursorPosition = (
  rawValue: string,
  formattedValue: string,
  cursorPosition: number,
) => {
  const rawValueUpToCursor = rawValue.slice(0, cursorPosition);
  const rawAlphanumeric = rawValueUpToCursor.replace(/[^a-zA-Z0-9]/g, "");
  let formattedCursorPosition = 0;
  let alphanumericCount = 0;

  for (let i = 0; i < formattedValue.length; i++) {
    if (formattedValue[i].match(/[a-zA-Z0-9]/)) {
      alphanumericCount++;
    }
    if (alphanumericCount === rawAlphanumeric.length) {
      formattedCursorPosition = i + 1;
      break;
    }
  }

  return formattedCursorPosition;
};
