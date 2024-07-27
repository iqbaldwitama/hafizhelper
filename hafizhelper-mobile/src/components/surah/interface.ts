export interface CardProps {
  content: {
    surah_no: number;
    title: string;
    latin_title: string;
    meaning: string;
    verses_count: number;
  };
  style?: object;
}

export interface BookmarkAyatCard {
  content: {
    surah_no: number;
    latin_title: string;
    ayat_no: number;
  };
  onDeleteBookmark: () => void;
  style?: object;
}

export interface BookmarkSuratCard {
  content: {
    surah_no: number;
    latin_title: string;
  };
  onDeleteBookmark: () => void;
  style?: object;
}
