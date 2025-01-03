import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors"; // import màu sắc từ file colors.js
import SearchHome from "../../components/home-component/SearchHome";
import AddPost from "@/components/forms/post/AddPost";
import fetchDetailedPosts from "@/hooks/usePosts";
import { fetchPosts } from "@/lib/service/post.service";
import OpenAddPost from "@/components/forms/post/OpenAddPost";
import PostCard from "@/components/card/post/PostCard";
import { SearchIcon, MessageIcon } from "@/components/icons/Icons";

const Home = () => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [postsData, setPostsData] = useState([]);
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
      const postsData = await fetchDetailedPosts(data);
      const sortedPosts = postsData.sort(
        (a, b) =>
          new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
      );
      setPostsData(sortedPosts);
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
        return <AddPost onClose={handleClose} setPostsData={setPostsData} />;
      default:
        return (
          <FlatList
            data={postsData}
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
                  } ${Platform.OS === "android" ? "pt-0" : "pt-12"}`}
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
                <OpenAddPost handleAddPost={handleAddPost} />
              </>
            }
            renderItem={({ item }) => (
              <PostCard item={item} setPostsData={setPostsData} />
            )}
          />
        );
    }
  };

  return <>{switchSreen()}</>;
};

export default Home;
