import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
    color: Colors.GREEN,
  },
  audioOptionButton: {
    backgroundColor: Colors.AQUA_GREEN,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    width: 100,
  },
  audioOptionButtonText: {
    fontSize: 16,
    color: "white",
  },
  audioOptionText: {
    fontSize: 16,
    color: Colors.AQUA_GREEN,
    paddingVertical: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%",
  },
  audioOptionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.DARK_GREEN,
  },
  drawerIconContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1, // Ensure the drawer icon is above other components
  },
  arabTextContainer: {
    marginBottom: 20,
  },
  scrollView: {
    padding: 10,
    bottom: 0,
    left: 0,
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  arabText: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.GREEN,
  },
  latinText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    color: Colors.DARK_GREEN,
  },
  image: {
    width: 60,
    height: 60,
  },
  footer: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  inputButton: {
    backgroundColor: "black",
  },
  leftButtonContainer: {
    flexDirection: "row",
    bottom: 0,
    right: 0,
  },
  repeatButtonContainer: {
    backgroundColor: "blue",
    flexDirection: "column-reverse",
    left: 10,
  },
  repeatButton: {
    padding: 3,
  },
  ellipseButton: {
    paddingTop: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: Colors.AQUA_GREEN,
  },
  hangingBoxLatin: {
    position: "absolute",
    top: 80,
    right: 20,
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.DARK_GREEN,
    zIndex: 1, // Ensure it appears above other elements
  },
  hangingBoxArti: {
    position: "absolute",
    top: 130,
    right: 20,
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.DARK_GREEN,
    zIndex: 1, // Ensure it appears above other elements
  },
  hangingBoxAudio: {
    position: "absolute",
    top: 190,
    right: 20,
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.DARK_GREEN,
    zIndex: 1, // Ensure it appears above other elements
  },
  hangingBoxFontSize: {
    position: "absolute",
    top: 250,
    right: 20,
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.DARK_GREEN,
    zIndex: 1, // Ensure it appears above other elements
  },
  hangingBoxText: {
    fontSize: 16,
    color: Colors.BLACK,
  },
});
