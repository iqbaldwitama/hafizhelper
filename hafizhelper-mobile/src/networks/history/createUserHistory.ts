import axiosClient from "../axiosClient";
export const createUserHistory = async (
  surah: string,
  surah_number: number,
  verse: number,
) => {
  const URL = `${process.env.EXPO_PUBLIC_BASE_URL}/histories/`;
  const requestBody = {
    surah: surah,
    surah_number: surah_number,
    verse: verse,
  };
  try {
    const response = await axiosClient.post(URL, requestBody);
    return response.data; // Return the fetched data if needed
  } catch (error) {
    console.error(
      "There was a problem with your axios operation:",
      error,
    );
    throw error; // Throw the error to handle it in the calling code
  }
};
