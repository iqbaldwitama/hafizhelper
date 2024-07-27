import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DateSeparatorProps } from "./history/interface";

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "#A7A7A7",
  },
  dateContainer: {
    paddingHorizontal: 10,
  },
  dateText: {
    color: "#A7A7A7",
    fontWeight: "bold",
  },
});

export default DateSeparator;
