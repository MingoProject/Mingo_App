import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { useAuth } from "@/context/AuthContext";
import { createNotification } from "@/lib/service/notification.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dislikeComment, likeComment } from "@/lib/service/comment.service";

const CommentAction = ({ comment, setReplyingTo, postId, mediaId }: any) => {
  const { colorScheme } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(comment.likes.length);
  const { profile } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const checkLike = async () => {
      const userId: string | null = await AsyncStorage.getItem("userId");
      if (userId) {
        try {
          const isUserLiked = comment.likes.some(
            (like: any) => like === userId
          );
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

  const handleLikeComment = async () => {
    try {
      const token: string | null = await AsyncStorage.getItem("token");
      if (token) {
        await likeComment(comment._id, token);
        setIsLiked(!isLiked);
        if (profile._id !== comment.userId._id) {
          const params = {
            senderId: profile._id,
            receiverId: comment.userId._id,
            type: "like_comment",
            commentId: comment._id,
            ...(postId && { postId }),
            ...(mediaId && { mediaId }),
          };
          await createNotification(params, token);
        }
      } else {
        console.warn("User is not authenticated");
      }
    } catch (error) {
      console.error("Error in handleLikePost:", error);
    }
  };

  const handleDislikeComment = async () => {
    try {
      const token: string | null = await AsyncStorage.getItem("token");
      if (token) {
        await dislikeComment(comment._id, token);

        setIsLiked(!isLiked);
      } else {
        console.warn("User is not authenticated");
      }
    } catch (error) {
      console.error("Error in handleLikePost:", error);
    }
  };

  const toggleLike = async () => {
    if (isLiked) {
      setIsLiked(false);
      setNumberOfLikes((prev: any) => prev - 1);
      await handleDislikeComment();
    } else {
      setIsLiked(true);
      setNumberOfLikes((prev: any) => prev + 1);
      await handleLikeComment();
    }
  };

  return (
    <View className="flex-row">
      <TouchableOpacity onPress={toggleLike}>
        <Text
          className="ml-2 text-xs font-mmedium"
          style={{
            color: isLiked
              ? colors.primary[100]
              : colorScheme === "dark"
                ? colors.dark[100]
                : colors.light[100],
          }}
        >
          Like
        </Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text
          className="ml-1 text-xs font-mmedium"
          style={{
            color: isLiked
              ? colors.primary[100]
              : colorScheme === "dark"
                ? colors.dark[100]
                : colors.light[100],
          }}
        >
          {numberOfLikes}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setReplyingTo(comment._id)}>
        <Text
          className="ml-2 text-xs font-mmedium"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[100],
          }}
        >
          Reply
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CommentAction;
