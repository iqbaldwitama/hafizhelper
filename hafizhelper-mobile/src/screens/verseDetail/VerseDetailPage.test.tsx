import React from "react";
import {
  render,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import VerseDetailPage from "./VerseDetailPage";
import {
  NavigationProp,
  ParamListBase,
  useIsFocused,
} from "@react-navigation/native";
import { Verse } from "../../interfaces/Verse";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontSize from "../../utils/FontSize";
import useScreen from "../../hooks/useScreen";
import { act } from "react-test-renderer";
import * as ReactQuery from "react-query";

jest.mock("expo-font");

jest.mock("react-query", () => ({
  ...jest.requireActual("react-query"),
  useQuery: jest.fn(),
}));

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useIsFocused: jest.fn(),
    useRoute: () => ({
      params: {
        data: {
          audio: {
            "01": "audio.mp3",
          },
          teksArab: "Arabic text",
          teksLatin: "Latin text",
        },
        surah: "Surah",
        jumlahAyat: 10,
        allAyat: [],
        noSurat: 1,
      },
    }),
  };
});

jest.mock("../../hooks/bookmark/useDeleteAyahBookmarkQuery", () =>
  jest.fn(),
);
jest.mock("../../hooks/bookmark/useCreateAyahBookmark", () =>
  jest.fn(),
);

jest.mock("../../hooks/useScreen"); // Mock hook useScreen

const surahTitleTestId = "surah-title-test";
const verseNumberTestId = "verse-number-test";
const quranLatinTestId = "quran-latin-test";
const repeatButtonTestId = "repeat-button-test";
const ellipseRepeatIconTestId = "ellipse-repeat-icon-test";

const playButtonTestId = "play-button-test";
const micButtonTestId = "mic-button-test";

