import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import VerseDetailPage from "./VerseDetailPage";
import { Audio } from "expo-av";
import { act } from "react-test-renderer";
import {
  NavigationProp,
  ParamListBase,
  useIsFocused,
} from "@react-navigation/native";
import ScreenName from "../../utils/ScreenName";
import { useFonts } from "expo-font";
import * as ReactQuery from "react-query";

const dummy2 = {
  data: {
    nomorAyat: 3,
    teksArab: "الرَّحْمٰنِ الرَّحِيْمِۙ",
    teksIndonesia: "Yang Maha Pengasih, Maha Penyayang.",
    audio: {
      "01": null,
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
      teksIndonesia: "Segala puji bagi Allah, Tuhan seluruh alam.",
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
};

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

const mockGetState2 = jest.fn(() => ({
  routes: [
    // Adjust the route structure based on your component's logic
    {}, // Screen 1
    {}, // Screen 2
    {}, // Screen 3
    {}, // Screen 4
    {
      params: {
        data: dummy2.data,
        surah: dummy2.surah,
        jumlahAyat: dummy2.jumlahAyat,
        allAyat: dummy2.allAyat,
        noSurat: dummy2.noSurat,
      },
    },
  ],
}));

const mockNavigation2 = {
  navigate: jest.fn(),
  getState: mockGetState2,
} as unknown as NavigationProp<ParamListBase>;

jest.mock("expo-font");

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useRoute: () => ({
      params: {
        data: {
          nomorAyat: 3,
          teksArab: "الرَّحْمٰنِ الرَّحِيْمِۙ",
          teksIndonesia: "Yang Maha Pengasih, Maha Penyayang.",
          audio: {
            "01": null,
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

// Mock the expo-av module
jest.mock("expo-av", () => {
  return {
    ...jest.requireActual("expo-av"),
    Audio: {
      Sound: jest.fn().mockReturnValue({
        loadAsync: jest.fn(),
        unloadAsync: jest.fn(),
        playAsync: jest.fn(),
        pauseAsync: jest.fn(),
        stopAsync: jest.fn(),
        replayAsync: jest.fn(),
        setStatusAsync: jest.fn(),
        getStatusAsync: jest
          .fn()
          .mockResolvedValue({ isLoaded: true }),
        setOnPlaybackStatusUpdate: jest.fn(),
      }),
    },
  };
});

it("handles error when audio URI is undefined", async () => {
  console.error = jest.fn();

  render(<VerseDetailPage navigation={mockNavigation2} />);
  await act(async () => {});

  expect(console.error).toHaveBeenCalledWith(
    "Audio URI is undefined or null",
  );
});

describe("PrevNextPositive", () => {
  let mockSound: Audio.Sound;

  (useFonts as jest.Mock).mockReturnValue([true]);
  (useIsFocused as jest.Mock).mockReturnValue(true);

  beforeEach(() => {
    mockSound = new Audio.Sound();
  });

  it("navigates to next verse when next button is pressed", async () => {
    const stopAsyncMock = jest
      .spyOn(mockSound, "stopAsync")
      .mockImplementation();
    const { getByTestId } = render(
      <VerseDetailPage navigation={mockNavigation2} />,
    );
    const nextButton = getByTestId("next-verse-button-test");

    await act(async () => {
      fireEvent.press(nextButton);
    });

    expect(mockSound.setStatusAsync).toHaveBeenCalledWith({
      shouldPlay: false,
      positionMillis: 0,
    });
    expect(mockNavigation2.navigate).toHaveBeenCalledWith(
      ScreenName.VERSE_DETAIL_PAGE,
      {
        data: {
          nomorAyat: 4,
          teksArab: "مٰلِكِ يَوْمِ الدِّيْنِۗ",
          teksIndonesia: "Pemilik hari pembalasan.",
        },
        jumlahAyat: 7,
        surah: "Al-Fatihah",
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
    );
    stopAsyncMock.mockRestore();
  });

  it("navigates to previous verse when previous button is pressed", async () => {
    const stopAsyncMock = jest
      .spyOn(mockSound, "stopAsync")
      .mockImplementation();
    const { getByTestId } = render(
      <VerseDetailPage navigation={mockNavigation2} />,
    );
    const prevButton = getByTestId("previous-verse-button-test");

    await act(async () => {
      fireEvent.press(prevButton);
    });

    expect(mockSound.setStatusAsync).toHaveBeenCalledWith({
      shouldPlay: false,
      positionMillis: 0,
    });

    expect(mockNavigation2.navigate).toHaveBeenCalledWith(
      ScreenName.VERSE_DETAIL_PAGE,
      {
        data: {
          nomorAyat: 4,
          teksArab: "مٰلِكِ يَوْمِ الدِّيْنِۗ",
          teksIndonesia: "Pemilik hari pembalasan.",
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
    );
    stopAsyncMock.mockRestore();
  });
});
