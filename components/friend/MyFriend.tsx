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

  // Sample data for demonstration with 10 entries, including userAva
  const fakePostData = [
    {
      _id: "1",
      userName: "Bao Anh",
      sendAt: new Date("2024-10-01T10:00:00"),
      userAva: require("../../assets/images/0dd7ef2b0c1abd4c1783b1878c4ae633.jpg"), // Example avatar
    },
    {
      _id: "2",
      userName: "Nguyen Van A",
      sendAt: new Date("2024-10-02T11:30:00"),
      userAva: require("../../assets/images/0dd7ef2b0c1abd4c1783b1878c4ae633.jpg"),
    },
    {
      _id: "3",
      userName: "Tran Thi B",
      sendAt: new Date("2024-10-03T12:45:00"),
      userAva: require("../../assets/images/0dd7ef2b0c1abd4c1783b1878c4ae633.jpg"),
    },
    {
      _id: "4",
      userName: "Le Van C",
      sendAt: new Date("2024-10-04T13:20:00"),
      userAva: require("../../assets/images/0dd7ef2b0c1abd4c1783b1878c4ae633.jpg"),
    },
    {
      _id: "5",
      userName: "Pham Minh D",
      sendAt: new Date("2024-10-05T09:15:00"),
      userAva: require("../../assets/images/0dd7ef2b0c1abd4c1783b1878c4ae633.jpg"),
    },
    {
      _id: "6",
      userName: "Hoang Thi E",
      sendAt: new Date("2024-10-06T08:50:00"),
      userAva: require("../../assets/images/0dd7ef2b0c1abd4c1783b1878c4ae633.jpg"),
    },
    {
      _id: "7",
      userName: "Vu Van F",
      sendAt: new Date("2024-10-07T14:30:00"),
      userAva: require("../../assets/images/0dd7ef2b0c1abd4c1783b1878c4ae633.jpg"),
    },
    {
      _id: "8",
      userName: "Nguyen Thi G",
      sendAt: new Date("2024-10-08T15:10:00"),
      userAva: require("../../assets/images/0dd7ef2b0c1abd4c1783b1878c4ae633.jpg"),
    },
    {
      _id: "9",
      userName: "Le Van H",
      sendAt: new Date("2024-10-09T16:00:00"),
      userAva: require("../../assets/images/0dd7ef2b0c1abd4c1783b1878c4ae633.jpg"),
    },
    {
      _id: "10",
      userName: "Pham Thi I",
      sendAt: new Date("2024-10-10T17:25:00"),
      userAva: require("../../assets/images/0dd7ef2b0c1abd4c1783b1878c4ae633.jpg"),
    },
  ];

  return (
    <View className={`w-full h-5/6`}>
      <FlatList
        data={friendList} // Use the fake data here
        keyExtractor={(item: any) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card item={item} actionButton="Nhắn tin" isLoiMoi={false} />
        )}
      />
    </View>
  );
};

export default BanBe;
