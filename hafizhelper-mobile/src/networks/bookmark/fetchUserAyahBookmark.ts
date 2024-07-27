import axiosClient from "../axiosClient";

export const fetchUserAyahBookmark = async () => {
  const URL = `${process.env.EXPO_PUBLIC_BASE_URL}/bookmarks/ayat-bookmark`;
  try {
    const response = await axiosClient.get(URL);
    return response.data.data;
  } catch (error) {
    console.error(
      "There was a problem with your axios operation:",
      error,
    );
    throw error; // Throw the error to handle it in the calling code
  }
};
