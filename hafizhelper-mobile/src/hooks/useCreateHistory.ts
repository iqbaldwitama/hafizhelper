import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserHistory } from "../networks/history/createUserHistory";

const useCreateUserHistory = async (
  ayatNo: number,
  surah_name: string,
  surah_number: number,
) => {
  try {
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken) {
      await createUserHistory(
        surah_name ?? "",
        surah_number ?? 1,
        ayatNo,
      );
    }
    console.log("Reading history stored successfully");
  } catch (error) {
    console.error("Error in logging history hook:", error);
  }
};

export default useCreateUserHistory;
