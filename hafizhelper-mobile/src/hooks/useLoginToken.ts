import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useLoginToken = () => {
  const [loginToken, setLoginToken] = useState<string | null>();

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        setLoginToken(userToken);
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoggedInStatus();
  }, []);

  return loginToken;
};

export default useLoginToken;
