import Navbar from "@/components/Navbar";
import { MenuItem } from "@/types/MenuItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";

const ADDITIONS = [
  { id: "cheese", name: "Cheese", price: 2.5 },
  { id: "butter", name: "Butter", price: 1.0 },
  { id: "bacon", name: "Bacon", price: 3.0 },
];

export default function ItemDetailsScreen() {
  const { menuItem } = useLocalSearchParams();
  const menuItemStr = Array.isArray(menuItem) ? menuItem[0] : menuItem;
  let item: MenuItem | null = null;
  try {
    if (typeof menuItemStr === "string") {
      item = JSON.parse(menuItemStr);
    }
  } catch (e) {}
  const router = useRouter();
  const [selectedAdditions, setSelectedAdditions] = useState<string[]>([]);
  const toggleAddition = (id: string) => {
    setSelectedAdditions((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };
  const calculateTotal = () => {
    const basePrice = parseFloat(item!.price);
    const additionsPrice = selectedAdditions.reduce((sum, id) => {
      const add = ADDITIONS.find((a) => a.id === id);
      return sum + (add?.price || 0);
    }, 0);
    return (basePrice + additionsPrice).toFixed(2);
  };
  const handleAddToCart = async () => {
    const selectedAdditionsData = selectedAdditions.map((id) => {
      const add = ADDITIONS.find((a) => a.id === id);
      return { id, name: add?.name || "", price: add?.price || 0 };
    });
    const cartItem = {
      id: item!.id,
      title: item!.title,
      price: item!.price,
      quantity: 1,
      imageUrl: item!.imageUrl,
      additions: selectedAdditionsData,
      description: item!.description,
    };
    try {
      const currentCart = await AsyncStorage.getItem("cartItems");
      let cartItems = currentCart ? JSON.parse(currentCart) : [];
      const existingIndex = cartItems.findIndex(
        (ci: any) => ci.id === cartItem.id
      );
      if (existingIndex !== -1) {
        cartItems[existingIndex].quantity += 1;
        cartItems[existingIndex].additions = selectedAdditionsData;
      } else {
        cartItems.push(cartItem);
      }
      await AsyncStorage.setItem("cartItems", JSON.stringify(cartItems));
      router.push("/(tabs)/OrderSummaryScreen");
    } catch (e) {
      Alert.alert("Cart Error", "Failed to add item to cart.");
    }
  };
  if (!item || !item.title || !item.imageUrl) {
    return (
      <View style={styles.container}>
        <Navbar />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Item not found or invalid data</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Navbar
        onProfilePress={() => router.push("/(tabs)/ProfileScreen")}
        showBackButton={true}
      />
      <ScrollView style={styles.content}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.priceBox}>
            <Text style={styles.price}>Base Price: ${item.price}</Text>
          </View>
          <Text style={styles.addOnsTitle}>Add-ons</Text>
          {ADDITIONS.map((add) => (
            <TouchableOpacity
              key={add.id}
              style={styles.addOnItem}
              onPress={() => toggleAddition(add.id)}
            >
              <Checkbox
                status={
                  selectedAdditions.includes(add.id) ? "checked" : "unchecked"
                }
                onPress={() => toggleAddition(add.id)}
                color="#495E57"
              />
              <Text style={styles.addOnName}>{add.name}</Text>
              <Text style={styles.addOnPrice}>+${add.price.toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Selected:</Text>
            {selectedAdditions.length > 0 ? (
              selectedAdditions.map((id) => {
                const add = ADDITIONS.find((a) => a.id === id);
                return (
                  <Text key={id} style={styles.summaryItem}>
                    • {add?.name}: ${add?.price.toFixed(2)}
                  </Text>
                );
              })
            ) : (
              <Text style={styles.noSelection}>None</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${calculateTotal()}</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
          <Text style={styles.addBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "#999", marginBottom: 20 },
  backBtn: {
    backgroundColor: "#495E57",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backBtnText: { color: "white", fontWeight: "bold" },
  content: { flex: 1, paddingBottom: 100 },
  image: { width: "100%", height: 250, resizeMode: "cover" },
  details: { padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#495E57",
    marginBottom: 4,
  },
  category: { fontSize: 14, color: "#999", marginBottom: 12 },
  description: { fontSize: 14, color: "#666", marginBottom: 16 },
  priceBox: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 20,
  },
  price: { fontSize: 16, fontWeight: "bold", color: "#495E57" },
  addOnsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#495E57",
    marginBottom: 12,
  },
  addOnItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  addOnName: { flex: 1, fontSize: 14, color: "#333", marginLeft: 8 },
  addOnPrice: { fontSize: 14, fontWeight: "600", color: "#495E57" },
  summary: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#495E57",
    marginBottom: 8,
  },
  summaryItem: { fontSize: 12, color: "#666", marginBottom: 4 },
  noSelection: { fontSize: 12, color: "#999" },
  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingBottom: 20,
  },
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: { fontSize: 16, fontWeight: "600", color: "#495E57" },
  totalPrice: { fontSize: 24, fontWeight: "bold", color: "#495E57" },
  addBtn: {
    backgroundColor: "#F4CE14",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addBtnText: { fontSize: 16, fontWeight: "bold", color: "black" },
});
