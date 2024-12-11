import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const UserProfile = () => {
  const route = useRoute();
  const { id } = route.params; // Nhận ID từ params

  // Giả sử fetch thông tin user từ API
  const fetchUserInfo = (userId: string) => {
    // Logic fetch dữ liệu user theo ID từ API
    console.log("Fetching user with ID:", userId);
    return { name: "John Doe", age: 25 }; // Dữ liệu giả
  };

  const userInfo = fetchUserInfo(id);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trang cá nhân</Text>
      <Text style={styles.text}>ID: {id}</Text>
      <Text style={styles.text}>Tên: {userInfo.name}</Text>
      <Text style={styles.text}>Tuổi: {userInfo.age}</Text>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});
