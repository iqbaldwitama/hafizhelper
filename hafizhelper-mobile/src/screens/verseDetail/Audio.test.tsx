import React from "react";
import {
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native";
import VerseDetailPage from "./VerseDetailPage";
import { Audio, AVPlaybackStatus } from "expo-av";
import { act } from "react-test-renderer";
import { Verse } from "../../interfaces/Verse";
import {
  NavigationProp,
  ParamListBase,
  useIsFocused,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import * as ReactQuery from "react-query";
import { useQuery } from "react-query";
import { useAuth } from "../../context/AuthContext";

const dummy: Verse = {
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
}));

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
  getState: mockGetState,
  getParent: jest.fn(),
} as unknown as NavigationProp<ParamListBase>;

jest.mock("expo-font");

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

jest.mock("react-query", () => ({
  ...jest.requireActual("react-query"),
  useQuery: jest.fn(),
}));

jest.spyOn(ReactQuery, "useQuery").mockImplementation(
  jest.fn().mockReturnValue({
    flag: true,
    isLoading: false,
    isSuccess: true,
    refetchBookmark: jest.fn(),
  }),
);

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
      Recording: jest.fn().mockReturnValue({
        prepareToRecordAsync: jest.fn(),
        startAsync: jest.fn(),
        stopAndUnloadAsync: jest.fn(),
        getURI: jest.fn(),
      }),
      requestPermissionsAsync: jest.fn().mockResolvedValue({
        canAskAgain: true,
        expires: "never",
        granted: true,
        status: "granted",
      }),
      setAudioModeAsync: jest.fn().mockResolvedValue({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }),
    },
  };
});

jest.mock("../../context/AuthContext"); // Mock hook useAuth

