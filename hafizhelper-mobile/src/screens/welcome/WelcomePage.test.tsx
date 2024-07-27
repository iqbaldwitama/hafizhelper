import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import WelcomePage from "./WelcomePage";
import {
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import ScreenName from "../../utils/ScreenName";

jest.mock("expo-font");

// Mock the navigation prop
const mockNavigation = {
  navigate: jest.fn(),
} as unknown as NavigationProp<ParamListBase>;

describe("WelcomePage", () => {
  (useFonts as jest.Mock).mockReturnValue([true]);

  it("renders correctly", () => {
    const { getByTestId } = render(
      <WelcomePage navigation={mockNavigation} />,
    );

    // Check if the Image component with testID "logo-id" exists
    const logoImage = getByTestId("img-logo");
    expect(logoImage).toBeTruthy();

    const descHeader = getByTestId("desc-header");
    expect(descHeader).toBeTruthy();
  });

  it("navigates to Login on button press", () => {
    const { getByTestId } = render(
      <WelcomePage navigation={mockNavigation} />,
    );
    const button = getByTestId("mulai-button");

    expect(button).toBeTruthy();

    // Simulate button press
    fireEvent.press(button);

    // Check that navigation was called with the correct parameters
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      ScreenName.LOGIN_PAGE,
      {
        name: "Login",
      },
    );
  });
});
