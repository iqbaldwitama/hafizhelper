import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import BookmarkPage from "./BookmarkPage";
import {
  NavigationContainer,
  NavigationProp,
  ParamListBase,
  useIsFocused,
} from "@react-navigation/native";
import ScreenName from "../../utils/ScreenName";
import useAyahBookmarkQuery from "../../hooks/bookmark/useAyahBookmarkQuery";
import useSurahBookmarkQuery from "../../hooks/bookmark/useSurahBookmarkQuery";
import { useFonts } from "expo-font";
import { useAuth } from "../../context/AuthContext";
import useDeleteSurahBookmarkQuery from "../../hooks/bookmark/useDeleteSurahBookmarkQuery";
import useDeleteAyahBookmarkQuery from "../../hooks/bookmark/useDeleteAyahBookmarkQuery";

jest.mock("react-query", () => ({
  ...jest.requireActual("react-query"),
  useQuery: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    getParent: jest.fn(),
    setOptions: jest.fn(),
  }),
  useIsFocused: jest.fn(),
}));

jest.mock("../../context/AuthContext"); // Mock hook useAuth

jest.mock("../../hooks/bookmark/useDeleteSurahBookmarkQuery");

const mockIsLoggin = true;

jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    authState: {
      isLoggedIn: mockIsLoggin,
    },
  })),
}));

jest.mock("expo-font");

// Mock useBookmarkQuery
jest.mock("../../hooks/bookmark/useAyahBookmarkQuery");
jest.mock("../../hooks/bookmark/useSurahBookmarkQuery");
const bookmarkData = [
  {
    id: "1",
    surah: "Al-Fatihah",
    surah_number: 1,
    created_at: "",
  },
];

const bookmarkAyahData = [
  {
    id: "1",
    surah: "Al-Fatihah",
    surah_number: 1,
    created_at: "",
    ayat: 1,
  },
];
const mockRefetch = jest.fn();
const mockBookmarkData = (
  mockIsLoading: boolean,
  mockAyahError: boolean,
  mockSurahError: boolean,
) => {
  (useAyahBookmarkQuery as jest.Mock).mockReturnValue({
    data: bookmarkAyahData,
    isLoading: mockIsLoading,
    error: mockAyahError,
    refetch: mockRefetch,
  });

  (useSurahBookmarkQuery as jest.Mock).mockReturnValue({
    data: bookmarkData,
    isLoading: mockIsLoading,
    error: mockSurahError,
    refetch: mockRefetch,
  });
};
const bookmarkLoading = true;
const ayahBookmarkError = true;
const surahBookmarkError = true;

