import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Keyboard,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { colors } from "../../../styles/colors";
import PostCard from "../../card/post/PostCard";
import { fetchUsers } from "@/lib/service/user.service";
import { fetchPosts } from "@/lib/service/post.service";
import UserCard from "../../card/user/UserCard";
import { ArrowIcon } from "../../shared/icons/Icons";
import Input from "@/components/shared/ui/input";
import { UserResponseDTO } from "@/dtos/UserDTO";
import { PostResponseDTO } from "@/dtos/PostDTO";
import Tab from "@/components/shared/ui/tab";

const SearchHome = ({ onClose }: any) => {
  const { colorScheme } = useTheme();
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [usersData, setUsersData] = useState<UserResponseDTO[]>([]);
  const [postsData, setPostsData] = useState<PostResponseDTO[]>([]);
  const [userResults, setUserResults] = useState<UserResponseDTO[]>([]);
  const [postResults, setPostResults] = useState<PostResponseDTO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()]);
      setUsersData(users);
      setPostsData(posts);
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    const users = usersData.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const posts = postsData.filter(
      (post: PostResponseDTO) =>
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        users.some((user) => user._id === post.author._id)
    );

    setUserResults(users);
    setPostResults(posts);
    Keyboard.dismiss();
  };

  useEffect(() => {
    let results = [];
    if (activeTab === "users") {
      results = userResults.map((user) => ({ type: "user", data: user }));
    } else if (activeTab === "posts") {
      results = postResults.map((post) => ({ type: "post", data: post }));
    } else {
      results = [
        ...userResults.map((user) => ({ type: "user", data: user })),
        ...postResults.map((post) => ({ type: "post", data: post })),
      ];
    }

    setSearchResults(results);
    setNoResults(results.length === 0);
  }, [activeTab, userResults, postResults]);

  const renderResults = () => (
    <FlatList
      data={searchResults}
      keyExtractor={(item) =>
        item.data._id + (item.type === "post" ? "-post" : "-user")
      }
      renderItem={({ item }) =>
        item.type === "post" ? (
          <PostCard post={item.data} setPostsData={setPostsData} />
        ) : (
          <UserCard item={item.data} />
        )
      }
    />
  );

  const renderTabs = () => (
    <ScrollView
      horizontal
      contentContainerStyle={{ flexDirection: "row", gap: 16 }}
      showsHorizontalScrollIndicator={false}
      style={{ marginVertical: 10 }}
    >
      {[
        { label: "All", key: "all" },
        { label: "Users", key: "users" },
        { label: "Posts", key: "posts" },
      ].map((tab) => (
        <View key={tab.key} style={{ width: "auto" }}>
          <Tab
            content={tab.label}
            isActive={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          />
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View
      style={{
        paddingTop: Platform.OS === "android" ? 14 : 52,
        flex: 1,
        backgroundColor:
          colorScheme === "dark" ? colors.dark[500] : colors.light[500],
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity onPress={onClose}>
          <ArrowIcon size={28} color={iconColor} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(text) => setSearchTerm(text)}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>
      <View style={{ marginVertical: 10, paddingHorizontal: 16 }}>
        {renderTabs()}
      </View>
      {noResults ? (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Image
            source={require("../../../assets/images/CannotFound.png")}
            style={{ width: 300, height: 300 }}
            resizeMode="contain"
          />
          <Text style={{ marginTop: 10 }}>No results for "{searchTerm}"</Text>
        </View>
      ) : (
        renderResults()
      )}
    </View>
  );
};

export default SearchHome;
