import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { colors } from "@/styles/colors";
import Background from "@/components/forms/setting/Background";
import Avatar from "@/components/forms/setting/Avatar";
import Bio from "@/components/forms/setting/Bio";
import DetailInformation from "@/components/shared/user/DetailInfomation";
import ImageProfile from "@/components/shared/user/ImageProfile";
import VideoProfile from "@/components/shared/user/VideoProfile";
import PostCard from "@/components/card/post/PostCard";
import { getMyPosts, getMyProfile } from "@/lib/service/user.service";
import fetchDetailedPosts from "@/hooks/usePosts";
import { useTheme } from "@/context/ThemeContext";
import { checkRelation } from "@/lib/service/relation.service";
import RelationAction from "@/components/forms/user/RelationAction";
import { ThreeDot } from "@/components/shared/icons/Icons";
import ReportCard from "@/components/card/report/ReportCard";
import { ArrowIcon } from "@/components/shared/icons/Icons";
import { useNavigation } from "@react-navigation/native";
import { pusherClient } from "@/lib/pusher";
import { useAuth } from "@/context/AuthContext";
import { UserBasicInfo, UserResponseDTO } from "@/dtos/UserDTO";
import { PostResponseDTO } from "@/dtos/PostDTO";
import TabSelector from "@/components/shared/ui/tab-selector";
import Button from "@/components/shared/ui/button";

const UserProfile = () => {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("posts");
  const { colorScheme } = useTheme();
  const [postsData, setPostsData] = useState<PostResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [profileUser, setProfileUser] = useState<UserResponseDTO>();
  const [profileUserBasic, setProfileUserBasic] = useState<UserBasicInfo>();

  const [relation, setRelation] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState(false);
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const menuRef = useRef<TouchableOpacity | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const navigation = useNavigation();
  const { profile } = useAuth();
  const [isBlocked, setIsBlocked] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMyProfile(id);
        setProfileUser(data.userProfile);
        setIsLoading(false);
        setProfileUserBasic({
          _id: data.userProfile._id,
          avatar: data.userProfile.avatar,
          firstName: data.userProfile.firstName,
          lastName: data.userProfile.lastName,
        });
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
    // const userId = await AsyncStorage.getItem("userId");
    const userId = profile._id;
    const check = async () => {
      try {
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
                  setIsBlocked(true);
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
    const userChannel = pusherClient.subscribe(`user-${userId}`);
    const targetChannel = pusherClient.subscribe(`user-${id}`);

    const handleFriendEvent = (data: any) => {
      if (isMounted) {
        console.log("Friend event:", data);
        check();
      }
    };

    userChannel.bind("friend", handleFriendEvent);
    targetChannel.bind("friend", handleFriendEvent);

    return () => {
      isMounted = false;
      userChannel.unbind("friend", handleFriendEvent);
      targetChannel.unbind("friend", handleFriendEvent);
      pusherClient.unsubscribe(`user-${userId}`);
      pusherClient.unsubscribe(`user-${id}`);
    };
  }, [id]);

  const fetchData = async () => {
    try {
      const data = await getMyPosts(id);
      // const postsData = await fetchDetailedPosts(data.userPosts);
      setPostsData(data.userPosts);
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
                colorScheme === "dark" ? colors.dark[500] : colors.light[500],
            }}
          >
            {postsData.map((item: PostResponseDTO) => (
              <PostCard
                key={item._id}
                post={item}
                setPostsData={setPostsData}
              />
            ))}
          </View>
        );
      case "photos":
        return (
          <>
            {profileUserBasic && (
              <ImageProfile profileUser={profileUserBasic} />
            )}
          </>
        );
      case "videos":
        return (
          <>
            {profileUserBasic && (
              <VideoProfile profileUser={profileUserBasic} />
            )}
          </>
        );
      default:
        return null;
    }
  };

  const closeReport = () => {
    setIsReport(false);
  };

  const getColorFromRelation = (relation: string): string => {
    switch (relation) {
      case "bff":
        return "#FACC15";
      case "senderRequestBff":
        return "#FDE68A";
      case "receiverRequestBff":
        return "#CA8A04";
      case "friend":
        return "#22C55E";
      case "following":
        return "#3B82F6";
      case "follower":
        return "#A855F7";
      case "blocked":
        return "#EF4444";
      case "blockedBy":
        return "#9CA3AF";
      default:
        return "#D1D5DB";
    }
  };

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
      {!isBlocked ? (
        <View className="flex felx-col space-y-6">
          <View className="flex flex-row">
            <TouchableOpacity onPress={handleBackPress}>
              <ArrowIcon size={28} color={iconColor} />
            </TouchableOpacity>

            {profileUserBasic && (
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
                className="text-[20px] font-msemibold"
              >
                {profileUser?.firstName} {profileUser?.lastName}
              </Text>
            )}
          </View>
          <Background profileUser={profileUser} />
          <View className="flex flex-row">
            <Avatar profileUser={profileUser} />
            <Bio profileUser={profileUser} />
          </View>
          <View className="flex-row">
            <Button
              size="small"
              onPress={() => setModalOpen(true)}
              title={
                relation === "bff"
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
                                : "Stranger"
              }
              fontColor={colors.light[400]}
              color={getColorFromRelation(relation)}
            />
            <View className="ml-2"></View>
            <Button size="small" title="Chat" fontColor={colors.light[400]} />

            <TouchableOpacity
              className="rounded-xl px-7 py-3  flex-1 felx flex-row justify-end"
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
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="bg-black/50"
              >
                <View
                  className=" rounded-lg p-5 w-[70%]"
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? colors.dark[400]
                        : colors.light[400],
                  }}
                >
                  <TouchableOpacity
                    className=""
                    onPress={() => setIsReport(true)}
                  >
                    <Text
                      className="text-center text-4"
                      style={{
                        color:
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[100],
                      }}
                    >
                      Report user
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="pt-3 mt-3"
                    onPress={() => setMenuVisible(false)}
                  >
                    <Text
                      className="text-center "
                      style={{
                        color:
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[100],
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
          <View className="mt-3">
            <DetailInformation profileUser={profileUser} />
          </View>

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

          <View className=" h-auto pb-7">
            <View
              style={{
                height: 1,
                width: "100%",
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
        </View>
      ) : (
        <>
          <View className="">
            <TouchableOpacity onPress={handleBackPress}>
              <ArrowIcon size={28} color={iconColor} />
            </TouchableOpacity>
            <Image
              source={
                colorScheme === "dark"
                  ? require("../../assets/images/Screenshot 2024-09-25 225618.png")
                  : require("../../assets/images/CannotFound.png")
              }
              style={{ width: 233, height: 235 }}
              className="mx-auto mt-40"
            />
            <Text
              className="font-msemibold text-[20px] mx-auto"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
            >
              User not found
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default UserProfile;
