import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    backgroundColor: "white",
  },
  navbar: {
    flexDirection: "column",
    paddingHorizontal: 15,
    paddingTop: 20,
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 10,
    color: Colors.GREEN,
  },
  subtitle: {
    fontSize: 16,
    color: "#A7A7A7",
    marginBottom: 8,
  },
  navText: {
    fontSize: 18,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDC",
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexGrow: 1,
    width: "100%",
  },
  arabTextContainer: {
    width: "100%",
  },
  scrollView: {
    paddingHorizontal: 10,
    bottom: 0,
    left: 0,
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  arabText: {
    fontFamily: "LPMQ IsepMisbah",
    textAlign: "right",
    marginVertical: 20,
    color: Colors.GREEN,
    width: "100%",
  },
  latinText: {
    fontSize: 16,
    textAlign: "left",
    marginTop: 10,
    color: Colors.LIGHT_GRAY,
  },
  footer: {
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
    flexDirection: "column-reverse",
    left: 10,
  },
  rightButtonContainer: {
    flexDirection: "row",
    bottom: 0,
    right: 0,
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
    color: "white",
  },
  extraButtonContainer: {
    position: "absolute",
    top: -40,
    flexDirection: "row",
    justifyContent: "center",
  },
  extraButton: {
    marginRight: 3,
  },
  bookmarkButton: {
    position: "absolute",
    top: 30,
    right: 10,
    padding: 8,
  },
  highlightFeedback: {
    color: "#cc1d1d",
  },
  correctFeedback: {
    color: "#248b6b",
  },
  feedbackButtonContainer: {
    flexDirection: "column",
    bottom: 0,
    right: 0,
    marginBottom: 35,
  },
});
