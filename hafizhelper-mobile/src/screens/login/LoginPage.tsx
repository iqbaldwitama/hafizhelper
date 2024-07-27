import React, { useEffect } from "react";
import {
  Text,
  SafeAreaView,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import {
  NavigationProp,
  ParamListBase,
  useIsFocused,
} from "@react-navigation/native";
import { styles } from "./styles";
import ScreenName from "../../utils/ScreenName";

interface LoginPageProps {
  navigation: NavigationProp<ParamListBase>;
}

const LoginPage = ({ navigation }: LoginPageProps) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      navigation.getParent()?.setOptions({ swipeEnabled: false });
    }
  }, [isFocused]);
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        testID="img-logo"
      />
      <Text style={styles.loginText} testID="title-login">
        Login
      </Text>
      <Text style={styles.descriptionText} testID="description">
        Masuk untuk menikmati seluruh fitur Hafiz Helper
      </Text>
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(ScreenName.USER_LOGIN_PAGE, {
              name: "UserLogin",
            })
          }
          style={styles.loginButton}
          testID="signin-button"
        >
          <Text style={styles.userLoginText}>Masuk dengan Akun</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(ScreenName.SURAH_LIST_PAGE, {
              name: "HomePage",
            })
          }
          style={styles.guestButton}
          testID="guest-login-button"
        >
          <Text style={styles.guestText}>Masuk Sebagai Tamu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;
