import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NavbarProps {
  profileImageUri?: string | null;
  initials?: string;
  onProfilePress?: () => void;
  showBackButton?: boolean;
}

export default function Navbar({
  profileImageUri,
  initials,
  onProfilePress,
  showBackButton,
}: NavbarProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={[styles.sideContainer, { alignItems: "flex-start" }]}>
        {showBackButton && (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>{"<-"}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/Logo.png")}
          style={styles.logo}
        />
      </View>
      <View style={[styles.sideContainer, { alignItems: "flex-end" }]}>
        <TouchableOpacity
          onPress={onProfilePress}
          style={styles.profileContainer}
        >
          {profileImageUri ? (
            <Image
              source={{ uri: profileImageUri }}
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={require("../assets/images/Profile.png")}
              style={styles.profileImage}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  sideContainer: {
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 170,
    height: 60,
    resizeMode: "contain",
  },
  backBtn: {
    borderWidth: 2,
    borderColor: "#495E57",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  backBtnText: {
    fontSize: 24,
    color: "#495E57",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 24,
  },
  profileContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
    resizeMode: "cover",
    backgroundColor: "#495E57",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsCircle: {
    backgroundColor: "#495E57",
  },
  initialsText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
