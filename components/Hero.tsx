import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";

interface HeroProps {
  showSearchBar?: boolean;
  handleSearchChange?: (text: string) => void;
}

export default function Hero({ 
  showSearchBar, 
  handleSearchChange 
}: HeroProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [searchText, setSearchText] = useState("");
  const widthAnimation = useRef(new Animated.Value(40)).current;

  const expandSearchBar = () => {
    setIsExpanded(true);
    Animated.timing(widthAnimation, {
      toValue: containerWidth,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const collapseSearch = () => {
    Animated.timing(widthAnimation, {
      toValue: 40,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      setIsExpanded(false);
    });
  };

  const handleTextChange = (text: string) => {
    setSearchText(text);
    if (handleSearchChange) {
      handleSearchChange(text);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Little Lemon</Text>
        <Text style={styles.subHeaderText}>Chicago</Text>
        <View style={styles.subContainer}>
          <Text style={styles.descriptionText}>
            We are a family owned Mediterranean restaurant, focused on
            traditional recipes served with a modern twist.
          </Text>
          <Image
            style={styles.image}
            source={require("../assets/images/Hero-image.png")}
          />
        </View>
        {showSearchBar && (
          <View
            style={styles.searchContainer}
            onLayout={(event) => {
              const width = event.nativeEvent.layout.width;
              setContainerWidth(width);
            }}
          >
            <Animated.View
              style={[styles.searchBox, { width: widthAnimation }]}
            >
              <TouchableOpacity onPress={expandSearchBar}>
                <Ionicons name="search-outline" size={24} color={"#495E57"} />
              </TouchableOpacity>
              {isExpanded && (
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search menu..."
                  autoFocus
                  value={searchText}
                  onChangeText={handleTextChange}
                  onBlur={collapseSearch}
                />
              )}
            </Animated.View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
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
    marginBottom: 15,
  },
  searchContainer: {
    marginHorizontal: 15,
    backgroundColor: "#495E57",
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 50,
    paddingHorizontal: 8,
    height: 40,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    height: 40,
  },
});
