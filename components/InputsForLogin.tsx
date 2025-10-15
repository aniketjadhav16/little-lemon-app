import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Keyboard,
} from "react-native";

export default function InputsForLogin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState({ name: false, email: false });
  const [error, setError] = useState("");

  const nameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  }, []);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isNameValid = name.trim().length > 0;
  const canLogin = isNameValid && isEmailValid;

  const handleLogin = () => {
    Keyboard.dismiss();
    setTouched({ name: true, email: true });
    if (!canLogin) {
      setError("Enter correct credentials");
      return;
    }
    setError("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.regularText}>Name *</Text>
      <TextInput
        ref={nameInputRef}
        placeholder="Enter name"
        keyboardType="default"
        returnKeyType="next"
        value={name}
        onChangeText={(text) => {
          setName(text);
          setError("");
        }}
        onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
        style={[
          styles.inputBar,
          { borderColor: touched.name && !isNameValid ? "red" : "#bbb" },
        ]}
      />
      {touched.name && !isNameValid && (
        <Text style={styles.validationText}>Please enter your name</Text>
      )}
      <Text style={styles.regularText}>Email *</Text>
      <TextInput
        placeholder="Enter email"
        keyboardType="email-address"
        value={email}
        returnKeyType="go"
        onChangeText={(text) => {
          setEmail(text);
          setError("");
        }}
        onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
        style={[
          styles.inputBar,
          { borderColor: touched.email && !isEmailValid ? "red" : "#bbb" },
        ]}
      />
      {touched.email && !isEmailValid && (
        <Text style={styles.validationText}>Please enter a valid email</Text>
      )}

      {!!error && <Text style={styles.validationText}>{error}</Text>}

      <Pressable
        style={[
          styles.button,
          { backgroundColor: canLogin ? "#495E57" : "gray" },
        ]}
        disabled={!canLogin}
        onPress={handleLogin}
      >
        <Text style={[styles.buttonText, { color: "white" }]}>Log In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  regularText: { marginBottom: 4, fontWeight: "600" },
  inputBar: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    backgroundColor: "#fff",
  },
  validationText: {
    color: "red",
    fontSize: 12,
  },

  buttonText: { textAlign: "center", padding: 5 },
  button: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#495E57",
    height: 35,
    marginTop: 20,
  },
});
