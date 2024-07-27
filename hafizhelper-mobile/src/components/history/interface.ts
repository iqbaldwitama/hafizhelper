export interface HistoryCardProps {
  content: {
    surah_number: number;
    verse: number;
    surah: string;
  };
  style?: object;
  // isBookmarked: boolean;
  // onBookmarkToggle: () => void;
}

export interface DateSeparatorProps {
  date: string;
}
