import React from "react";
import {
  render,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import UserLoginPage from "./UserLoginPage";
import {
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import ScreenName from "../../utils/ScreenName";
import { loginUser } from "../../networks/auth/loginUser";
import { Alert } from "react-native";
import { ErrorResponse } from "../../interfaces/ErrorResponse";

const mockNavigation = {
  navigate: jest.fn(),
  getParent: jest.fn(),
} as unknown as NavigationProp<ParamListBase>;

jest.mock("../../networks/auth/loginUser");

describe("Login component", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(
      <UserLoginPage navigation={mockNavigation} />,
    );
    const loginText = getByTestId("login-text");
    const emailInput = getByTestId("email-input");
    const passwordInput = getByTestId("password-input");
    const loginButton = getByTestId("login-button");
    const signUpText = getByTestId("sign-up");

    expect(loginText).toBeDefined();
    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(loginButton).toBeDefined();
    expect(signUpText).toBeDefined();
  });

  it("handles input change correctly", () => {
    const { getByPlaceholderText } = render(
      <UserLoginPage navigation={mockNavigation} />,
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
      <UserLoginPage navigation={mockNavigation} />,
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

  it("handles login correctly", async () => {
    // Mock loginUser function to return a dummy token and user
    (loginUser as jest.Mock).mockResolvedValueOnce({
      token: "dummyToken",
      user: { id: 1, name: "Test User", email: "email@email.com" },
    });

    // Render the UserLoginPage component
    const { getByTestId } = render(
      <UserLoginPage navigation={mockNavigation} />,
    );

    // Fill in email and password
    const emailInput = getByTestId("email-input");
    const passwordInput = getByTestId("password-input");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");

    // Trigger the login process
    const loginButton = getByTestId("login-button");
    fireEvent.press(loginButton);

    // Wait for the login process to complete
    await waitFor(() => expect(loginUser).toHaveBeenCalledTimes(1));

    // Ensure that loginUser was called with correct arguments
    expect(loginUser).toHaveBeenCalledWith(
      "test@example.com",
      "password123",
    );

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      ScreenName.SURAH_LIST_PAGE,
      {
        name: "HomePage",
      },
    );
  });

  it("navigates to UserSignUp on button press", () => {
    const { getByTestId } = render(
      <UserLoginPage navigation={mockNavigation} />,
    );
    const button = getByTestId("sign-up");

    expect(button).toBeTruthy();

    // Simulate button press
    fireEvent.press(button);

    // Check that navigation was called with the correct parameters
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      ScreenName.SIGN_UP_PAGE,
      {
        name: "SignUpPage",
      },
    );
  });

  it("handles login loading state correctly", async () => {
    const mockErrorResponse: ErrorResponse = {
      error_message: "Email and password combination is incorrect",
      code: "error",
      validation_error: null,
    };

    (loginUser as jest.Mock).mockResolvedValueOnce({
      errors: mockErrorResponse,
    });

    // Mock Alert.alert function
    jest.spyOn(Alert, "alert");

    // Render the UserLoginPage component
    const { getByTestId } = render(
      <UserLoginPage navigation={mockNavigation} />,
    );

    // Fill in email and password
    const emailInput = getByTestId("email-input");
    const passwordInput = getByTestId("password-input");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");

    // Trigger the login process
    const loginButton = getByTestId("login-button");
    fireEvent.press(loginButton);

    // Ensure that loading indicator is displayed
    await waitFor(() =>
      expect(getByTestId("loading-indicator")).toBeDefined(),
    );

    // Ensure that loginUser was called
    expect(loginUser).toHaveBeenCalledTimes(2);

    // Wait for the login process to complete
    await waitFor(() => expect(loginUser).toHaveBeenCalledTimes(2));

    // Ensure that Alert.alert was called with correct parameters for login failure
    expect(Alert.alert).toHaveBeenCalledWith(
      "Login Failed",
      mockErrorResponse.error_message,
    );
  });

  test("handles login error state correctly", async () => {
    // Mock loginUser function to throw an error
    (loginUser as jest.Mock).mockRejectedValueOnce(
      new Error("Login error"),
    );

    // Mock Alert.alert function
    jest.spyOn(Alert, "alert");

    // Render the UserLoginPage component
    const { getByTestId } = render(
      <UserLoginPage navigation={mockNavigation} />,
    );

    // Fill in email and password
    const emailInput = getByTestId("email-input");
    const passwordInput = getByTestId("password-input");
    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");

    // Trigger the login process
    const loginButton = getByTestId("login-button");
    fireEvent.press(loginButton);

    // Ensure that loading indicator is displayed
    await waitFor(() =>
      expect(getByTestId("loading-indicator")).toBeDefined(),
    );

    // Ensure that loginUser was called
    expect(loginUser).toHaveBeenCalledTimes(3);

    // Wait for the login process to complete
    await waitFor(() => expect(loginUser).toHaveBeenCalledTimes(3));

    // Ensure that Alert.alert was called with correct parameters for login error
    expect(Alert.alert).toHaveBeenCalledWith(
      "Login Error",
      "An error occurred during login, please try again",
    );
  });
});
