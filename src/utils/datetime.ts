import dayjs from "dayjs";

function normalize(input: string | Date) {
  return typeof input === "string" ? dayjs(input) : dayjs(input);
}

function convertFormat(format?: string) {
  if (!format) return undefined;
  return format.replace("yyyy", "YYYY").replace("dd", "DD");
}

/**
 * Format date => dd/MM/yyyy
 */
export const formatDate = (date: string | Date, format?: string) => {
  return normalize(date).format(convertFormat(format) || "DD/MM/YYYY");
};

/**
 * Format datetime => dd/MM/yyyy HH:mm:ss
 */
export const formatDateTime = (date: string | Date, format?: string) => {
  return normalize(date).format(convertFormat(format) || "DD/MM/YYYY HH:mm:ss");
};

/**
 * Format time => HH:mm:ss
 */
export const formatTime = (time: string | Date, format?: string) => {
  return normalize(time).format(convertFormat(format) || "HH:mm:ss");
};

/**
 * Calculate age from ISO birthdate
 */
export function calculateAge(birthdate: string): number {
  const birth = normalize(birthdate);
  const today = dayjs();

  let age = today.diff(birth, "year");

  const hasBirthdayPassed = today.isAfter(birth.year(today.year()));

  if (!hasBirthdayPassed) {
    age--;
  }

  return age;
}
