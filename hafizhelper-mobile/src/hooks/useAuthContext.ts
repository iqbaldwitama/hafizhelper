import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuthContext = () => {
  const [email, setEmail] = useState();
  const [fullName, setFullName] = useState();

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const user = await AsyncStorage.getItem("userObject");
        if (user) {
          const { email, full_name } = JSON.parse(user);
          setEmail(email);
          setFullName(full_name);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoggedInStatus();
  }, []);

  return { email, fullName };
};

export default useAuthContext;
