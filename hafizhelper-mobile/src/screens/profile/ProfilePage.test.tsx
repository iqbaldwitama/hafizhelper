import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import ProfilePage from "./ProfilePage";
import {
  NavigationProp,
  ParamListBase,
  useIsFocused,
} from "@react-navigation/native";
import ScreenName from "../../utils/ScreenName";
import { useFonts } from "expo-font";

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useIsFocused: jest.fn(),
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

const mockNavigation = {
  navigate: jest.fn(),
  getParent: jest.fn(),
} as unknown as NavigationProp<ParamListBase>;

describe("<ProfilePage />", () => {
  (useFonts as jest.Mock).mockReturnValue([true]);

  it("renders profile page correctly", () => {
    (useIsFocused as jest.Mock).mockReturnValue(true);

    const { getByTestId } = render(
      <ProfilePage navigation={mockNavigation} />,
    );

    // Ensure placeholder text for name field is rendered
    const nameInput = getByTestId("name-input");
    expect(nameInput).toBeTruthy();

    // Ensure placeholder text for email field is rendered
    const emailInput = getByTestId("email-input");
    expect(emailInput).toBeTruthy();
  });

  test("navigate to error page when user is not logged in", () => {
    // Error history
    setIsLoggin(false);
    const { getByTestId } = render(
      <ProfilePage navigation={mockNavigation} />,
    );

    const retryButton = getByTestId("reset-button");

    fireEvent.press(retryButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      ScreenName.LOGIN_PAGE,
    );
  });
});
