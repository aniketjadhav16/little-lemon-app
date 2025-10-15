import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function LoginSection() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Are you Hungry?</Text>
      <View style={styles.dotsRow}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <View style={styles.buttonsContainer}>
        <Pressable
          onPress={() => router.push("/(tabs)/LoginScreen")}
          style={[styles.button, { backgroundColor: "#495E57" }]}
        >
          <Text style={[styles.buttonText, { color: "white" }]}>Log In</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/(tabs)/ProfileScreen")}
          style={[styles.button, { backgroundColor: "white" }]}
        >
          <Text style={[styles.buttonText, { color: "#495E57" }]}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F4CE14",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    padding: 9,
  },
  regularText: {
    textAlign: "center",
    padding: 9,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 50,
    alignItems: "center",
    justifyContent: "center",
    padding: 9,
  },
  button: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#495E57",
    width: 95,
    height: 35,
  },
  buttonText: {
    textAlign: "center",
    padding: 5,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 12,
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#bbb",
  },
  dotActive: {
    backgroundColor: "#495E57",
  },
});
