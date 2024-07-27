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
    padding: 5,
    marginHorizontal: 14,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#0F543F",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#A7A7A7",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  button: {
    flex: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: Colors.GREEN,
  },
  ButtonSelected: {
    backgroundColor: Colors.GREEN,
  },
  ButtonUnselected: {
    backgroundColor: Colors.WHITE,
  },
  selectedButtonText: {
    color: Colors.WHITE,
  },
  unselectedButtonText: {
    color: Colors.GREEN,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 70,
  },
});
