import Navbar from "@/components/Navbar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";

export default function CheckoutScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [cutleryChecked, setCutleryChecked] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [deliveryTime] = useState("20 minutes");
  const [orderPlaced, setOrderPlaced] = useState(false);

  useFocusEffect(
    useCallback(() => {
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
    }, [])
  );

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

  const handlePlaceOrder = async () => {
    setOrderPlaced(true);
  };

  const handleTrackOrder = async () => {
    await AsyncStorage.removeItem("cartItems");
    setCartItems([]);
    router.push("/(tabs)/HomeScreen");
  };

  if (orderPlaced) {
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
          </View>
          <View style={styles.orderSummarySection}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.itemsHeader}>
              <Text style={styles.itemsHeaderText}>Items</Text>
            </View>
            {cartItems.map((item: any) => (
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
                  ${(
                    (parseFloat(item.price) +
                      (item.additions || []).reduce(
                        (sum: number, a: any) => sum + a.price,
                        0
                      )) *
                    item.quantity
                  ).toFixed(2)}
                </Text>
              </View>
            ))}
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
          <View style={styles.successSection}>
            <Text style={styles.successTitle}>Success!</Text>
            <MaterialCommunityIcons
              name="truck-fast"
              size={64}
              color="#495E57"
              style={styles.truckIcon}
            />
            <Text style={styles.successMessage}>Your order</Text>
            <Text style={styles.successMessage}>will be with you shortly.</Text>
            <Text style={styles.thankYouText}>
              Thank you for your business.
            </Text>
          </View>
        </ScrollView>
        <View style={styles.trackOrderSection}>
          <TouchableOpacity
            style={styles.trackOrderButton}
            onPress={handleTrackOrder}
          >
            <Text style={styles.trackOrderButtonText}>Track Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
              Help reduce plastic waste. only only ask for cutlery if you need
              it
            </Text>
          </View>
          <Checkbox
            status={cutleryChecked ? "checked" : "unchecked"}
            onPress={() => setCutleryChecked(!cutleryChecked)}
            color="#495E57"
          />
        </View>
        <View style={styles.orderSummarySection}>
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
                  ${(
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
          onPress={handlePlaceOrder}
        >
          <Text style={styles.checkoutButtonText}>Place Order</Text>
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
    borderRadius: 4,
  },
  changeButtonText: { fontSize: 14, fontWeight: "600", color: "#495E57" },
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
  orderSummarySection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
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
  priceBreakdown: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 16,
    marginTop: 12,
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
  successSection: {
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    borderRadius: 12,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#495E57",
  },
  truckIcon: { marginBottom: 16 },
  successMessage: { fontSize: 16, color: "#495E57", fontWeight: "500" },
  thankYouText: { fontSize: 14, color: "#666", marginTop: 16 },
  trackOrderSection: {
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
  trackOrderButton: {
    backgroundColor: "#F4CE14",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  trackOrderButtonText: { fontSize: 16, fontWeight: "bold", color: "#000" },
});
