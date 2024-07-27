import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { DrawerItemIterface } from "../../interfaces/Drawer";
import CustomDrawerItem from "./CustomDrawerItem";
import { NavigationContainer } from "@react-navigation/native";

import {
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as NavigationProp<ParamListBase>;

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => mockNavigation,
}));

describe("CustomDrawerItem", () => {
  const props: DrawerItemIterface = {
    icon_name: "home",
    label: "Test Label",
    navigate_to: "TestScreen",
    color: "blue",
    additionalBehaviour: jest.fn(),
    handleLogout: jest.fn(),
  };

  const props_2: DrawerItemIterface = {
    icon_name: "home",
    label: "Test Label",
    navigate_to: "TestScreen",
    color: "blue",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <CustomDrawerItem {...props} />
      </NavigationContainer>,
    );
    expect(getByText("Test Label")).toBeTruthy();
    expect(getByTestId("drawer-item")).toBeTruthy();
  });

  it("navigates when clicked", () => {
    const wrapper = render(
      <NavigationContainer>
        <CustomDrawerItem {...props} />
      </NavigationContainer>,
    );

    fireEvent.press(wrapper.getByText("Test Label"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      "TestScreen",
    );
  });

  it("calls additional behaviour if provided when clicked", () => {
    const { getByText } = render(
      <NavigationContainer>
        <CustomDrawerItem {...props} />
      </NavigationContainer>,
    );
    fireEvent.press(getByText("Test Label"));
    expect(props.additionalBehaviour).toHaveBeenCalled();
  });

  it("calls handle logout if provided when clicked", () => {
    const { getByText } = render(
      <NavigationContainer>
        <CustomDrawerItem {...props} />
      </NavigationContainer>,
    );
    fireEvent.press(getByText("Test Label"));
    expect(props.handleLogout).toHaveBeenCalled();
  });

  it("does not throw error if additional behavior is not defined", () => {
    const { getByText } = render(
      <NavigationContainer>
        <CustomDrawerItem {...props_2} />
      </NavigationContainer>,
    );
    const label = getByText("Test Label");
    expect(() => fireEvent.press(label)).not.toThrow();
  });
});
