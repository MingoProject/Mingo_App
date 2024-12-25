import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
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
import { createCommentMedia } from "@/lib/service/comment.service";
import { useAuth } from "@/context/AuthContext";
import MediaAction from "./MediaAction";
import CommentCard from "@/components/card/comment/CommentCard";

const DetailImage = ({
  isModalVisible,
  setModalVisible,
  image,
  commentsData,
  setCommentsData,
}: any) => {
  const { colorScheme } = useTheme();
  const [comment, setComment] = useState("");
  const [numberOfComments, setNumberOfComments] = useState(
    image.comments?.length
  );
  // const [commentsData, setCommentsData] = useState<any[]>([]);
  // const [author, setAuthor] = useState();

  const { profile } = useAuth();

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
          avatar:
            profile?.avatar ||
            "https://i.pinimg.com/736x/e0/90/1f/e0901fe498301d96aa23ad2fe9e4c9f0.jpg",
          firstName: profile?.firstName || "Anonymous",
          lastName: profile?.lastName || "Anonymous",
        },
        createAt: isoStringWithOffset,
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
      setNumberOfComments(numberOfComments + 1);
      setComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
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
              source={{
                uri:
                  image?.createBy.avatar ||
                  "https://i.pinimg.com/736x/d0/1f/7f/d01f7f7987f7b60bac995ee1d251025b.jpg",
              }}
              className="w-10 h-10 rounded-full"
            />
            <View className="ml-4">
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-msemibold text-[17px]"
              >
                {image?.createBy.firstName} {image?.createBy.lastName}
              </Text>
              <Text className="text-[#D9D9D9] font-mregular mt-1 text-sm">
                {image?.createAt && getTimestamp(image?.createAt)}
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
            {image?.caption}
          </Text>

          <Image
            source={{ uri: image?.url }}
            className="w-96 h-96 rounded-lg"
          />

          <MediaAction
            media={image}
            isModalVisible={isModalVisible}
            setModalVisible={setModalVisible}
            numberOfComments={numberOfComments}
          />

          {commentsData.length > 0 && (
            <View className="mt-2">
              {commentsData.map(
                (comment) =>
                  comment?.parentId === null && (
                    <View key={comment?._id}>
                      <CommentCard
                        comment={comment}
                        setCommentsData={setCommentsData}
                        author={image?.createBy}
                        mediaId={image?._id}
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
                className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg font-mmedium"
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

export default DetailImage;
