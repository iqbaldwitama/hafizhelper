import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.AQUA_GREEN,
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 5 },
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#FFFFFF",
    alignContent: "center",
  },
  description: {
    fontWeight: "bold",
    fontSize: 11,
    color: "#FFFFFF",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    marginLeft: -210,
    marginRight: -5,
  },
  icon: {
    top: "auto",
  },
  iconAyat: {
    top: 6,
  },
  imageContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginRight: 10,
    marginLeft: -5,
  },
  image: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#248B6B",
  },
  number: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
  },
});
