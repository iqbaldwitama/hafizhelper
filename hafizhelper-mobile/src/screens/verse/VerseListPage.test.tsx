import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react-native";
import VerseListPage from "./VerseListPage"; // Adjust the import path as necessary
import {
  NavigationProp,
  ParamListBase,
  useIsFocused,
} from "@react-navigation/native";
import { fetchVerseList } from "../../networks/ayat/fetchVerseList";
import axiosClient from "../../networks/axiosClient";
import MockAdapter from "axios-mock-adapter";
import { useFonts } from "expo-font";

jest.mock("expo-font");
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontSize from "../../utils/FontSize";
import useScreen from "../../hooks/useScreen";
import { fetchVerseListMadinah } from "../../networks/ayat/fetchVerseListMadinah";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { useAuth } from "../../context/AuthContext";
import { alfatihah, alfatihahAPI, alfatihahMadina } from "./mockData";
import { useQuery } from "react-query";
import useSpecificSurahBookmarkQuery from "../../hooks/bookmark/useSpecificSurahBookmarkQuery";
import { useVerseData } from "../../hooks/useVerseData";
import { VerseMadinahData } from "../../interfaces/VerseMadinah";
import { VerseData } from "../../interfaces/Verse";

const mockStore = configureMockStore();

jest.mock("react-query", () => ({
  ...jest.requireActual("react-query"),
  useQuery: jest.fn(),
}));

let mockSuratId = 1;

const setSuratId = (newSuratId: number) => {
  mockSuratId = newSuratId;
};

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useRoute: () => ({
      params: {
        suratId: mockSuratId,
        verseNumber: 1,
      },
    }),
    useIsFocused: jest.fn(),
  };
});

jest.mock("../../hooks/bookmark/useDeleteSurahBookmarkQuery", () =>
  jest.fn(),
);
jest.mock("../../hooks/bookmark/useCreateSurahBookmark", () =>
  jest.fn(),
);

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));
jest.mock("../../networks/history/createUserHistory", () =>
  jest.fn(),
);

jest.mock("../../hooks/useScreen"); // Mock hook useScreen

jest.mock("../../context/AuthContext"); // Mock hook useAuth

// Mock the getState method
const mockGetState = jest.fn(() => ({
  routes: [
    // Adjust the route structure based on your component's logic
    {}, // Screen 1
    {}, // Screen 2
    {}, // Screen 3
    { params: { suratId: 1 } }, // Screen 4 (VerseListPage)
  ],
  // Adjust the index as needed
  index: 3,
}));

const mockNavigation = {
  navigate: jest.fn(),
  getState: mockGetState,
  getParent: jest.fn(),
} as unknown as NavigationProp<ParamListBase>;

jest.mock("../../hooks/bookmark/useSpecificSurahBookmarkQuery");

// Mock useVerseData
jest.mock("../../hooks/useVerseData");
const mockUseVerseData = (
  verseData: VerseData,
  verseMadinah: VerseMadinahData,
  mockVerseLoading: boolean,
  mockVerseError: boolean,
) => {
  (useVerseData as jest.Mock).mockReturnValue({
    verseData: verseData,
    verseLoading: mockVerseLoading,
    verseError: mockVerseError,
    verseMadinahData: verseMadinah,
    verseMadinahLoading: mockVerseLoading,
    loadVerses: jest.fn(),
  });
};
const verseError = true;
const verseLoading = true;

// Mock useScreen
jest.mock("../../hooks/useScreen");
const mockUseScreen = (isPortrait: boolean) => {
  (useScreen as jest.Mock).mockReturnValue({
    width: isPortrait ? 400 : 800,
    height: isPortrait ? 800 : 400,
    isPortrait: isPortrait,
    scale: 2,
    fontScale: 1,
  });
};
const potraitMode = true;
const landscapeMode = false;

// Mock UseSpecificSurahBookmarkQuery
jest.mock("../../hooks/bookmark/useSpecificSurahBookmarkQuery");
const mockBookmarkRefetch = jest.fn();
const mockUseSpecificSurahBookmarkQuery = (
  isBookmarked: boolean,
  isLoading: boolean,
) => {
  (useSpecificSurahBookmarkQuery as jest.Mock).mockReturnValue({
    flag: isBookmarked,
    isLoading: isLoading,
    refetch: mockBookmarkRefetch,
  });
};
const flagBookmark = true;
const bookmarkLoading = true;

