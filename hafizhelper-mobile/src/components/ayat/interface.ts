export interface AyatCardProps {
  content: {
    ayat_nomor: number;
    arabic: string;
    id_translate: string;
    arti_setting: boolean;
  };
  style?: object;
  // isBookmarked: boolean;
  // onBookmarkToggle: () => void;
}

export interface VerseStyle {
  fontSizeStyle: {
    arabicFontSize: number;
    arabiclineHeight: number;
    numberPaddingVertical: number;
    meaningFontSize: number;
  };
}
