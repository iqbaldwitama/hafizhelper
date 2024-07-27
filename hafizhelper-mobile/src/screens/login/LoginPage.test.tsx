import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import LoginPage from "./LoginPage";
import {
  NavigationContainer,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import ScreenName from "../../utils/ScreenName";

// Mock the navigation prop

const mockNavigation = {
  navigate: jest.fn(),
  getParent: jest.fn(),
} as unknown as NavigationProp<ParamListBase>;

describe("LoginPage", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <LoginPage navigation={mockNavigation} />
      </NavigationContainer>,
    );

    const logoImage = getByTestId("img-logo");
    expect(logoImage).toBeTruthy();

    const titleLoginText = getByTestId("title-login");
    expect(titleLoginText).toBeTruthy();

    const descriptionText = getByTestId("description");
    expect(descriptionText).toBeTruthy();
  });

  it("navigates to HomePage on button press", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <LoginPage navigation={mockNavigation} />
      </NavigationContainer>,
    );
    const button = getByTestId("guest-login-button");

    expect(button).toBeTruthy();

    // Simulate button press
    fireEvent.press(button);

    // Check that navigation was called with the correct parameters
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      ScreenName.SURAH_LIST_PAGE,
      {
        name: "HomePage",
      },
    );
  });

  it("navigates to UserLogin on button press", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <LoginPage navigation={mockNavigation} />
      </NavigationContainer>,
    );
    const button = getByTestId("signin-button");

    expect(button).toBeTruthy();

    // Simulate button press
    fireEvent.press(button);

    // Check that navigation was called with the correct parameters
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      ScreenName.USER_LOGIN_PAGE,
      {
        name: "UserLogin",
      },
    );
  });
});
