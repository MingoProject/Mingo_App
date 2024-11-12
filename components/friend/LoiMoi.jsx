import React from "react";
import { View, Text, FlatList } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Make sure this is correctly imported
import { colors } from "../../styles/colors"; // Adjust the import path as necessary
import Card from "./Card";

const LoiMoi = () => {
  const { colorScheme } = useTheme(); // Get the color scheme from context

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
    <View className={`w-full pb-20`}>
      <FlatList
        data={fakePostData} // Use the fake data here
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card item={item} actionButton="Chấp nhận" isLoiMoi={true} />
        )}
      />
    </View>
  );
};

export default LoiMoi;
