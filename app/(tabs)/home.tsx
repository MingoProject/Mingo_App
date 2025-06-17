import React, { useCallback, useEffect, useRef, useState } from "react";
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
import SearchHome from "../../components/forms/other/SearchHome";
import AddPost from "@/components/forms/post/AddPost";
import {
  fetchRelevantPosts,
  fetchTrendingPosts,
} from "@/lib/service/post.service";
import OpenAddPost from "@/components/forms/post/OpenAddPost";
import PostCard from "@/components/card/post/PostCard";
import { SearchIcon, MessageIcon } from "@/components/shared/icons/Icons";
import { PostResponseDTO } from "@/dtos/PostDTO";
import { useAuth } from "@/context/AuthContext";
import { UserBasicInfo } from "@/dtos/UserDTO";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const { colorScheme } = useTheme();
  const { profile } = useAuth();
  const profileBasic: UserBasicInfo = {
    _id: profile?._id,
    avatar: profile?.avatar,
    firstName: profile?.firstName,
    lastName: profile?.lastName,
  };
  const userId = profile?._id || null;
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];
  const [postsData, setPostsData] = useState<PostResponseDTO[]>([]);
  const [trendingPostsData, setTrendingPostsData] = useState<PostResponseDTO[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSelect, setIsSelect] = useState("home");
  const [hasMore, setHasMore] = useState(true);

  const loadMorePosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !userId) return;
      const newPosts = await fetchRelevantPosts(token, page, 5);
      if (newPosts.length < 5) setHasMore(false);
      setPostsData((prev) => [...prev, ...newPosts]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error loading more posts", err);
    } finally {
      setIsLoading(false);
    }
  };

  const mergedPosts = () => {
    const relevant = postsData || [];
    const result = [];
    let trendingIndex = 0;
    for (let i = 0; i < relevant.length; i++) {
      result.push({ ...relevant[i], isTrending: false });
      if ((i + 1) % 4 === 0 && trendingIndex < trendingPostsData.length) {
        result.push({ ...trendingPostsData[trendingIndex], isTrending: true });
        trendingIndex++;
      }
    }
    if (relevant.length === 0) {
      return trendingPostsData.map((post) => ({ ...post, isTrending: true }));
    }
    return result;
  };

  useEffect(() => {
    let isMounted = true;
    const loadInitialPosts = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token || !userId) return;

        const firstPosts = await fetchRelevantPosts(token, 1, 5);
        if (!isMounted) return;
        setPostsData(firstPosts);
        setPage(2);

        const allTrending = await fetchTrendingPosts();
        const relevantIds = new Set(firstPosts.map((p) => p._id));
        const filteredTrending = allTrending.filter(
          (p) => !relevantIds.has(p._id)
        );

        if (isMounted) setTrendingPostsData(filteredTrending);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading initial posts", error);
        setIsError(true);
        setIsLoading(false);
      }
    };
    loadInitialPosts();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleSearch = () => setIsSelect("searchHome");
  const handleAddPost = () => setIsSelect("addPost");
  const handleClose = () => setIsSelect("home");

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
            data={mergedPosts()}
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
            onEndReached={loadMorePosts}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              hasMore ? (
                <View style={{ padding: 12, alignItems: "center" }}>
                  <ActivityIndicator size="small" color={colors.primary[100]} />
                </View>
              ) : null
            }
          />
        );
    }
  };

  return <>{switchSreen()}</>;
};

export default Home;
