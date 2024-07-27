import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0F543F",
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  default: {
    color: "#0F543F",
  },
  imagePicker: {
    marginBottom: 20,
    height: 200,
    width: 200,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "#0F543F",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: "#0F543F",
    padding: 12,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileIcon: {
    width: 120,
  },
  imageText: {
    color: "#888",
    textAlign: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 2,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#0F543F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  togglePasswordVisibility: {
    position: "absolute",
    right: 10,
    bottom: 3,
    justifyContent: "center",
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  invalidInput: {
    borderColor: "red",
    borderWidth: 1,
  },
  warningText: {
    position: "absolute",
    bottom: -15,
    color: "red",
    alignSelf: "flex-start",
    marginLeft: 5,
    fontSize: 12,
  },
  inputValidatorContainer: {
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
});
