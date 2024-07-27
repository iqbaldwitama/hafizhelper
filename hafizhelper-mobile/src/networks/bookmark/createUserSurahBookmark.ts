import axiosClient from "../axiosClient";
export const createUserSurahBookmark = async (
  surah: string,
  surah_number: number,
) => {
  const URL = `${process.env.EXPO_PUBLIC_BASE_URL}/bookmarks/surah-bookmark`;
  const requestBody = {
    surah: surah,
    surah_number: surah_number,
  };
  try {
    const response = await axiosClient.post(URL, requestBody);
    return response; // Return the fetched data if needed
  } catch (error) {
    console.error(
      "There was a problem with your axios operation:",
      error,
    );
    throw error; // Throw the error to handle it in the calling code
  }
};
