import axiosClient from "../axiosClient";

export const deleteSpecificAyahBookmark = async (
  noSurah: number,
  noAyat: number,
) => {
  const URL = `${process.env.EXPO_PUBLIC_BASE_URL}/bookmarks/ayat-bookmark/${noSurah}/${noAyat}`;
  try {
    const response = await axiosClient.delete(URL);
    console.log("response", response.data);
    return response; // Return the fetched data if needed
  } catch (error) {
    console.error(
      "There was a problem with your axios operation:",
      error,
    );
    throw error; // Throw the error to handle it in the calling code
  }
};