import { useEffect, useState } from "react";
import { Dimensions, ScaledSize } from "react-native";

const useScreen = () => {
  const [screenInfo, setScreenInfo] = useState<ScaledSize>(
    Dimensions.get("screen"),
  );

  useEffect(() => {
    const onChange = Dimensions.addEventListener(
      "change",
      (result: { screen: ScaledSize }) => {
        setScreenInfo(result.screen);
      },
    );

    return () => onChange?.remove();
  }, []);

  return {
    ...screenInfo,
    isPortrait: screenInfo.height > screenInfo.width,
  };
};

export default useScreen;
