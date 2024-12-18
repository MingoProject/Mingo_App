import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SettingsIcon } from "../../components/icons/Icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import PostCard from "@/components/card/post/PostCard";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import Setting from "../../components/forms/profile/Setting";
import OpenAddPost from "@/components/forms/post/OpenAddPost";
import ImageProfile from "@/components/forms/profile/ImageProfile";
import AddPost from "@/components/forms/post/AddPost";
import { useAuth } from "@/context/AuthContext";
import { getMyPosts } from "@/lib/service/user.service";
import fetchDetailedPosts from "@/hooks/usePosts";
import VideoProfile from "@/components/forms/profile/VideoProfile";
import Background from "@/components/forms/profile/Background";
import Avatar from "@/components/forms/profile/Avatar";
import Bio from "@/components/forms/profile/Bio";
import DetailInformation from "@/components/forms/profile/DetailInfomation";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const { colorScheme, toggleColorScheme } = useTheme();
  const [setting, setSetting] = useState(false);
  const [isSelect, setIsSelect] = useState("profile");
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const { profile, setProfile } = useAuth();
  const [postsData, setPostsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getMyPosts(profile._id);
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
                colorScheme === "dark" ? colors.dark[300] : colors.light[700],
            }}
          >
            <>
              <OpenAddPost handleAddPost={handleAddPost} />
            </>
            {postsData.map((item) => (
              <PostCard key={item._id} item={item} />
            ))}
          </View>
        );

      case "photos":
        return <ImageProfile userId={profile._id} />;
      case "videos":
        return <VideoProfile userId={profile._id} />;
      default:
        return null;
    }
  };

  const switchSreen = () => {
    switch (isSelect) {
      case "addPost":
        return <AddPost onClose={handleClose} />;
      default:
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
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="text-[20px] font-msemibold"
              >
                {profile.firstName} {profile.lastName}
              </Text>
              <TouchableOpacity
                onPress={() => setSetting(true)}
                className="ml-auto"
              >
                <SettingsIcon size={27} color={iconColor} />
              </TouchableOpacity>
            </View>
            <Background profileUser={profile} setProfile={setProfile} />
            <View className="flex flex-row mt-2">
              <Avatar profileUser={profile} setProfile={setProfile} />
              <Bio profileUser={profile} setProfile={setProfile} />
            </View>
            <DetailInformation
              profileUser={profile}
              setProfileUser={setProfile}
            />
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
                      activeTab === "posts"
                        ? colors.primary[100]
                        : "transparent", // màu đường viền dưới
                  }}
                  className="text-[14px] font-mregular "
                >
                  Posts
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
                      activeTab === "photos"
                        ? colors.primary[100]
                        : "transparent", // màu đường viền dưới khi active
                  }}
                  className="text-[14px] font-mregular ml-5"
                >
                  Pictures
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
                      activeTab === "videos"
                        ? colors.primary[100]
                        : "transparent", // màu đường viền dưới khi active
                  }}
                  className="text-[14px] font-mregular ml-5"
                >
                  Videos
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
