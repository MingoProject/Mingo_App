import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  RunIcon,
  SettingsIcon,
  SoccerIcon,
  SwimIcon,
} from "../../components/shared/icons/Icons";
import React, { useState, useEffect } from "react";
import PostCard from "@/components/card/post/PostCard";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import OpenAddPost from "@/components/forms/post/OpenAddPost";
import ImageProfile from "@/components/shared/user/ImageProfile";
import AddPost from "@/components/forms/post/AddPost";
import { useAuth } from "@/context/AuthContext";
import { getMyPosts } from "@/lib/service/user.service";
import VideoProfile from "@/components/shared/user/VideoProfile";
import Background from "@/components/forms/setting/Background";
import Avatar from "@/components/forms/setting/Avatar";
import Bio from "@/components/forms/setting/Bio";
import DetailInformation from "@/components/shared/user/DetailInfomation";
import { UserBasicInfo } from "@/dtos/UserDTO";
import { PostResponseDTO } from "@/dtos/PostDTO";
import TabSelector from "@/components/shared/ui/tab-selector";
import Setting from "@/components/shared/setting/Setting";
export const tabIcons: Record<string, any> = {
  Posts: SoccerIcon,
  Images: SwimIcon,
  Videos: RunIcon,
};
const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const { colorScheme } = useTheme();
  const [setting, setSetting] = useState(false);
  const [isSelect, setIsSelect] = useState("profile");
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];
  const { profile, setProfile } = useAuth();
  const profileBasic: UserBasicInfo = {
    _id: profile?._id,
    avatar: profile?.avatar,
    firstName: profile?.firstName,
    lastName: profile?.lastName,
  };
  const [postsData, setPostsData] = useState<PostResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    try {
      const result = await getMyPosts(profile?._id);
      const posts = result.userPosts || []; // hoặc result.data.posts
      const sortedPosts = posts.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  const handleAddPost = () => {
    setIsSelect("addPost");
  };
  const handleClose = () => {
    setIsSelect("profile");
  };

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
                colorScheme === "dark" ? colors.dark[500] : colors.light[500],
            }}
          >
            <>
              <OpenAddPost
                handleAddPost={handleAddPost}
                profileBasic={profileBasic}
              />
            </>
            {postsData.map((item) => (
              <PostCard post={item} setPostsData={setPostsData} />
            ))}
          </View>
        );

      case "photos":
        return <ImageProfile profileUser={profileBasic} />;
      case "videos":
        return <VideoProfile profileUser={profileBasic} />;
      default:
        return null;
    }
  };

  const switchSreen = () => {
    switch (isSelect) {
      case "addPost":
        return <AddPost onClose={handleClose} setPostsData={setPostsData} />;
      default:
        return (
          <ScrollView
            className="p-3 flex felx-col space-y-6"
            style={{
              paddingTop: Platform.OS === "android" ? 16 : 52, // Android: 0, iOS: 12
              backgroundColor:
                colorScheme === "dark" ? colors.dark[500] : colors.light[500],
              flex: 1,
            }}
          >
            <View className="flex flex-row">
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "600",
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
                className="text-[20px] font-msemibold"
              >
                {profile?.firstName} {profile?.lastName}
              </Text>
              <TouchableOpacity
                onPress={() => setSetting(true)}
                className="ml-auto"
              >
                <SettingsIcon size={27} color={iconColor} />
              </TouchableOpacity>
            </View>
            <Background profileUser={profile} setProfile={setProfile} />
            <View className="flex flex-row">
              <Avatar profileUser={profile} setProfile={setProfile} />
              <Bio profileUser={profile} setProfile={setProfile} />
            </View>
            <DetailInformation
              profileUser={profile}
              setProfileUser={setProfile}
            />
            <TabSelector
              tabs={[
                { key: "posts", label: "Post" },
                { key: "photos", label: "Image" },
                { key: "videos", label: "Video" },
              ]}
              activeTab={activeTab}
              onTabPress={setActiveTab}
              colorScheme={colorScheme}
              colors={colors}
            />

            <View className=" h-auto">
              <View
                style={{
                  height: 1,
                  width: "100%",
                }}
              />
              {renderContent()}
            </View>

            <Modal
              transparent={true}
              animationType="slide"
              visible={setting}
              onRequestClose={() => setSetting(false)}
            >
              <Setting setSetting={setSetting} />
            </Modal>
          </ScrollView>
        );
    }
  };

  return <>{switchSreen()}</>;
};

export default Profile;