const dummy: Verse = {
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

const mockGetState = jest.fn(() => ({
  routes: [
    // Adjust the route structure based on your component's logic
    {}, // Screen 1
    {}, // Screen 2
    {}, // Screen 3
    {}, // Screen 4
    { params: { data: dummy, surah: "Al-Fatihah" } },
  ],
  index: 2,
}));

const mockNavigation = {
  navigate: jest.fn(),
  getState: mockGetState,
  getParent: jest.fn(),
} as unknown as NavigationProp<ParamListBase>;

describe("VerseDetailPage_UI", () => {
  // (useIsFocused as jest.Mock).mockReturnValue(true);
  jest
    .spyOn(AsyncStorage, "getItem")
    .mockImplementation(async (key: string) => {
      switch (key) {
        case "latinEnabled":
          return JSON.stringify(true); // Simulate 'true' value for latinEnabled
        case "audioOption":
          return "01"; // Simulate '01' value for audioOption
        case "arabicOption":
          return "01"; // Simulate '01' value for arabicOption
        default:
          return null;
      }
    });

  (useFonts as jest.Mock).mockReturnValue([true]);
  (useIsFocused as jest.Mock).mockReturnValue(true);

  afterEach(() => {
    jest.clearAllMocks();
  });

  (useScreen as jest.Mock).mockReturnValue({
    width: 400,
    height: 800,
    isPortrait: true,
    scale: 2,
    fontScale: 1,
  });

  // Memastikan komponen dirender dengan benar
  it("should renders correctly initially", () => {
    (useFonts as jest.Mock).mockReturnValue([true]);

    jest
      .spyOn(AsyncStorage, "getItem")
      .mockImplementation(async (key: string) => {
        switch (key) {
          case "fontSizeOption":
            return FontSize.MEDIUM;
          default:
            return FontSize.MEDIUM;
        }
      });

    jest.spyOn(ReactQuery, "useQuery").mockImplementation(
      jest.fn().mockReturnValue({
        flag: true,
        isLoading: false,
        isSuccess: true,
        refetch: jest.fn(),
      }),
    );

    const { getByTestId } = render(
      <VerseDetailPage navigation={mockNavigation} />,
    );

    // Memastikan komponen text dirender dengan benar
    expect(getByTestId(surahTitleTestId)).toBeTruthy();
    expect(getByTestId(verseNumberTestId)).toBeTruthy();
    expect(getByTestId(quranLatinTestId)).toBeTruthy();

    // Memastikan komponen button dirender dengan benar
    expect(getByTestId(playButtonTestId)).toBeTruthy();
    expect(getByTestId(micButtonTestId)).toBeTruthy();
  });

  it("should toggle repeat state on button press", () => {
    jest
      .spyOn(AsyncStorage, "getItem")
      .mockImplementation(async (key: string) => {
        switch (key) {
          case "fontSizeOption":
            return FontSize.SMALL;
          default:
            return FontSize.SMALL;
        }
      });

    const { getByTestId, queryByTestId } = render(
      <VerseDetailPage navigation={mockNavigation} />,
    );

    // Mode repeat diaktifkan & icon muncul
    fireEvent.press(getByTestId(repeatButtonTestId));
    expect(getByTestId(ellipseRepeatIconTestId)).toBeTruthy();

    // Mode repeat dinonaktifkan & icon tidak muncul
    fireEvent.press(getByTestId(repeatButtonTestId));
    expect(queryByTestId(ellipseRepeatIconTestId)).toBeFalsy();
  });

  it("should load with font size setting", async () => {
    (useIsFocused as jest.Mock).mockReturnValue(true);

    // Mock values to be returned by AsyncStorage.getItem
    jest
      .spyOn(AsyncStorage, "getItem")
      .mockImplementation(async (key: string) => {
        switch (key) {
          case "fontSizeOption":
            return FontSize.LARGE;
          default:
            return FontSize.LARGE;
        }
      });

    // Render the component
    render(<VerseDetailPage navigation={mockNavigation} />);

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        "fontSizeOption",
      );
    });
  });

  it("should render correctly with appropriate width and structur based in portrait mode", async () => {
    // const playAsyncMock = jest
    //   .spyOn(mockSound, "playAsync")
    //   .mockImplementation();
    // jest.spyOn(mockSound, "playAsync").mockImplementation();

    const { getByTestId } = render(
      <VerseDetailPage navigation={mockNavigation} />,
    );

    expect(getByTestId("headerComponent")).toBeTruthy();

    const micButton = getByTestId("mic-button-test");
    // Simulate pressing mic button
    await act(async () => {
      fireEvent.press(micButton);
    });

    expect(getByTestId("mic-off-button-test")).toBeTruthy();

    const micOffButton = getByTestId("mic-off-button-test");
    // Simulate pressing mic off button
    await act(async () => {
      fireEvent.press(micOffButton);
    });

    const playButton = getByTestId("play-button-test");
    // Simulate pressing play button
    await act(async () => {
      fireEvent.press(playButton);
    });

    await waitFor(() => {
      const footerContainer = getByTestId("footer-test");
      expect(footerContainer).toHaveStyle({
        paddingVertical: 20,
        paddingHorizontal: 10,
      });

      const soundWave = getByTestId("sound-wave-test");
      expect(soundWave).toHaveStyle({
        width: 60,
        height: 60,
      });
    });

    // playAsyncMock.mockRestore();
  });

  it("should render correctly with appropriate width and structur based in landscape mode", async () => {
    // Simulasikan perubahan orientasi layar dengan mengubah nilai height dan width

    (useScreen as jest.Mock).mockReturnValue({
      width: 800,
      height: 400,
      isPortrait: false,
      scale: 2,
      fontScale: 1,
    });

    // const playAsyncMock = jest
    //   .spyOn(mockSound, "playAsync")
    //   .mockImplementation();
    // jest.spyOn(mockSound, "playAsync").mockImplementation();

    const { getByTestId } = render(
      <VerseDetailPage navigation={mockNavigation} />,
    );

    expect(getByTestId("headerComponent")).toBeTruthy();

    const micButton = getByTestId("mic-button-test");
    // Simulate pressing mic button
    await act(async () => {
      fireEvent.press(micButton);
    });

    expect(getByTestId("mic-off-button-test")).toBeTruthy();

    const micOffButton = getByTestId("mic-off-button-test");
    // Simulate pressing mic off button
    await act(async () => {
      fireEvent.press(micOffButton);
    });

    const playButton = getByTestId("play-button-test");
    // Simulate pressing play button
    await act(async () => {
      fireEvent.press(playButton);
    });

    await waitFor(() => {
      const footerContainer = getByTestId("footer-test");
      expect(footerContainer).toHaveStyle({
        paddingVertical: 10,
        paddingHorizontal: 20,
      });

      const soundWave = getByTestId("sound-wave-test");
      expect(soundWave).toHaveStyle({
        width: 46,
        height: 46,
      });

      // playAsyncMock.mockRestore();
    });
  });

  it("should navigate to verse feedback on recording toggle off", async () => {
    const { getByTestId } = render(
      <VerseDetailPage navigation={mockNavigation} />,
    );

    const micButton = getByTestId("mic-button-test");
    await act(async () => {
      fireEvent.press(micButton);
    });

    expect(getByTestId("mic-off-button-test")).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByTestId("mic-off-button-test"));
    });

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalled();
    });
  });
});
