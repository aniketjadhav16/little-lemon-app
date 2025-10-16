import Navbar from "@/components/Navbar";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { MaskedTextInput } from "react-native-mask-text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [orderStatusChecked, setOrderStatusChecked] = useState(false);
  const [passwordChangesChecked, setPasswordChangesChecked] = useState(false);
  const [specialOffersChecked, setSpecialOffersChecked] = useState(false);
  const [newsletterChecked, setNewsletterChecked] = useState(false);

  const router = useRouter();

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
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("isLoggedIn");
    router.replace("/");
  };

  const renderProfilePicture = () => {
    if (imageUri) {
      return (
        <TouchableOpacity onPress={pickImage}>
          <Image style={styles.profilePicture} source={{ uri: imageUri }} />
        </TouchableOpacity>
      );
    }
    const initials =
      (firstName ? firstName[0].toUpperCase() : "") +
      (lastName ? lastName[0].toUpperCase() : "");
    return (
      <TouchableOpacity
        style={[styles.profilePicture, styles.placeholder]}
        onPress={pickImage}
      >
        <Text style={styles.initialsText}>{initials || "U"}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar />
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
            <Text style={[styles.buttonText, { color: "#495E57" }]}>Remove</Text>
          </Pressable>
        </View>
        <KeyboardAvoidingView style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>First name</Text>
          <TextInput
            style={styles.inputText}
            placeholder="Enter first name"
            returnKeyType="next"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
          <Text style={styles.userInfoText}>Last name</Text>
          <TextInput
            style={styles.inputText}
            value={lastName}
            onChangeText={(text) => setLastName(text)}
            placeholder="Enter last name"
          />
          <Text style={styles.userInfoText}>Email</Text>
          <TextInput
            style={styles.inputText}
            placeholder="Enter email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />
          <Text style={styles.userInfoText}>Phone number</Text>
          <MaskedTextInput
            style={styles.inputText}
            placeholder="Enter phone number"
            value={phone}
            onChangeText={(text, rawText) => setPhone(rawText)}
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
          <Pressable style={styles.footerButtons}>
            <Text style={[styles.buttonText, { color: "#495E57" }]}>
              Discard changes
            </Text>
          </Pressable>
          <Pressable
            style={[styles.footerButtons, { backgroundColor: "#495E57" }]}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </Pressable>
        </View>
      </ScrollView>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={[styles.buttonText, { color: "black", fontWeight: "bold" }]}>
          Log out
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
    fontWeight: "semibold",
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
    fontWeight: "semibold",
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
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#495E57",
    height: 35,
    backgroundColor: "#F4CE14",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});
