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
import { fetchPosts } from "@/lib/service/post.service";
import OpenAddPost from "@/components/forms/post/OpenAddPost";
import PostCard from "@/components/card/post/PostCard";
import { SearchIcon, MessageIcon } from "@/components/icons/Icons";
import { PostResponseDTO } from "@/dtos/PostDTO";
import { useAuth } from "@/context/AuthContext";
import { UserBasicInfo } from "@/dtos/UserDTO";

const Home = () => {
  const { colorScheme } = useTheme();
  const { profile } = useAuth();
  const profileBasic: UserBasicInfo = {
    _id: profile?._id,
    avatar: profile?.avatar,
    firstName: profile?.firstName,
    lastName: profile?.lastName,
  };
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];
  const [postsData, setPostsData] = useState<PostResponseDTO[]>([]);
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
      const sortedPosts = data.sort(
        (a: any, b: any) =>
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
        <ActivityIndicator size="large" color={colors.primary[100]} />
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
                colorScheme === "dark" ? colors.dark[500] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
              flex: 1,
            }}
            className="p-3"
            ListHeaderComponent={
              <>
                <View
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? colors.dark[500]
                        : colors.light[500],
                  }}
                  className={`flex flex-row items-center p-3 ${Platform.OS === "android" ? "pt-0" : "pt-12"}`}
                >
                  <Text
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[100]
                          : colors.light[100],
                      flex: 1,
                    }}
                    className={`text-[24px] font-jsemibold `}
                  >
                    Min
                    <Text
                      className="text-[24px] font-semibold"
                      style={{ color: colors.primary[100] }}
                    >
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
                <OpenAddPost
                  handleAddPost={handleAddPost}
                  profileBasic={profileBasic}
                />
              </>
            }
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderItem={({ item }) => (
              <PostCard post={item} setPostsData={setPostsData} />
            )}
          />
        );
    }
  };

  return <>{switchSreen()}</>;
};

export default Home;
