import React, { useEffect, useRef, useState } from "react";
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
import {
  createCommentMedia,
  getCommentByCommentId,
} from "@/lib/service/comment.service";
import { useAuth } from "@/context/AuthContext";
import MediaAction from "./MediaAction";
import CommentCard from "@/components/card/comment/CommentCard";
import {
  getAuthorByMediaId,
  getCommentsByMediaId,
} from "@/lib/service/media.service";
import { Video, ResizeMode } from "expo-av";

const DetailVideo = ({ isModalVisible, setModalVisible, video }: any) => {
  const { colorScheme } = useTheme();
  const [comment, setComment] = useState("");
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [author, setAuthor] = useState();

  const { profile } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const fetchCommentsData = async () => {
      const detailsComments = await Promise.all(
        video?.comments.map(async (comment: any) => {
          return await getCommentByCommentId(comment);
        })
      );

      if (isMounted) {
        setCommentsData(detailsComments);
      }
      // console.log(detailsComments);
    };

    if (video?.comments.length > 0) {
      fetchCommentsData();
    }
    return () => {
      isMounted = false;
    };
  }, [video?.comments]);

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
        video._id
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

      if (video.createBy._id !== profile._id) {
        const notificationParams = {
          senderId: profile._id,
          receiverId: video.createBy._id,
          type: "comment",
          imageId: video._id,
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
            source={{
              uri:
                video?.createBy.avatar ||
                "https://i.pinimg.com/736x/d0/1f/7f/d01f7f7987f7b60bac995ee1d251025b.jpg",
            }}
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
              {video?.createBy.firstName} {video?.createBy.lastName}
            </Text>
            <Text className="text-[#D9D9D9] font-mregular mt-1 text-sm">
              {video?.createAt && getTimestamp(video?.createAt)}
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
          {video?.caption}
        </Text>

        <VideoPlayer videoUrl={video?.url} />
        {/* <Image source={{ uri: video?.url }} className="w-96 h-96 rounded-lg" /> */}

        <MediaAction
          media={video}
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
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
                      author={video?.createBy}
                      mediaId={video?._id}
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

export default DetailVideo;
