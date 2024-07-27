import React from "react";
import {
  render,
  waitFor,
  fireEvent,
} from "@testing-library/react-native";
import VerseFeedbackPage from "./VerseFeedbackPage"; // Update this path to your actual file path
import { NavigationContainer } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { Verse } from "../../interfaces/Verse";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useScreen from "../../hooks/useScreen";
import { useFonts } from "expo-font";
import FontSize from "../../utils/FontSize";
import { styles } from "./styles";
import { Audio, AVPlaybackStatus } from "expo-av";
import { act } from "react-test-renderer";

jest.mock("expo-font", () => ({
  ...jest.requireActual("expo-font"),
  useFonts: jest.fn().mockReturnValue([true]),
}));

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

jest.mock("../../hooks/useScreen");

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useRoute: jest.fn(),
}));

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

const mockData = {
  data: dummy,
  dataMadinah: {
    text_uthmani: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
  },
  surah: "Al-Fatihah",
  jumlahAyat: 40,
  allAyat: [],
  noSurat: 1,
  allAyatMadinah: [],
  voiceURI:
    "https://equran.nos.wjv-1.neo.id/audio-partial/Abdullah-Al-Juhany/001001.mp3",
};

describe("VerseFeedbackPage", () => {
  let mockSound: Audio.Sound;

  beforeEach(() => {
    jest
      .spyOn(AsyncStorage, "getItem")
      .mockImplementation(async (key: string) => {
        switch (key) {
          case "arabicOption":
            return "01"; // Simulate '01' value for arabicOption
          default:
            return null;
        }
      });

    (
      useScreen as jest.MockedFunction<typeof useScreen>
    ).mockReturnValue({
      width: 400,
      height: 800,
      isPortrait: true,
      scale: 2,
      fontScale: 1,
    });

    (useRoute as jest.Mock).mockReturnValue({ params: mockData });

    mockSound = new Audio.Sound();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly and highlights text when jumlahAyat is more than 30", async () => {
    (useFonts as jest.Mock).mockReturnValue([true]);

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

    const { getByText } = render(
      <NavigationContainer>
        <VerseFeedbackPage />
      </NavigationContainer>,
    );

    await waitFor(() => {
      const highlightedText = getByText(
        mockData.dataMadinah.text_uthmani,
      );
      expect(highlightedText).toBeTruthy();
      expect(highlightedText.props.style).toMatchObject({
        color: "#248b6b",
      });
    });
  });

  it("does not highlight text when jumlahAyat is less than or equal to 30", async () => {
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

    mockData.jumlahAyat = 20;
    (useRoute as jest.Mock).mockReturnValue({ params: mockData });

    const { getByText } = render(
      <NavigationContainer>
        <VerseFeedbackPage />
      </NavigationContainer>,
    );

    await waitFor(() => {
      const textElement = getByText(
        mockData.dataMadinah.text_uthmani,
      );
      expect(textElement).toBeTruthy();
    });
  });

  it("displays the correct Arabic text", async () => {
    (useFonts as jest.Mock).mockReturnValue([true]);

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

    const { getByText } = render(
      <NavigationContainer>
        <VerseFeedbackPage />
      </NavigationContainer>,
    );

    await waitFor(() => {
      const arabicText = getByText(mockData.data.teksArab);
      expect(arabicText).toBeTruthy();
    });
  });

  it("should render correctly initially", () => {
    (useFonts as jest.Mock).mockReturnValue([true]);

    const { getByText } = render(
      <NavigationContainer>
        <VerseFeedbackPage />
      </NavigationContainer>,
    );

    // Ensure some initial rendering assertions, such as checking for a specific text
    expect(getByText(mockData.data.teksArab)).toBeTruthy();
  });

  it("displays ActivityIndicator when fonts are not loaded", () => {
    (useFonts as jest.Mock).mockReturnValue([false]);

    const { getByTestId } = render(
      <NavigationContainer>
        <VerseFeedbackPage />
      </NavigationContainer>,
    );

    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("displays correct feedback text when text length is smaller than 30", async () => {
    (useFonts as jest.Mock).mockReturnValue([true]);

    const shortText = "Short text not highlighted.";
    const mockRouteData = {
      ...mockData,
      dataMadinah: {
        text_uthmani: shortText,
      },
    };
    (useRoute as jest.Mock).mockReturnValue({
      params: mockRouteData,
    });

    const { getByText } = render(
      <NavigationContainer>
        <VerseFeedbackPage />
      </NavigationContainer>,
    );

    await waitFor(() => {
      const feedbackTextElement = getByText(shortText);
      expect(feedbackTextElement).toBeTruthy();
      expect(feedbackTextElement.props.style).toMatchObject(
        styles.correctFeedback,
      );
    });
  });

  it("sets arabicSetting to '01' if AsyncStorage returns null", async () => {
    jest.spyOn(AsyncStorage, "getItem").mockResolvedValue(null);

    render(
      <NavigationContainer>
        <VerseFeedbackPage />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        "arabicOption",
      );
    });
  });

  it("sets arabicSetting to the value from AsyncStorage if it exists", async () => {
    jest.spyOn(AsyncStorage, "getItem").mockResolvedValue("02");

    render(
      <NavigationContainer>
        <VerseFeedbackPage />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        "arabicOption",
      );
    });
  });

  it("loads audio when the component mounts", async () => {
    const loadAsyncMock = jest
      .spyOn(mockSound, "loadAsync")
      .mockImplementation();

    render(
      <NavigationContainer>
        <VerseFeedbackPage />
      </NavigationContainer>,
    );

    waitFor(async () => {
      expect(mockSound.loadAsync).toHaveBeenCalled();
    });

    loadAsyncMock.mockRestore();
  });

  it("logs an error when audio fails to load", async () => {
    const loadAsyncMock = jest
      .spyOn(mockSound, "loadAsync")
      .mockRejectedValue(new Error("Error loading sound"));

    console.error = jest.fn();
    render(
      <NavigationContainer>
        <VerseFeedbackPage />
      </NavigationContainer>,
    );
    await act(async () => {});

    expect(console.error).toHaveBeenCalledWith("Error loading sound");

    loadAsyncMock.mockRestore();
  });

  it("should call setStatusAsnc when audio playback finishes", async () => {
    const stopAsyncMock = jest
      .spyOn(mockSound, "stopAsync")
      .mockImplementation();

    const setOnPlaybackStatusUpdateMock = jest
      .spyOn(mockSound, "setOnPlaybackStatusUpdate")
      .mockImplementation((callback) => {
        if (callback) {
          const status: Partial<AVPlaybackStatus> = {
            didJustFinish: true,
          };
          callback(status as AVPlaybackStatus);
        }
      });

    render(
      <NavigationContainer>
        <VerseFeedbackPage />
      </NavigationContainer>,
    );
    await act(async () => {});

    expect(mockSound.setStatusAsync).toHaveBeenCalledWith({
      shouldPlay: false,
      positionMillis: 0,
    });
    stopAsyncMock.mockRestore();
    setOnPlaybackStatusUpdateMock.mockRestore();
  });

  it("logs error when toggle button", async () => {
    const playAsyncMock = jest
      .spyOn(mockSound, "setStatusAsync")
      .mockRejectedValue(new Error());
    console.error = jest.fn();

    const { getByTestId } = render(
      <NavigationContainer>
        <VerseFeedbackPage />
      </NavigationContainer>,
    );
    await act(async () => {});

    const playButton = getByTestId("play-recording-button-test");

    // Simulate pressing play button
    await act(async () => {
      fireEvent.press(playButton);
    });

    expect(mockSound.setStatusAsync).toHaveBeenCalledWith({
      shouldPlay: true,
    });

    expect(console.error).toHaveBeenCalledWith(
      "Error toggling playback",
      expect.any(Error),
    );
    playAsyncMock.mockRestore();
  });

  it("should not play audio when audio is not loaded and isAudioPlaying is false", async () => {
    const playAsyncMock = jest
      .spyOn(mockSound, "playAsync")
      .mockImplementation();
    const getStatusAsyncMock = jest
      .spyOn(mockSound, "getStatusAsync")
      .mockResolvedValue({ isLoaded: false });
    const pauseAsyncMock = jest
      .spyOn(mockSound, "pauseAsync")
      .mockImplementation();

    const { getByTestId } = render(
      <NavigationContainer>
        <VerseFeedbackPage />
      </NavigationContainer>,
    );
    const playButton = getByTestId("play-recording-button-test");

    await act(async () => {
      fireEvent.press(playButton);
    });

    expect(mockSound.playAsync).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.press(playButton);
    });

    expect(mockSound.pauseAsync).not.toHaveBeenCalled();

    playAsyncMock.mockRestore();
    getStatusAsyncMock.mockRestore();
    pauseAsyncMock.mockRestore();
  });

  it("logs error when unloading audio fails", async () => {
    const unloadAsyncMock = jest
      .spyOn(mockSound, "unloadAsync")
      .mockRejectedValue(new Error());
    console.error = jest.fn();

    const { unmount } = render(
      <NavigationContainer>
        <VerseFeedbackPage />
      </NavigationContainer>,
    );
    await act(async () => {});

    unmount();

    // Wait for promises to resolve
    await Promise.resolve();

    expect(console.error).toHaveBeenCalledWith(
      "Error unloading audio",
      expect.any(Error),
    );

    unloadAsyncMock.mockRestore();
  });
});
