import { View, Text, Image, StyleSheet } from "react-native";

export default function Hero() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Little Lemon</Text>
      <Text style={styles.subHeaderText}>Chicago</Text>
      <View style={styles.subContainer}>
        <Text style={styles.descriptionText}>
          We are a family owned Mediterranean restaurant, focused on traditional
          recipes served with a modern twist.
        </Text>
        <Image
          style={styles.image}
          source={require("../assets/images/Hero-image.png")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#495E57",
  },
  headerText: {
    color: "#F4CE14",
    fontSize: 40,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginTop: 5,
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
  subHeaderText: {
    color: "white",
    fontSize: 22,
    fontWeight: "semibold",
    marginHorizontal: 15,
  },
  descriptionText: {
    color: "white",
    marginVertical: 25,
    width: 200,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    borderRadius: 20,
    marginBottom: 15
  },
});