describe("BookmarkPage", () => {
  beforeEach(() => {
    mockBookmarkData(
      !bookmarkLoading,
      !ayahBookmarkError,
      !surahBookmarkError,
    );
  });

  (useFonts as jest.Mock).mockReturnValue([true]);
  (useIsFocused as jest.Mock).mockReturnValue(true);

  const dummyAuthState = {
    isLoggedIn: true,
    userToken: "",
    user: null,
  };

  (useAuth as jest.Mock).mockReturnValue({
    authState: dummyAuthState,
  });

  const mockNavigation = {
    navigate: jest.fn(),
    getParent: jest.fn(),
    dispatch: jest.fn(),
  } as unknown as NavigationProp<ParamListBase>;

  it("renders Surat layout by default", () => {
    const { getByText } = render(
      <BookmarkPage navigation={mockNavigation} />,
    );

    const suratTitle = getByText("Surat");
    expect(suratTitle).toBeTruthy();
  });

  it("renders Ayat layout when Ayat button is pressed", () => {
    const { getByTestId, getAllByText } = render(
      <BookmarkPage navigation={mockNavigation} />,
    );

    fireEvent.press(getByTestId("ayat-layout"));
    const ayatTitle = getAllByText("Ayat");
    expect(ayatTitle).toBeTruthy();
  });

  test("renders bookmark items when data is available", () => {
    const wrapper = render(
      <NavigationContainer>
        <BookmarkPage navigation={mockNavigation} />
      </NavigationContainer>,
    );

    expect(wrapper.queryByTestId("loading-indicator")).toBeFalsy();

    expect(wrapper.getByTestId("scroll-view")).toBeTruthy();
    fireEvent.press(wrapper.getByTestId("surat-layout"));

    expect(wrapper.getAllByTestId("surat-card")).toBeTruthy();
  });

  test("shows loading indicator when data is loading", () => {
    mockBookmarkData(
      bookmarkLoading,
      !ayahBookmarkError,
      !surahBookmarkError,
    );

    const { getByTestId } = render(
      <BookmarkPage navigation={mockNavigation} />,
    );
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  test("navigates to verse list page on card press", () => {
    const wrapper = render(
      <NavigationContainer>
        <BookmarkPage navigation={mockNavigation} />
      </NavigationContainer>,
    );

    expect(wrapper.getAllByTestId("surat-card")).toBeTruthy(),
      fireEvent.press(wrapper.getAllByTestId("surat-card")[0]);

    expect(mockNavigation.getParent).toHaveBeenCalled();
    expect(mockNavigation.dispatch).toHaveBeenCalled();
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      ScreenName.VERSE_LIST_PAGE,
      {
        suratId: 1, // Assuming surah_number of the first item is 1
      },
    );
  });
  test("navigates to verse detail page on card press", () => {
    (useIsFocused as jest.Mock).mockReturnValue(false);

    const wrapper = render(
      <NavigationContainer>
        <BookmarkPage navigation={mockNavigation} />
      </NavigationContainer>,
    );

    fireEvent.press(wrapper.getByTestId("ayat-layout"));

    expect(wrapper.getAllByTestId("ayat-card")).toBeTruthy(),
      fireEvent.press(wrapper.getAllByTestId("ayat-card")[0]);

    expect(mockNavigation.getParent).toHaveBeenCalled();
    expect(mockNavigation.dispatch).toHaveBeenCalled();
    expect(mockNavigation.navigate).toHaveBeenCalled();
  });

  test("calls onRefresh function when reset button is pressed", () => {
    // Error ayah bookmark
    mockBookmarkData(
      !bookmarkLoading,
      ayahBookmarkError,
      !surahBookmarkError,
    );

    const { getByTestId } = render(
      <BookmarkPage navigation={mockNavigation} />,
    );
    const retryButton = getByTestId("reset-button");

    fireEvent.press(retryButton);

    expect(mockRefetch).toHaveBeenCalled();
  });

  test("displays an error message if there is an error", () => {
    // Error surah bookmark
    mockBookmarkData(
      !bookmarkLoading,
      !ayahBookmarkError,
      surahBookmarkError,
    );

    const { getByTestId } = render(
      <BookmarkPage navigation={mockNavigation} />,
    );
    expect(getByTestId("error-message")).toBeTruthy();
  });

  test("navigate to error page when user is not logged in", () => {
    const dummyAuthState = {
      isLoggedIn: false,
      userToken: "",
      user: null,
    };

    (useAuth as jest.Mock).mockReturnValue({
      authState: dummyAuthState,
    });
    const { getByTestId } = render(
      <BookmarkPage navigation={mockNavigation} />,
    );

    const retryButton = getByTestId("reset-button");

    fireEvent.press(retryButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      ScreenName.LOGIN_PAGE,
    );
  });

  it("should not showing bookmark button if user is not logged in", () => {
    const dummyAuthState = {
      isLoggedIn: false,
      userToken: "",
      user: null,
    };

    (useAuth as jest.Mock).mockReturnValue({
      authState: dummyAuthState,
    });

    const { getByTestId } = render(
      <BookmarkPage navigation={mockNavigation} />,
    );

    const errorMsg = getByTestId("error-message");
    expect(errorMsg).toBeTruthy();
  });

  it("should remove surah bookmark", () => {
    const dummyAuthState = {
      isLoggedIn: true,
      userToken: "",
      user: null,
    };

    (useAuth as jest.Mock).mockReturnValue({
      authState: dummyAuthState,
    });

    const { getByTestId } = render(
      <BookmarkPage navigation={mockNavigation} />,
    );

    const BookmarkButton = getByTestId("bookmark-surat-button");
    fireEvent.press(BookmarkButton);
    expect(useDeleteSurahBookmarkQuery).toBeTruthy();
  });

  it("should remove ayat bookmark", () => {
    const dummyAuthState = {
      isLoggedIn: true,
      userToken: "",
      user: null,
    };

    (useAuth as jest.Mock).mockReturnValue({
      authState: dummyAuthState,
    });

    const { getByTestId } = render(
      <BookmarkPage navigation={mockNavigation} />,
    );

    fireEvent.press(getByTestId("ayat-layout"));

    const BookmarkButton = getByTestId("bookmark-ayat-button");
    fireEvent.press(BookmarkButton);
    expect(useDeleteAyahBookmarkQuery).toBeTruthy();
  });
});
