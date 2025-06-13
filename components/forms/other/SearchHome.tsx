import React, { useState } from "react";
import MyButton from "../../shared/ui/MyButton";
import Svg, { Path } from "react-native-svg";
import {
  View,
  Text,
  FlatList,
  Image,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { colors } from "../../../styles/colors";
import PostCard from "../../card/post/PostCard";
import { fetchUsers } from "@/lib/service/user.service";
import { fetchPosts, getPostByPostId } from "@/lib/service/post.service";
import UserCard from "../../card/user/UserCard";
import MyInput from "../../shared/ui/MyInput";
import { ArrowIcon } from "../../shared/icons/Icons";

const SearchHome = ({ onClose }: any) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isClickSearch, setIsClickSearch] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [isActiveTab, setIsActiveTab] = useState("");
  const [usersData, setUsersData] = useState<any[]>([]);

  const handleSearch = async () => {
    try {
      const users = await fetchUsers();
      setUsersData(users);
      const userResults = users.filter(
        (user) =>
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const posts = await fetchPosts();

      const postsData = await Promise.all(
        posts.map(async (post: any) => {
          const postDetails = await getPostByPostId(post._id);
          return postDetails;
        })
      );

      const postResults = postsData.filter(
        (post) =>
          userResults.some((user) => user?._id === post.author?._id) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const combinedResults = [...userResults, ...postResults];

      setSearchResults(combinedResults);
      setSuggestions([]);
      setIsClickSearch(true);
      setNoResults(combinedResults.length === 0);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleInputChange = (text: any) => {
    setSearchTerm(text);
    if (text) {
      const filteredUsers = usersData.filter(
        (user) =>
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSuggestions(filteredUsers);
    } else {
      setSuggestions([]);
      setSearchResults([]);
    }
    setNoResults(false);
  };

  const handleSubmitEditing = () => {
    handleSearch();
    Keyboard.dismiss();
  };

  const renderResults = () => {
    if (isClickSearch) {
      if (isActiveTab === "") {
        return (
          <FlatList
            showsVerticalScrollIndicator={false} // Ẩn scrollbar dọc
            showsHorizontalScrollIndicator={false} // Ẩn scrollbar ngang
            data={searchResults}
            keyExtractor={(item) =>
              item?._id.toString() + (item.lastName ? "-user" : "-post")
            }
            ListHeaderComponent={renderHeader}
            renderItem={({ item, index }) => {
              const isLastUserCard =
                index > 0 &&
                searchResults[index - 1].lastName &&
                !item.lastName;
              const isFirstPostCard =
                index > 0 &&
                !searchResults[index - 1].author?._id &&
                item.content; // Kiểm tra nếu đây là PostCard đầu tiên

              if (item.lastName) {
                return <UserCard item={item} />;
              } else if (item.content) {
                return (
                  <View>
                    {isLastUserCard && (
                      <View
                        style={{
                          height: 2,
                          backgroundColor: "#f0f0f0",
                          paddingBottom: 1,
                        }}
                      />
                    )}
                    <PostCard item={item} />
                  </View>
                );
              }
              return null;
            }}
          />
        );
      }
      if (isActiveTab === "user") {
        return (
          <FlatList
            ListHeaderComponent={renderHeader} // Sử dụng component tiêu đề
            showsVerticalScrollIndicator={false} // Ẩn scrollbar dọc
            showsHorizontalScrollIndicator={false} // Ẩn scrollbar ngang
            data={searchResults.filter((item) => item.lastName)}
            keyExtractor={(item) => item?._id.toString() + "-user"}
            renderItem={({ item }) => <UserCard item={item} />}
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
            keyExtractor={(item) => item?._id.toString() + "-post"}
            renderItem={({ item }) => <PostCard item={item} />}
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
        className="flex flex-row gap-3 pb-2 mt-2 mb-2"
        style={{
          backgroundColor:
            colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
          flex: 1,
        }}
      >
        <View className="w-14">
          <TouchableOpacity
            className="mx-auto"
            onPress={() => setIsActiveTab("")}
          >
            <Text
              style={{
                fontSize: 16,

                color:
                  isActiveTab === ""
                    ? colors.primary[100] // màu chữ khi active
                    : colorScheme === "dark"
                      ? colors.dark[100] // màu chữ khi không active và trong dark mode
                      : colors.light[500], // màu chữ khi không active và trong light mode
                borderBottomWidth: isActiveTab === "" ? 2 : 0, // đường viền dưới khi active
                borderBottomColor:
                  isActiveTab === "" ? colors.primary[100] : "transparent", // màu đường viền dưới
              }}
              className="text-[16px] font-mregular "
            >
              All
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-14">
          <TouchableOpacity
            className="mx-auto"
            onPress={() => setIsActiveTab("user")}
          >
            <Text
              style={{
                fontSize: 16,

                color:
                  isActiveTab === "user"
                    ? colors.primary[100] // màu chữ khi active
                    : colorScheme === "dark"
                      ? colors.dark[100] // màu chữ khi không active và trong dark mode
                      : colors.light[500], // màu chữ khi không active và trong light mode
                borderBottomWidth: isActiveTab === "user" ? 2 : 0, // đường viền dưới khi active
                borderBottomColor:
                  isActiveTab === "user" ? colors.primary[100] : "transparent", // màu đường viền dưới
              }}
              className="text-[14px] font-mregular "
            >
              User
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-14 mx-auto">
          <TouchableOpacity
            className="mx-auto"
            onPress={() => setIsActiveTab("post")}
          >
            <Text
              style={{
                fontSize: 16,

                color:
                  isActiveTab === "post"
                    ? colors.primary[100] // màu chữ khi active
                    : colorScheme === "dark"
                      ? colors.dark[100] // màu chữ khi không active và trong dark mode
                      : colors.light[500], // màu chữ khi không active và trong light mode
                borderBottomWidth: isActiveTab === "post" ? 2 : 0, // đường viền dưới khi active
                borderBottomColor:
                  isActiveTab === "post" ? colors.primary[100] : "transparent", // màu đường viền dưới
              }}
              className="text-[14px] font-mregular "
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View
      className="w-full h-full flex flex-col p-4 pt-12"
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
    >
      <View className="w-full  ">
        <View className="w-full flex flex-row items-center gap-4 ">
          <TouchableOpacity onPress={onClose}>
            <ArrowIcon size={28} color={iconColor} />
          </TouchableOpacity>
          <View className="flex-1">
            <MyInput
              placeholder={"Search"}
              borderRadius={8}
              padding={8}
              value={searchTerm}
              onChangeText={handleInputChange}
              onSubmit={handleSubmitEditing}
              borderColor={undefined}
              backgroundColor={undefined}
              fontWeight={undefined}
              fontFamily="Montserrat-Medium"
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
            keyExtractor={(item) => item?._id} // Change this line
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
                  setSearchTerm(item.lastName);
                  setSuggestions([]);
                  setNoResults(false);
                }}
              >
                {item.lastName}
              </Text>
            )}
          />
        </View>
      )}
      {isClickSearch && noResults ? (
        <View className="mt-4 w-full">
          <Image
            source={require("../../../assets/images/CannotFound.png")}
            style={{ width: 350, height: 342 }}
            resizeMode="contain"
          />
          <Text className="mt-4 text-center">
            Users not found <Text className="font-msemibold">{searchTerm}</Text>
          </Text>
        </View>
      ) : (
        searchResults.length > 0 &&
        isClickSearch && (
          <View className="mt-4 w-full mx-1">{renderResults()}</View>
        )
      )}
    </View>
  );
};

export default SearchHome;
