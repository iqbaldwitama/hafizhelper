import { StyleSheet } from "react-native";

const defaultColor = "#0F543F";
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 15,
    paddingHorizontal: 5,
  },
  wrapper: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 40,
  },
  profileWrapper: {
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingBottom: 10,
    marginTop: 10,
    marginHorizontal: 20,
    borderBottomColor: defaultColor,
    borderBottomWidth: 1,
    elevation: 0,
  },
  profileIcon: {
    width: 35,
  },
  profileBorder: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: defaultColor,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontWeight: "bold",
    fontSize: 20,
    color: defaultColor,
  },
  default: {
    color: defaultColor,
  },
});

export default styles;
