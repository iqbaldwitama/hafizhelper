import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    // backgroundColor: "#aaFaFF",
    borderColor: "#000000",
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: "#000000",
    elevation: 0,
    justifyContent: "space-between",
    flexDirection: "column",
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#FFFFFF",
  },
  verseContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  arabicContainer: {
    flex: 1,
  },
  arabic: {
    fontFamily: "LPMQ IsepMisbah",
    fontWeight: "normal",
    marginBottom: 20,
    color: "#0F543F",
    textAlign: "right",
    writingDirection: "rtl",
  },
  description: {
    color: "#797979",
    marginBottom: 10,
  },
  bookmarkIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 10,
  },
  image: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 5,
  },
  numberContainer: {
    marginRight: 10,
  },
  number: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0F543F",
  },
});
