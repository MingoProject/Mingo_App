import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import Video from "react-native-video";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { getTimestamp } from "@/lib/utils";
import { LikeIcon, CommentIcon, ShareIcon } from "@/components/icons/Icons";
import { getCommentsByPostId } from "@/lib/service/post.service";
import fetchDetailedComments from "@/hooks/useComments";
import { createNotification } from "@/lib/service/notification.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createComment } from "@/lib/service/comment.service";
import { useAuth } from "@/context/AuthContext";
import PostAction from "./PostAction";
import CommentCard from "@/components/card/comment/CommentCard";

const DetailsPost = ({ isModalVisible, setModalVisible, post }: any) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [comment, setComment] = useState("");
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const { profile } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const getComments = async () => {
      const comments = await getCommentsByPostId(post._id);
      const detailedComments = await fetchDetailedComments(comments);
      if (isMounted) {
        setCommentsData(detailedComments);
      }
    };

    getComments();

    return () => {
      isMounted = false;
    };
  }, []);

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
      setComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <View className="flex-1 bg-black bg-opacity-50">
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
          <Image
            source={{ uri: post.author.avatar }}
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-4">
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className="font-msemibold text-[17px]"
            >
              {post.author.firstName} {post.author.lastName}
            </Text>
            <Text className="text-[#D9D9D9] font-mregular mt-1 text-sm">
              {getTimestamp(post.createAt)}
            </Text>
          </View>
        </View>

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
                  <View className="w-96 h-96 bg-gray-200 rounded-lg">
                    {/* <Video
                              source={{ uri: media.url }} // Đường dẫn URL video
                              style={{ width: "100%", height: "100%" }}
                              controls={true} // Hiển thị các controls như play, pause, volume,...
                              resizeMode="contain" // Điều chỉnh video sao cho phù hợp với container
                            /> */}
                  </View>
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
        />

        {commentsData.length > 0 && (
          <View className="mt-2">
            {commentsData.map(
              (comment) =>
                comment.parentId === null && (
                  <View key={comment._id}>
                    <CommentCard
                      comment={comment}
                      setCommentsData={setCommentsData}
                      author={post.author}
                      postId={post._id}
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
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg"
            />
            <TouchableOpacity
              onPress={handleSendComment}
              className="ml-3 bg-blue-500 p-3 rounded-lg"
            >
              <Text className="text-white font-msemibold">Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DetailsPost;
