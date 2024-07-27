import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IconButton } from "react-native-paper";
import {
  useNavigation,
  DrawerActions,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import {
  HomePage,
  LoginPage,
  VerseDetailPage,
  VerseListPage,
  WelcomePage,
  ProfilePage,
  SettingsPage,
  BookmarkPage,
  SignUpPage,
  UserLoginPage,
  HistoryPage,
  VerseFeedbackPage,
} from "../screens";
import ScreenName from "../utils/ScreenName";
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();
const defaultColor = "#0F543F";

const MenuButton = () => {
  const navigation = useNavigation();

  return (
    <IconButton
      testID="menuButton"
      icon="menu"
      iconColor={defaultColor}
      size={30}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    />
  );
};

const AppNavigation = () => {
  const { authState } = useAuth();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  // istanbul ignore next
  useEffect(() => {
    if (authState.isLoggedIn) {
      navigation.reset({
        index: 0,
        routes: [{ name: ScreenName.SURAH_LIST_PAGE }],
      });
    }
  }, [authState.isLoggedIn, navigation]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: "Hafiz Helper",
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: defaultColor,
        },
        headerBackTitle: "Back",
        headerTintColor: "#808080",
        orientation: "portrait",
      }}
    >
      <Stack.Screen
        name={ScreenName.WELCOME_PAGE}
        component={WelcomePage}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name={ScreenName.LOGIN_PAGE}
        component={LoginPage}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name={ScreenName.SURAH_LIST_PAGE}
        component={HomePage}
        options={{
          headerLeft: MenuButton,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={ScreenName.VERSE_LIST_PAGE}
        component={VerseListPage}
        options={{
          gestureEnabled: true,
          orientation: "all",
        }}
      />
      <Stack.Screen
        name={ScreenName.VERSE_DETAIL_PAGE}
        component={VerseDetailPage}
        options={{
          gestureEnabled: true,
          orientation: "all",
        }}
      />
      <Stack.Screen
        name={ScreenName.PROFILE_PAGE}
        component={ProfilePage}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name={ScreenName.SETTINGS_PAGE}
        component={SettingsPage}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name={ScreenName.SIGN_UP_PAGE}
        component={SignUpPage}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name={ScreenName.USER_LOGIN_PAGE}
        component={UserLoginPage}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name={ScreenName.HISTORY_PAGE}
        component={HistoryPage}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name={ScreenName.BOOKMARK_PAGE}
        component={BookmarkPage}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name={ScreenName.VERSE_FEEDBACK_PAGE}
        component={VerseFeedbackPage}
        options={{
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigation;
