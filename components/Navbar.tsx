import { View, StyleSheet, Image } from "react-native";

export default function Navbar() {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/Logo.png")} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 170,
    height: 60,
    resizeMode: "contain",
  },
});
