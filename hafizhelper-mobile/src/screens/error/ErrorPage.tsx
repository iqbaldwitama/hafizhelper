import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

import { styles } from "./styles";
import { useFonts } from "expo-font";
import LoadingIndicator from "../../components/utils/LoadingIndicator";

interface ErrorPageProps {
  error: Error;
  buttonName?: string;
  resetError: () => void; // Tipe data yang spesifik untuk resetError
}

const networkErrMsg =
  "Tampaknya ada masalah dengan koneksi internet Anda. Silakan periksa koneksi Anda dan coba lagi";
const loginErrMsg =
  "Login terlebih dahulu untuk menggunakan fitur ini";
const fetchErrMsg =
  "Terjadi kesalahan saat memuat data. Silakan coba lagi nanti";

const ErrorPage = (props: ErrorPageProps) => {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
  });

  const errorString = props.error.toString().toLowerCase();
  let feedbackMessage = "";

  if (errorString.includes("network")) {
    feedbackMessage = networkErrMsg;
  } else if (errorString.includes("login")) {
    feedbackMessage = loginErrMsg;
  } else {
    feedbackMessage = fetchErrMsg;
  }

  if (!fontsLoaded) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.oops}>Oops!</Text>
      <Text style={styles.message} testID="error-message">
        {feedbackMessage}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => props.resetError()}
        testID="reset-button"
      >
        <Text style={styles.buttonText}>
          {props.buttonName ? props.buttonName : "Coba Lagi"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorPage;
