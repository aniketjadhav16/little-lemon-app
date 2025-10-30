import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  SectionList,
  StyleSheet,
  Alert,
} from "react-native";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import axios from "axios";
import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from "@/database";
import Filters from "@/components/Filters";
import { getSectionListData, useUpdateEffect } from "@/utils";
import { MenuItem } from "@/types/MenuItem";

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const IMAGE_BASE_URL =
  "https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/";

const sections = ["starters", "mains", "desserts"] as const;

interface ItemProps {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}

const Item: React.FC<ItemProps> = ({ title, description, price, imageUrl }) => (
  <View style={styles.item}>
    <Image source={{ uri: imageUrl }} style={styles.image} />
    <View style={{ flex: 1, marginLeft: 10 }}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>${price}</Text>
    </View>
  </View>
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

  return (
    <View style={styles.container}>
      <Navbar />
      <Hero showSearchBar={true} />
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
          <Item
            title={item.title}
            description={item.description}
            price={item.price}
            imageUrl={item.imageUrl}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#495E57",
  },
  sectionList: {
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#495E57",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  header: {
    fontSize: 24,
    paddingVertical: 8,
    color: "#FBDABB",
    backgroundColor: "#495E57",
  },
  title: {
    fontSize: 18,
    color: "white",
  },
  description: {
    fontSize: 14,
    color: "#ccc",
  },
  price: {
    fontSize: 16,
    color: "#F4CE14",
  },
});
