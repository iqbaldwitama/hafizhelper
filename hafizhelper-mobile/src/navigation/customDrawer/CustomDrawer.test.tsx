import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import {
  NavigationContainer,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import "@testing-library/jest-native/extend-expect";
import CustomDrawer from "./CustomDrawer";
import ScreenName from "../../utils/ScreenName";

const mockNavigation = {
  navigate: jest.fn(),
  dispatch: jest.fn(),
} as unknown as NavigationProp<ParamListBase>;

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => mockNavigation,
  DrawerActions: {
    openDrawer: jest.fn(),
  },
}));

describe("CustomDrawerContent", () => {
  it("renders profile information correctly", () => {
    const screen = render(
      <NavigationContainer>
        <CustomDrawer />
      </NavigationContainer>,
    );

    expect(screen.getByTestId("profile-name")).toHaveTextContent(
      "Sobat Hafiz",
    );
  });

  it("navigates to ProfilePage on profile press", () => {
    const screen = render(
      <NavigationContainer>
        <CustomDrawer />
      </NavigationContainer>,
    );

    // Simulate press on profile
    fireEvent.press(screen.getByTestId("mulai-button"));
    fireEvent.press(screen.getByTestId("guest-login-button"));
    fireEvent.press(screen.getByTestId("menuButton"));

    const profilePress = screen.getByTestId("profile-wrapper");
    fireEvent.press(profilePress);

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      ScreenName.PROFILE_PAGE,
    );
  });
});
