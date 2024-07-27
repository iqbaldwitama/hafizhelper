import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

const usePreference = async () => {
  const [latinSetting, setLatinSetting] = useState<boolean>(true);

  const latinSettingPref = await AsyncStorage.getItem("latinEnabled");
  setLatinSetting(latinSettingPref == "false" ? false : true);

  const audioSetting = await AsyncStorage.getItem("audioOption");
  const arabicSetting = await AsyncStorage.getItem("arabicOption");

  return { latinSetting, audioSetting, arabicSetting };
};

export default usePreference;
