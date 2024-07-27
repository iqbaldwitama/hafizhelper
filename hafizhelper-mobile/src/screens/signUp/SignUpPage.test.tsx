import React from "react";
import {
  render,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import {
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import SignUpPage from "./SignUpPage";
import { createUser } from "../../networks/auth/createUser";

const mockNavigation = {
  navigate: jest.fn(),
  getParent: jest.fn(),
} as unknown as NavigationProp<ParamListBase>;

jest.mock("../../networks/auth/createUser");

describe("Login component", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(
      <SignUpPage navigation={mockNavigation} />,
    );

    const usernameValidator = getByTestId("input-validator-username");
    const emailValidator = getByTestId("input-validator-email");
    const passwordValidator = getByTestId("input-validator-password");
    const fullnameInput = getByTestId("fullname-input");
    const emailInput = getByTestId("email-input");
    const passwordInput = getByTestId("password-input");
    const signUpButton = getByTestId("signup-button");

    expect(usernameValidator).toBeDefined();
    expect(emailValidator).toBeDefined();
    expect(passwordValidator).toBeDefined();
    expect(fullnameInput).toBeDefined();
    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(signUpButton).toBeDefined();
  });

  it("handles input change correctly", () => {
    const { getByPlaceholderText } = render(
      <SignUpPage navigation={mockNavigation} />,
    );
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");

    expect(emailInput.props.value).toBe("test@example.com");
    expect(passwordInput.props.value).toBe("password123");
  });

  it("toggles password visibility", () => {
    const { getByPlaceholderText, getByTestId } = render(
      <SignUpPage navigation={mockNavigation} />,
    );
    const passwordInput = getByPlaceholderText("Password");
    const toggleVisibilityButton = getByTestId(
      "toggle-password-visibility",
    );

    fireEvent.press(toggleVisibilityButton);

    expect(passwordInput.props.secureTextEntry).toBe(false);

    fireEvent.press(toggleVisibilityButton);

    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it("handles sign up correctly", async () => {
    // Mock loginUser function to return a dummy token and user
    (createUser as jest.Mock).mockResolvedValueOnce({
      token: "dummyToken",
      user: { id: 1, name: "Test User", email: "email@email.com" },
    });

    // Render the UserLoginPage component
    const { getByTestId } = render(
      <SignUpPage navigation={mockNavigation} />,
    );

    // Fill in email and password
    const fullnameInput = getByTestId("fullname-input");
    const emailInput = getByTestId("email-input");
    const passwordInput = getByTestId("password-input");
    fireEvent.changeText(fullnameInput, "testUser");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");

    // Trigger the login process
    const signupButton = getByTestId("signup-button");
    fireEvent.press(signupButton);

    // Wait for the login process to complete
    await waitFor(() => expect(createUser).toHaveBeenCalledTimes(1));

    // Ensure that loginUser was called with correct arguments
    expect(createUser).toHaveBeenCalledWith(
      "testUser",
      "test@example.com",
      "password123",
    );
  });

  it("displays error messages for invalid inputs", () => {
    const { getByPlaceholderText, getByText } = render(
      <SignUpPage navigation={mockNavigation} />,
    );

    const usernameInput = getByPlaceholderText("Username");
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(usernameInput, "");
    fireEvent.changeText(emailInput, "invalidemail");
    fireEvent.changeText(passwordInput, "pass");

    expect(getByText("Username cannot be empty.")).toBeTruthy();
    expect(
      getByText("Please enter a valid email address."),
    ).toBeTruthy();
    expect(
      getByText("Password must be at least 8 characters."),
    ).toBeTruthy();
  });

  it("clears error messages when inputs are valid", () => {
    const { getByPlaceholderText, queryByText } = render(
      <SignUpPage navigation={mockNavigation} />,
    );

    const usernameInput = getByPlaceholderText("Username");
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(usernameInput, "validUsername");
    fireEvent.changeText(emailInput, "validemail@example.com");
    fireEvent.changeText(passwordInput, "password123");

    expect(queryByText("Username cannot be empty.")).toBeNull();
    expect(
      queryByText("Please enter a valid email address."),
    ).toBeNull();
    expect(
      queryByText("Password must be at least 8 characters."),
    ).toBeNull();
  });

  it("handles input blur change correctly", () => {
    const { getByPlaceholderText } = render(
      <SignUpPage navigation={mockNavigation} />,
    );
    const fullnameInput = getByPlaceholderText("Username");
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(fullnameInput, "testUser");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");

    // Simulate a blur event on the username input field
    fireEvent(fullnameInput, "blur");
    fireEvent(emailInput, "blur");
    fireEvent(passwordInput, "blur");

    expect(fullnameInput.props.value).toBe("testUser");
    expect(emailInput.props.value).toBe("test@example.com");
    expect(passwordInput.props.value).toBe("password123");
  });
});
