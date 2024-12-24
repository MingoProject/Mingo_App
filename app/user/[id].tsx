import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
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
import { checkRelation } from "@/lib/service/relation.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RelationAction from "@/components/forms/user/RelationAction";
import { ThreeDot } from "@/components/icons/Icons";
import ReportCard from "@/components/card/report/ReportCard";
import { ArrowIcon } from "@/components/icons/Icons";
import { useNavigation } from "@react-navigation/native";

const UserProfile = () => {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("posts");
  const { colorScheme } = useTheme();
  const [postsData, setPostsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [profileUser, setProfileUser] = useState();
  const [relation, setRelation] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState(false);
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const menuRef = useRef<TouchableOpacity | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isReport, setIsReport] = useState(false);

  const handleBackPress = () => {
    navigation.goBack(); // Trở về trang trước
  };
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

  useEffect(() => {
    let isMounted = true;
    const check = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          const res: any = await checkRelation(userId, id);
          if (isMounted) {
            if (!res) {
              setRelation("stranger");
              // setRelationStatus(false);
            } else {
              const { relation, status, sender, receiver } = res;

              if (relation === "bff") {
                if (status) {
                  setRelation("bff"); //
                } else if (userId === sender) {
                  setRelation("senderRequestBff"); //
                } else if (userId === receiver) {
                  setRelation("receiverRequestBff"); //
                }
              } else if (relation === "friend") {
                if (status) {
                  setRelation("friend"); //
                } else if (userId === sender) {
                  setRelation("following"); //
                } else if (userId === receiver) {
                  setRelation("follower"); //
                }
              } else if (relation === "block") {
                if (userId === sender) {
                  setRelation("blocked"); //
                } else if (userId === receiver) {
                  setRelation("blockedBy");
                }
              } else {
                setRelation("stranger"); //
              }
              // setRelationStatus(status);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching relation:", error);
      }
    };
    check();
    return () => {
      isMounted = false;
    };
  }, [id]);

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
        return <ImageProfile userId={id} />;
      case "videos":
        return <VideoProfile userId={id} />;
      default:
        return null;
    }
  };

  const closeReport = () => {
    setIsReport(false);
  };

  return (
    <ScrollView
      className="p-3 pt-14"
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700],
        flex: 1,
      }}
    >
      <View className="flex flex-row">
        <TouchableOpacity onPress={handleBackPress}>
          <ArrowIcon size={28} color={iconColor} />
        </TouchableOpacity>

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
      <View className="flex-row">
        <TouchableOpacity
          onPress={() => setModalOpen(true)}
          className={` mt-3 rounded-xl px-4 py-3 text-white ${
            relation === "bff"
              ? "bg-yellow-500"
              : relation === "senderRequestBff"
              ? "bg-yellow-300"
              : relation === "receiverRequestBff"
              ? "bg-yellow-700"
              : relation === "friend"
              ? "bg-green-500"
              : relation === "following"
              ? "bg-blue-500"
              : relation === "follower"
              ? "bg-purple-500"
              : relation === "blocked"
              ? "bg-red-500"
              : relation === "blockedBy"
              ? "bg-gray-500"
              : "bg-gray-400"
          }`}
        >
          <Text className="text-white">
            {relation === "bff"
              ? "Best friend"
              : relation === "senderRequestBff"
              ? "Sending friend request"
              : relation === "receiverRequestBff"
              ? "Friend request"
              : relation === "friend"
              ? "Friend"
              : relation === "following"
              ? "Following"
              : relation === "follower"
              ? "Follower"
              : relation === "blocked"
              ? "Blocked"
              : relation === "blockedBy"
              ? "Blocked by"
              : "Stranger"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-3 rounded-xl px-7 py-3 text-white bg-slate-500 ml-3 "
          style={{
            // height: 1,
            backgroundColor: colors.primary[100],
            // marginVertical: 5,
          }}
        >
          <Text className="text-white">Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-3 rounded-xl px-7 py-3 text-white flex-1 felx flex-row justify-end"
          ref={menuRef}
          onPress={() => {
            menuRef.current?.measure((fx, fy, width, height, px, py) => {
              setMenuPosition({ x: px, y: py + height }); // Lấy vị trí dưới dấu `...`
            });
            setMenuVisible(true);
          }}
        >
          <ThreeDot size={20} color={iconColor} />
        </TouchableOpacity>
        <Modal
          visible={isModalOpen}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalOpen(false)}
        >
          <RelationAction
            relation={relation}
            onClose={() => setModalOpen(false)}
            id={id}
            setRelation={setRelation}
          />
        </Modal>
        <Modal
          visible={isMenuVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setMenuVisible(false)}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            className="bg-black/50"
          >
            <View
              className=" rounded-lg p-5 w-[80%]"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[300] : colors.light[700],
              }}
            >
              <TouchableOpacity
                className="py-3 mt-2"
                onPress={() => setIsReport(true)}
              >
                <Text className="text-center text-primary-100">
                  Report user
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 mt-4"
                onPress={() => setMenuVisible(false)}
              >
                <Text className="text-center text-gray-400">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
                activeTab === "photos" ? colors.primary[100] : "transparent", // màu đường viền dưới khi active
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
                activeTab === "videos" ? colors.primary[100] : "transparent", // màu đường viền dưới khi active
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
        animationType="none"
        visible={isReport}
        onRequestClose={closeReport}
        transparent={true}
      >
        <ReportCard
          onClose={closeReport}
          type="user"
          entityId={profileUser?._id || ""}
          reportedId={profileUser?._id || ""}
        />
      </Modal>
    </ScrollView>
  );
};

export default UserProfile;
