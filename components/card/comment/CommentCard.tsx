import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { getTimestamp } from "@/lib/utils";
import CommentAction from "@/components/forms/comment/CommentAction";

const CommentCard = ({ comment, postId }: any) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View className="flex-row items-center my-2">
      <Image
        source={{ uri: comment.userId.avatar }}
        className="w-11 h-11 rounded-full"
      />
      <View className="ml-3">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="font-msemibold text-sm"
        >
          {comment.userId.firstName} {comment.userId.lastName}
        </Text>
        <Text
          className="text-sm mt-1 border-gray-400"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
        >
          {comment.content}
        </Text>
        <View className="flex-row">
          <Text
            className="text-xs"
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
          >
            {getTimestamp(comment.createAt)}
          </Text>
          <CommentAction comment={comment} postId={postId} />
        </View>
      </View>
    </View>
  );
};

export default CommentCard;
