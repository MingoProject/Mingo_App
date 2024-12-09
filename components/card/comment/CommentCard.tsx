import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { getTimestamp } from "@/lib/utils";
import CommentAction from "@/components/forms/comment/CommentAction";
import {
  addReplyToComment,
  createReplyComment,
  getCommentByCommentId,
} from "@/lib/service/comment.service";
import { useAuth } from "@/context/AuthContext";
import { createNotification } from "@/lib/service/notification.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReplyCard from "./ReplyCard";
import CommentMenu from "@/components/forms/comment/CommentMenu";

const CommentCard = ({
  comment,
  setCommentsData,
  author,
  postId,
  mediaId,
}: any) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [isModalVisible, setModalVisible] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [repliesData, setRepliesData] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );
  const { profile } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchReplies = async () => {
      try {
        const replies = comment.replies || [];

        const detailedReplies = await Promise.all(
          replies.map(async (reply: any) => {
            const detailedReply = await getCommentByCommentId(reply._id);
            return detailedReply;
          })
        );

        if (isMounted) {
          setRepliesData(detailedReplies);
        }
      } catch (error) {
        console.error("Failed to fetch replies:", error);
        if (isMounted) {
          setRepliesData([]);
        }
      }
    };

    fetchReplies();

    return () => {
      isMounted = false;
    };
  }, [comment]);

  const handleReplyComment = async () => {
    const token: string | null = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    if (!newComment.trim() || !replyingTo) {
      console.warn("Comment cannot be empty or no comment to reply to");
      return;
    }

    try {
      const newCommentData = await createReplyComment(
        { content: newComment },
        token
      );
      if (newCommentData) {
        await addReplyToComment(replyingTo, newCommentData._id, token);
      }

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

      setRepliesData((prev) => [enrichedComment, ...prev]);

      if (comment.userId._id !== profile._id) {
        const notificationParams = {
          senderId: profile._id,
          receiverId: comment.userId._id,
          type: "reply_comment",
          commentId: comment._id,
          ...(postId && { postId }),
          ...(mediaId && { mediaId }),
        };

        await createNotification(notificationParams, token);
      }

      const notificationParams2 = {
        senderId: profile._id,
        receiverId: author._id,
        type: "comment",
        ...(postId && { postId }),
        ...(mediaId && { mediaId }),
      };

      await createNotification(notificationParams2, token);

      console.log("da rep");
      setNewComment("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Failed to reply to comment:", error);
    }
  };

  const handleLongPress = () => {
    setModalVisible(true);
  };

  return (
    <View>
      <TouchableOpacity onLongPress={handleLongPress}>
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
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                {getTimestamp(comment.createAt)}
              </Text>
              <CommentAction
                comment={comment}
                setReplyingTo={setReplyingTo}
                postId={postId}
                mediaId={mediaId}
              />
            </View>
            {comment.replies?.length > 0 && (
              <TouchableOpacity onPress={() => setShowReplies(!showReplies)}>
                <Text className="text-blue-500 text-sm mt-2">
                  {showReplies
                    ? "Hide replies"
                    : `${comment.replies.length} replies`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {replyingTo === comment._id && (
          <View className="mt-2 ml-12 flex-row">
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Write a reply..."
              className="border w-60 border-gray-300 rounded-lg p-2 text-sm"
            />
            <TouchableOpacity
              onPress={handleReplyComment}
              className="bg-blue-500  rounded-lg ml-2 px-3 py-2 flex-row justify-center items-center"
            >
              <Text className="text-white text-sm">Reply</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setReplyingTo(null)}
              className=" rounded-lg ml-2 py-2 flex-row justify-center items-center"
            >
              <Text className="text-sm">X</Text>
            </TouchableOpacity>
          </View>
        )}
        {showReplies && Array.isArray(repliesData) && (
          <View className="my-2 ml-10">
            {repliesData.map((reply: any) => (
              <View key={reply._id}>
                <ReplyCard
                  reply={reply}
                  setRepliesData={setRepliesData}
                  commentId={comment._id}
                  author={author}
                  postId={postId}
                  mediaId={mediaId}
                />
              </View>
            ))}
          </View>
        )}
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <CommentMenu
            comment={comment}
            setCommentsData={setCommentsData}
            setModalVisible={setModalVisible}
            postId={postId}
            mediaId={mediaId}
          />
        </Modal>
      </TouchableOpacity>
    </View>
  );
};

export default CommentCard;
