import React, { ReactNode } from "react";
import { DrawerItem } from "@react-navigation/drawer";
import { DrawerItemIterface } from "../../interfaces/Drawer";
import {
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface MenuIconProps {
  focused: boolean;
  size: number;
  color: string;
}

const CustomDrawerItem = (props: DrawerItemIterface) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const getIcon: (iconParam: MenuIconProps) => ReactNode = (
    iconParam,
  ) => (
    <Icon
      name={props.icon_name} // Assuming icon_name is a property of SomeObject
      color={props.color}
      size={iconParam.size}
    />
  );

  return (
    <DrawerItem
      testID="drawer-item"
      icon={getIcon}
      label={props.label}
      labelStyle={{ color: props.color, fontSize: 18 }}
      onPress={() => {
        if (props.additionalBehaviour) {
          props.additionalBehaviour();
        }
        if (props.handleLogout) {
          props.handleLogout();
        }
        navigation.navigate(props.navigate_to);
      }}
    />
  );
};

export default CustomDrawerItem;
