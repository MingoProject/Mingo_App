import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { getTimestamp } from "@/lib/utils";
import CommentAction from "@/components/forms/comment/CommentAction";
import {
  addReplyToComment,
  createReplyCommentPost,
  createReplyCommentMedia,
  getCommentByCommentId,
} from "@/lib/service/comment.service";
import { useAuth } from "@/context/AuthContext";
import { createNotification } from "@/lib/service/notification.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReplyCard from "./ReplyCard";
import CommentMenu from "@/components/forms/comment/CommentMenu";
import { CancelIcon } from "@/components/icons/Icons";
import { CommentResponseDTO } from "@/dtos/CommentDTO";

const CommentCard = ({
  comment,
  commentsData,
  setCommentsData,
  author,
  postId,
  mediaId,
  setNumberOfComments,
  numberOfComments,
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

  const toggleShowReplies = async () => {
    const nextShow = !showReplies;
    setShowReplies(nextShow);

    if (
      nextShow &&
      Array.isArray(comment.replies) &&
      comment.replies.length > 0
    ) {
      try {
        const detailsComments: CommentResponseDTO[] = await Promise.all(
          comment.replies.map(async (replyId: string) => {
            return await getCommentByCommentId(replyId);
          })
        );
        setRepliesData(detailsComments);
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    }
  };

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
      setNewComment("");
      setReplyingTo(null);
      if (postId) {
        const newCommentData = await createReplyCommentPost(
          {
            content: newComment,
            parentId: comment._id,
            originalCommentId: comment._id,
          },
          token,
          postId
        );
        if (newCommentData) {
          await addReplyToComment(replyingTo, newCommentData._id, token);
        }

        const currentTime = new Date();
        const isoStringWithOffset = currentTime
          .toISOString()
          .replace("Z", "+00:00");

        const enrichedComment = {
          ...newCommentData,
          userId: {
            _id: profile?._id,
            avatar: profile?.avatar || "/assets/images/default-avatar.jpg",
            firstName: profile?.firstName || "Anonymous",
            lastName: profile?.lastName || "Anonymous",
          },
          createAt: isoStringWithOffset,
        };

        console.log(enrichedComment);

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

        if (author._id !== profile._id) {
          const notificationParams2 = {
            senderId: profile._id,
            receiverId: author._id,
            type: "comment",
            ...(postId && { postId }),
            ...(mediaId && { mediaId }),
          };
          await createNotification(notificationParams2, token);
        }
      } else {
        const newCommentData = await createReplyCommentMedia(
          {
            content: newComment,
            parentId: comment._id,
            originalCommentId: comment._id,
          },
          token,
          mediaId
        );
        if (newCommentData) {
          await addReplyToComment(replyingTo, newCommentData._id, token);
        }

        const currentTime = new Date();
        const isoStringWithOffset = currentTime
          .toISOString()
          .replace("Z", "+00:00");

        const enrichedComment = {
          ...newCommentData,
          userId: {
            _id: profile?._id,
            avatar: profile?.avatar || "/assets/images/default-avatar.jpg",
            firstName: profile?.firstName || "Anonymous",
            lastName: profile?.lastName || "Anonymous",
          },
          createAt: isoStringWithOffset,
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

        if (author._id !== profile._id) {
          const notificationParams2 = {
            senderId: profile._id,
            receiverId: author._id,
            type: "comment",
            ...(postId && { postId }),
            ...(mediaId && { mediaId }),
          };
          await createNotification(notificationParams2, token);
        }
      }
      setNumberOfComments(numberOfComments + 1);
    } catch (error) {
      console.error("Failed to reply to comment:", error);
    }
  };

  const handleLongPress = () => {
    setModalVisible(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableOpacity onLongPress={handleLongPress}>
        <View className="flex-row my-2">
          <Image
            source={{
              uri:
                comment.author?.avatar ||
                "https://i.pinimg.com/236x/88/bd/6b/88bd6bd828ec509f4bda0d9f9450824d.jpg",
            }}
            className="w-11 h-11 rounded-full"
          />
          <View className="ml-3">
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
              className="font-mmedium text-[16px]"
            >
              {comment.author.firstName} {comment.author.lastName}
            </Text>
            <View
              className=" rounded-r-[20px] rounded-bl-[20px] px-[15px] py-[10px]  self-start"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[400] : colors.light[400],
              }}
            >
              <Text
                className="text-[16px] font-normal inline-block"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                {comment.content}
              </Text>
            </View>

            <View className="flex-row">
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
              <TouchableOpacity onPress={toggleShowReplies}>
                <Text className="text-primary-100 text-sm mt-2 font-mmedium">
                  {showReplies
                    ? "Hide replies"
                    : `${comment.replies?.length} replies`}
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
              className="border w-[220px] border-gray-300 rounded-lg p-2 text-sm font-mmedium"
            />
            <TouchableOpacity
              onPress={handleReplyComment}
              className="bg-primary-100  rounded-lg ml-2 px-3 py-2 flex-row justify-center items-center"
            >
              <Text className="text-white text-sm font-mbold">Reply</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setReplyingTo(null)}
              className=" rounded-lg ml-2 py-2 flex-row justify-center items-center"
            >
              <CancelIcon size={20} color={iconColor} />
            </TouchableOpacity>
          </View>
        )}
        {showReplies && Array.isArray(repliesData) && (
          <View className="my-2 ml-10">
            {repliesData.map((reply: any) => (
              <View key={reply._id}>
                <ReplyCard
                  reply={reply}
                  repliesData={repliesData}
                  setRepliesData={setRepliesData}
                  commentId={comment._id}
                  author={author}
                  postId={postId}
                  mediaId={mediaId}
                  setNumberOfComments={setNumberOfComments}
                  numberOfComments={numberOfComments}
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
            commentsData={commentsData}
            setCommentsData={setCommentsData}
            setModalVisible={setModalVisible}
            postId={postId}
            mediaId={mediaId}
            setNumberOfComments={setNumberOfComments}
            numberOfComments={numberOfComments}
            repliesCount={repliesData?.length}
          />
        </Modal>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default CommentCard;
