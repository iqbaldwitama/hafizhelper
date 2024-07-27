export interface HistoryResponse {
  history: History[];
}

export interface History {
  id: string;
  surah: string;
  surah_number: number;
  verse: number;
  created_at: string;
}
