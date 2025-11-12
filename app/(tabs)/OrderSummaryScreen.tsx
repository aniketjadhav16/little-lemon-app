import Navbar from "@/components/Navbar";
import { createTable, getMenuItems, saveMenuItems } from "@/database";
import { MenuItem } from "@/types/MenuItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const IMAGE_BASE_URL =
  "https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/";

export default function OrderSummaryScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [cutleryChecked, setCutleryChecked] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [deliveryTime] = useState("20 minutes");
  const [suggestedItems, setSuggestedItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    (async () => {
      const uri = await AsyncStorage.getItem("profileImageUri");
      const first = await AsyncStorage.getItem("firstName");
      const last = await AsyncStorage.getItem("lastName");
      setProfileImageUri(uri);
      setFirstName(first || "");
      setLastName(last || "");
      const currentCart = await AsyncStorage.getItem("cartItems");
      setCartItems(currentCart ? JSON.parse(currentCart) : []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems: MenuItem[] = await getMenuItems();
        if (!menuItems.length) {
          menuItems = await fetchData();
          await saveMenuItems(menuItems);
        }
        setSuggestedItems(menuItems.slice(0, 2));
      } catch (error: any) {
        Alert.alert("Error", error?.message || "Unknown error");
      }
    })();
  }, []);

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
      Alert.alert("Fetch Error", "Unable to fetch menu data.");
      return [];
    }
  };

  const initials =
    (firstName ? firstName[0].toUpperCase() : "") +
    (lastName ? lastName[0].toUpperCase() : "");

  const calculateSubtotal = () => {
    return cartItems.reduce((sum: number, item: any) => {
      const basePrice = parseFloat(item.price);
      const additionsPrice = (item.additions || []).reduce(
        (addSum: number, add: any) => addSum + add.price,
        0
      );
      return sum + (basePrice + additionsPrice) * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const delivery = 2.0;
  const service = 1.0;
  const total = subtotal + delivery + service;

  const handleCheckout = () => {
    router.push("/(tabs)/CheckoutScreen");
  };

  const handleAddSuggestedItem = async (item: MenuItem) => {
    const newCartItem = {
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
      additions: [],
      description: item.description,
    };
    try {
      const currentCart = await AsyncStorage.getItem("cartItems");
      let cartItemsArray = currentCart ? JSON.parse(currentCart) : [];
      const existingIndex = cartItemsArray.findIndex(
        (ci: any) => ci.id === newCartItem.id
      );
      if (existingIndex !== -1) {
        cartItemsArray[existingIndex].quantity += 1;
      } else {
        cartItemsArray.push(newCartItem);
      }
      await AsyncStorage.setItem("cartItems", JSON.stringify(cartItemsArray));
      setCartItems(cartItemsArray);
      Alert.alert("Added", `${item.title} added to cart`);
    } catch {
      Alert.alert("Cart Error", "Could not add item");
    }
  };

  return (
    <View style={styles.container}>
      <Navbar
        profileImageUri={profileImageUri}
        initials={initials}
        onProfilePress={() => router.push("/(tabs)/ProfileScreen")}
        showBackButton={true}
      />
      <ScrollView style={styles.content}>
        <View style={styles.deliverySection}>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryText}>
              Delivery time:{" "}
              <Text style={styles.deliveryTime}>{deliveryTime}</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cutlerySection}>
          <View style={styles.cutleryInfo}>
            <Text style={styles.cutleryTitle}>Cutlery</Text>
            <Text style={styles.cutleryDescription}>
              Help reduce plastic waste. Only ask for cutlery if you need it.
            </Text>
          </View>
          <Checkbox
            status={cutleryChecked ? "checked" : "unchecked"}
            onPress={() => setCutleryChecked(!cutleryChecked)}
            color="#495E57"
          />
        </View>
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.itemsHeader}>
            <Text style={styles.itemsHeaderText}>Items</Text>
          </View>
          {cartItems.length > 0 ? (
            cartItems.map((item: any) => (
              <View key={item.id} style={styles.cartItem}>
                <Text style={styles.cartItemQuantity}>{item.quantity} x</Text>
                <View style={styles.cartItemDetails}>
                  <Text style={styles.cartItemName}>{item.title}</Text>
                  {item.additions && item.additions.length > 0 && (
                    <Text style={styles.additionsText}>
                      + {item.additions.map((a: any) => a.name).join(", ")}
                    </Text>
                  )}
                </View>
                <Text style={styles.cartItemPrice}>
                  $
                  {(
                    (parseFloat(item.price) +
                      (item.additions || []).reduce(
                        (sum: number, a: any) => sum + a.price,
                        0
                      )) *
                    item.quantity
                  ).toFixed(2)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
          )}
          {suggestedItems.length > 0 && (
            <>
              <Text style={styles.addMoreTitle}>Add More To Your Order!</Text>
              <ScrollView
                style={styles.suggestedItemsContainer}
                contentContainerStyle={styles.suggestedItemsContent}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {suggestedItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.suggestedItem}
                    onPress={() => handleAddSuggestedItem(item)}
                  >
                    <View style={styles.suggestedTextContent}>
                      <Text style={styles.suggestedTitle}>{item.title}</Text>
                      <Text
                        style={styles.suggestedDescription}
                        numberOfLines={2}
                      >
                        {item.description}
                      </Text>
                      <Text style={styles.suggestedPrice}>${item.price}</Text>
                    </View>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.suggestedImage}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery</Text>
              <Text style={styles.priceValue}>${delivery.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service</Text>
              <Text style={styles.priceValue}>${service.toFixed(2)}</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.checkoutSection}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  content: { flex: 1 },
  deliverySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
  },
  deliveryInfo: { flexDirection: "row", alignItems: "center", gap: 8 },
  deliveryText: { fontSize: 14, color: "#666" },
  deliveryTime: { fontWeight: "bold", color: "#000" },
  changeButton: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },
  changeButtonText: { fontSize: 14, fontWeight: "bold", color: "#495E57" },
  cutlerySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  cutleryInfo: { flex: 1, paddingRight: 12 },
  cutleryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  cutleryDescription: { fontSize: 12, color: "#666", lineHeight: 16 },
  summarySection: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  itemsHeader: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  itemsHeaderText: { fontSize: 14, fontWeight: "600", color: "#000" },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cartItemQuantity: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    width: 40,
  },
  cartItemDetails: { flex: 1 },
  cartItemName: { fontSize: 14, fontWeight: "600", color: "#000" },
  additionsText: { fontSize: 11, color: "#999", marginTop: 2 },
  cartItemPrice: { fontSize: 14, fontWeight: "bold", color: "#000" },
  emptyCartText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingVertical: 16,
  },
  addMoreTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 24,
    marginBottom: 12,
  },
  suggestedItemsContainer: {
    marginBottom: 24,
    marginTop: 4,
    paddingLeft: 2,
    paddingRight: 2,
  },
  suggestedItemsContent: {
    flexDirection: "row",
    gap: 12,
  },
  suggestedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 12,
    marginRight: 12,
    width: 220,
  },
  suggestedTextContent: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    marginRight: 12,
  },
  suggestedImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    resizeMode: "cover",
  },
  suggestedTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  suggestedDescription: {
    fontSize: 11,
    color: "#666",
    marginBottom: 8,
  },
  suggestedPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#495E57",
  },

  priceBreakdown: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceLabel: { fontSize: 14, color: "#666" },
  priceValue: { fontSize: 14, color: "#666" },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalLabel: { fontSize: 18, fontWeight: "bold", color: "#000" },
  totalValue: { fontSize: 24, fontWeight: "bold", color: "#495E57" },
  checkoutSection: {
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
  checkoutButton: {
    backgroundColor: "#F4CE14",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: { fontSize: 16, fontWeight: "bold", color: "#000" },
});
