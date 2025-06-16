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
import CommentCard from "@/components/card/comment/CommentCard";
import { MediaResponseDTO } from "@/dtos/MediaDTO";
import { UserBasicInfo } from "@/dtos/UserDTO";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import MediaAction from "@/components/forms/media/MediaAction";
import Button from "@/components/shared/ui/button";
import { useRouter } from "expo-router";
import Input from "@/components/shared/ui/input";
import PostHeader from "@/components/shared/post/PostHeader";
import { SendIcon } from "@/components/shared/icons/Icons";
interface MediaDetailCardProps {
  media: MediaResponseDTO;
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  profileBasic: UserBasicInfo;
  commentsData: CommentResponseDTO[];
  setCommentsData: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
}
const MediaDetailCard = ({
  isModalVisible,
  setModalVisible,
  media,
  profileBasic,
  commentsData,
  setCommentsData,
}: MediaDetailCardProps) => {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const [comment, setComment] = useState("");
  const [numberOfComments, setNumberOfComments] = useState(
    media.comments?.length
  );

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
        media._id
      );

      const currentTime = new Date();
      const enrichedComment: CommentResponseDTO = {
        ...newCommentData,
        author: {
          _id: profileBasic?._id,
          avatar: profileBasic?.avatar || "/assets/images/default-avatar.jpg",
          firstName: profileBasic?.firstName || "Anonymous",
          lastName: profileBasic?.lastName || "Anonymous",
        },
        createAt: currentTime,
        likes: [],
      };

      setCommentsData((prev: any) => [enrichedComment, ...prev]);

      if (media.createBy._id !== profileBasic._id) {
        const notificationParams = {
          senderId: profileBasic._id,
          receiverId: media.createBy._id,
          type: "comment_media",
          mediaId: media._id,
        };

        await createNotification(notificationParams, token);
      }

      // setCommentsData((prev) => [newCommentData, ...prev]);
      setNumberOfComments(numberOfComments + 1);
      setComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const navigateToUserProfile = (item: any) => {
    if (item === profileBasic._id) {
      router.push(`/profile`);
    } else {
      router.push(`/user/${item}`);
    }
  };
  return (
    <View
      className="flex-1 bg-opacity-50"
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[500] : colors.light[500],
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[200] : colors.light[200],
          }}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
          className="flex-1 px-[20px]"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
              className="font-msemibold text-[24px]"
            >
              Image Details
            </Text>
            <Button
              title="Close"
              size="small"
              color="transparent"
              onPress={() => setModalVisible(false)}
            />
          </View>

          {/* Author Info */}
          <View className="flex-row items-center mb-2 space-x-2">
            <TouchableOpacity
              onPress={() => navigateToUserProfile(media.createBy?._id)}
            >
              <Image
                source={{
                  uri:
                    media.createBy?.avatar ||
                    "https://i.pinimg.com/236x/88/bd/6b/88bd6bd828ec509f4bda0d9f9450824d.jpg",
                }}
                className="w-10 h-10 rounded-full"
              />
            </TouchableOpacity>
            <View className="flex flex-col gap-2">
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                  fontSize: 16,
                }}
                className="font-mmedium"
              >
                {media.createBy?.firstName || ""}{" "}
                {media.createBy?.lastName || ""}
              </Text>
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[300]
                      : colors.light[300],
                  fontSize: 12,
                }}
                className="font-mregular"
              >
                {getTimestamp(media.createAt)}
              </Text>
            </View>
          </View>

          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[100],
            }}
            className="mb-4 font-mregular text-[16px]"
          >
            {media?.caption}
          </Text>

          <Image
            source={{ uri: media?.url }}
            className="w-96 h-96 rounded-lg"
          />

          <MediaAction
            media={media}
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
                        commentsData={commentsData}
                        setCommentsData={setCommentsData}
                        author={media?.createBy}
                        mediaId={media?._id}
                        profileBasic={profileBasic}
                        setNumberOfComments={setNumberOfComments}
                        numberOfComments={numberOfComments}
                      />
                    </View>
                  )
              )}
            </View>
          )}
        </ScrollView>
        <View
          className="absolute bottom-0 left-0 right-0 px-2 py-2"
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[200] : colors.light[200],
          }}
        >
          <View className="w-full flex-row items-center space-x-2">
            <View className="flex-1">
              <Input
                avatarSrc={profileBasic?.avatar || "/assets/images/capy.jpg"}
                placeholder="Write a comment"
                readOnly={false}
                value={comment}
                onChange={(e) => setComment(e)}
              />
            </View>
            <TouchableOpacity onPress={handleSendComment}>
              <SendIcon size={27} color={colors.primary[100]} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default MediaDetailCard;
