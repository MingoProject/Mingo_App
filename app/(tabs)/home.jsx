import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Svg, { Path, Rect } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors"; // import màu sắc từ file colors.js
import SearchHome from "../../components/home-component/SearchHome";
import AddPost from "@/components/home-component/AddPost";

const fakeMediaData = [
  {
    _id: "652c02b2fc13ae1c41000001", // ID giả
    url: require("../../assets/images/950d0d7b19b956a5052b7d2c362c9871.jpg"), // URL của hình ảnh
    type: "image", // Loại là hình ảnh
    caption: "Đây là ảnh bún đậu", // Chú thích cho hình ảnh
    createdAt: new Date("2024-08-01T10:00:00Z"), // Thời gian tạo
    author: "1", // ID của người dùng
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

const fakePostData = [
  {
    _id: "652c02b2fc13ae1c410000033",
    content: "Hôm nay ăn bún đậuu",
    media: ["652c02b2fc13ae1c41000001", "652c02b2fc13ae1c41000009"], // Sử dụng media 1 và media 2
    url: "https://example.com/bun-dau",
    createdAt: new Date("2024-08-01T10:00:00Z"),
    author: "1", // user1
    shares: ["652c02b2fc13ae1c41000008"],
    likes: [
      "652c02b2fc13ae1c41000004",
      "652c02b2fc13ae1c41000005",
      "652c02b2fc13ae1c41000006",
    ],
    comments: [
      { text: "Ngon quá!", user: "652c02b2fc13ae1c41000006" },
      { text: "Nhìn hấp dẫn quá", user: "652c02b2fc13ae1c41000005" },
      { text: "Muốn ăn thử!", user: "652c02b2fc13ae1c41000004" },
    ],
    location: "Hà Nội, Việt Nam",
    privacy: {
      type: "friends",
      allowedUsers: ["652c02b2fc13ae1c41000005", "652c02b2fc13ae1c41000006"],
    },
  },
  {
    _id: "652c02b2fc13ae1c41000012", // Bài viết của user2
    content: "Thử làm bún đậu tại nhà",
    media: ["652c02b2fc13ae1c41000010"], // Sử dụng media 3
    url: "https://example.com/bun-dau-nha",
    createdAt: new Date("2024-08-02T09:00:00Z"),
    author: "2", // user2
    shares: ["652c02b2fc13ae1c41000016"],
    likes: ["652c02b2fc13ae1c41000013"],
    comments: [
      { text: "Tự làm à? Tuyệt quá!", user: "652c02b2fc13ae1c41000014" },
      { text: "Phải thử thôi", user: "652c02b2fc13ae1c41000015" },
    ],
    location: "Sài Gòn, Việt Nam",
    privacy: {
      type: "public",
      allowedUsers: [],
    },
  },
  {
    _id: "652c02b2fc13ae1c410000122", // Bài viết của user2
    content: "Thử làm bún đậu tại nhà",
    media: ["652c02b2fc13ae1c41000010"], // Sử dụng media 3
    url: "https://example.com/bun-dau-nha",
    createdAt: new Date("2024-08-02T09:00:00Z"),
    author: "1", // user2
    shares: ["652c02b2fc13ae1c41000016"],
    likes: ["652c02b2fc13ae1c41000013"],
    comments: [
      { text: "Tự làm à? Tuyệt quá!", user: "652c02b2fc13ae1c41000014" },
      { text: "Phải thử thôi", user: "652c02b2fc13ae1c41000015" },
    ],
    location: "Sài Gòn, Việt Nam",
    privacy: {
      type: "public",
      allowedUsers: [],
    },
  },
];

const Home = () => {
  const [isSelect, setIsSelect] = useState("home");

  const handleSearch = () => {
    setIsSelect("searchHome");
  };

  const handleAddPost = () => {
    setIsSelect("addPost");
  };

  const handleClose = () => {
    setIsSelect("home");
  };

  const switchSreen = () => {
    switch (isSelect) {
      case "searchHome":
        return <SearchHome onClose={handleClose} />;
      case "addPost":
        return <AddPost onClose={handleClose} />;
      default:
        return (
          <FlatList
            data={fakePostData} // Dữ liệu chính sẽ được cung cấp ở đây
            keyExtractor={(item) => item._id}
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
              flex: 1,
            }}
            className="p-3"
            ListHeaderComponent={
              <>
                <View
                  className={`flex flex-row items-center ${
                    colorScheme === "dark" ? "dark:bg-dark-300" : "bg-light-700"
                  }`}
                >
                  <Text
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[100]
                          : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                      flex: 1,
                    }}
                    className={`text-[24px] font-jsemibold `}
                  >
                    Min
                    <Text className="text-[24px] font-semibold text-primary-100">
                      gle
                    </Text>
                  </Text>
                  <View className="ml-auto flex flex-row">
                    <SearchIcon
                      size={27}
                      color={iconColor}
                      onPress={handleSearch}
                    />
                    <Text className="mx-2"></Text>
                    <MessageIcon size={27} color={iconColor} />
                  </View>
                </View>

                <View
                  className={`h-auto w-full rounded-lg px-2 py-4 ${
                    colorScheme === "dark" ? "bg-dark-300" : "bg-light-700"
                  }`}
                >
                  <View className="flex flex-row items-center px-4 py-1">
                    <View className="h-[40px] w-[40px] overflow-hidden rounded-full">
                      <Image
                        source={require("../../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg")}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                      />
                    </View>
                    <TextInput
                      placeholder="Share something..."
                      placeholderTextColor="#D9D9D9"
                      className={`ml-3 flex-1 h-[40px] text-[#D9D9D9] font-mregular px-4 rounded-full text-sm ${
                        colorScheme === "dark" ? "bg-dark-200" : "bg-light-600"
                      }`}
                      onPress={handleAddPost}
                    />
                  </View>

                  <View className="mt-3 flex flex-row justify-around">
                    <View className="flex flex-row items-center">
                      <PictureIcon size={20} color={iconColor} />
                      <Text className="ml-2 text-sm text-primary-100 font-mregular">
                        Image
                      </Text>
                    </View>
                    <View className="flex flex-row items-center">
                      <VideoIcon size={22} color={iconColor} />
                      <Text className="ml-2 text-sm text-primary-100 font-mregular">
                        Video
                      </Text>
                    </View>
                    <View className="flex flex-row items-center">
                      <EmotionIcon size={20} color={iconColor} />
                      <Text className="ml-2 text-sm text-primary-100 font-mregular">
                        Emotion
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    height: 1,
                    backgroundColor: "#D9D9D9",
                    width: "100%",
                    marginVertical: 5,
                  }}
                />
              </>
            }
            renderItem={({ item }) => (
              <View className="p-4 bg-transparent mb-4">
                <View className="flex-row items-center mb-2">
                  <Image
                    source={
                      fakeUsers.find((user) => user._id === item.author)
                        ?.userAvatar
                    }
                    className="w-10 h-10 rounded-full"
                  />
                  <View className="ml-4">
                    <Text
                      style={{
                        color:
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[500],
                      }}
                      className="font-msemibold text-[17px] "
                    >
                      {
                        fakeUsers.find((user) => user._id === item.author)
                          ?.userName
                      }
                    </Text>
                    <Text className="text-[#D9D9D9] font-mregular mt-1 text-sm">
                      {item.createdAt.toDateString()}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500], // Sử dụng giá trị màu từ file colors.js
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
                    keyExtractor={(media) => media}
                    renderItem={({ item: mediaId }) => {
                      const media = fakeMediaData.find(
                        (m) => m._id === mediaId
                      );
                      if (!media) return null;
                      return (
                        <View className="mr-2">
                          {media.type === "image" ? (
                            <Image
                              source={media.url}
                              className="w-96 h-96 rounded-lg"
                            />
                          ) : (
                            <View className="w-40 h-40 bg-gray-200 rounded-lg justify-center items-center">
                              <Text>Video</Text>
                            </View>
                          )}
                        </View>
                      );
                    }}
                  />
                )}

                <View className="flex-row mt-2 justify-around">
                  <TouchableOpacity className="flex-row items-center mr-4">
                    <LikeIcon size={25} color={iconColor} />
                    <Text
                      className="ml-1 text-gray-700"
                      style={{
                        color:
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[500],
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
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[500],
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
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[500],
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
            )}
          />
        );
    }
  };

  const SearchIcon = ({ size = 24, color, onPress }) => {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 256 256"
        fill="none"
        onPress={onPress}
      >
        <Path
          d="M229.66 218.34l-50.07-50.06a88.11 88.11 0 1 0-11.31 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32M40 112a72 72 0 1 1 72 72a72.08 72.08 0 0 1-72-72"
          fill={color}
        />
      </Svg>
    );
  };

  const MessageIcon = ({ size = 24, color }) => {
    return (
      <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
        <Path
          fill={color}
          d="M464 512a48 48 0 1 0 96 0a48 48 0 1 0-96 0m200 0a48 48 0 1 0 96 0a48 48 0 1 0-96 0m-400 0a48 48 0 1 0 96 0a48 48 0 1 0-96 0m661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.4 444.4 0 0 0-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.4 445.4 0 0 0-142 96.5c-40.9 41.3-73 89.3-95.2 142.8c-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 0 0 112 714v152a46 46 0 0 0 46 46h152.1A449.4 449.4 0 0 0 510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.5 444.5 0 0 0 142.8-95.2c41.3-40.9 73.8-88.7 96.5-142c23.6-55.2 35.6-113.9 35.9-174.5c.3-60.9-11.5-120-34.8-175.6m-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8c69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9c44.6 18.7 84.6 45.6 119 80c34.3 34.3 61.3 74.4 80 119c19.4 46.2 29.1 95.2 28.9 145.8c-.6 99.6-39.7 192.9-110.1 262.7"
        />
      </Svg>
    );
  };

  const PictureIcon = ({ size = 16, color }) => {
    return (
      <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
        <Path
          fill={color}
          d="M512 128a384 384 0 1 0 0 768a384 384 0 0 0 0-768m0-64a448 448 0 1 1 0 896a448 448 0 0 1 0-896"
        />
        <Path
          fill={color}
          d="M640 288q64 0 64 64t-64 64t-64-64t64-64M214.656 790.656l-45.312-45.312l185.664-185.6a96 96 0 0 1 123.712-10.24l138.24 98.688a32 32 0 0 0 39.872-2.176L906.688 422.4l42.624 47.744L699.52 693.696a96 96 0 0 1-119.808 6.592l-138.24-98.752a32 32 0 0 0-41.152 3.456l-185.664 185.6z"
        />
      </Svg>
    );
  };

  const VideoIcon = ({ size = 24, color }) => {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect
          width="13.5"
          height="12"
          x="2.75"
          y="6"
          rx="3.5"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <Path
          d="M16.25 9.74l3.554-1.77a1 1 0 0 1 1.446.895v6.268a1 1 0 0 1-1.447.895l-3.553-1.773z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </Svg>
    );
  };

  const EmotionIcon = ({ size = 48, color = "currentColor" }) => {
    return (
      <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <Path
          d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Z"
          stroke={color}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <Path
          d="M31 18v1m-14-1v1m14 12s-2 4-7 4-7-4-7-4"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  };

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

  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  return (
    // <FlatList
    //   data={fakePostData} // Dữ liệu chính sẽ được cung cấp ở đây
    //   keyExtractor={(item) => item._id}
    //   style={{
    //     backgroundColor:
    //       colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
    //     flex: 1,
    //   }}
    //   className="p-3"
    //   ListHeaderComponent={
    //     <>
    //       <View
    //         className={`flex flex-row items-center ${
    //           colorScheme === "dark" ? "dark:bg-dark-300" : "bg-light-700"
    //         }`}
    //       >
    //         <Text
    //           style={{
    //             color:
    //               colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
    //             flex: 1,
    //           }}
    //           className={`text-[24px] font-jsemibold `}
    //         >
    //           Min
    //           <Text className="text-[24px] font-semibold text-primary-100">
    //             gle
    //           </Text>
    //         </Text>
    //         <View className="ml-auto flex flex-row">
    //           <SearchIcon size={27} color={iconColor} onPress={handleSearch} />
    //           <Text className="mx-2"></Text>
    //           <MessageIcon size={27} color={iconColor} />
    //         </View>
    //       </View>

    //       <TouchableOpacity
    //         className={`h-auto w-full rounded-lg px-2 py-4 ${
    //           colorScheme === "dark" ? "bg-dark-300" : "bg-light-700"
    //         }`}
    //       >
    //         <View className="flex flex-row items-center px-4 py-1">
    //           <View className="h-[40px] w-[40px] overflow-hidden rounded-full">
    //             <Image
    //               source={require("../../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg")}
    //               style={{ width: 40, height: 40, borderRadius: 20 }}
    //             />
    //           </View>
    //           <TextInput
    //             placeholder="Share something..."
    //             placeholderTextColor="#D9D9D9"
    //             className={`ml-3 flex-1 h-[40px] text-[#D9D9D9] font-mregular px-4 rounded-full text-sm ${
    //               colorScheme === "dark" ? "bg-dark-200" : "bg-light-600"
    //             }`}
    //             editable={false}
    //           />
    //         </View>

    //         <View className="mt-3 flex flex-row justify-around">
    //           <View className="flex flex-row items-center">
    //             <PictureIcon size={20} color={iconColor} />
    //             <Text className="ml-2 text-sm text-primary-100 font-mregular">
    //               Image
    //             </Text>
    //           </View>
    //           <View className="flex flex-row items-center">
    //             <VideoIcon size={22} color={iconColor} />
    //             <Text className="ml-2 text-sm text-primary-100 font-mregular">
    //               Video
    //             </Text>
    //           </View>
    //           <View className="flex flex-row items-center">
    //             <EmotionIcon size={20} color={iconColor} />
    //             <Text className="ml-2 text-sm text-primary-100 font-mregular">
    //               Emotion
    //             </Text>
    //           </View>
    //         </View>
    //       </TouchableOpacity>

    //       <View
    //         style={{
    //           height: 1,
    //           backgroundColor: "#D9D9D9",
    //           width: "100%",
    //           marginVertical: 5,
    //         }}
    //       />
    //     </>
    //   }
    //   renderItem={({ item }) => (
    //     <View className="p-4 bg-transparent mb-4">
    //       <View className="flex-row items-center mb-2">
    //         <Image
    //           source={
    //             fakeUsers.find((user) => user._id === item.author)?.userAvatar
    //           }
    //           className="w-10 h-10 rounded-full"
    //         />
    //         <View className="ml-4">
    //           <Text
    //             style={{
    //               color:
    //                 colorScheme === "dark"
    //                   ? colors.dark[100]
    //                   : colors.light[500],
    //             }}
    //             className="font-msemibold text-[17px] "
    //           >
    //             {fakeUsers.find((user) => user._id === item.author)?.userName}
    //           </Text>
    //           <Text className="text-[#D9D9D9] font-mregular mt-1 text-sm">
    //             {item.createdAt.toDateString()}
    //           </Text>
    //         </View>
    //       </View>

    //       <Text
    //         style={{
    //           color:
    //             colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
    //           flex: 1,
    //         }}
    //         className="mb-4 font-mregular mt-3 text-[15px]"
    //       >
    //         {item.content}
    //       </Text>

    //       {item.media && (
    //         <FlatList
    //           data={item.media}
    //           horizontal
    //           keyExtractor={(media) => media}
    //           renderItem={({ item: mediaId }) => {
    //             const media = fakeMediaData.find((m) => m._id === mediaId);
    //             if (!media) return null;
    //             return (
    //               <View className="mr-2">
    //                 {media.type === "image" ? (
    //                   <Image
    //                     source={media.url}
    //                     className="w-96 h-96 rounded-lg"
    //                   />
    //                 ) : (
    //                   <View className="w-40 h-40 bg-gray-200 rounded-lg justify-center items-center">
    //                     <Text>Video</Text>
    //                   </View>
    //                 )}
    //               </View>
    //             );
    //           }}
    //         />
    //       )}

    //       <View className="flex-row mt-2 justify-around">
    //         <TouchableOpacity className="flex-row items-center mr-4">
    //           <LikeIcon size={25} color={iconColor} />
    //           <Text
    //             className="ml-1 text-gray-700"
    //             style={{
    //               color:
    //                 colorScheme === "dark"
    //                   ? colors.dark[100]
    //                   : colors.light[500],
    //             }}
    //           >
    //             {item.likes.length} Likes
    //           </Text>
    //         </TouchableOpacity>

    //         <TouchableOpacity className="flex-row items-center mr-4">
    //           <CommentIcon size={25} color={iconColor} />
    //           <Text
    //             className="ml-1 text-gray-700"
    //             style={{
    //               color:
    //                 colorScheme === "dark"
    //                   ? colors.dark[100]
    //                   : colors.light[500],
    //             }}
    //           >
    //             {item.comments.length} Comments
    //           </Text>
    //         </TouchableOpacity>

    //         <TouchableOpacity className="flex-row items-center">
    //           <ShareIcon size={25} color={iconColor} />
    //           <Text
    //             className="ml-1 text-gray-700"
    //             style={{
    //               color:
    //                 colorScheme === "dark"
    //                   ? colors.dark[100]
    //                   : colors.light[500],
    //             }}
    //           >
    //             {item.shares.length} Shares
    //           </Text>
    //         </TouchableOpacity>
    //       </View>
    //       <View
    //         style={{
    //           height: 1,
    //           backgroundColor: "#D9D9D9",
    //           width: "100%",
    //           marginVertical: 5,
    //         }}
    //         className="mt-5"
    //       />
    //     </View>
    //   )}
    // />
    // <>
    //   {isSearch ? (
    //     <SearchHome onClose={handleCloseSearch} />
    //   ) : (
    //     <FlatList
    //       data={fakePostData} // Dữ liệu chính sẽ được cung cấp ở đây
    //       keyExtractor={(item) => item._id}
    //       style={{
    //         backgroundColor:
    //           colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
    //         flex: 1,
    //       }}
    //       className="p-3"
    //       ListHeaderComponent={
    //         <>
    //           <View
    //             className={`flex flex-row items-center ${
    //               colorScheme === "dark" ? "dark:bg-dark-300" : "bg-light-700"
    //             }`}
    //           >
    //             <Text
    //               style={{
    //                 color:
    //                   colorScheme === "dark"
    //                     ? colors.dark[100]
    //                     : colors.light[500], // Sử dụng giá trị màu từ file colors.js
    //                 flex: 1,
    //               }}
    //               className={`text-[24px] font-jsemibold `}
    //             >
    //               Min
    //               <Text className="text-[24px] font-semibold text-primary-100">
    //                 gle
    //               </Text>
    //             </Text>
    //             <View className="ml-auto flex flex-row">
    //               <SearchIcon
    //                 size={27}
    //                 color={iconColor}
    //                 onPress={handleSearch}
    //               />
    //               <Text className="mx-2"></Text>
    //               <MessageIcon size={27} color={iconColor} />
    //             </View>
    //           </View>

    //           <TouchableOpacity
    //             className={`h-auto w-full rounded-lg px-2 py-4 ${
    //               colorScheme === "dark" ? "bg-dark-300" : "bg-light-700"
    //             }`}
    //           >
    //             <View className="flex flex-row items-center px-4 py-1">
    //               <View className="h-[40px] w-[40px] overflow-hidden rounded-full">
    //                 <Image
    //                   source={require("../../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg")}
    //                   style={{ width: 40, height: 40, borderRadius: 20 }}
    //                 />
    //               </View>
    //               <TextInput
    //                 placeholder="Share something..."
    //                 placeholderTextColor="#D9D9D9"
    //                 className={`ml-3 flex-1 h-[40px] text-[#D9D9D9] font-mregular px-4 rounded-full text-sm ${
    //                   colorScheme === "dark" ? "bg-dark-200" : "bg-light-600"
    //                 }`}
    //                 editable={false}
    //               />
    //             </View>

    //             <View className="mt-3 flex flex-row justify-around">
    //               <View className="flex flex-row items-center">
    //                 <PictureIcon size={20} color={iconColor} />
    //                 <Text className="ml-2 text-sm text-primary-100 font-mregular">
    //                   Image
    //                 </Text>
    //               </View>
    //               <View className="flex flex-row items-center">
    //                 <VideoIcon size={22} color={iconColor} />
    //                 <Text className="ml-2 text-sm text-primary-100 font-mregular">
    //                   Video
    //                 </Text>
    //               </View>
    //               <View className="flex flex-row items-center">
    //                 <EmotionIcon size={20} color={iconColor} />
    //                 <Text className="ml-2 text-sm text-primary-100 font-mregular">
    //                   Emotion
    //                 </Text>
    //               </View>
    //             </View>
    //           </TouchableOpacity>

    //           <View
    //             style={{
    //               height: 1,
    //               backgroundColor: "#D9D9D9",
    //               width: "100%",
    //               marginVertical: 5,
    //             }}
    //           />
    //         </>
    //       }
    //       renderItem={({ item }) => (
    //         <View className="p-4 bg-transparent mb-4">
    //           <View className="flex-row items-center mb-2">
    //             <Image
    //               source={
    //                 fakeUsers.find((user) => user._id === item.author)
    //                   ?.userAvatar
    //               }
    //               className="w-10 h-10 rounded-full"
    //             />
    //             <View className="ml-4">
    //               <Text
    //                 style={{
    //                   color:
    //                     colorScheme === "dark"
    //                       ? colors.dark[100]
    //                       : colors.light[500],
    //                 }}
    //                 className="font-msemibold text-[17px] "
    //               >
    //                 {
    //                   fakeUsers.find((user) => user._id === item.author)
    //                     ?.userName
    //                 }
    //               </Text>
    //               <Text className="text-[#D9D9D9] font-mregular mt-1 text-sm">
    //                 {item.createdAt.toDateString()}
    //               </Text>
    //             </View>
    //           </View>

    //           <Text
    //             style={{
    //               color:
    //                 colorScheme === "dark"
    //                   ? colors.dark[100]
    //                   : colors.light[500], // Sử dụng giá trị màu từ file colors.js
    //               flex: 1,
    //             }}
    //             className="mb-4 font-mregular mt-3 text-[15px]"
    //           >
    //             {item.content}
    //           </Text>

    //           {item.media && (
    //             <FlatList
    //               data={item.media}
    //               horizontal
    //               keyExtractor={(media) => media}
    //               renderItem={({ item: mediaId }) => {
    //                 const media = fakeMediaData.find((m) => m._id === mediaId);
    //                 if (!media) return null;
    //                 return (
    //                   <View className="mr-2">
    //                     {media.type === "image" ? (
    //                       <Image
    //                         source={media.url}
    //                         className="w-96 h-96 rounded-lg"
    //                       />
    //                     ) : (
    //                       <View className="w-40 h-40 bg-gray-200 rounded-lg justify-center items-center">
    //                         <Text>Video</Text>
    //                       </View>
    //                     )}
    //                   </View>
    //                 );
    //               }}
    //             />
    //           )}

    //           <View className="flex-row mt-2 justify-around">
    //             <TouchableOpacity className="flex-row items-center mr-4">
    //               <LikeIcon size={25} color={iconColor} />
    //               <Text
    //                 className="ml-1 text-gray-700"
    //                 style={{
    //                   color:
    //                     colorScheme === "dark"
    //                       ? colors.dark[100]
    //                       : colors.light[500],
    //                 }}
    //               >
    //                 {item.likes.length} Likes
    //               </Text>
    //             </TouchableOpacity>

    //             <TouchableOpacity className="flex-row items-center mr-4">
    //               <CommentIcon size={25} color={iconColor} />
    //               <Text
    //                 className="ml-1 text-gray-700"
    //                 style={{
    //                   color:
    //                     colorScheme === "dark"
    //                       ? colors.dark[100]
    //                       : colors.light[500],
    //                 }}
    //               >
    //                 {item.comments.length} Comments
    //               </Text>
    //             </TouchableOpacity>

    //             <TouchableOpacity className="flex-row items-center">
    //               <ShareIcon size={25} color={iconColor} />
    //               <Text
    //                 className="ml-1 text-gray-700"
    //                 style={{
    //                   color:
    //                     colorScheme === "dark"
    //                       ? colors.dark[100]
    //                       : colors.light[500],
    //                 }}
    //               >
    //                 {item.shares.length} Shares
    //               </Text>
    //             </TouchableOpacity>
    //           </View>
    //           <View
    //             style={{
    //               height: 1,
    //               backgroundColor: "#D9D9D9",
    //               width: "100%",
    //               marginVertical: 5,
    //             }}
    //             className="mt-5"
    //           />
    //         </View>
    //       )}
    //     />
    //   )}
    // </>
    <>{switchSreen()}</>
  );
};

export default Home;
