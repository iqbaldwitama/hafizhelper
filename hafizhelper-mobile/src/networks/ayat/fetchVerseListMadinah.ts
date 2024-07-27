import axiosClient from "../axiosClient";

export const fetchVerseListMadinah = async (suratId: number) => {
  const URL = `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${suratId}`;
  try {
    const response = await axiosClient.get(URL);
    return response.data; // Return the fetched data if needed
  } catch (error) {
    console.error(
      "There was a problem with your axios operation:",
      error,
    );
    throw error; // Throw the error to handle it in the calling code
  }
};
