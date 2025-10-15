import Hero from "@/components/Hero";
import InputsForLogin from "@/components/InputsForLogin";
import Navbar from "@/components/Navbar";
import { KeyboardAvoidingView, Platform, View, StyleSheet } from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Navbar />
      <Hero />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <InputsForLogin />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
});
