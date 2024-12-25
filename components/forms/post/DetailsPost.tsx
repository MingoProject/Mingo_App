import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { getTimestamp } from "@/lib/utils";
import { createNotification } from "@/lib/service/notification.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createComment } from "@/lib/service/comment.service";
import { useAuth } from "@/context/AuthContext";
import PostAction from "./PostAction";
import CommentCard from "@/components/card/comment/CommentCard";
import { ResizeMode, Video } from "expo-av";
import { FriendIcon, LocationIcon, ThreeDot } from "@/components/icons/Icons";
import TagModal from "./TagsModal";
import PostMenu from "./PostMenu";
import { useRouter } from "expo-router";

const DetailsPost = ({
  isModalVisible,
  setModalVisible,
  post,
  setPostsData,
  numberOfLikes,
  setNumberOfLikes,
  isLiked,
  setIsLiked,
  setNumberOfComments,
  numberOfComments,
  commentsData,
  setCommentsData,
}: any) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [comment, setComment] = useState("");
  const { profile } = useAuth();
  const menuRef = useRef<TouchableOpacity | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const isAuthor = profile?._id === post.author._id;
  const router = useRouter();

  const handleTagsModalToggle = () => {
    setIsTagsModalOpen(!isTagsModalOpen);
  };

  const handleSendComment = async () => {
    const token: string | null = await AsyncStorage.getItem("token");

    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    if (!comment.trim()) {
      console.warn("Comment cannot be empty");
      return;
    }

    try {
      const newCommentData = await createComment(
        { content: comment },
        token,
        post._id
      );

      const currentTime = new Date();
      const isoStringWithOffset = currentTime
        .toISOString()
        .replace("Z", "+00:00");
      console.log(
        "Current Time (new Date()):",
        currentTime.toISOString().replace("Z", "+00:00")
      );

      const enrichedComment = {
        ...newCommentData,
        userId: {
          _id: profile?._id,
          avatar: profile?.avatar || "/assets/images/default-avatar.jpg",
          firstName: profile?.firstName || "Anonymous",
          lastName: profile?.lastName || "Anonymous",
        },
        createAt: isoStringWithOffset,
      };

      // Cập nhật state commentsData
      setCommentsData((prev) => [enrichedComment, ...prev]);

      if (post.author._id !== profile._id) {
        const notificationParams = {
          senderId: profile._id,
          receiverId: post.author._id,
          type: "comment",
          postId: post._id,
        };

        await createNotification(notificationParams, token);
      }
      setNumberOfComments(numberOfComments + 1);
      setComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const navigateToUserProfile = (item: any) => {
    setModalVisible(false);
    if (item === profile._id) {
      router.push(`/profile`);
    } else {
      router.push(`/user/${item}`);
    }
  };

  return (
    <View className="flex-1 bg-black bg-opacity-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1 bg-white dark:bg-black rounded-t-3xl p-5">
          {/* Header */}
          <View className="flex-row mt-7 justify-between items-center mb-4">
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className="font-msemibold text-lg"
            >
              Post Details
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text
                style={{
                  color: colorScheme === "dark" ? colors.dark[100] : "#D9D9D9",
                }}
                className="font-msemibold"
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>

          {/* Author Info */}
          <View className="flex-row items-center mb-2">
            <TouchableOpacity
              onPress={() => navigateToUserProfile(post.author._id)}
            >
              <Image
                source={{ uri: post.author.avatar }}
                className="w-10 h-10 rounded-full"
              />
            </TouchableOpacity>

            <View className="ml-4">
              <View
                style={{ flexDirection: "row", alignItems: "center" }}
                className="mb-2"
              >
                <Text
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                  className="font-msemibold"
                >
                  {post.author?.firstName || ""} {post.author?.lastName || ""}{" "}
                </Text>
                {post.location && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    className="flex"
                  >
                    <Text
                      style={{
                        color:
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[500],
                      }}
                    >
                      {" "}
                      {"- "}
                    </Text>
                    <LocationIcon size={14} color={iconColor} />
                    <Text
                      style={{
                        fontSize: 16,
                        color:
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[500],
                      }}
                      className="font-mregular ml-1"
                    >
                      {post.location}
                    </Text>
                  </View>
                )}
              </View>
              {post.tags?.length > 0 && (
                <Text
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                    fontSize: 16,
                    // marginBottom: 5,
                  }}
                  className="font-mmedium"
                >
                  <FriendIcon size={18} color={iconColor} />

                  {post.tags?.length > 0 && (
                    <TouchableOpacity
                      onPress={handleTagsModalToggle}
                      // className="mt-[10px]"
                    >
                      <Text
                        style={{
                          color: colors.primary[100],
                          fontSize: 16,
                        }}
                        className="font-mregular"
                        numberOfLines={1} // Hiển thị tối đa 1 dòng
                        ellipsizeMode="tail"
                      >
                        {` with ${post.tags.length} others`}
                      </Text>
                    </TouchableOpacity>
                  )}
                </Text>
              )}

              <Text className="text-[#D9D9D9] font-mregular text-sm">
                {getTimestamp(post.createAt)}
              </Text>
            </View>
            <TagModal
              tags={post.tags}
              isOpen={isTagsModalOpen}
              onClose={handleTagsModalToggle}
            />

            <TouchableOpacity
              ref={menuRef}
              className="ml-auto mb-2"
              onPress={() => {
                menuRef.current?.measure((fx, fy, width, height, px, py) => {
                  setMenuPosition({ x: px, y: py + height }); // Lấy vị trí dưới dấu `...`
                });
                setMenuVisible(true);
              }}
            >
              <ThreeDot size={20} color={iconColor} />
            </TouchableOpacity>
          </View>

          {isMenuVisible && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={isMenuVisible}
              onRequestClose={() => setMenuVisible(false)}
            >
              <View
                style={{
                  position: "absolute",
                  top: menuPosition.y,
                  right: menuPosition.x - 250,
                  backgroundColor: "white",
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <PostMenu
                  isAuthor={isAuthor}
                  item={post}
                  setMenuVisible={setMenuVisible}
                  setPostsData={setPostsData}
                />
              </View>
            </Modal>
          )}

          {/* Post Content */}
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
            className="mb-4 font-mregular text-[15px]"
          >
            {post.content}
          </Text>

          {/* Media */}
          {post.media && (
            <FlatList
              data={post.media}
              horizontal
              keyExtractor={(media) => media._id}
              renderItem={({ item: media }) => (
                <View className="mr-2">
                  {media.type === "image" ? (
                    <Image
                      source={{ uri: media.url }}
                      className="w-96 h-96 rounded-lg"
                    />
                  ) : media.type === "video" ? (
                    <VideoPlayer videoUrl={media.url} />
                  ) : (
                    <Text>Unsupported Media</Text>
                  )}
                </View>
              )}
            />
          )}

          <PostAction
            post={post}
            isModalVisible={isModalVisible}
            setModalVisible={setModalVisible}
            numberOfLikes={numberOfLikes}
            setNumberOfLikes={setNumberOfLikes}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            numberOfComments={numberOfComments}
          />

          {commentsData.length > 0 && (
            <View className="mt-2">
              {commentsData.map(
                (comment) =>
                  comment.parentId === null && (
                    <View key={comment._id}>
                      <CommentCard
                        comment={comment}
                        commentsData={commentsData}
                        setCommentsData={setCommentsData}
                        author={post.author}
                        postId={post._id}
                        setNumberOfComments={setNumberOfComments}
                        numberOfComments={numberOfComments}
                      />
                    </View>
                  )
              )}
            </View>
          )}

          <View className="p-4 bg-white dark:bg-black border-t border-gray-300">
            <View className="flex-row items-center">
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Write a comment..."
                placeholderTextColor={
                  colorScheme === "dark" ? "#92898A" : "#D9D9D9"
                }
                style={{
                  flex: 1,
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg font-mregular"
              />
              <TouchableOpacity
                onPress={handleSendComment}
                className="ml-3 bg-primary-100 p-3 rounded-lg"
              >
                <Text className="text-white font-msemibold">Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});

  return (
    <View>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={{ width: 350, height: 200, borderRadius: 10 }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
    </View>
  );
};

export default DetailsPost;
