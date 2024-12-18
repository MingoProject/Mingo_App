import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { getTimestamp } from "@/lib/utils";
import fetchDetailedComments from "@/hooks/useComments";
import { createNotification } from "@/lib/service/notification.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createCommentMedia } from "@/lib/service/comment.service";
import { useAuth } from "@/context/AuthContext";
import MediaAction from "./MediaAction";
import CommentCard from "@/components/card/comment/CommentCard";
import {
  getAuthorByMediaId,
  getCommentsByMediaId,
} from "@/lib/service/media.service";

const DetailImage = ({ isModalVisible, setModalVisible, image }: any) => {
  const { colorScheme } = useTheme();
  const [comment, setComment] = useState("");
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [author, setAuthor] = useState();

  const { profile } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const getComments = async () => {
      const comments = await getCommentsByMediaId(image._id);
      console.log(comments);
      const author = await getAuthorByMediaId(image._id);
      const detailedComments = await fetchDetailedComments(comments);
      if (isMounted) {
        setCommentsData(detailedComments);
        setAuthor(author);
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
      const newCommentData = await createCommentMedia(
        { content: comment },
        token,
        image._id
      );

      const enrichedComment = {
        ...newCommentData,
        userId: {
          _id: profile?._id,
          avatar: profile?.avatar || "/assets/images/default-avatar.jpg",
          firstName: profile?.firstName || "Anonymous",
          lastName: profile?.lastName || "Anonymous",
          createAt: "Now",
        },
      };

      // Cập nhật state commentsData
      setCommentsData((prev) => [enrichedComment, ...prev]);

      if (image.createBy._id !== profile._id) {
        const notificationParams = {
          senderId: profile._id,
          receiverId: image.createBy._id,
          type: "comment",
          imageId: image._id,
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
            Image Details
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
            source={{ uri: author?.avatar }}
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
              {author?.firstName} {author?.lastName}
            </Text>
            <Text className="text-[#D9D9D9] font-mregular mt-1 text-sm">
              {getTimestamp(image.createAt)}
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
          {image.caption}
        </Text>

        <Image source={{ uri: image.url }} className="w-96 h-96 rounded-lg" />

        <MediaAction
          media={image}
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
        />

        {commentsData.length > 0 && (
          <View className="mt-2">
            {commentsData.map((comment) => (
              <View key={comment._id}>
                <CommentCard
                  comment={comment}
                  setCommentsData={setCommentsData}
                  author={author}
                  mediaId={image._id}
                />
              </View>
            ))}
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

export default DetailImage;