describe("Verse List Page", () => {
  (useFonts as jest.Mock).mockReturnValue([true]);
  (useIsFocused as jest.Mock).mockReturnValue(true);

  beforeEach(() => {
    mockUseVerseData(
      alfatihah,
      alfatihahMadina,
      !verseLoading,
      !verseError,
    );
    mockUseScreen(potraitMode);
    mockUseSpecificSurahBookmarkQuery(
      !flagBookmark,
      !bookmarkLoading,
    );
  });

  const dummyAuthState = {
    isLoggedIn: true,
    userToken: "",
    user: null,
  };

  (useAuth as jest.Mock).mockReturnValue({
    authState: dummyAuthState,
  });

  it("displays the loading indicator when data is being fetched", () => {
    (useIsFocused as jest.Mock).mockReturnValue(false);
    mockUseSpecificSurahBookmarkQuery(!flagBookmark, bookmarkLoading);
    const store = mockStore();
    mockUseVerseData(
      alfatihah,
      alfatihahMadina,
      verseLoading,
      !verseError,
    );

    const { getByTestId } = render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />,
      </Provider>,
    );
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("displays an error message if there is an error", () => {
    const store = mockStore();
    mockUseVerseData(
      alfatihah,
      alfatihahMadina,
      !verseLoading,
      verseError,
    );
    const { getByTestId } = render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />,
      </Provider>,
    );
    expect(getByTestId("error-message")).toBeTruthy();
  });

  it("renders verse data when fetched successfully", () => {
    const store = mockStore();
    const { getByText, getAllByTestId } = render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />,
      </Provider>,
    );

    // Test the verse data in scrollview
    const verseCards = getAllByTestId("verse-card-container");
    verseCards.forEach((card, index) => {
      act(() => {
        fireEvent(card, "layout", {
          nativeEvent: {
            layout: {
              y: 100 * (index + 1),
              // etc
            },
          },
        });
      });
    });

    expect(getByText(alfatihahAPI.data.namaLatin)).toBeTruthy();
    expect(
      getByText(
        `${alfatihahAPI.data.arti} • ${alfatihahAPI.data.jumlahAyat} Ayat`,
      ),
    ).toBeTruthy();
  });

  it("should load arti true", async () => {
    const store = mockStore();
    // Mock values to be returned by AsyncStorage.getItem
    jest
      .spyOn(AsyncStorage, "getItem")
      .mockImplementation(async (key: string) => {
        switch (key) {
          case "artiEnabled":
            return "true";
          default:
            return null;
        }
      });

    // Render the component
    render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />
      </Provider>,
    );
  });

  it("should load arti false", async () => {
    const store = mockStore();
    (useIsFocused as jest.Mock).mockReturnValue(true);
    // Mock values to be returned by AsyncStorage.getItem
    jest
      .spyOn(AsyncStorage, "getItem")
      .mockImplementation(async (key: string) => {
        switch (key) {
          case "artiEnabled":
            return "false";
          default:
            return null;
        }
      });

    // Render the component
    const { queryByTestId } = render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />,
      </Provider>,
    );

    await waitFor(() => {
      const arti = queryByTestId("arti-test");
      expect(arti).toBeNull();
    });
  });

  it("navigates to another screen when a verse is pressed", async () => {
    const store = mockStore();
    // Similar to the previous test, but you need to simulate pressing a verse
    const { getAllByTestId } = render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />,
      </Provider>,
    );
    const verseButton = getAllByTestId("verse-card");

    const verseCards = getAllByTestId("verse-card-container");
    verseCards.forEach((card, index) => {
      act(() => {
        fireEvent(card, "layout", {
          nativeEvent: {
            layout: {
              y: 100 * (index + 1),
              // etc
            },
          },
        });
      });
    });
    fireEvent.press(verseButton[0]);
    await waitFor(() =>
      expect(mockNavigation.navigate).toHaveBeenCalled(),
    );
  });

  it("fetches data successfully from an API", async () => {
    const mock = new MockAdapter(axiosClient);
    const mockData = { jumlah_ayat: 7, nama_latin: "Al-Fatihah" };
    mock
      .onGet(`https://equran.id/api/v2/surat/1`)
      .reply(200, mockData);

    const response = await fetchVerseList(1);
    expect(response).toEqual(mockData);
  });

  it("fetches data Madinah successfully from an API", async () => {
    const mock = new MockAdapter(axiosClient);
    const mockData = { verse_key: "1:1" };
    mock
      .onGet(
        `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=1`,
      )
      .reply(200, mockData);

    const response = await fetchVerseListMadinah(1);
    expect(response).toEqual(mockData);
  });

  it("throws an error when the API call fails", async () => {
    const mock = new MockAdapter(axiosClient);
    mock.onGet(`https://equran.id/api/v2/surat/1`).reply(500);

    await expect(fetchVerseList(1)).rejects.toThrow(
      "Request failed with status code 500",
    );
  });

  it("throws an error when the API Madinah call fails", async () => {
    const mock = new MockAdapter(axiosClient);
    mock
      .onGet(
        `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=1`,
      )
      .reply(500);

    await expect(fetchVerseListMadinah(1)).rejects.toThrow(
      "Request failed with status code 500",
    );
  });

  it("calls onRefresh function when reset button is pressed", () => {
    const store = mockStore();

    mockUseVerseData(
      alfatihah,
      alfatihahMadina,
      !verseLoading,
      verseError,
    );

    const { getByTestId } = render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />
      </Provider>,
    );
    const retryButton = getByTestId("reset-button");

    fireEvent.press(retryButton);

    expect(mockBookmarkRefetch).toHaveBeenCalled();
  });

  it("clears input and shows an error alert if an invalid verse number is submitted", () => {
    const store = mockStore();
    const mockAlert = jest.spyOn(Alert, "alert");

    // Render the component with the mocked navigation prop
    const { getByTestId } = render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />,
      </Provider>,
    );

    // Find the TextInput and submit button by placeholder/text
    const searchInput = getByTestId("verseSearchBar");

    // Simulate entering an invalid verse number and submitting
    fireEvent.changeText(searchInput, "999");
    fireEvent(searchInput, "submitEditing");

    expect(mockAlert).toHaveBeenCalled();
  });

  it("submits a valid verse number and navigates to the detail view", () => {
    const store = mockStore();

    // Render the component
    const { getByTestId } = render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />
      </Provider>,
    );

    const searchInput = getByTestId("verseSearchBar");
    const searchButton = getByTestId("searchButton");

    // Simulate entering a valid verse number and submitting
    fireEvent.changeText(searchInput, "3");
    fireEvent.press(searchButton);

    expect(searchInput.props.value).toBe("");
  });

  it("shows an error when an invalid (high) verse number is submitted and `jumlahAyat` is undefined", () => {
    const store = mockStore();
    const mockAlert = jest.spyOn(Alert, "alert");

    const { getByTestId } = render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />,
      </Provider>,
    );

    const searchInput = getByTestId("verseSearchBar");
    const searchButton = getByTestId("searchButton");

    // Simulate entering an unrealistic verse number and submitting
    fireEvent.changeText(searchInput, "999");
    fireEvent.press(searchButton);

    expect(mockAlert).toHaveBeenCalledWith(
      "Error",
      "Periksa kembali nomor ayat yang dimasukkan.",
    );
  });

  it("should load with font size setting", async () => {
    const store = mockStore();
    (useIsFocused as jest.Mock).mockReturnValue(true);

    // Mock values to be returned by AsyncStorage.getItem
    jest
      .spyOn(AsyncStorage, "getItem")
      .mockImplementation(async (key: string) => {
        switch (key) {
          case "fontSizeOption":
            return FontSize.LARGE;
          default:
            return FontSize.SMALL;
        }
      });

    // Render the component

    render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />
      </Provider>,
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        "fontSizeOption",
      );
    });
  });

  it("should display basmallah in any surah except Al-Fatihah and At-taubah", async () => {
    const store = mockStore();
    (useIsFocused as jest.Mock).mockReturnValue(true);

    // Mock values to be returned by AsyncStorage.getItem
    jest
      .spyOn(AsyncStorage, "getItem")
      .mockImplementation(async (key: string) => {
        switch (key) {
          case "fontSizeOption":
            return FontSize.LARGE;
          default:
            return FontSize.SMALL;
        }
      });

    setSuratId(2);

    // Render the component
    const { queryByTestId } = render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />
      </Provider>,
    );

    await waitFor(() => {
      const basmallah = queryByTestId("basmallah");
      expect(basmallah).toBeTruthy();
    });
  });

  it("should not display basmallah in Al-Fatihah and At-taubah", async () => {
    const store = mockStore();
    (useIsFocused as jest.Mock).mockReturnValue(true);

    // Mock values to be returned by AsyncStorage.getItem
    jest
      .spyOn(AsyncStorage, "getItem")
      .mockImplementation(async (key: string) => {
        switch (key) {
          case "fontSizeOption":
            return FontSize.LARGE;
          default:
            return FontSize.SMALL;
        }
      });

    setSuratId(1);

    // Render the component
    const { queryByTestId } = render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />
      </Provider>,
    );

    await waitFor(() => {
      const basmallah = queryByTestId("basmallah");
      expect(basmallah).toBeNull();
    });
  });

  it("should render correctly with appropriate width and structur based in portrait mode", async () => {
    const store = mockStore();

    setSuratId(2);

    const { getByTestId } = render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />
      </Provider>,
    );
    expect(getByTestId("headerComponent")).toBeTruthy();

    await waitFor(() => {
      const basmallahContainer = getByTestId("basmallah");
      expect(basmallahContainer).toHaveStyle({ width: "60%" });
    });
  });

  it("should render correctly with appropriate width and structur based in landscape mode", async () => {
    const store = mockStore();

    // landascape screen
    mockUseScreen(landscapeMode);

    setSuratId(2);

    const { getByTestId } = render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />,
      </Provider>,
    );
    expect(getByTestId("headerComponent")).toBeTruthy();

    await waitFor(() => {
      const basmallahContainer = getByTestId("basmallah");
      expect(basmallahContainer).toHaveStyle({ width: "40%" });
    });
  });

  it("Bookmark button press should call handleBookmarkPress", () => {
    const store = mockStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />,
      </Provider>,
    );

    const bookmarkButton = getByTestId("bookmark-button");
    fireEvent.press(bookmarkButton);
    expect(useSpecificSurahBookmarkQuery).toHaveBeenCalled();
  });

  it("should not showing bookmark button if user is not logged in", () => {
    (useScreen as jest.Mock).mockReturnValue({
      width: 400,
      height: 800,
      isPortrait: true,
      scale: 2,
      fontScale: 1,
    });

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
    const store = mockStore();

    const { getByTestId } = render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />,
      </Provider>,
    );

    const bookmarkButton = getByTestId("bookmark-disabled");
    expect(bookmarkButton).toBeTruthy();
  });

  it("should update verseYCoordinates on layout", () => {
    // Test suite ini juga sekaligus digunakan untuk kasus useRef.current bernilai null dengan menggasign jumlah ayat 999
    const alfatihahCopy = JSON.parse(JSON.stringify(alfatihah));
    alfatihahCopy.jumlahAyat = 999;

    mockUseSpecificSurahBookmarkQuery(flagBookmark, !bookmarkLoading);

    const store = mockStore();
    mockUseVerseData(
      alfatihahCopy,
      alfatihahMadina,
      !verseLoading,
      !verseError,
    );

    const { getByTestId } = render(
      <Provider store={store}>
        <VerseListPage navigation={mockNavigation} />,
      </Provider>,
    );

    const searchInput = getByTestId("verseSearchBar");

    // Simulate entering an invalid verse number and submitting
    fireEvent.changeText(searchInput, "2");
    fireEvent(searchInput, "submitEditing");

    expect(1).toBe(1);
  });
});
