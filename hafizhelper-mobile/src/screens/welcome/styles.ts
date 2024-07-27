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
    width: 170,
    height: 170,
    marginBottom: 20,
    marginTop: 270,
  },
  description: {
    color: "#0F543F",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: "#248B6B",
    paddingVertical: 8,
    paddingHorizontal: 130,
    borderRadius: 20,
    marginBottom: 150,
  },
  startButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 18,
  },
  spacer: {
    flex: 1,
  },
});
