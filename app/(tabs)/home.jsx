import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors"; // import màu sắc từ file colors.js
import SearchHome from "../../components/home-component/SearchHome";
import AddPost from "@/components/home-component/AddPost";
import { Link } from "expo-router";
import {
  SearchIcon,
  MessageIcon,
  PictureIcon,
  VideoIcon,
  EmotionIcon,
  LikeIcon,
  CommentIcon,
  ShareIcon,
} from "../../components/icons/Icons";
import { fetchPosts, getAllPost } from "@/lib/service/post.service";

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
    _id: "652c02b2fc13ae1c410000122",
    content: "Thử làm bún đậu tại nhà",
    media: ["652c02b2fc13ae1c41000010"],
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
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
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

  const fetchData = async () => {
    try {
      const data = await fetchPosts();
      console.log("Fetched posts:", data);
      setPosts(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  const switchSreen = () => {
    switch (isSelect) {
      case "searchHome":
        return <SearchHome onClose={handleClose} />;
      case "addPost":
        return <AddPost onClose={handleClose} />;
      default:
        return (
          <FlatList
            data={fakePostData}
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
                          : colors.light[500],
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
                    <TouchableOpacity onPress={handleSearch}>
                      <SearchIcon size={27} color={iconColor} />
                    </TouchableOpacity>

                    <Text className="mx-2"></Text>
                    <TouchableOpacity>
                      <Link href="/message">
                        <MessageIcon size={27} color={iconColor} />
                      </Link>
                    </TouchableOpacity>
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
