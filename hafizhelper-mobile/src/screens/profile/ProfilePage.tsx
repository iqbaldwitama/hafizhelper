import React, { useEffect } from "react";
import { SafeAreaView, View, Text, TextInput } from "react-native";
import { styles } from "./styles";
import {
  NavigationProp,
  ParamListBase,
  useIsFocused,
} from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import ScreenName from "../../utils/ScreenName";
import ErrorPage from "../error/ErrorPage";

interface ProfileProps {
  navigation: NavigationProp<ParamListBase>;
}

const ProfilePage = ({ navigation }: ProfileProps) => {
  const { authState } = useAuth();
  const isFocused = useIsFocused();
  // istanbul ignore next
  useEffect(() => {
    if (isFocused) {
      navigation.getParent()?.setOptions({ swipeEnabled: false });
    }
  }, [isFocused]);

  const navigateToLoginPage = () => {
    navigation.navigate(ScreenName.LOGIN_PAGE);
  };

  if (!authState.isLoggedIn) {
    return (
      <ErrorPage
        error={new Error("Login Error")}
        buttonName={"login"}
        resetError={navigateToLoginPage}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.line}></View>
        <View style={styles.profileField}>
          <Text style={styles.fieldTitle}>Nama</Text>
          <TextInput
            style={styles.disabledTextField}
            placeholder={authState.user?.fullName}
            testID="name-input"
          />
        </View>
        <View style={styles.profileField}>
          <Text style={styles.fieldTitle}>Email</Text>
          <TextInput
            style={styles.disabledTextField}
            placeholder={authState.user?.email}
            editable={false}
            testID="email-input"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfilePage;
