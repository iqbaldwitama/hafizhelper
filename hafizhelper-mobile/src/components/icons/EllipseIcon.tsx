import React from "react";
import { Svg, Circle } from "react-native-svg";

interface EllipseIconInterface {
  width: number;
  height: number;
  color: string;
}

export const EllipseIcon = ({
  width,
  height,
  color,
}: EllipseIconInterface) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 4 4" fill="none">
      <Circle cx="2" cy="2" r="2" fill={color} />
    </Svg>
  );
};
