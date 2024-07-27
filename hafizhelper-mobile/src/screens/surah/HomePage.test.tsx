import React from "react";
import {
  render,
  waitFor,
  fireEvent,
} from "@testing-library/react-native";
import {
  NavigationContainer,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";

import { fetchSurah } from "../../networks/surah/fetchSurah";
import MockAdapter from "axios-mock-adapter";
import axiosClient from "../../networks/axiosClient";
import { useIsFocused } from "@react-navigation/native";
import { useFonts } from "expo-font";
import ScreenName from "../../utils/ScreenName";
import HomePage from "./HomePage";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("expo-font");
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useIsFocused: jest.fn(),
  useNavigation: jest.fn(),
  DrawerActions: {
    closeDrawer: jest.fn(),
  },
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

describe("List Surah Component", () => {
  const mockNavigation = {
    navigate: jest.fn(),
    getParent: jest.fn(),
    dispatch: jest.fn(),
  } as unknown as NavigationProp<ParamListBase>;

  (useFonts as jest.Mock).mockReturnValue([true]);

  const mockData = [
    {
      nomor: 1,
      nama: "الفاتحة",
      nama_latin: "Al-Fatihah",
      jumlah_ayat: 7,
      tempat_turun: "mekah",
      arti: "Pembukaan",
    },
    {
      nomor: 2,
      nama: "البقرة",
      nama_latin: "Al-Baqarah",
      jumlah_ayat: 286,
      tempat_turun: "madinah",
      arti: "Sapi",
    },
  ];
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the page correctly", async () => {
    const mock = new MockAdapter(axiosClient);

    mock.onGet("https://equran.id/api/surat").reply(200, mockData);

    const { getByTestId } = render(
      <HomePage navigation={mockNavigation} />,
    );

    await waitFor(() => expect(getByTestId("title")).toBeTruthy());

    expect(getByTestId("title")).toBeTruthy();
    expect(getByTestId("subtitle")).toBeTruthy();
    expect(getByTestId("surahSearchBar")).toBeTruthy();
  });

  it("navigates to another screen when surah card is pressed", async () => {
    const mock = new MockAdapter(axiosClient);

    mock.onGet("https://equran.id/api/surat").reply(200, mockData);

    const wrapper = render(
      <NavigationContainer>
        <HomePage navigation={mockNavigation} />
      </NavigationContainer>,
    );

    await waitFor(() =>
      expect(wrapper.getAllByTestId("surah-card")).toBeTruthy(),
    );
    fireEvent.press(wrapper.getAllByTestId("surah-card")[0]);

    await waitFor(() =>
      expect(mockNavigation.navigate).toHaveBeenCalled(),
    );

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      ScreenName.VERSE_LIST_PAGE,
      { suratId: 1 },
    );
  }, 10000);

  it("fetches Surah successfully", async () => {
    const mock = new MockAdapter(axiosClient);

    mock.onGet("https://equran.id/api/surat").reply(200, mockData);

    (useIsFocused as jest.Mock).mockReturnValue(true);

    process.env.NODE_ENV = "production";
    const data = await fetchSurah();

    expect(data.length).toEqual(2);
  });

  it("throws an error when the API call fails", async () => {
    const mock = new MockAdapter(axiosClient);
    mock.onGet("https://equran.id/api/surat").networkError();

    await expect(fetchSurah()).rejects.toThrow("Network Error");

    const { getByTestId } = render(
      <NavigationContainer>
        <HomePage navigation={mockNavigation} />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(getByTestId("reset-button")).toBeTruthy();
    });
    const retryButton = getByTestId("reset-button");

    fireEvent.press(retryButton);
  });

  it("functional search input", async () => {
    const mock = new MockAdapter(axiosClient);

    mock.onGet("https://equran.id/api/surat").reply(200, mockData);

    (useIsFocused as jest.Mock).mockReturnValue(true);

    const { findByTestId } = render(
      <HomePage navigation={mockNavigation} />,
    );
    const searchInput = await findByTestId("surahSearchBar");
    const surahFilter = "Al-Fatihah";

    fireEvent.changeText(searchInput, surahFilter);

    const filteredData = mockData.filter(
      (item) => item.nama_latin === surahFilter,
    );
    expect(filteredData.length).toEqual(1);
  });

  it("should set PopupStatus to true in AsyncStorage and hide popup when done", async () => {
    const mock = new MockAdapter(axiosClient);

    mock.onGet("https://equran.id/api/surat").reply(200, mockData);

    (useIsFocused as jest.Mock).mockReturnValue(true);

    const { getByText, queryByTestId } = render(
      <HomePage navigation={mockNavigation} />,
    );

    // Simulate pressing the done button
    waitFor(async () => {
      fireEvent.press(getByText("Lewati"));
    });

    // Wait for async operation to complete
    await waitFor(() =>
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1),
    );

    // Assert that AsyncStorage is updated with PopupStatus true
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "PopupStatus",
      "true",
    );

    // Assert that the popup is hidden
    expect(queryByTestId("popup")).toBeNull();
  });

  // it("hides popup when onRequestClose is triggered", async () => {
  //   const mock = new MockAdapter(axiosClient);

  //   mock.onGet("https://equran.id/api/surat").reply(200, mockData);

  //   (useIsFocused as jest.Mock).mockReturnValue(true);

  //   const { queryByTestId } = render(
  //     <HomePage navigation={mockNavigation} />,
  //   );

  //   // Check if the popup is initially visible
  //     expect(queryByTestId("popup")).toBeTruthy();

  //     // Simulate closing the modal
  //     fireEvent(queryByTestId("modal"), "requestClose");

  //     // Check if the popup is hidden
  //     expect(queryByTestId("popup")).toBeNull();
  // });

  // it("Go to the next page of the Swiper component", async () => {
  //   const mock = new MockAdapter(axiosClient);

  //   mock.onGet("https://equran.id/api/surat").reply(200, mockData);

  //   (useIsFocused as jest.Mock).mockReturnValue(true);

  //   const { getByText, queryByTestId } = render(
  //     <HomePage navigation={mockNavigation} />,
  //   );

  //   fireEvent(queryByTestId("popup"), "onIndexChanged", 2); // Change the index to 2

  //   expect(getByText("Selesai")).toBeTruthy();
  // });
});
