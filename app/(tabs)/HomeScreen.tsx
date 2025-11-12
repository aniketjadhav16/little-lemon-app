import Filters from "@/components/Filters";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import {
  createTable,
  filterByQueryAndCategories,
  getMenuItems,
  saveMenuItems,
} from "@/database";
import { MenuItem } from "@/types/MenuItem";
import { getSectionListData, useUpdateEffect } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const IMAGE_BASE_URL =
  "https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/";

const sections = ["starters", "mains", "desserts"] as const;

interface ItemProps {
  item: MenuItem;
  onPress: (item: MenuItem) => void;
}

const Item: React.FC<ItemProps> = ({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    <View style={styles.item}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const [data, setData] = useState<Array<{ title: string; data: MenuItem[] }>>(
    []
  );
  const [searchBarText, setSearchBarText] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [filterSelections, setFilterSelections] = useState<boolean[]>(
    sections.map(() => false)
  );
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const fetchData = async (): Promise<MenuItem[]> => {
    try {
      const response = await axios.get(API_URL);
      const result = response.data;
      const menuItems: MenuItem[] = result.menu.map(
        (item: any, index: number): MenuItem => ({
          id: index.toString(),
          uuid: index.toString(),
          title: item.name,
          price: item.price.toString(),
          description: item.description,
          category: item.category,
          imageUrl: `${IMAGE_BASE_URL}${item.image}?raw=true`,
        })
      );
      return menuItems;
    } catch (error) {
      console.error("Error while fetching data", error);
      Alert.alert("Fetch Error", "Unable to fetch menu data.");
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems: MenuItem[] = await getMenuItems();
        if (!menuItems.length) {
          menuItems = await fetchData();
          await saveMenuItems(menuItems);
        }
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (error: any) {
        console.error(error);
        Alert.alert("Error", error?.message || "Unknown error");
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems: MenuItem[] = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (e: any) {
        Alert.alert("Error filtering data", e?.message || "Unknown error");
      }
    })();
  }, [filterSelections, query]);

  const handleSearchChange = (text: string) => {
    setSearchBarText(text);
    setQuery(text);
  };

  const handleFiltersChange = (index: number) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  const router = useRouter();

  const handleItemPress = (item: MenuItem) => {
    router.push({
      pathname: "/(tabs)/ItemDetailsScreen",
      params: { menuItem: JSON.stringify(item) },
    });
  };

  useEffect(() => {
    (async () => {
      const uri = await AsyncStorage.getItem("profileImageUri");
      const first = await AsyncStorage.getItem("firstName");
      const last = await AsyncStorage.getItem("lastName");
      setProfileImageUri(uri);
      setFirstName(first || "");
      setLastName(last || "");
    })();
  }, []);

  const initials =
    (firstName ? firstName[0].toUpperCase() : "") +
    (lastName ? lastName[0].toUpperCase() : "");

  return (
    <View style={styles.container}>
      <Navbar
        profileImageUri={profileImageUri}
        initials={initials}
        onProfilePress={() => router.push("/(tabs)/ProfileScreen")}
        showBackButton={false}
      />
      <Hero showSearchBar={true} handleSearchChange={handleSearchChange} />
      <Text style={styles.deliveryText}>ORDER FOR DELIVERY!</Text>
      <Filters
        selections={filterSelections}
        onChange={handleFiltersChange}
        sections={sections}
      />
      <SectionList
        style={styles.sectionList}
        sections={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Item item={item} onPress={handleItemPress} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  sectionList: {
    paddingHorizontal: 16,
  },
  deliveryText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#495E57",
    paddingVertical: 10,
    backgroundColor: "white",
  },
  item: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    marginRight: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#495E57",
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    color: "#495E57",
    fontWeight: "bold",
  },
});
