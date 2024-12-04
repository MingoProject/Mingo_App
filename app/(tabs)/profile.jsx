import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { SettingsIcon } from "../../components/icons/Icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import PostCard from "@/components/card/post/PostCard";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors"; // import màu sắc từ file colors.js
import Setting from "../../components/forms/profile/Setting";
import OpenAddPost from "@/components/forms/post/OpenAddPost";
import AddPost from "@/components/home-component/AddPost";
import { useAuth } from "@/context/AuthContext";
import { getMyPosts } from "@/lib/service/user.service";
import fetchDetailedPosts from "@/hooks/usePosts";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const { colorScheme, toggleColorScheme } = useTheme();
  const [setting, setSetting] = useState(false);
  const [isSelect, setIsSelect] = useState("profile");
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const { profile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [postsData, setPostsData] = useState([]);

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const data = await getMyPosts(userId);
        setPosts(data.userPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchPostsData = async () => {
    try {
      const data = await fetchDetailedPosts(posts);
      setPostsData(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPostsData();
  }, []);

  const handleAddPost = () => {
    setIsSelect("addPost");
  };
  const handleClose = () => {
    setIsSelect("profile");
  };

  const picturesData = [
    "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg", // Mickey Mouse image
    "https://i.pinimg.com/originals/ff/ec/81/ffec81a1a3ee6a557433bcc626e1dfc6.jpg", // Minnie Mouse image
    "https://i.pinimg.com/originals/ce/16/72/ce16725b94d75e6434bbe3ac0f005814.jpg", // Donald Duck image
    "https://i.pinimg.com/originals/70/3f/f8/703ff89cf6cad803da55cf5cc9ff42fd.jpg", // Goofy image
    "https://i.pinimg.com/originals/8d/87/4b/8d874bdf21d904fece1f06a83bfb8160.jpg", // Pluto image
    "https://i.pinimg.com/originals/22/ac/ca/22accaa81d76b8e6aace6c5562e00f8e.jpg", // Daisy Duck image
    "https://i.pinimg.com/originals/9c/8d/c8/9c8dc806006f2da4154d68e85a9dd7cc.jpg", // Simba image
    "https://i.pinimg.com/originals/1c/6d/80/1c6d806c88fe716566fb83713396b195.jpg", // Ariel image
    "https://i.pinimg.com/originals/95/0d/0d/950d0d7b19b956a5052b7d2c362c9871.jpg", // Elsa image
    "https://i.pinimg.com/originals/4c/94/8f/4c948f59bd94a59dd88cc4636a7016ad.jpg", // Woody image
  ];

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
              <PostCard item={item} />
            ))}
          </View>
        );

      case "photos":
        return (
          <View className="flex flex-wrap mt-2">
            <View className="flex flex-row flex-wrap">
              {picturesData.map((item, index) => (
                <View
                  key={index}
                  className="flex flex-col items-center mb-4"
                  style={{ width: "33%" }}
                >
                  <Image
                    source={{ uri: item }}
                    className="h-[100px] w-[100px] rounded-md" // Đặt width bằng 100%
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>
          </View>
        );
      case "videos":
        return (
          <View className="flex flex-wrap mt-2">
            <View className="flex flex-row flex-wrap">
              {picturesData.map((item, index) => (
                <View
                  key={index}
                  className="flex flex-col items-center mb-4"
                  style={{ width: "33%" }}
                >
                  <Image
                    source={{ uri: item }}
                    className="h-[100px] w-[100px] rounded-md" // Đặt width bằng 100%
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>
          </View>
        );
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
                colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
              flex: 1,
            }}
          >
            <View className="flex flex-row">
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500], // Sử dụng màu text phù hợp
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
            <View className="mt-4">
              <Image
                source={{ uri: profile.background }}
                className="w-full h-[152px] rounded-lg"
              />
            </View>
            <View className="flex flex-row mt-2">
              <View className="h-[105px] w-[105px] overflow-hidden rounded-full">
                <Image
                  source={{ uri: profile.avatar }}
                  style={{ width: 105, height: 105, borderRadius: 20 }}
                />
              </View>
              <View className="p-3 w-[266px]">
                <Text
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                  className="font-mregular text-[14px] "
                >
                  {profile.bio}
                </Text>
              </View>
            </View>
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
                      activeTab === "photos"
                        ? colors.primary[100]
                        : "transparent", // màu đường viền dưới khi active
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
                      activeTab === "videos"
                        ? colors.primary[100]
                        : "transparent", // màu đường viền dưới khi active
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
