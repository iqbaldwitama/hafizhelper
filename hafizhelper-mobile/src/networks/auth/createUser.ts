import { ErrorResponse } from "../../interfaces/ErrorResponse";
import axiosClient from "../axiosClient";
import axios, { AxiosError } from "axios";

export const createUser = async (
  full_name: string,
  email: string,
  password: string,
) => {
  const URL = `${process.env.EXPO_PUBLIC_BASE_URL}/users/register/`;
  const requestBody = {
    full_name: full_name,
    email: email,
    password: password,
  };
  try {
    const response = await axiosClient.post(URL, requestBody);
    return response.data;
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
