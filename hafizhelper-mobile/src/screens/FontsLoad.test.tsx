import React from "react";
import { render } from "@testing-library/react-native";
import { useFonts } from "expo-font";
import ErrorPage from "./error/ErrorPage";
import {
  NavigationProp,
  ParamListBase,
  useIsFocused,
} from "@react-navigation/native";
import { useQuery } from "react-query";
import VerseListPage from "./verse/VerseListPage";
import { Verse } from "../interfaces/Verse";
import VerseDetailPage from "./verseDetail/VerseDetailPage";
import * as ReactQuery from "react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import verseReducer, { VerseState } from "../redux/verseSlice";
import verseMadinahReducer, {
  VerseMadinahState,
} from "../redux/verseMadinahSlice";

const initialStateLoading: {
  verse: VerseState;
  verseMadinah: VerseMadinahState;
} = {
  verse: {
    data: {},
    isLoading: true,
    error: null,
  },
  verseMadinah: {
    data: {},
    isLoading: true,
    error: null,
  },
};

jest.mock("expo-font");
jest.mock("react-query", () => ({
  ...jest.requireActual("react-query"),
  useQuery: jest.fn(),
}));

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useRoute: () => ({
      params: {
        data: {
          nomorAyat: 1,
          teksArab: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
          teksIndonesia:
            "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
          teksLatin: "bismillāhir-raḥmānir-raḥīm(i).",
          audio: {
            "01": "https://equran.nos.wjv-1.neo.id/audio-partial/Abdullah-Al-Juhany/001002.mp3",
            "02": "https://equran.nos.wjv-1.neo.id/audio-partial/Abdul-Muhsin-Al-Qasim/001002.mp3",
            "03": "https://equran.nos.wjv-1.neo.id/audio-partial/Abdurrahman-as-Sudais/001002.mp3",
            "04": "https://equran.nos.wjv-1.neo.id/audio-partial/Ibrahim-Al-Dossari/001002.mp3",
            "05": "https://equran.nos.wjv-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/001002.mp3",
          },
        },
        surah: "Al-Fatihah",
        jumlahAyat: 7,
        allAyat: [
          {
            nomorAyat: 1,
            teksArab: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
            teksIndonesia:
              "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
          },
          {
            nomorAyat: 2,
            teksArab: "اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ",
            teksIndonesia:
              "Segala puji bagi Allah, Tuhan seluruh alam.",
          },
          {
            nomorAyat: 3,
            teksArab: "الرَّحْمٰنِ الرَّحِيْمِۙ",
            teksIndonesia: "Yang Maha Pengasih, Maha Penyayang.",
          },
          {
            nomorAyat: 4,
            teksArab: "مٰلِكِ يَوْمِ الدِّيْنِۗ",
            teksIndonesia: "Pemilik hari pembalasan.",
          },
          {
            nomorAyat: 5,
            teksArab: "اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِيْنُۗ",
            teksIndonesia:
              "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan.",
          },
          {
            nomorAyat: 6,
            teksArab: "اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَۙ",
            teksIndonesia: "Tunjukilah kami jalan yang lurus.",
          },
          {
            nomorAyat: 7,
            teksArab:
              "صِرَاطَ الَّذِيْنَ اَنْعَمْتَ عَلَيْهِمْ ەۙ غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّاۤلِّيْنَ ࣖ",
            teksIndonesia:
              "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.",
          },
        ],
        noSurat: 1,
      },
    }),
    useIsFocused: jest.fn(),
  };
});

const mockGetStateVerseList = jest.fn(() => ({
  routes: [
    // Adjust the route structure based on your component's logic
    {}, // Screen 1
    {}, // Screen 2
    {}, // Screen 3
    { params: { suratId: 42 } }, // Screen 4 (VerseListPage)
  ],
  // Adjust the index as needed
  index: 3,
}));

const mockNavigationVerseList = {
  navigate: jest.fn(),
  getState: mockGetStateVerseList,
  getParent: jest.fn(),
} as unknown as NavigationProp<ParamListBase>;

const dummyVerse: Verse = {
  nomorAyat: 1,
  teksArab: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
  teksLatin: "bismillāhir-raḥmānir-raḥīm(i).",
  teksIndonesia:
    "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
  audio: {
    "01": "https://equran.nos.wjv-1.neo.id/audio-partial/Abdullah-Al-Juhany/001001.mp3",
    "02": "https://equran.nos.wjv-1.neo.id/audio-partial/Abdul-Muhsin-Al-Qasim/001001.mp3",
    "03": "https://equran.nos.wjv-1.neo.id/audio-partial/Abdurrahman-as-Sudais/001001.mp3",
    "04": "https://equran.nos.wjv-1.neo.id/audio-partial/Ibrahim-Al-Dossari/001001.mp3",
    "05": "https://equran.nos.wjv-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/001001.mp3",
  },
};
const mockGetStateVerseDetail = jest.fn(() => ({
  routes: [
    // Adjust the route structure based on your component's logic
    {}, // Screen 1
    {}, // Screen 2
    {}, // Screen 3
    {}, // Screen 4
    { params: { data: dummyVerse, surah: "Al-Fatihah" } },
  ],
  index: 2,
}));

const mockNavigationVerseDetail = {
  navigate: jest.fn(),
  getState: mockGetStateVerseDetail,
  getParent: jest.fn(),
} as unknown as NavigationProp<ParamListBase>;

const error = new Error("Request failed");
const resetError = jest.fn();

describe("Font is not loaded", () => {
  (useFonts as jest.Mock).mockReturnValue([false]);
  (useQuery as jest.Mock).mockReturnValue({ isLoading: true });
  (useIsFocused as jest.Mock).mockReturnValue(true);

  jest.mock("react-query", () => ({
    ...jest.requireActual("react-query"),
    useQuery: jest.fn(),
  }));

  jest.spyOn(ReactQuery, "useQuery").mockImplementation(
    jest.fn().mockReturnValue({
      flag: true,
      isLoading: false,
      isSuccess: true,
      refetch: jest.fn(),
    }),
  );

  it(`should render loading state when font is not loaded for errorpage`, () => {
    const { getByTestId } = render(
      <ErrorPage
        key="errorPage"
        error={error}
        resetError={resetError}
      />,
    );

    expect(getByTestId("loading-indicator")).toBeTruthy();
  });
  it(`should render loading state when font is not loaded for verseList`, () => {
    const store = configureStore({
      reducer: {
        verse: verseReducer,
        verseMadinah: verseMadinahReducer,
      },
      preloadedState: initialStateLoading,
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <VerseListPage
          key="verseListPage"
          navigation={mockNavigationVerseList}
        />
        ,
      </Provider>,
    );

    expect(getByTestId("loading-indicator")).toBeTruthy();
  });
  it(`should render loading state when font is not loaded for verseDetail`, () => {
    const { getByTestId } = render(
      <VerseDetailPage
        key="verseDetailPage"
        navigation={mockNavigationVerseDetail}
      />,
    );

    expect(getByTestId("loading-indicator")).toBeTruthy();
  });
});
