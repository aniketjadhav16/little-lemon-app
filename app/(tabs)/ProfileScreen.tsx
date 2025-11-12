import Navbar from "@/components/Navbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import { Checkbox } from "react-native-paper";

export default function ProfileScreen() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [orderStatusChecked, setOrderStatusChecked] = useState<boolean>(false);
  const [passwordChangesChecked, setPasswordChangesChecked] = useState<boolean>(false);
  const [specialOffersChecked, setSpecialOffersChecked] = useState<boolean>(false);
  const [newsletterChecked, setNewsletterChecked] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const loggedIn = await AsyncStorage.getItem("isLoggedIn");
      setIsLoggedIn(loggedIn === "true");
      const uri = await AsyncStorage.getItem("profileImageUri");
      const first = await AsyncStorage.getItem("firstName");
      const last = await AsyncStorage.getItem("lastName");
      const emailVal = await AsyncStorage.getItem("email");
      const phoneVal = await AsyncStorage.getItem("phone");
      setImageUri(uri);
      setFirstName(first || "");
      setLastName(last || "");
      setEmail(emailVal || "");
      setPhone(phoneVal || "");
    })();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleButtonPress = async () => {
    if (isLoggedIn) {
      await AsyncStorage.removeItem("isLoggedIn");
      router.push("/(tabs)/OnboardingScreen");
    } else {
      router.push("/(tabs)/LoginScreen");
    }
  };

  const handleSave = async () => {
    await AsyncStorage.setItem("profileImageUri", imageUri || "");
    await AsyncStorage.setItem("firstName", firstName);
    await AsyncStorage.setItem("lastName", lastName);
    await AsyncStorage.setItem("email", email);
    await AsyncStorage.setItem("phone", phone);
  };

  const handleDiscard = async () => {
    const uri = await AsyncStorage.getItem("profileImageUri");
    const first = await AsyncStorage.getItem("firstName");
    const last = await AsyncStorage.getItem("lastName");
    const emailVal = await AsyncStorage.getItem("email");
    const phoneVal = await AsyncStorage.getItem("phone");
    setImageUri(uri);
    setFirstName(first || "");
    setLastName(last || "");
    setEmail(emailVal || "");
    setPhone(phoneVal || "");
  };

  const renderProfilePicture = () => {
    if (imageUri) {
      return (
        <TouchableOpacity onPress={pickImage}>
          <Image style={styles.profilePicture} source={{ uri: imageUri }} />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={pickImage}>
        <Image
          style={styles.profilePicture}
          source={require("@/assets/images/Profile.png")}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar showBackButton />
      <ScrollView style={styles.ProfileScreenContainer}>
        <Text style={styles.headerText}>Personal Information</Text>
        <View style={styles.profilePictureContainer}>
          {renderProfilePicture()}
          <Pressable
            style={[styles.profileButtons, { backgroundColor: "#495E57" }]}
            onPress={pickImage}
          >
            <Text style={styles.buttonText}>Change</Text>
          </Pressable>
          <Pressable
            style={styles.profileButtons}
            onPress={() => setImageUri(null)}
          >
            <Text style={[styles.buttonText, { color: "#495E57" }]}>
              Remove
            </Text>
          </Pressable>
        </View>
        <KeyboardAvoidingView style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>First name</Text>
          <TextInput
            style={styles.inputText}
            placeholder="Enter first name"
            returnKeyType="next"
            value={firstName}
            onChangeText={setFirstName}
          />
          <Text style={styles.userInfoText}>Last name</Text>
          <TextInput
            style={styles.inputText}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
          />
          <Text style={styles.userInfoText}>Email</Text>
          <TextInput
            style={styles.inputText}
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Text style={styles.userInfoText}>Phone number</Text>
          <MaskedTextInput
            style={styles.inputText}
            placeholder="Enter phone number"
            value={phone}
            onChangeText={(_text, rawText) => setPhone(rawText)}
            keyboardType="phone-pad"
            mask="(999) 999-9999"
          />
        </KeyboardAvoidingView>
        <Text style={styles.headerText}>Email notifications</Text>
        <View style={styles.notificationsContainer}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={orderStatusChecked ? "checked" : "unchecked"}
              onPress={() => setOrderStatusChecked(!orderStatusChecked)}
              color="#495E57"
            />
            <Text style={styles.checkboxText}>Order statuses</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={passwordChangesChecked ? "checked" : "unchecked"}
              onPress={() => setPasswordChangesChecked(!passwordChangesChecked)}
              color="#495E57"
            />
            <Text style={styles.checkboxText}>Password changes</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={specialOffersChecked ? "checked" : "unchecked"}
              onPress={() => setSpecialOffersChecked(!specialOffersChecked)}
              color="#495E57"
            />
            <Text style={styles.checkboxText}>Special offers</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={newsletterChecked ? "checked" : "unchecked"}
              onPress={() => setNewsletterChecked(!newsletterChecked)}
              color="#495E57"
            />
            <Text style={styles.checkboxText}>Newsletter</Text>
          </View>
        </View>
        <View style={styles.footerButtonsContainer}>
          <Pressable style={styles.footerButtons} onPress={handleDiscard}>
            <Text style={[styles.buttonText, { color: "#495E57" }]}>
              Discard changes
            </Text>
          </Pressable>
          <Pressable
            style={[styles.footerButtons, { backgroundColor: "#495E57" }]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </Pressable>
        </View>
      </ScrollView>
      <Pressable style={styles.logoutButton} onPress={handleButtonPress}>
        <Text style={[styles.buttonText, { color: "black", fontWeight: "bold" }]}>
          {isLoggedIn ? "Log out" : "Create Account"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    position: "relative",
  },
  ProfileScreenContainer: {
    padding: 16,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 10,
  },
  profilePictureContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 10,
  },
  profilePicture: {
    height: 80,
    width: 80,
    resizeMode: "contain",
    borderRadius: 50,
  },
  placeholder: {
    backgroundColor: "#495E57",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  profileButtons: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#495E57",
    width: 95,
    height: 35,
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    padding: 6,
    color: "white",
  },
  userInfoContainer: {
    marginVertical: 15,
  },
  userInfoText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  inputText: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    backgroundColor: "#fff",
    borderColor: "#bbb",
    height: 40,
  },
  notificationsContainer: {
    flexDirection: "column",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxText: {
    fontSize: 14,
    fontWeight: "600",
  },
  footerButtonsContainer: {
    flexDirection: "row",
    marginHorizontal: "auto",
    marginBottom: 80,
    marginTop: 10,
    gap: 20,
  },
  footerButtons: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#495E57",
    width: 120,
    height: 35,
  },
  logoutButton: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    borderRadius: 8,
    borderColor: "#495E57",
    height: 50,
    backgroundColor: "#F4CE14",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});
