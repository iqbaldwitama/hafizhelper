import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../interfaces/User";

const useStoreUser = async (
  token: string,
  user: User,
): Promise<void> => {
  try {
    await AsyncStorage.setItem("userToken", token);
    await AsyncStorage.setItem("userObject", JSON.stringify(user));
    console.log("User token and object stored successfully");
  } catch (error) {
    console.error("Error in login hook:", error);
  }
};

export default useStoreUser;