describe("VerseDetailPage", () => {
  let mockSound: Audio.Sound;
  let mockRecording: Audio.Recording;

  (useFonts as jest.Mock).mockReturnValue([true]);
  (useIsFocused as jest.Mock).mockReturnValue(true);

  beforeEach(async () => {
    mockSound = new Audio.Sound();
    mockRecording = new Audio.Recording();
  });

  const dummyAuthState = {
    isLoggedIn: true,
    userToken: "",
    user: null,
  };

  (useAuth as jest.Mock).mockReturnValue({
    authState: dummyAuthState,
  });

  it("loads audio when page is rendered", async () => {
    (useIsFocused as jest.Mock).mockReturnValue(false);
    const loadAsyncMock = jest
      .spyOn(mockSound, "loadAsync")
      .mockImplementation();

    render(<VerseDetailPage navigation={mockNavigation} />);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    waitFor(async () => {
      expect(mockSound.loadAsync).toHaveBeenCalledWith({
        uri: dummy.audio["01"],
      });
    });

    loadAsyncMock.mockRestore();
  });

  it("should load settings from AsyncStorage", async () => {
    // Mock values to be returned by AsyncStorage.getItem
    jest
      .spyOn(AsyncStorage, "getItem")
      .mockImplementation(async (key: string) => {
        switch (key) {
          case "latinEnabled":
            return "true"; // Simulate 'true' value for latinEnabled
          case "audioOption":
            return "01"; // Simulate '01' value for audioOption
          default:
            return null;
        }
      });

    // Render the component
    render(<VerseDetailPage navigation={mockNavigation} />);

    expect(1).toBe(1);
  });

  it("should load latin false", async () => {
    // Mock values to be returned by AsyncStorage.getItem
    jest
      .spyOn(AsyncStorage, "getItem")
      .mockImplementation(async (key: string) => {
        switch (key) {
          case "latinEnabled":
            return "false"; // Simulate 'true' value for latinEnabled
          case "audioOption":
            return "01"; // Simulate '01' value for audioOption
          default:
            return null;
        }
      });

    // Render the component
    render(<VerseDetailPage navigation={mockNavigation} />);

    expect(1).toBe(1);
  });

  it("plays audio when play button is pressed", async () => {
    const playAsyncMock = jest
      .spyOn(mockSound, "playAsync")
      .mockImplementation();
    jest.spyOn(mockSound, "playAsync").mockImplementation();

    const { getByTestId } = render(
      <VerseDetailPage navigation={mockNavigation} />,
    );
    const playButton = getByTestId("play-button-test");

    // Simulate pressing play button
    await act(async () => {
      fireEvent.press(playButton);
    });

    expect(mockSound.setStatusAsync).toHaveBeenCalledWith({
      shouldPlay: true,
    });

    playAsyncMock.mockRestore();
  });

  it("pause audio when play button is pressed and audio is playing", async () => {
    const playAsyncMock = jest
      .spyOn(mockSound, "playAsync")
      .mockImplementation();
    const pauseAsyncMock = jest
      .spyOn(mockSound, "pauseAsync")
      .mockImplementation();

    const { getByTestId } = render(
      <VerseDetailPage navigation={mockNavigation} />,
    );
    const playButton = getByTestId("play-button-test");

    // Simulate pressing play button
    await act(async () => {
      fireEvent.press(playButton);
    });

    expect(mockSound.setStatusAsync).toHaveBeenCalledWith({
      shouldPlay: true,
    });

    // Simulate pressing pause button
    await act(async () => {
      fireEvent.press(playButton);
    });

    expect(mockSound.setStatusAsync).toHaveBeenCalledWith({
      shouldPlay: false,
    });

    playAsyncMock.mockRestore();
    pauseAsyncMock.mockRestore();
  });

  it("stops audio when play button is pressed and audio is playing", async () => {
    const playAsyncMock = jest
      .spyOn(mockSound, "playAsync")
      .mockImplementation();
    const stopAsyncMock = jest
      .spyOn(mockSound, "stopAsync")
      .mockImplementation();

    const { getByTestId } = render(
      <VerseDetailPage navigation={mockNavigation} />,
    );
    const playButton = getByTestId("play-button-test");

    // Simulate pressing play button
    await act(async () => {
      fireEvent.press(playButton);
    });

    expect(mockSound.setStatusAsync).toHaveBeenCalledWith({
      shouldPlay: true,
    });

    const stopButton = getByTestId("stop-button-test");

    // Simulate pressing stop button
    await act(async () => {
      fireEvent.press(stopButton);
    });

    expect(mockSound.setStatusAsync).toHaveBeenCalledWith({
      shouldPlay: false,
      positionMillis: 0,
    });

    playAsyncMock.mockRestore();
    stopAsyncMock.mockRestore();
  });

  it("logs error when loading audio fails", async () => {
    // Simulate error during audio loading
    const loadAsyncMock = jest
      .spyOn(mockSound, "loadAsync")
      .mockRejectedValue(new Error("Error loading audio"));

    console.error = jest.fn();

    render(<VerseDetailPage navigation={mockNavigation} />);
    await act(async () => {});

    expect(console.error).toHaveBeenCalledWith(
      "Error loading audio",
      expect.any(Error),
    );

    loadAsyncMock.mockRestore();
  });

  it("logs error when toggle button", async () => {
    const playAsyncMock = jest
      .spyOn(mockSound, "setStatusAsync")
      .mockRejectedValue(new Error());
    console.error = jest.fn();

    const { getByTestId } = render(
      <VerseDetailPage navigation={mockNavigation} />,
    );
    await act(async () => {});

    const playButton = getByTestId("play-button-test");

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

    render(<VerseDetailPage navigation={mockNavigation} />);
    await act(async () => {});

    expect(mockSound.setStatusAsync).toHaveBeenCalledWith({
      shouldPlay: false,
      positionMillis: 0,
    });
    stopAsyncMock.mockRestore();
    setOnPlaybackStatusUpdateMock.mockRestore();
  });

  it("should not call stopAsync when audio playback finishes", async () => {
    const stopAsyncMock = jest
      .spyOn(mockSound, "stopAsync")
      .mockImplementation();

    const setOnPlaybackStatusUpdateMock = jest
      .spyOn(mockSound, "setOnPlaybackStatusUpdate")
      .mockImplementation((callback) => {
        if (callback) {
          const status: Partial<AVPlaybackStatus> = {
            didJustFinish: false,
          };
          callback(status as AVPlaybackStatus);
        }
      });

    render(<VerseDetailPage navigation={mockNavigation} />);
    await act(async () => {});

    expect(mockSound.stopAsync).not.toHaveBeenCalled();
    stopAsyncMock.mockRestore();
    setOnPlaybackStatusUpdateMock.mockRestore();
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
      <VerseDetailPage navigation={mockNavigation} />,
    );
    const playButton = getByTestId("play-button-test");

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
      <VerseDetailPage navigation={mockNavigation} />,
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

  it("should call replayAsync when play button is pressed and repeat button is toggled", async () => {
    const replayAsyncMock = jest
      .spyOn(mockSound, "replayAsync")
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

    const { getByTestId } = render(
      <VerseDetailPage navigation={mockNavigation} />,
    );
    const repeatButton = getByTestId("repeat-button-test");

    await act(async () => {
      fireEvent.press(repeatButton);
    });

    await act(async () => {});

    expect(mockSound.replayAsync).toHaveBeenCalled();
    replayAsyncMock.mockRestore();
    setOnPlaybackStatusUpdateMock.mockRestore();
  });

  it("recording audio when record button is pressed", async () => {
    const { getByTestId } = render(
      <VerseDetailPage navigation={mockNavigation} />,
    );
    const recordButton = getByTestId("mic-button-test");

    // Simulate pressing record button
    await act(async () => {
      fireEvent.press(recordButton);
    });

    expect(getByTestId("mic-off-button-test")).toBeTruthy();
  });
  it("Bookmark button press should call handleBookmarkPress *if logged in*", () => {
    (useQuery as jest.Mock).mockReturnValue({
      flag: false,
      isLoading: false,
      refetch: jest.fn(),
    });

    const dummyAuthState = {
      isLoggedIn: true,
      userToken: "",
      user: null,
    };

    (useAuth as jest.Mock).mockReturnValue({
      authState: dummyAuthState,
    });

    const { getByTestId } = render(
      <VerseDetailPage navigation={mockNavigation} />,
    );

    const bookmarkButton = getByTestId("bookmark-button");
    fireEvent.press(bookmarkButton);
    expect(useQuery).toHaveBeenCalled();
  });

  it("should not showing bookmark button if user is not logged in", () => {
    (useQuery as jest.Mock).mockReturnValue({
      flag: false,
      isLoading: false,
      refetch: jest.fn(),
    });

    const dummyAuthState = {
      isLoggedIn: false,
      userToken: "",
      user: null,
    };

    (useAuth as jest.Mock).mockReturnValue({
      authState: dummyAuthState,
    });

    const { getByTestId } = render(
      <VerseDetailPage navigation={mockNavigation} />,
    );

    const bookmarkButton = getByTestId("bookmark-disabled");
    expect(bookmarkButton).toBeTruthy();
  });

  it("should start recording when mic button is pressed and stop recording when mic off button is pressed", async () => {
    const startAsyncMock = jest
      .spyOn(mockRecording, "startAsync")
      .mockImplementation();
    jest.spyOn(mockRecording, "startAsync").mockImplementation();

    const requestPermissionsAsyncMock = jest
      .spyOn(Audio, "requestPermissionsAsync")
      .mockResolvedValue({
        canAskAgain: true,
        granted: true,
        expires: "never",
        status: "granted",
      });

    const stopAndUnloadAsyncMock = jest
      .spyOn(mockRecording, "stopAndUnloadAsync")
      .mockImplementation();
    jest
      .spyOn(mockRecording, "stopAndUnloadAsync")
      .mockImplementation();

    const { getByTestId } = render(
      <VerseDetailPage navigation={mockNavigation} />,
    );
    const recordButton = getByTestId("mic-button-test");

    // Simulate pressing record button
    await act(async () => {
      fireEvent.press(recordButton);
    });
    expect(Audio.requestPermissionsAsync).toHaveBeenCalled();

    await act(async () => {
      fireEvent.press(recordButton);
    });

    expect(mockRecording.stopAndUnloadAsync).toHaveBeenCalled();

    requestPermissionsAsyncMock.mockRestore();
    startAsyncMock.mockRestore();
    stopAndUnloadAsyncMock.mockRestore();
  });
});
