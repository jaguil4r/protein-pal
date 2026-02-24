import { DayData } from '../types';
import { isValidDayData, isValidEntry, saveDayData } from './storage';

export interface ImportResult {
  success: boolean;
  daysImported: number;
  error?: string;
}

const MAX_IMPORT_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_IMPORT_DAYS = 3650; // ~10 years

export function importFromJSON(jsonString: string): ImportResult {
  if (jsonString.length > MAX_IMPORT_SIZE) {
    return { success: false, daysImported: 0, error: 'File too large (max 5 MB).' };
  }

  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data)) {
      return { success: false, daysImported: 0, error: 'Expected an array of day records.' };
    }

    if (data.length > MAX_IMPORT_DAYS) {
      return { success: false, daysImported: 0, error: `Too many records (max ${MAX_IMPORT_DAYS}).` };
    }

    let imported = 0;
    for (const day of data) {
      if (!isValidDayData(day)) continue;
      day.entries = (day.entries || []).filter(isValidEntry);
      saveDayData(day);
      imported++;
    }

    if (imported === 0) {
      return { success: false, daysImported: 0, error: 'No valid day records found in file.' };
    }
    return { success: true, daysImported: imported };
  } catch {
    return { success: false, daysImported: 0, error: 'Invalid JSON file.' };
  }
}

export function exportAsJSON(data: DayData[]): string {
  return JSON.stringify(data, null, 2);
}

export function exportAsCSV(data: DayData[]): string {
  const header = 'Date,Goal,Water (oz),Entry Name,Protein (g),Category,Time';
  const rows = data.flatMap((day) =>
    day.entries.length > 0
      ? day.entries.map((entry, i) =>
          [
            day.date,
            day.goal,
            i === 0 ? (day.waterOz ?? 0) : '',
            `"${entry.name.replace(/"/g, '""')}"`,
            entry.protein,
            entry.category,
            new Date(entry.timestamp).toISOString(),
          ].join(',')
        )
      : [[day.date, day.goal, day.waterOz ?? 0, '', '', '', ''].join(',')]
  );
  return [header, ...rows].join('\n');
}

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
