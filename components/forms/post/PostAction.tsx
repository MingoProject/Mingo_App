import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { LikeIcon, CommentIcon, LinkIcon } from "@/components/icons/Icons";
import {
  dislikePost,
  getLikesByPostId,
  likePost,
} from "@/lib/service/post.service";
import { useAuth } from "@/context/AuthContext";
import { createNotification } from "@/lib/service/notification.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PostAction = ({ isModalVisible, setModalVisible, post }: any) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(post.likes.length);
  const [likes, setLikes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const data = await getLikesByPostId(post._id);
        setLikes(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setIsError(true);
        setIsLoading(false);
      }
    };
    fetchLikes();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const checkLike = async () => {
      const userId: string | null = await AsyncStorage.getItem("userId");
      if (userId) {
        try {
          const isUserLiked = post.likes.some((like: any) => like === userId);
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
        await likePost(post._id, token);
        if (profile._id !== post.author._id) {
          const params = {
            senderId: profile._id,
            receiverId: post.author._id,
            type: "like",
            postId: post._id,
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
        await dislikePost(post._id, token);
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

  return (
    <View className="flex-row mt-2 justify-around">
      <TouchableOpacity
        className="flex-row items-center mr-4"
        onPress={toggleLike}
      >
        <LikeIcon size={25} color={isLiked ? colors.primary[100] : iconColor} />
        <Text
          className="ml-1"
          style={{
            color: isLiked
              ? colors.primary[100]
              : colorScheme === "dark"
              ? colors.dark[100]
              : colors.light[500],
          }}
        >
          {isLiked ? "Liked" : "Like"} {numberOfLikes}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center mr-4"
        onPress={!isModalVisible ? () => setModalVisible(true) : undefined}
      >
        <CommentIcon size={25} color={iconColor} />
        <Text
          className="ml-1 text-gray-700"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
        >
          {post.comments.length} Comments
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center">
        <LinkIcon size={25} color={iconColor} />
        <Text
          className="ml-1 text-gray-700"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
        >
          {post.shares.length} Shares
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostAction;
