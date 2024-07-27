import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";

import { DrawerItemIterface } from "../../interfaces/Drawer";
import { CustomDrawerItem } from "../../components";
import { TouchableOpacity } from "react-native-gesture-handler";
import ScreenName from "../../utils/ScreenName";
import { logInMenu, logOutMenu } from "../../utils/data";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";

const homeMenu: DrawerItemIterface = {
  icon_name: "home",
  label: "Beranda",
  navigate_to: ScreenName.SURAH_LIST_PAGE,
  color: styles.default.color,
};

const settingsMenu: DrawerItemIterface = {
  icon_name: "cog",
  label: "Pengaturan",
  navigate_to: "Settings",
  color: styles.default.color,
};

const bookmarkMenu: DrawerItemIterface = {
  icon_name: "bookmark",
  label: "Bookmarks",
  navigate_to: "Bookmark",
  color: styles.default.color,
};

const historyMenu: DrawerItemIterface = {
  icon_name: "clock",
  label: "Riwayat Bacaan",
  navigate_to: ScreenName.HISTORY_PAGE,
  color: styles.default.color,
};

const MenuItemList: DrawerItemIterface[] = [
  homeMenu,
  bookmarkMenu,
  historyMenu,
  settingsMenu,
];

export const CustomDrawerContent = (
  props: DrawerContentComponentProps,
) => {
  const { authState, logout } = useAuth();

  const navigation =
    useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const handleProfilePress = () => {
    navigation.navigate(ScreenName.PROFILE_PAGE);
  };

  let authButtonComponent;
  // istanbul ignore next
  if (authState.isLoggedIn) {
    authButtonComponent = (
      <CustomDrawerItem {...logOutMenu} handleLogout={logout} />
    );
  } else {
    authButtonComponent = <CustomDrawerItem {...logInMenu} />;
  }

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.wrapper}>
        <TouchableOpacity
          style={styles.profileWrapper}
          onPress={handleProfilePress}
          testID="profile-wrapper"
        >
          <Text testID="profile-name" style={styles.profileName}>
            {authState.user?.fullName ?? "Sobat Hafiz"}
          </Text>
        </TouchableOpacity>
        <DrawerContentScrollView {...props}>
          <View>
            {MenuItemList.map((item) => (
              <CustomDrawerItem key={item.label} {...item} />
            ))}
          </View>
        </DrawerContentScrollView>
      </View>
      <View testID="auth-button">{authButtonComponent}</View>
    </View>
  );
};
