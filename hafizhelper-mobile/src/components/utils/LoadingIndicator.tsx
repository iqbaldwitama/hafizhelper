import React from "react";
import { ActivityIndicator, View } from "react-native";
import { styles } from "./styles";

const LoadingIndicator = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator
        size="large"
        color="#0F543F"
        testID="loading-indicator"
      />
    </View>
  );
};

export default LoadingIndicator;
