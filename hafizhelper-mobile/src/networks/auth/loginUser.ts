import { ErrorResponse } from "../../interfaces/ErrorResponse";
import axiosClient from "../axiosClient";
import axios, { AxiosError } from "axios";

export const loginUser = async (email: string, password: string) => {
  const URL = `${process.env.EXPO_PUBLIC_BASE_URL}/users/login/`;
  console.log(URL);
  const requestBody = {
    email: email,
    password: password,
  };
  try {
    const response = await axiosClient.post(URL, requestBody);
    return response.data; // Return the fetched data if needed
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const responseData = axiosError.response?.data;
      return responseData;
    } else {
      console.error("An unexpected error occurred:", error);
      throw error;
    }
  }
};
