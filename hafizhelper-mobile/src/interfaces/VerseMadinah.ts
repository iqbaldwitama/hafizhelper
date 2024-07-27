export interface VerseMadinah {
  id: number;
  verse_key: string;
  text_uthmani: string;
}

export interface VerseMadinahData {
  verses: VerseMadinah[];
  meta?: MetaData;
}

interface MetaFilters {
  chapter_number: string; // Since it's given as a string in your JSON
}

interface MetaData {
  filters: MetaFilters;
}
