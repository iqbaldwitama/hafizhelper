import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#248B6B",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000000",
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#FFFFFF",
    alignContent: "center",
  },
  arabic: {
    fontFamily: "LPMQ IsepMisbah",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#FFFFFF",
  },
  dot: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  description: {
    fontWeight: "bold",
    fontSize: 10,
    color: "#FFFFFF",
  },
  imageContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginRight: 10,
    marginLeft: -5,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    marginLeft: -210,
    marginRight: -5,
  },
  image: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#248B6B",
  },
  number: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
  },
});
