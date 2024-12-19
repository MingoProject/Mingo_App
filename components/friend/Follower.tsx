import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { getMyFollowers, getMyFollowings } from "@/lib/service/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, FlatList } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Make sure this is correctly imported
import { colors } from "../../styles/colors"; // Adjust the import path as necessary
import Card from "./Card";

const Follower = () => {
  const { colorScheme } = useTheme(); // Get the color scheme from context
  const [followersData, setFollowersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchFollowersData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      if (!token) throw new Error("Token không tồn tại");
      const data = await getMyFollowers(userId);
      setFollowersData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching friend request:", error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowersData();
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
        data={followersData}
        keyExtractor={(item: any) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card
            item={item}
            actionButton="follower"
            isLoiMoi={true}
            setData={setFollowersData}
          />
        )}
      />
    </View>
  );
};

export default Follower;
