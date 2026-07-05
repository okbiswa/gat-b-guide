import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface Institute {
  institute_id: string;
  institute_name: string;
  programme_offered: string;
  broad_field: string;
  degree_type: string;
  total_seats: string;
  eligibility: string;
  city: string;
  state: string;
  admissions_url: string;
  source_page: string;
  remarks: string;
  more_info: string;
}

export interface Cutoff {
  year: string;
  institute_id: string;
  course: string;
  category: string;
  min_score: string;
  max_score: string;
}

let institutesCache: Institute[] | null = null;
let cutoffsCache: Cutoff[] | null = null;

function loadCSV<T>(filePath: string): T[] {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    }) as T[];
  } catch (error) {
    console.error(`Failed to load CSV at ${filePath}`, error);
    return [];
  }
}

export function getInstitutes(): Institute[] {
  if (!institutesCache) {
    const filePath = path.join(process.cwd(), 'data', 'institutes.csv');
    institutesCache = loadCSV<Institute>(filePath);
  }
  return institutesCache;
}

export function getCutoffs(): Cutoff[] {
  if (!cutoffsCache) {
    const filePath = path.join(process.cwd(), 'data', 'master_cutoffs.csv');
    cutoffsCache = loadCSV<Cutoff>(filePath);
  }
  return cutoffsCache;
}
