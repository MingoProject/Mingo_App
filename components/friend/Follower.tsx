import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { getMyFollower, getMyFollowings } from "@/lib/service/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, FlatList } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Make sure this is correctly imported
import { colors } from "../../styles/colors"; // Adjust the import path as necessary
import Card from "./Card";

const Follower = () => {
  const { colorScheme } = useTheme(); // Get the color scheme from context
  const [addFriendRequest, setAddFriendRequets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchAddFriendRequestData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      if (!token) throw new Error("Token không tồn tại");

      // Giải mã token
      const data = await getMyFollower(userId);
      setAddFriendRequets(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching friend request:", error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddFriendRequestData();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error fetching posts. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View className={`w-full h-5/6`}>
      <FlatList
        data={addFriendRequest} // Use the fake data here
        keyExtractor={(item: any) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card item={item} actionButton="Chấp nhận" isLoiMoi={true} />
        )}
      />
    </View>
  );
};

export default Follower;
