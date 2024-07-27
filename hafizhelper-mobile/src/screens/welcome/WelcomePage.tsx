import React from "react";
import { Text, Image, View, TouchableOpacity } from "react-native";
import {
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import { styles } from "./styles";
import { useFonts } from "expo-font";
import ScreenName from "../../utils/ScreenName";
import LoadingIndicator from "../../components/utils/LoadingIndicator";

interface WelcomePageProps {
  navigation: NavigationProp<ParamListBase>;
}

const WelcomePage = ({ navigation }: WelcomePageProps) => {
  const [fontsLoaded] = useFonts({
    "LPMQ IsepMisbah": require("../../assets/fonts/LPMQ IsepMisbah.ttf"),
  });

  if (!fontsLoaded) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        testID="img-logo"
      />
      <Text style={styles.description} testID="desc-header">
        Solusi belajar Al-Quran dengan teknologi Artificial
        Intelligence
      </Text>
      <View style={styles.spacer} />
      <TouchableOpacity
        style={styles.startButton}
        onPress={() =>
          navigation.navigate(ScreenName.LOGIN_PAGE, {
            name: "Login",
          })
        }
        testID="mulai-button"
      >
        <Text style={styles.startButtonText}>Mulai</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomePage;
