import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AppNavigation from "./AppNavigation";
import { NavigationContainer } from "@react-navigation/native";
import {
  useNavigation,
  DrawerActions,
} from "@react-navigation/native";

import { useFonts } from "expo-font";

jest.mock("expo-font");

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: jest.fn(),
  DrawerActions: {
    openDrawer: jest.fn(),
  },
}));

// Mock the Alert module
jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

describe("AppNavigation", () => {
  it("opens drawer when menu button is pressed", () => {
    (useFonts as jest.Mock).mockReturnValue([true]);

    const mockDispatch = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
      dispatch: mockDispatch,
    });

    const wrapper = render(
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>,
    );

    fireEvent.press(wrapper.getByTestId("mulai-button"));
    fireEvent.press(wrapper.getByTestId("guest-login-button"));
    fireEvent.press(wrapper.getByTestId("menuButton"));
    expect(DrawerActions.openDrawer).toHaveBeenCalled();
  });
});
