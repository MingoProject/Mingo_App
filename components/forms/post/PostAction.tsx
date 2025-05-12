import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { LikeIcon, CommentIcon } from "@/components/icons/Icons";
import { dislikePost, likePost } from "@/lib/service/post.service";
import { useAuth } from "@/context/AuthContext";
import { createNotification } from "@/lib/service/notification.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PostResponseDTO } from "@/dtos/PostDTO";
interface PostActionProps {
  openModal?: () => void;
  post: PostResponseDTO;
  numberOfLikes: number;
  setNumberOfLikes: React.Dispatch<React.SetStateAction<number>>;
  isLiked: boolean;
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>;
  numberOfComments: number;
}
const PostAction = ({
  openModal,
  post,
  numberOfLikes,
  setNumberOfLikes,
  isLiked,
  setIsLiked,
  numberOfComments,
}: PostActionProps) => {
  const { colorScheme } = useTheme();
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];
  const { profile } = useAuth();

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

  return (
    <View className=" mt-2 pl-3">
      <View className="flex flex-row gap-3">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={toggleLike}
        >
          <LikeIcon
            size={25}
            color={isLiked ? colors.primary[100] : iconColor}
            fillColor={isLiked ? colors.primary[100] : "none"}
          />
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
          onPress={openModal}
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
      </View>

      {/* <TouchableOpacity className="flex-row items-center">
        <LinkIcon size={25} color={iconColor} />
        <Text
          className="ml-1 font-mmedium"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[100],
          }}
        >
          {post.shares.length} Shares
        </Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default PostAction;
