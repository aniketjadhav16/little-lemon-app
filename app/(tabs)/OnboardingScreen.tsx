import Hero from "@/components/Hero";
import LoginSection from "@/components/LoginSection";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import { View, StyleSheet } from "react-native";

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <Navbar />
      <Hero />
      <Testimonials />
      <LoginSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
});
