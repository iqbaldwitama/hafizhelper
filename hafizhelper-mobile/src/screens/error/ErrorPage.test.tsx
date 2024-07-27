import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ErrorPage from "./ErrorPage";
import { useFonts } from "expo-font";

jest.mock("expo-font");

describe("ErrorPage", () => {
  (useFonts as jest.Mock).mockReturnValue([true]);

  it("renders correctly", () => {
    const error = new Error("Network Error");
    const resetError = jest.fn();

    const { getByTestId } = render(
      <ErrorPage error={error} resetError={resetError} />,
    );

    expect(getByTestId("error-message")).toBeTruthy();
    expect(getByTestId("reset-button")).toBeTruthy();
  });

  it('calls resetError function when "Coba lagi" button is pressed', () => {
    const error = new Error("Request failed");
    const resetError = jest.fn();
    const { getByTestId } = render(
      <ErrorPage error={error} resetError={resetError} />,
    );
    const retryButton = getByTestId("reset-button");

    fireEvent.press(retryButton);

    expect(resetError).toHaveBeenCalledTimes(1);
  });

  (useFonts as jest.Mock).mockReturnValue([true]);

  it("shows login error feedback when user is not logged in", () => {
    const error = new Error("Login Error");
    const resetError = jest.fn();

    const { getByText } = render(
      <ErrorPage error={error} resetError={resetError} />,
    );

    expect(
      getByText("Login terlebih dahulu untuk menggunakan fitur ini"),
    ).toBeTruthy();
  });
});
