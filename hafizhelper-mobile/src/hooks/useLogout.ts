import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userObject");
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
};

export default useLogout;
