import React, { useState } from "react";
import MyButton from "../share/MyButton";
import Svg, { Path } from "react-native-svg";
import { View, Text, FlatList, Image, Keyboard } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import MyInput from "../share/MyInput";
import UserCard from "./UserCard";
import PostCard from "./PostCard";

const BackIcon = ({ size = 24, color = "black", onPress }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      onPress={onPress}
    >
      <Path
        fill={color}
        d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z"
      />
    </Svg>
  );
};

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

const SearchHome = ({ onClose }) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isClickSearch, setIsClickSearch] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [isActiveTab, setIsActiveTab] = useState("");

  const handleSearch = () => {
    // Thực hiện tìm kiếm và hiển thị kết quả
    const userResults = fakeUsers.filter((user) =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Tìm kiếm các bài viết của người dùng đã tìm thấy
    const postResults = fakePostData.filter(
      (post) =>
        userResults.some((user) => user._id === post.author) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const combinedResults = [...userResults, ...postResults];

    setSearchResults(combinedResults);
    setSuggestions([]); // Xóa gợi ý khi tìm kiếm
    setIsClickSearch(true);
    setNoResults(combinedResults.length === 0);
  };

  const handleInputChange = (text) => {
    setSearchTerm(text);
    if (text) {
      // Lọc người dùng theo tên
      const filteredUsers = fakeUsers.filter((user) =>
        user.userName.toLowerCase().includes(text.toLowerCase())
      );

      // Cập nhật gợi ý với người dùng đã lọc
      setSuggestions(filteredUsers);
    } else {
      setSuggestions([]);
      setSearchResults([]); // Xóa kết quả tìm kiếm nếu không có input
    }
    setNoResults(false);
  };

  const handleSubmitEditing = () => {
    // Khi nhấn nút "OK" trên bàn phím
    handleSearch();
    Keyboard.dismiss(); // Đóng bàn phím
  };

  const renderResults = () => {
    if (isClickSearch) {
      // Chỉ hiển thị kết quả khi nhấn nút "OK"
      if (isActiveTab === "") {
        // Gộp kết quả người dùng và bài viết
        return (
          <FlatList
            showsVerticalScrollIndicator={false} // Ẩn scrollbar dọc
            showsHorizontalScrollIndicator={false} // Ẩn scrollbar ngang
            data={searchResults}
            keyExtractor={(item) =>
              item._id.toString() + (item.userName ? "-user" : "-post")
            }
            ListHeaderComponent={renderHeader} // Sử dụng component tiêu đề
            renderItem={({ item, index }) => {
              const isLastUserCard =
                index > 0 &&
                searchResults[index - 1].userName &&
                !item.userName;
              const isFirstPostCard =
                index > 0 && !searchResults[index - 1].userName && item.content; // Kiểm tra nếu đây là PostCard đầu tiên

              if (item.userName) {
                // Nếu là người dùng, hiển thị UserCard
                return (
                  <UserCard
                    item={item}
                    actionButton="Chấp nhận"
                    isLoiMoi={false}
                  />
                );
              } else if (item.content) {
                // Nếu là bài viết, hiển thị PostCard
                return (
                  <View>
                    {isLastUserCard && (
                      // Ngăn cách giữa UserCard cuối cùng và PostCard đầu tiên
                      <View
                        style={{
                          height: 2,
                          backgroundColor: "#f0f0f0",
                          paddingBottom: 1,
                        }}
                      />
                    )}
                    <PostCard
                      item={item}
                      actionButton="Chấp nhận"
                      isFirstPost={isFirstPostCard ? true : false}
                    />
                  </View>
                );
              }
              return null; // Nếu không có kiểu phù hợp
            }}
          />
        );
      }
      // Hiển thị kết quả theo tab được chọn
      if (isActiveTab === "user") {
        return (
          <FlatList
            ListHeaderComponent={renderHeader} // Sử dụng component tiêu đề
            showsVerticalScrollIndicator={false} // Ẩn scrollbar dọc
            showsHorizontalScrollIndicator={false} // Ẩn scrollbar ngang
            data={searchResults.filter((item) => item.userName)}
            keyExtractor={(item) => item._id.toString() + "-user"}
            renderItem={({ item }) => (
              <UserCard item={item} actionButton="Chấp nhận" isLoiMoi={false} />
            )}
          />
        );
      }
      if (isActiveTab === "post") {
        return (
          <FlatList
            ListHeaderComponent={renderHeader} // Sử dụng component tiêu đề
            showsVerticalScrollIndicator={false} // Ẩn scrollbar dọc
            showsHorizontalScrollIndicator={false} // Ẩn scrollbar ngang
            data={searchResults.filter((item) => item.content)}
            keyExtractor={(item) => item._id.toString() + "-post"}
            renderItem={({ item }) => (
              <PostCard item={item} actionButton="Chấp nhận" isLoiMoi={true} />
            )}
          />
        );
      }

      return null; // Trả về null nếu không có tab nào được chọn
    }
  };
  const renderHeader = () => (
    <View
      className="w-full "
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
    >
      <View
        className="flex flex-row gap-4 pb-2 "
        style={{
          backgroundColor:
            colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
          flex: 1,
        }}
      >
        <View>
          <MyButton
            title="Tất cả"
            onPress={() => setIsActiveTab("")}
            paddingLeft={20}
            paddingRight={20}
            width={100}
            height={40}
            borderRadius={30}
            fontSize={16}
            isShadow={true}
            isActive={isActiveTab === ""}
            backgroundColor={
              isActiveTab === ""
                ? colors.primary[100]
                : colorScheme === "dark"
                ? colors.dark[200]
                : colors.light[600]
            }
            titleStyle={{
              color:
                isActiveTab === ""
                  ? colors.light[100] // Màu chữ khi active
                  : colorScheme === "dark"
                  ? colors.light[300] // Màu chữ khi dark mode và không active
                  : colors.dark[700], // Màu chữ khi light mode và không active
            }}
          />
          {/* <MyButton
            title="Tất cả"
            onPress={() => setIsActiveTab("")}
            paddingLeft={20}
            paddingRight={20}
            width={90}
            height={40}
            borderRadius={30}
            fontSize={16}
            isShadow
            isActive={isActiveTab === ""}
          /> */}
        </View>
        <View>
          <MyButton
            title="Người dùng"
            onPress={() => setIsActiveTab("user")}
            paddingLeft={20}
            paddingRight={20}
            width={140}
            height={40}
            borderRadius={30}
            fontSize={16}
            isShadow={true}
            isActive={isActiveTab === "user"}
            backgroundColor={
              isActiveTab === "user"
                ? colors.primary[100]
                : colorScheme === "dark"
                ? colors.dark[200]
                : colors.light[600]
            }
            titleStyle={{
              color:
                isActiveTab === "user"
                  ? colors.light[100] // Màu chữ khi active
                  : colorScheme === "dark"
                  ? colors.light[300] // Màu chữ khi dark mode và không active
                  : colors.dark[700], // Màu chữ khi light mode và không active
            }}
          />
        </View>
        <View className="flex-1">
          <MyButton
            title="Bài viết"
            onPress={() => setIsActiveTab("post")}
            paddingLeft={20}
            paddingRight={20}
            width={100}
            height={40}
            borderRadius={30}
            fontSize={16}
            isShadow={true}
            isActive={isActiveTab === "post"}
            backgroundColor={
              isActiveTab === "post"
                ? colors.primary[100]
                : colorScheme === "dark"
                ? colors.dark[200]
                : colors.light[600]
            }
            titleStyle={{
              color:
                isActiveTab === "post"
                  ? colors.light[100] // Màu chữ khi active
                  : colorScheme === "dark"
                  ? colors.light[300] // Màu chữ khi dark mode và không active
                  : colors.dark[700], // Màu chữ khi light mode và không active
            }}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View
      className="w-full h-full flex flex-col p-4 bg-white"
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
    >
      <View className="w-full  ">
        <View className="w-full flex flex-row items-center gap-4 ">
          <View>
            <BackIcon size={24} color={iconColor} onPress={onClose} />
          </View>
          <View className="flex-1">
            <MyInput
              placeholder={"Tìm kiếm"}
              value={searchTerm}
              onChangeText={handleInputChange}
              onSubmit={handleSubmitEditing}
            />
          </View>
        </View>
      </View>

      {suggestions.length > 0 && (
        <View
          className="mt-4 bg-gray-200 rounded-lg p-2"
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[200] : colors.light[600], // Sử dụng giá trị màu từ file colors.js
            flex: 1,
          }}
        >
          <FlatList
            showsVerticalScrollIndicator={false} // Ẩn scrollbar dọc
            showsHorizontalScrollIndicator={false} // Ẩn scrollbar ngang
            data={suggestions}
            keyExtractor={(item) => item._id} // Change this line
            renderItem={({ item }) => (
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors["title-pink"],
                }}
                className="py-2 px-4 hover:bg-gray-300"
                onPress={() => {
                  setSearchTerm(item.userName);
                  setSuggestions([]);
                  setNoResults(false);
                }}
              >
                {item.userName}
              </Text>
            )}
          />
        </View>
      )}
      {isClickSearch && noResults ? (
        <View className="mt-4 w-full">
          <Image
            source={require("../../assets/images/CannotFound.png")}
            style={{ width: 350, height: 342 }}
            resizeMode="contain"
          />
          <Text className="mt-4 text-center">
            Không tìm thấy người dùng với tên{" "}
            <Text className="font-msemibold">{searchTerm}</Text>
          </Text>
        </View>
      ) : (
        searchResults.length > 0 &&
        isClickSearch && (
          <View className="mt-4 w-full">
            {/* <View className="w-full ">
              <View className="flex flex-row gap-4 pb-2 ">
                <View>
                  <MyButton
                    title="Tất cả"
                    onPress={() => setIsActiveTab("")}
                    paddingLeft={20}
                    paddingRight={20}
                    width={90}
                    height={40}
                    borderRadius={30}
                    fontSize={16}
                    isShadow
                    isActive={isActiveTab === ""}
                  />
                </View>
                <View>
                  <MyButton
                    title="Người dùng"
                    onPress={() => setIsActiveTab("user")}
                    paddingLeft={20}
                    paddingRight={20}
                    width={140}
                    height={40}
                    borderRadius={30}
                    fontSize={16}
                    isShadow
                    isActive={isActiveTab === "user"}
                  />
                </View>
                <View className="flex-1">
                  <MyButton
                    title="Bài viết"
                    onPress={() => setIsActiveTab("post")}
                    paddingLeft={20}
                    paddingRight={20}
                    width={100}
                    height={40}
                    borderRadius={30}
                    fontSize={16}
                    isShadow
                    isActive={isActiveTab === "post"}
                  />
                </View>
              </View>
            </View> */}

            {renderResults()}
          </View>
        )
      )}
    </View>
  );
};

export default SearchHome;
