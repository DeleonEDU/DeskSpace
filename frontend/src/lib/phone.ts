function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Format as user types: +38 (0XX) XXX-XX-XX */
export function formatPhoneInput(raw: string): string {
  let digits = digitsOnly(raw);
  if (digits.startsWith("380")) digits = digits.slice(3);
  else if (digits.startsWith("80")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  digits = digits.slice(0, 9);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `+38 (0${digits}`;
  if (digits.length <= 5) {
    return `+38 (0${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 7) {
    return `+38 (0${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5)}`;
  }
  return `+38 (0${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7, 9)}`;
}

/** API/storage: +380XXXXXXXXX */
export function phoneToE164(formatted: string): string {
  const digits = digitsOnly(formatted);
  if (digits.length === 12 && digits.startsWith("380")) return `+${digits}`;
  if (digits.length === 10 && digits.startsWith("0")) return `+38${digits}`;
  if (digits.length === 9) return `+380${digits}`;
  return formatted.trim();
}

/** Display stored E.164 or raw string in the UI mask. */
export function formatPhoneDisplay(value: string | undefined | null): string {
  if (!value) return "";
  const normalized = value.replace(/\s/g, "");
  if (normalized.startsWith("+380") && normalized.length >= 13) {
    const d = normalized.slice(4);
    return `+38 (0${d.slice(0, 2)}) ${d.slice(2, 5)}-${d.slice(5, 7)}-${d.slice(7, 9)}`;
  }
  return formatPhoneInput(value);
}
