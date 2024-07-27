import React from "react";
import { Svg, Path } from "react-native-svg";
import Colors from "../../utils/Colors";

export const RepeatIcon = () => {
  return (
    <Svg width={25} height={24} viewBox="0 0 25 24" fill="none">
      <Path
        d="M17.2501 1L21.2501 5M21.2501 5L17.2501 9M21.2501 5H7.25006C6.1892 5 5.17178 5.42143 4.42163 6.17157C3.67149 6.92172 3.25006 7.93913 3.25006 9V11M7.25006 23L3.25006 19M3.25006 19L7.25006 15M3.25006 19H17.2501C18.3109 19 19.3283 18.5786 20.0785 17.8284C20.8286 17.0783 21.2501 16.0609 21.2501 15V13"
        stroke={Colors.AQUA_GREEN}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
