import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { colors } from "@/styles/colors";
import Background from "@/components/forms/profile/Background";
import Avatar from "@/components/forms/profile/Avatar";
import Bio from "@/components/forms/profile/Bio";
import DetailInformation from "@/components/forms/profile/DetailInfomation";
import ImageProfile from "@/components/forms/profile/ImageProfile";
import VideoProfile from "@/components/forms/profile/VideoProfile";
import PostCard from "@/components/card/post/PostCard";
import { getMyPosts, getMyProfile } from "@/lib/service/user.service";
import fetchDetailedPosts from "@/hooks/usePosts";
import { useTheme } from "@/context/ThemeContext";

const UserProfile = () => {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("posts");
  const { colorScheme } = useTheme();
  const [postsData, setPostsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [profileUser, setProfileUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMyProfile(id);
        setProfileUser(data.userProfile);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setIsError(true);
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  console.log(profileUser);

  const fetchData = async () => {
    try {
      const data = await getMyPosts(id);
      const postsData = await fetchDetailedPosts(data.userPosts);
      setPostsData(postsData);
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

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <View
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[300] : colors.light[700],
            }}
          >
            {postsData.map((item: any) => (
              <PostCard key={item._id} item={item} />
            ))}
          </View>
        );

      case "photos":
        return <ImageProfile />;
      case "videos":
        return <VideoProfile />;
      default:
        return null;
    }
  };

  return (
    <ScrollView
      className="p-3"
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700],
        flex: 1,
      }}
    >
      <View className="flex flex-row">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="text-[20px] font-msemibold"
        >
          {profileUser?.firstName} {profileUser?.lastName}
        </Text>
      </View>
      <Background profileUser={profileUser} />
      <View className="flex flex-row mt-2">
        <Avatar profileUser={profileUser} />
        <Bio profileUser={profileUser} />
      </View>
      <DetailInformation profileUser={profileUser} />
      <View className="flex  flex-row justify-start  mx-[10%] mt-10">
        <TouchableOpacity onPress={() => setActiveTab("posts")}>
          <Text
            style={{
              fontSize: 14,

              color:
                activeTab === "posts"
                  ? colors.primary[100] // màu chữ khi active
                  : colorScheme === "dark"
                  ? colors.dark[100] // màu chữ khi không active và trong dark mode
                  : colors.light[500], // màu chữ khi không active và trong light mode
              borderBottomWidth: activeTab === "posts" ? 2 : 0, // đường viền dưới khi active
              borderBottomColor:
                activeTab === "posts" ? colors.primary[100] : "transparent", // màu đường viền dưới
            }}
            className="text-[14px] font-mregular "
          >
            Bài viết
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("photos")}>
          <Text
            style={{
              fontSize: 14,
              color:
                activeTab === "photos"
                  ? colors.primary[100] // màu chữ khi active
                  : colorScheme === "dark"
                  ? colors.dark[100] // màu chữ khi không active và trong dark mode
                  : colors.light[500], // màu chữ khi không active và trong light mode
              borderBottomWidth: activeTab === "photos" ? 2 : 0, // đường viền dưới khi active
              borderBottomColor:
                activeTab === "photos" ? colors.primary[100] : "transparent", // màu đường viền dưới khi active
            }}
            className="text-[14px] font-mregular ml-5"
          >
            Ảnh
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("videos")}>
          <Text
            style={{
              fontSize: 14,
              color:
                activeTab === "videos"
                  ? colors.primary[100] // màu chữ khi active
                  : colorScheme === "dark"
                  ? colors.dark[100] // màu chữ khi không active trong dark mode
                  : colors.light[500], // màu chữ khi không active trong light mode
              borderBottomWidth: activeTab === "videos" ? 2 : 0, // đường viền dưới khi active
              borderBottomColor:
                activeTab === "videos" ? colors.primary[100] : "transparent", // màu đường viền dưới khi active
            }}
            className="text-[14px] font-mregular ml-5"
          >
            Video
          </Text>
        </TouchableOpacity>
      </View>

      <View className=" py-3 h-auto">
        <View
          style={{
            height: 1,
            backgroundColor: "#D9D9D9",
            width: "100%",
            marginVertical: 5,
          }}
        />
        {renderContent()}
      </View>
    </ScrollView>
  );
};

export default UserProfile;
