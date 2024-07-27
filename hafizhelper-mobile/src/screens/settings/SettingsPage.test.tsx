import {
  render,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Mock AsyncStorage
import { NavigationContainer } from "@react-navigation/native"; // Import NavigationContainer
import SettingsPage from "./SettingsPage";
import { Alert } from "react-native";
import React from "react";
import FontSize from "../../utils/FontSize";

jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

// Mock useNavigation hook
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    getParent: jest.fn(),
    setOptions: jest.fn(),
  }),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

const itemData = [
  { key: "artiEnabled", text: "true" },
  { key: "latinEnabled", text: "true" },
  { key: "audioOption", text: "Abdullah-Al-Juhany" },
];

describe("<SettingsPage />", () => {
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(async () => {
    await AsyncStorage.clear();

    const jsonValue1 = JSON.stringify(itemData[0]);
    const jsonValue2 = JSON.stringify(itemData[1]);
    const jsonValue3 = JSON.stringify(itemData[2]);
    await AsyncStorage.setItem(itemData[0].key, jsonValue1);
    await AsyncStorage.setItem(itemData[1].key, jsonValue2);
    await AsyncStorage.setItem(itemData[2].key, jsonValue3);
  });

  it("renders correctly", async () => {
    const { getByText } = render(
      <NavigationContainer>
        <SettingsPage />
      </NavigationContainer>,
    );
    expect(getByText("Tunjukkan Latin")).toBeTruthy();
    expect(getByText("Tunjukkan Arti")).toBeTruthy();
    expect(getByText("Opsi Qari")).toBeTruthy();
    expect(getByText("Opsi Mushaf")).toBeTruthy();
  });

  it("toggles Latin option correctly", async () => {
    const { getByTestId } = render(<SettingsPage />);
    const switchButton = getByTestId("latin-switch");
    fireEvent.press(switchButton);
    expect(switchButton.props.value).toEqual(true);

    await act(async () => {
      fireEvent.press(switchButton);

      await waitFor(async () => {
        await expect(switchButton.props.value).toEqual(false);
      });
    });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const latinSwitch = getByTestId("latin-switch");
    fireEvent(latinSwitch, "onValueChange", true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "latinEnabled",
      "true",
    );
  });

  it("toggles Arti option correctly", async () => {
    const { getByTestId } = render(<SettingsPage />);
    const switchButton = getByTestId("arti-switch");
    fireEvent.press(switchButton);
    expect(switchButton.props.value).toEqual(true);
    await act(async () => {
      await waitFor(async () => {
        await expect(switchButton.props.value).toEqual(true);
      });
    });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const artiSwitch = getByTestId("arti-switch");
    fireEvent(artiSwitch, "onValueChange", true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "artiEnabled",
      "true",
    );
  });

  it("displays correct audio option modal", async () => {
    const { getByTestId, getByText } = render(<SettingsPage />);
    const audioOptionButton = getByTestId("audio-option-button");
    fireEvent.press(audioOptionButton);
    expect(getByText("01 : Abdullah-Al-Juhany")).toBeTruthy();
    expect(getByText("02 : Abdul-Muhsin-Al-Qasim")).toBeTruthy();

    const option = { name: "Abdullah-Al-Juhany", key: "01" };
    await fireEvent.press(getByText("01 : Abdullah-Al-Juhany"));

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "audioOption",
      option.key,
    );

    // Expect Alert.alert to be called with the correct parameters
    waitFor(async () => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Opsi Telah Diubah",
        `Pilihan Qari: ${option.name}`,
      );
    });
  });

  it("displays correct font size option modal", async () => {
    const { getByTestId, getByText, getAllByText } = render(
      <SettingsPage />,
    );
    const audioOptionButton = getByTestId("font-size-option-button");
    fireEvent.press(audioOptionButton);

    expect(getAllByText(FontSize.SMALL)).toBeTruthy(); // default small font size
    expect(getByText(FontSize.MEDIUM)).toBeTruthy();
    expect(getByText(FontSize.LARGE)).toBeTruthy();

    const option = FontSize.LARGE;
    await fireEvent.press(getByText(FontSize.LARGE));

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "fontSizeOption",
      option,
    );
  });

  it("displays correct arabic option modal", async () => {
    const { getByTestId, getByText } = render(<SettingsPage />);
    const arabicOptionButton = getByTestId("arabic-option-button");

    fireEvent.press(arabicOptionButton);
    expect(getByText("01 : Mushaf Madinah")).toBeTruthy();
    expect(getByText("02 : Mushaf Standar Indonesia")).toBeTruthy();

    const option = { name: "Mushaf Madinah", key: "01" };
    await fireEvent.press(getByText("01 : Mushaf Madinah"));

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "arabicOption",
      option.key,
    );

    // Expect Alert.alert to be called with the correct parameters
    waitFor(async () => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Opsi Telah Diubah",
        `Pilihan Mushaf: ${option.name}`,
      );
    });
  });

  it("should show Latin info on pressIn and hide on pressOut", () => {
    const { getByTestId, queryByText } = render(<SettingsPage />);

    expect(
      queryByText(
        "Pada bacaan ayat suatu surat, kamu dapat memunculkan atau menghilangkan teks latin pada ayat tersebut.",
      ),
    ).toBeNull();

    fireEvent(getByTestId("latin-info-icon"), "pressIn");

    expect(
      queryByText(
        "Pada bacaan ayat suatu surat, kamu dapat memunculkan atau menghilangkan teks latin pada ayat tersebut.",
      ),
    ).not.toBeNull();

    // Trigger pressOut event
    fireEvent(getByTestId("latin-info-icon"), "pressOut");

    // Latin info should be hidden again
    expect(
      queryByText(
        "Pada bacaan ayat suatu surat, kamu dapat memunculkan atau menghilangkan teks latin pada ayat tersebut.",
      ),
    ).toBeNull();
  });

  it("should show arti info on pressIn and hide on pressOut", () => {
    const { getByTestId, queryByText } = render(<SettingsPage />);

    expect(
      queryByText(
        "Saat membaca suatu surat, kamu dapat menghilangkan teks arti pada ayat-ayat agar memudahkan kamu dalam membaca Al-Quran",
      ),
    ).toBeNull();

    fireEvent(getByTestId("arti-info-icon"), "pressIn");

    expect(
      queryByText(
        "Saat membaca suatu surat, kamu dapat menghilangkan teks arti pada ayat-ayat agar memudahkan kamu dalam membaca Al-Quran",
      ),
    ).not.toBeNull();

    // Trigger pressOut event
    fireEvent(getByTestId("arti-info-icon"), "pressOut");

    // Latin info should be hidden again
    expect(
      queryByText(
        "Saat membaca suatu surat, kamu dapat menghilangkan teks arti pada ayat-ayat agar memudahkan kamu dalam membaca Al-Quran",
      ),
    ).toBeNull();
  });

  it("should show audio info on pressIn and hide on pressOut", () => {
    const { getByTestId, queryByText } = render(<SettingsPage />);

    expect(
      queryByText(
        "Kamu dapat kustomisasi pilihan Qari yang akan membuat kamu lebih nyaman untuk membaca dan menghafal suatu ayat.",
      ),
    ).toBeNull();

    fireEvent(getByTestId("audio-info-icon"), "pressIn");

    expect(
      queryByText(
        "Kamu dapat kustomisasi pilihan Qari yang akan membuat kamu lebih nyaman untuk membaca dan menghafal suatu ayat.",
      ),
    ).not.toBeNull();

    // Trigger pressOut event
    fireEvent(getByTestId("audio-info-icon"), "pressOut");

    // Latin info should be hidden again
    expect(
      queryByText(
        "Kamu dapat menkustomisasi pilihan Qari yang akan membuat kamu lebih nyaman untuk membaca dan menghapal suatu ayat.",
      ),
    ).toBeNull();
  });

  it("should show font size info on pressIn and hide on pressOut", () => {
    const { getByTestId, queryByTestId } = render(<SettingsPage />);

    expect(queryByTestId("font-size-info")).toBeNull();

    fireEvent(getByTestId("font-size-info-icon"), "pressIn");

    expect(queryByTestId("font-size-info")).toBeTruthy();

    // Trigger pressOut event
    fireEvent(getByTestId("font-size-info-icon"), "pressOut");

    // font size info should be hidden again
    expect(queryByTestId("font-size-info")).toBeNull();
  });

  it("should close audio modal when pressed outside", () => {
    const { getByTestId, queryByTestId } = render(<SettingsPage />);

    // Initially, audio modal should not be visible
    expect(queryByTestId("audio-modal")).toBeNull();

    const audioOptionButton = getByTestId("audio-option-button");
    fireEvent.press(audioOptionButton);

    // Trigger onPress event on the modal backdrop
    fireEvent.press(getByTestId("audio-modal-backdrop"));

    // Audio modal should still not be visible as we haven't opened it yet
    expect(queryByTestId("audio-modal")).toBeNull();

    // Open the audio modal
    fireEvent.press(getByTestId("audio-option-button"));

    // Now, audio modal should be visible
    expect(queryByTestId("audio-modal")).not.toBeNull();

    // Trigger onPress event on the modal backdrop to close the modal
    fireEvent.press(getByTestId("audio-modal-backdrop"));

    // Audio modal should be closed
    expect(queryByTestId("audio-modal")).toBeNull();

    fireEvent.press(audioOptionButton);
    fireEvent(getByTestId("audio-modal"), "requestClose");

    // Audio modal should be closed
    expect(queryByTestId("audio-modal")).toBeNull();
  });

  it("should close font size modal when pressed outside", () => {
    const { getByTestId, queryByTestId } = render(<SettingsPage />);

    // Initially, Font size modal should not be visible
    expect(queryByTestId("font-size-modal")).toBeNull();

    const audioOptionButton = getByTestId("font-size-option-button");
    fireEvent.press(audioOptionButton);

    // Trigger onPress event on the modal backdrop
    fireEvent.press(getByTestId("font-size-modal-backdrop"));

    // Font size modal should still not be visible as we haven't opened it yet
    expect(queryByTestId("font-size-modal")).toBeNull();

    // Open the Font size modal
    fireEvent.press(getByTestId("font-size-option-button"));

    // Now, Font size modal should be visible
    expect(queryByTestId("font-size-modal")).not.toBeNull();

    // Trigger onPress event on the modal backdrop to close the modal
    fireEvent.press(getByTestId("font-size-modal-backdrop"));

    // Font size modal should be closed
    expect(queryByTestId("font-size-modal")).toBeNull();

    fireEvent.press(audioOptionButton);
    fireEvent(getByTestId("font-size-modal"), "requestClose");

    // Font size modal should be closed
    expect(queryByTestId("font-size-modal")).toBeNull();
  });

  it("should show arabic info on pressIn and hide on pressOut", () => {
    const { getByTestId, queryByText } = render(<SettingsPage />);

    expect(
      queryByText(
        "Kamu dapat kustomisasi pilihan Mushaf yang akan membuat kamu lebih nyaman untuk membaca dan menghafal suatu ayat.",
      ),
    ).toBeNull();

    fireEvent(getByTestId("arabic-info-icon"), "pressIn");

    expect(
      queryByText(
        "Kamu dapat kustomisasi pilihan Mushaf yang akan membuat kamu lebih nyaman untuk membaca dan menghafal suatu ayat.",
      ),
    ).not.toBeNull();

    // Trigger pressOut event
    fireEvent(getByTestId("arabic-info-icon"), "pressOut");

    // Latin info should be hidden again
    expect(
      queryByText(
        "Kamu dapat menkustomisasi pilihan Mushaf yang akan membuat kamu lebih nyaman untuk membaca dan menghafal suatu ayat.",
      ),
    ).toBeNull();
  });

  it("should close arabic modal when pressed outside", () => {
    const { getByTestId, queryByTestId } = render(<SettingsPage />);

    expect(queryByTestId("arabic-modal")).toBeNull();

    const arabicOptionButton = getByTestId("arabic-option-button");
    fireEvent.press(arabicOptionButton);

    fireEvent.press(getByTestId("arabic-modal-backdrop"));
    expect(queryByTestId("arabic-modal")).toBeNull();

    // Open the audio modal
    fireEvent.press(getByTestId("arabic-option-button"));
    expect(queryByTestId("arabic-modal")).not.toBeNull();

    // Trigger onPress event on the modal backdrop to close the modal
    fireEvent.press(getByTestId("arabic-modal-backdrop"));
    expect(queryByTestId("arabic-modal")).toBeNull();

    fireEvent.press(arabicOptionButton);
    fireEvent(getByTestId("arabic-modal"), "requestClose");

    // Audio modal should be closed
    expect(queryByTestId("arabic-modal")).toBeNull();
  });
});
