import { View, Image, StyleSheet, Text } from "react-native";

const starImage = require("../assets/images/star.png");

export default function Testimonials() {
  const imageArray = Array(5).fill(0);
  return (
    <View style={styles.container}>
      <View style={styles.starContainer}>
        <View style={styles.stars}>
          {imageArray.map((_, index) => (
            <Image key={index} source={starImage} style={styles.starImage} />
          ))}
        </View>
      </View>
      <View style={styles.profileContainer}>
        <Image
          source={require("../assets/images/Elena_Vasquez.jpg")}
          style={styles.profilePicture}
        />
        <View>
          <Text style={styles.nameText}>Elena Vasquez</Text>
          <Text style={styles.usernameText}>@elena7</Text>
        </View>
      </View>
      <Text style={styles.reviewText}>
        "The Greek salad here is absolutely phenomenal! Fresh feta, crisp
        vegetables, and that perfect olive oil dressing, it's like a taste of
        the Mediterranean coast"
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
    marginVertical: 40,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 20,
  },
  profilePicture: {
    height: 50,
    width: 50,
    resizeMode: "contain",
    borderRadius: 50,
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  starContainer: {
    alignItems: "center",
    marginVertical: 8,
    marginBottom: 15,
  },
  stars: {
    flexDirection: "row",
  },
  starImage: {
    width: 15,
    height: 15,
    marginHorizontal: 10,
  },
  usernameText: {
    color: "gray",
    fontSize: 13,
  },
  reviewText: {
    textAlign: "center",
    marginVertical: 9,
  },
});
