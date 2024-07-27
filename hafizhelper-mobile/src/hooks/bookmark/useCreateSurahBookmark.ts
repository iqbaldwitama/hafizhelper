import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserSurahBookmark } from "../../networks/bookmark/createUserSurahBookmark";

const useCreateSurahBookmark = async (
  surah: string,
  surah_number: number,
) => {
  try {
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken) {
      await createUserSurahBookmark(surah ?? "", surah_number ?? 1);
    }
    console.log("Surah Bokomark stored successfully");
  } catch (error) {
    console.error("Error in logging bookmark hook:", error);
  }
};

export default useCreateSurahBookmark;
