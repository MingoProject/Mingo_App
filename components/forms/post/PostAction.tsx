import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { LikeIcon, CommentIcon, ShareIcon } from "@/components/icons/Icons";

const PostAction = ({ isModalVisible, setModalVisible, post }: any) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  return (
    <View className="flex-row mt-2 justify-around">
      <TouchableOpacity className="flex-row items-center mr-4">
        <LikeIcon size={25} color={iconColor} />
        <Text
          className="ml-1 text-gray-700"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
        >
          {post.likes.length} Likes
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
        <ShareIcon size={25} color={iconColor} />
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
