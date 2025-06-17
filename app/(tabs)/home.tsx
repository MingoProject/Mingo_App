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
import { colors } from "../../styles/colors";
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
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const loadMorePosts = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
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
      setIsFetchingMore(false);
    }
  };

  const mergedPosts = () => {
    const result = [];
    let trendingIndex = 0;
    const usedTrendingIds = new Set();

    for (let i = 0; i < postsData.length; i++) {
      result.push({ ...postsData[i], isTrending: false });
      if ((i + 1) % 4 === 0 && trendingIndex < trendingPostsData.length) {
        const trendingPost = trendingPostsData[trendingIndex];
        if (!usedTrendingIds.has(trendingPost._id)) {
          result.push({ ...trendingPost, isTrending: true });
          usedTrendingIds.add(trendingPost._id);
          trendingIndex++;
        }
      }
    }

    return postsData.length === 0
      ? trendingPostsData.map((p) => ({ ...p, isTrending: true }))
      : result;
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
        const usedIds = new Set(firstPosts.map((p) => p._id));
        const filteredTrending = allTrending.filter(
          (p) => !usedIds.has(p._id) && p.author?._id !== userId
        );
        setTrendingPostsData(filteredTrending);
      } catch (e) {
        console.error("Failed to load posts", e);
      } finally {
        if (isMounted) setIsLoading(false);
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
                colorScheme === "dark" ? colors.dark[500] : colors.light[500],
              flex: 1,
            }}
            contentContainerStyle={{ padding: 12 }}
            ListHeaderComponent={
              <>
                <View
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? colors.dark[500]
                        : colors.light[500],
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 12,
                    paddingTop: Platform.OS === "android" ? 0 : 48,
                  }}
                >
                  <Text
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[100]
                          : colors.light[100],
                      flex: 1,
                      fontSize: 24,
                      fontWeight: "600",
                    }}
                  >
                    Min
                    <Text
                      style={{ color: colors.primary[100], fontWeight: "bold" }}
                    >
                      gle
                    </Text>
                  </Text>
                  <View style={{ flexDirection: "row", marginLeft: "auto" }}>
                    <TouchableOpacity onPress={handleSearch}>
                      <SearchIcon size={27} color={iconColor} />
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 8 }}></Text>
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
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => (
              <PostCard
                post={item}
                setPostsData={setPostsData}
                isTrending={item.isTrending}
              />
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
