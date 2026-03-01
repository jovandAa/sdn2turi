export type PpdbListItem = {
  text: string;
  subItems?: string[];
};

const bulletLineRegex = /^\s*[-*•]\s+(.*)$/;

function toCleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function coercePpdbList(value: unknown): PpdbListItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (typeof entry === "string") {
        const text = entry.trim();
        return text ? { text } : null;
      }

      if (entry && typeof entry === "object") {
        const maybeText = toCleanText((entry as { text?: unknown }).text);
        if (!maybeText) return null;

        const rawSubItems = (entry as { subItems?: unknown }).subItems;
        const subItems = Array.isArray(rawSubItems)
          ? rawSubItems.map((v) => toCleanText(v)).filter(Boolean)
          : [];

        return subItems.length ? { text: maybeText, subItems } : { text: maybeText };
      }

      return null;
    })
    .filter((item): item is PpdbListItem => Boolean(item));
}

export function parsePpdbTextarea(text: string): PpdbListItem[] {
  const items: PpdbListItem[] = [];

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    const bulletMatch = line.match(bulletLineRegex);
    if (bulletMatch) {
      const subText = (bulletMatch[1] || "").trim();
      if (!subText) continue;

      const last = items.at(-1);
      if (!last) {
        items.push({ text: subText });
        continue;
      }

      last.subItems = [...(last.subItems ?? []), subText];
      continue;
    }

    items.push({ text: line });
  }

  return items;
}

export function ppdbListToTextarea(value: unknown) {
  const items = coercePpdbList(value);
  return items
    .flatMap((item) => [item.text, ...(item.subItems?.map((sub) => `- ${sub}`) ?? [])])
    .join("\n");
}

