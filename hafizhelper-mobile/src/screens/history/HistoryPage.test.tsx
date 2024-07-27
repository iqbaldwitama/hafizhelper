import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HistoryPage from "./HistoryPage";
import {
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import useHistoryQuery from "../../hooks/useHistoryQuery";
import { useFonts } from "expo-font";
import ScreenName from "../../utils/ScreenName";

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  getParent: jest.fn(() => ({
    setOptions: jest.fn(),
  })),
  dispatch: jest.fn(),
} as unknown as NavigationProp<ParamListBase>;

// Mock DrawerActions and NavigationProp
jest.mock("@react-navigation/native", () => ({
  DrawerActions: {
    closeDrawer: jest.fn(),
  },
  NavigationProp: jest.fn(),
  ParamListBase: jest.fn(),
}));

let mockIsLoggin = true;

const setIsLoggin = (newIsLogginId: boolean) => {
  mockIsLoggin = newIsLogginId;
};

jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    authState: {
      isLoggedIn: mockIsLoggin,
    },
  })),
}));

jest.mock("expo-font");

jest.mock("../../hooks/useHistoryQuery");
const historyData = [
  {
    id: 1,
    surah_number: 1,
    created_at: "2024-05-01T08:00:00Z",
  },
  {
    id: 2,
    surah_number: 1,
    created_at: "2024-05-01T09:00:00Z", // Same date, different time
  },
  {
    id: 3,
    surah_number: 2,
    created_at: "2024-05-02T08:00:00Z", // Different date
  },
];
const mockRefetch = jest.fn();
const mockHistoryData = (
  mockIsLoading: boolean,
  mockHistoryError: boolean,
) => {
  (useHistoryQuery as jest.Mock).mockReturnValue({
    data: historyData,
    isLoading: mockIsLoading,
    error: mockHistoryError,
    refetch: mockRefetch,
  });
};
const historyLoading = true;
const historyError = true;

describe("<HistoryPage />", () => {
  beforeEach(() => {
    mockHistoryData(!historyLoading, !historyError);
  });

  (useFonts as jest.Mock).mockReturnValue([true]);

  test("renders history items when data is available", () => {
    const { getByTestId, queryByTestId, getAllByTestId } = render(
      <HistoryPage navigation={mockNavigation} />,
    );

    expect(queryByTestId("loading-indicator")).toBeFalsy();

    expect(getByTestId("scroll-view")).toBeTruthy();
    // Check if history cards are rendered for each data item
    expect(getAllByTestId("history-card")).toBeTruthy();
  });

  test("navigates to verse list page on card press", () => {
    const { getAllByTestId } = render(
      <HistoryPage navigation={mockNavigation} />,
    );

    const firstCard = getAllByTestId("history-card")[0];
    fireEvent.press(firstCard);

    expect(mockNavigation.getParent).toHaveBeenCalled();
    expect(mockNavigation.dispatch).toHaveBeenCalled();
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      "Verse List Page",
      {
        suratId: 1, // Assuming surah_number of the first item is 1
      },
    );
  });

  test("shows loading indicator when data is loading", () => {
    mockHistoryData(historyLoading, !historyError);
    const { getByTestId } = render(
      <HistoryPage navigation={mockNavigation} />,
    );
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  test("renders DateSeparator when dates change", () => {
    const { queryByText } = render(
      <HistoryPage navigation={mockNavigation} />,
    );

    expect(queryByText("1 Mei 2024")).toBeTruthy(); // Assuming using Indonesian locale
  });

  test("calls onRefresh function when reset button is pressed", () => {
    // Error history
    mockHistoryData(!historyLoading, historyError);
    const { getByTestId } = render(
      <HistoryPage navigation={mockNavigation} />,
    );

    const retryButton = getByTestId("reset-button");

    fireEvent.press(retryButton);

    expect(mockRefetch).toHaveBeenCalled();
  });

  test("navigate to error page when user is not logged in", () => {
    // Error history
    setIsLoggin(false);
    const { getByTestId } = render(
      <HistoryPage navigation={mockNavigation} />,
    );

    const retryButton = getByTestId("reset-button");

    fireEvent.press(retryButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      ScreenName.LOGIN_PAGE,
    );
  });
});
