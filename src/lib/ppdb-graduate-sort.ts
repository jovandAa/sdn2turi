type GraduateLike = {
  graduationYear: string;
  registrationNo?: string | null;
  fullName: string;
};

function extractLastNumber(value: string) {
  const matches = value.match(/\d+/g);
  if (!matches?.length) return null;
  const last = matches[matches.length - 1];
  const parsed = Number.parseInt(last, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function extractYearNumber(value: string) {
  const match = value.match(/\d{4}/);
  if (!match) return null;
  const parsed = Number.parseInt(match[0], 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function sortPpdbGraduates<T extends GraduateLike>(items: T[]) {
  return [...items].sort((a, b) => {
    const yearA = extractYearNumber(a.graduationYear);
    const yearB = extractYearNumber(b.graduationYear);
    if (yearA !== null && yearB !== null && yearA !== yearB) return yearB - yearA;
    if (yearA !== null && yearB === null) return -1;
    if (yearA === null && yearB !== null) return 1;

    const regA = a.registrationNo ? extractLastNumber(a.registrationNo) : null;
    const regB = b.registrationNo ? extractLastNumber(b.registrationNo) : null;
    if (regA !== null && regB !== null && regA !== regB) return regA - regB;
    if (regA !== null && regB === null) return -1;
    if (regA === null && regB !== null) return 1;

    const regStrA = a.registrationNo?.toLowerCase() ?? "";
    const regStrB = b.registrationNo?.toLowerCase() ?? "";
    if (regStrA !== regStrB) return regStrA.localeCompare(regStrB, "id");

    return a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase(), "id");
  });
}

