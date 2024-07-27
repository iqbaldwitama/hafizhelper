import { StyleSheet } from "react-native";

const defaultColor = "#0F543F";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 25,
  },
  profileContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  profileIcon: {
    width: 60,
  },
  profileBorder: {
    width: 125,
    height: 125,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: defaultColor,
    borderRadius: 100,
    marginVertical: 70,
  },
  profileName: {
    fontWeight: "bold",
    fontSize: 20,
    color: defaultColor,
  },
  default: {
    color: defaultColor,
  },
  line: {
    height: 2,
    backgroundColor: "gray",
    marginHorizontal: 10,
  },
  profileField: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "space-between",
    padding: 15,
  },
  fieldTitle: {
    color: defaultColor,
    fontSize: 18,
    width: 80,
    fontWeight: "500",
  },
  disabledTextField: {
    flex: 1,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "#999",
    paddingHorizontal: 10,
  },
  editTextField: {
    flex: 1,
    height: 40,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: defaultColor,
    paddingHorizontal: 10,
  },
  editButton: {
    marginLeft: 10,
    backgroundColor: defaultColor,
    padding: 9,
    borderRadius: 10,
  },
});
