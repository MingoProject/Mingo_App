import Card from "../friend/Card";

import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import { getTimestamp } from "@/lib/utils";

const fakeUsers = [
  {
    _id: "1", // user1
    userName: "Huỳnh",
    sendAt: new Date(),
    userAvatar: require("../../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg"),
  },
  {
    _id: "2", // user2
    userName: "Nguyễn Tấn Dũng",
    sendAt: new Date(),
    userAvatar: require("../../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg"),
  },
  {
    _id: "3", // user3
    userName: "Trần Ngọc Ngạn",
    sendAt: new Date(),
    userAvatar: require("../../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg"),
  },
];

const fakeMediaData = [
  {
    _id: "652c02b2fc13ae1c41000001", // ID giả
    url: require("../../assets/images/950d0d7b19b956a5052b7d2c362c9871.jpg"), // URL của hình ảnh
    type: "image", // Loại là hình ảnh
    caption: "Đây là ảnh bún đậu", // Chú thích cho hình ảnh
    createdAt: new Date("2024-08-01T10:00:00Z"), // Thời gian tạo
    author: "652c02b2fc13ae1c41000002", // ID của người dùng
    postId: "652c02b2fc13ae1c41000003", // ID bài viết
    likes: ["652c02b2fc13ae1c41000004", "652c02b2fc13ae1c41000005"], // Người dùng đã thích
    comments: ["652c02b2fc13ae1c41000006", "652c02b2fc13ae1c41000007"], // Danh sách bình luận
    shares: ["652c02b2fc13ae1c41000008"], // Danh sách người dùng chia sẻ
  },
  {
    _id: "652c02b2fc13ae1c41000009", // ID giả
    url: require("../../assets/images/950d0d7b19b956a5052b7d2c362c9871.jpg"), // URL của video
    type: "video", // Loại là video
    caption: "Video nấu bún đậu", // Chú thích cho video
    createdAt: new Date("2024-08-01T12:00:00Z"), // Thời gian tạo
    author: "652c02b2fc13ae1c41000002", // ID của người dùng
    postId: "652c02b2fc13ae1c41000003", // ID bài viết
    likes: ["652c02b2fc13ae1c41000004"], // Người dùng đã thích
    comments: ["652c02b2fc13ae1c41000006"], // Danh sách bình luận
    shares: ["652c02b2fc13ae1c41000005"], // Danh sách người dùng chia sẻ
  },
  {
    _id: "652c02b2fc13ae1c41000010", // ID giả
    url: require("../../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg"), // URL của hình ảnh
    type: "image", // Loại là hình ảnh
    caption: "Bún đậu tự làm ở nhà", // Chú thích khác
    createdAt: new Date("2024-08-02T08:30:00Z"), // Thời gian tạo
    author: "652c02b2fc13ae1c41000011", // ID của người dùng khác
    postId: "652c02b2fc13ae1c41000012", // ID bài viết khác
    likes: ["652c02b2fc13ae1c41000013"], // Người dùng đã thích
    comments: ["652c02b2fc13ae1c41000014", "652c02b2fc13ae1c41000015"], // Danh sách bình luận
    shares: ["652c02b2fc13ae1c41000016"], // Danh sách người dùng chia sẻ
  },
];

const PostCard = ({ item, isFirstPost }) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  const LikeIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.99 10.99 0 0 0 15 8"
      />
    </Svg>
  );

  const CommentIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M21.25 12a9.23 9.23 0 0 1-2.705 6.54A9.25 9.25 0 0 1 12 21.25a9.2 9.2 0 0 1-3.795-.81l-3.867.572a1.195 1.195 0 0 1-1.361-1.43l.537-3.923A8.9 8.9 0 0 1 2.75 12a9.23 9.23 0 0 1 2.705-6.54A9.25 9.25 0 0 1 12 2.75a9.26 9.26 0 0 1 6.545 2.71A9.24 9.24 0 0 1 21.25 12"
      />
    </Svg>
  );

  const ShareIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
        fill="none"
      />
      <Path
        fill={color}
        d="M10.114 4.491c.076-.795.906-1.45 1.743-.972c1.74 1.019 3.382 2.18 4.97 3.421c1.96 1.548 3.533 3.007 4.647 4.172c.483.507.438 1.308-.024 1.792a42 42 0 0 1-3.495 3.228c-1.938 1.587-3.945 3.125-6.13 4.358c-.741.418-1.544-.06-1.687-.801l-.017-.113l-.227-3.574c-1.816.038-3.574.662-4.98 1.823l-.265.222l-.128.104l-.247.192l-.12.088l-.23.16a5 5 0 0 1-.218.135l-.206.111C2.534 19.314 2 18.892 2 17c0-4.404 3.245-8.323 7.632-8.917l.259-.031zm1.909 1.474l-.192 3.472a.5.5 0 0 1-.447.47l-1.361.142c-3.065.366-5.497 2.762-5.948 5.894a9.95 9.95 0 0 1 5.135-1.912l.397-.023l1.704-.036a.5.5 0 0 1 .51.472l.197 3.596c1.603-1.021 3.131-2.196 4.664-3.45a44 44 0 0 0 2.857-2.595l-.258-.256l-.556-.533a48 48 0 0 0-3.134-2.693a46 46 0 0 0-3.568-2.548"
      />
    </Svg>
  );

  return (
    <View className={`w-full ${isFirstPost ? "" : "pt-4"}`}>
      <View className="bg-transparent mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={{ uri: item.avatar }}
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-4">
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className="font-msemibold text-[17px] "
            >
              {item.firstName} {item.lastName}
            </Text>
            <Text className="text-[#D9D9D9] font-mregular mt-1 text-sm">
              {getTimestamp(item.createAt)}
            </Text>
          </View>
        </View>

        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
            flex: 1,
          }}
          className="mb-4 font-mregular mt-3 text-[15px]"
        >
          {item.content}
        </Text>

        {item.media && (
          <FlatList
            data={item.media}
            horizontal
            keyExtractor={(media) => media._id} // Giả sử media có _id
            renderItem={({ item: media }) => (
              <View className="mr-2">
                {media.type === "image" ? (
                  <Image
                    source={{ uri: media.url }}
                    className="w-96 h-96 rounded-lg"
                  />
                ) : media.type === "video" ? (
                  <View className="w-40 h-40 bg-gray-200 rounded-lg justify-center items-center">
                    <Text>Video</Text>
                  </View>
                ) : (
                  <Text>Unsupported Media</Text>
                )}
              </View>
            )}
          />
        )}

        <View className="flex-row mt-2 justify-around">
          <TouchableOpacity className="flex-row items-center mr-4">
            <LikeIcon size={25} color={iconColor} />
            <Text
              className="ml-1 text-gray-700"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
            >
              {item.likes.length} Likes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center mr-4">
            <CommentIcon size={25} color={iconColor} />
            <Text
              className="ml-1 text-gray-700"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
            >
              {item.comments.length} Comments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center">
            <ShareIcon size={25} color={iconColor} />
            <Text
              className="ml-1 text-gray-700"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
            >
              {item.shares.length} Shares
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: "#D9D9D9",
            width: "100%",
            marginVertical: 5,
          }}
          className="mt-5"
        />
      </View>
    </View>
  );
};

export default PostCard;
