import React, { ReactNode } from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

interface CircularButtonProps extends TouchableOpacityProps {
  onPress: () => void;
  children?: ReactNode;
  color: string;
  testId?: string;
  radius: number;
}
import { styles } from "./styles";

export const CircularButton: React.FC<CircularButtonProps> = ({
  onPress,
  children,
  color,
  testId,
  radius,
}) => {
  const viewBox = `0 0 ${radius} ${radius}`;
  return (
    <TouchableOpacity
      testID={testId}
      onPress={onPress}
      style={[styles.buttonContainer]}
    >
      <Svg
        width={radius}
        height={radius}
        viewBox={viewBox}
        fill="none"
      >
        <Circle
          cx={radius / 2}
          cy={radius / 2}
          r={radius / 2}
          fill={color}
        />
      </Svg>
      <View style={styles.iconContainer}>{children}</View>
    </TouchableOpacity>
  );
};
