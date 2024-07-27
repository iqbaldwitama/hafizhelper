import { StyleSheet, Dimensions } from "react-native";
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
    width: Dimensions.get("window").width, // Set ScrollView width to window width
  },

  card: {
    width: "100%",
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginHorizontal: 25,
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
  bookmarkIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 10,
  },
  cardContainer: {
    width: Dimensions.get("window").width - 10, // Make the TouchableOpacity take the full width of the screen
    paddingHorizontal: 20,
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
  },
  searchButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#0F543F",
  },
  searchText: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: Colors.DARK_GREEN,
    textAlign: "center",
    width: "100%",
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: -100,
    marginLeft: 45,
    width: 300,
    height: 300,
  },
});
