import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
  },
  oops: {
    fontSize: 60,
    fontFamily: "Poppins-Bold",
    color: Colors.AQUA_GREEN,
    width: "100%",
    textAlign: "center",
    marginBottom: 2,
  },
  message: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: Colors.DARK_GREEN,
    textAlign: "center",
    width: "100%",
  },
  button: {
    backgroundColor: Colors.AQUA_GREEN,
    paddingVertical: 8,
    paddingHorizontal: 60,
    borderRadius: 20,
    marginTop: 50,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: Colors.WHITE,
    width: "100%",
  },
});
