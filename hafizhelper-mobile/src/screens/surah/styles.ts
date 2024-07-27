import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 10,
    marginHorizontal: 14,
  },
  salam: {
    marginTop: 7,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
    color: "#A7A7A7",
  },
  title: {
    marginTop: -5,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#0F543F",
  },
  subtitle: {
    fontSize: 14,
    marginTop: -7,
    marginBottom: 10,
    fontWeight: "600",
    color: "#0F543F",
  },
  scrollViewContent: {
    flexGrow: 1,
    width: "100%", // Set ScrollView width to window width
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cardContainer: {
    width: "100%", // Make the TouchableOpacity take the full width of the screen
    paddingHorizontal: 20, // Optional: Add horizontal padding to the cards
    marginBottom: 10, // Optional: Add margin between cards
  },
  card: {
    width: "100%", // Make the SurahCard take the full width of the TouchableOpacity
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginTop: 3,
    marginBottom: 0,
    marginHorizontal: 0,
    opacity: 0.4,
    // paddingHorizontal: 20
    // width:"80%",
  },
  lineHeader: {
    borderBottomWidth: 2,
    borderBottomColor: "gray",
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: -10,
    opacity: 0.4,
    // paddingHorizontal: 20
    // width:"80%",
  },
  searchBar: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  PopupContainer: {
    zIndex: 1,
    flex: 1,
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    bottom: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(256, 256, 256, 0.5)",
  },
  Popup: {
    zIndex: 1,
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(256, 256, 256, 0.7)",
  },
  slideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePopup: {
    width: "80%", // Adjust the width of the image
    height: "80%", // Adjust the height of the image
    resizeMode: "contain",
  },
  paginationContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20, // Adjust the distance from the bottom as needed
    left: 50,
    right: 50,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.DARK_GREEN,
  },
  dot: {
    color: Colors.DARK_GREEN,
  },
});
