import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AppNavigation from "../AppNavigation";
import { CustomDrawerContent } from "./CustomDrawerContent";
import SettingsPage from "../../screens/settings/SettingsPage";
import { BookmarkPage } from "../../screens";

const Drawer = createDrawerNavigator();

const CustomDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      initialRouteName="Home"
      useLegacyImplementation={false}
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
      }}
    >
      <Drawer.Screen
        name="App Navigation"
        component={AppNavigation}
      />
      <Drawer.Screen name="Bookmark" component={BookmarkPage} />
      <Drawer.Screen name="Settings" component={SettingsPage} />
    </Drawer.Navigator>
  );
};

export default CustomDrawer;
