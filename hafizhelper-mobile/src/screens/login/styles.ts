import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 25,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 70,
  },
  loginText: {
    color: "#248B6B",
    fontSize: 35,
    fontWeight: "700",
    marginBottom: 16,
  },
  descriptionText: {
    color: "#61677D",
    marginBottom: 60,
  },
  guestButton: {
    backgroundColor: "#F5F9FE",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
  },
  loginButton: {
    backgroundColor: "#248B6B",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
  },
  guestText: {
    color: "#61677D",
    fontSize: 16,
    fontWeight: "400",
  },
  userLoginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
  },
});
