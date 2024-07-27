import axiosClient from "../axiosClient";

export const fetchUserHistory = async () => {
  const URL = `${process.env.EXPO_PUBLIC_BASE_URL}/histories/`;
  try {
    const response = await axiosClient.get(URL);
    console.log("response", response.data);
    return response.data.data; // Return the fetched data if needed
  } catch (error) {
    console.error(
      "There was a problem with your axios operation:",
      error,
    );
    throw error; // Throw the error to handle it in the calling code
  }
};
