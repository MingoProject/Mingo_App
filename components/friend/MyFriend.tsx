import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { View, Text, FlatList } from "react-native";
import { getMyFriends } from "@/lib/service/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../context/ThemeContext"; // Make sure this is correctly imported
import { colors } from "../../styles/colors"; // Adjust the import path as necessary
import Card from "./Card";

const BanBe = () => {
  const [friendList, setFriendList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchFriendListData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại");
      const userId = await AsyncStorage.getItem("userId");

      const data = await getMyFriends(userId);
      setFriendList(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching friend request:", error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendListData();
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
        data={friendList} // Use the fake data here
        keyExtractor={(item: any) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card
            item={item}
            actionButton="friend"
            isLoiMoi={false}
            setData={setFriendList}
          />
        )}
      />
    </View>
  );
};

export default BanBe;
