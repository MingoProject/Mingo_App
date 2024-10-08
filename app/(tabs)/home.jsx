import { View, Text, TextInput, FlatList, Image } from "react-native";
import React from "react";
const posts = [
  {
    id: 1,
    userName: "Huỳnh",
    userAvatar: "/assets/images/4d7b4220f336f18936a8c33a557bf06b.jpg",
    title: "Hôm nay ăn bún đậu",
    images: {
      id: 1,
      img1: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
      img2: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    },
    like: ["An", "Minh", "Lan"],
    comment: [
      { text: "Ngon quá!", user: "An" },
      { text: "Nhìn hấp dẫn quá", user: "Minh" },
      { text: "Muốn ăn thử!", user: "Lan" },
    ],
    createdAt: "2024-08-01T10:00:00Z",
  },
  {
    id: 2,
    userName: "Minh",
    userAvatar: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    title: "Trải nghiệm bún bò Huế",
    images: {
      id: 2,
      img1: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
      img2: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    },
    like: ["Huỳnh", "Linh"],
    comment: [
      { text: "Tuyệt vời!", user: "Huỳnh" },
      { text: "Nhìn rất ngon!", user: "Linh" },
    ],
    createdAt: "2024-08-02T12:30:00Z",
  },
  {
    id: 3,
    userName: "Anh",
    userAvatar: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    title: "Bún chả Hà Nội ngon tuyệt",
    images: {
      id: 3,
      img1: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
      img2: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    },
    like: ["Thảo", "Minh"],
    comment: [
      { text: "Nhìn tuyệt quá!", user: "Thảo" },
      { text: "Rất ngon!", user: "Minh" },
    ],
    createdAt: "2024-08-03T09:15:00Z",
  },
  {
    id: 4,
    userName: "Thảo",
    userAvatar: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    title: "Ăn phở cuốn",
    images: {
      id: 4,
      img1: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
      img2: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    },
    like: ["Huỳnh", "Linh"],
    comment: [
      { text: "Rất ngon!", user: "Huỳnh" },
      { text: "Mình cũng thích món này", user: "Linh" },
    ],
    createdAt: "2024-08-04T14:45:00Z",
  },
  {
    id: 5,
    userName: "Linh",
    userAvatar: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    title: "Thưởng thức bánh mì Sài Gòn",
    images: {
      id: 5,
      img1: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
      img2: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    },
    like: ["Minh", "Thảo", "Anh"],
    comment: [
      { text: "Bánh mì ngon quá!", user: "Minh" },
      { text: "Mình muốn ăn thử", user: "Thảo" },
      { text: "Ngon lắm!", user: "Anh" },
    ],
    createdAt: "2024-08-05T11:00:00Z",
  },
  {
    id: 6,
    userName: "Nam",
    userAvatar: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    title: "Món ngon bánh cuốn",
    images: {
      id: 6,
      img1: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
      img2: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    },
    like: ["Minh", "Thảo", "Huỳnh"],
    comment: [
      { text: "Rất ngon!", user: "Minh" },
      { text: "Món yêu thích của mình", user: "Thảo" },
      { text: "Món này ngon!", user: "Huỳnh" },
    ],
    createdAt: "2024-08-06T08:20:00Z",
  },
];
const Home = () => {
  return (
    <View className="flex-1 p-4">
      {/* Input tìm kiếm */}
      <TextInput
        placeholder="Tìm kiếm..."
        className="border border-gray-300 rounded-lg p-2 mb-4"
      />

      {/* Danh sách bài viết */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="mb-4 border p-4 rounded-lg">
            <View className="flex-row items-center mb-2">
              <Image
                source={{ uri: item.userAvatar }}
                className="w-10 h-10 rounded-full"
              />
              <Text className="ml-2 font-bold">{item.userName}</Text>
            </View>
            <Text className="font-semibold mb-2">{item.title}</Text>
            <View className="flex-row">
              <Image
                source={{ uri: item.images.img1 }}
                className="w-1/2 h-40 rounded-lg mr-1"
              />
              <Image
                source={{ uri: item.images.img2 }}
                className="w-1/2 h-40 rounded-lg ml-1"
              />
            </View>
            <View className="mt-2">
              <Text className="text-gray-500">
                {item.comment.length} bình luận
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Home;
