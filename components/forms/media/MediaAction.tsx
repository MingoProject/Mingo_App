import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import {
  LikeIcon,
  CommentIcon,
  ShareIcon,
} from "@/components/shared/icons/Icons";
import {
  dislikePost,
  getLikesByPostId,
  likePost,
} from "@/lib/service/post.service";
import { useAuth } from "@/context/AuthContext";
import { createNotification } from "@/lib/service/notification.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  dislikeMedia,
  getLikesByMediaId,
  likeMedia,
} from "@/lib/service/media.service";

const MediaAction = ({
  isModalVisible,
  setModalVisible,
  media,
  numberOfComments,
}: any) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(media.likes.length);

  const { profile } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const checkLike = async () => {
      const userId: string | null = await AsyncStorage.getItem("userId");
      if (userId) {
        try {
          const isUserLiked = media.likes.some((like: any) => like === userId);
          if (isMounted) {
            setIsLiked(isUserLiked);
          }
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    };
    checkLike();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLikePost = async () => {
    try {
      const token: string | null = await AsyncStorage.getItem("token");
      if (token) {
        await likeMedia(media._id, token);
        if (profile._id !== media.createBy._id) {
          const params = {
            senderId: profile._id,
            receiverId: media.createBy._id,
            type: "like",
            mediaId: media._id,
          };
          await createNotification(params, token);
        }
        console.log("da like");
      } else {
        console.warn("User is not authenticated");
      }
    } catch (error) {
      console.error("Error in handleLikePost:", error);
    }
  };

  const handleDislikePost = async () => {
    try {
      const token: string | null = await AsyncStorage.getItem("token");
      if (token) {
        await dislikeMedia(media._id, token);
        console.log("da dislike");
      } else {
        console.warn("User is not authenticated");
      }
    } catch (error) {
      console.error("Error in handleDislikePost:", error);
    }
  };

  const toggleLike = async () => {
    if (isLiked) {
      setIsLiked(false);
      setNumberOfLikes((prev: any) => prev - 1);
      await handleDislikePost();
    } else {
      setIsLiked(true);
      setNumberOfLikes((prev: any) => prev + 1);
      await handleLikePost();
    }
  };

  return (
    <View className="flex-row mt-2 justify-around">
      <TouchableOpacity className="flex-row items-center" onPress={toggleLike}>
        <LikeIcon size={25} color={isLiked ? colors.primary[100] : iconColor} />
        <Text
          className="ml-1 font-mmedium"
          style={{
            color: isLiked
              ? colors.primary[100]
              : colorScheme === "dark"
                ? colors.dark[100]
                : colors.light[100],
          }}
        >
          {numberOfLikes} {isLiked ? "Liked" : "Like"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center mr-4"
        onPress={!isModalVisible ? () => setModalVisible(true) : undefined}
      >
        <CommentIcon size={25} color={iconColor} />
        <Text
          className="ml-1 font-mmedium"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[100],
          }}
        >
          {numberOfComments} Comments
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center">
        <ShareIcon size={25} color={iconColor} />
        <Text
          className="ml-1 text-gray-700 font-mmedium"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[100],
          }}
        >
          {media.shares.length} Shares
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MediaAction;
