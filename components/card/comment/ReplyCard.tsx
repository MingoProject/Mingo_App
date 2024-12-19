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
import { ArrowRightIcon } from "@/components/icons/Icons";
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
import { createNotification } from "@/lib/service/notification.service";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommentMenu from "@/components/forms/comment/CommentMenu";

const ReplyCard = ({
  reply,
  setRepliesData,
  commentId,
  author,
  postId,
  mediaId,
}: any) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [detailsComment, setDetailsComment] = useState<any>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [parentComment, setParentComment] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const fetchDetailsComment = async () => {
      try {
        const details = await getCommentByCommentId(reply._id);
        if (isMounted) {
          setDetailsComment(details);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchDetailsComment();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchDetailsComment = async () => {
      try {
        if (detailsComment?.parentId?._id) {
          const parent = await getCommentByCommentId(
            detailsComment?.parentId?._id
          );
          setParentComment(parent);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchDetailsComment();
  }, [detailsComment]);

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
          { content: newComment, parentId: detailsComment._id },
          token,
          postId
        );
        if (newCommentData) {
          await addReplyToComment(commentId, newCommentData._id, token);
        }

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
            avatar: profile?.avatar || "/assets/images/default-avatar.jpg",
            firstName: profile?.firstName || "Anonymous",
            lastName: profile?.lastName || "Anonymous",
          },
          createAt: isoStringWithOffset,
        };

        setRepliesData((prev: any) => [enrichedComment, ...prev]);

        if (detailsComment.userId._id !== profile._id) {
          const notificationParams = {
            senderId: profile._id,
            receiverId: detailsComment.userId._id,
            type: "reply_comment",
            commentId: detailsComment._id,
            ...(postId && { postId }),
            ...(mediaId && { mediaId }),
          };

          await createNotification(notificationParams, token);
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
          { content: newComment, parentId: detailsComment._id },
          token,
          mediaId
        );
        if (newCommentData) {
          await addReplyToComment(commentId, newCommentData._id, token);
        }

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
            avatar: profile?.avatar || "/assets/images/default-avatar.jpg",
            firstName: profile?.firstName || "Anonymous",
            lastName: profile?.lastName || "Anonymous",
          },
          createAt: isoStringWithOffset,
        };

        setRepliesData((prev: any) => [enrichedComment, ...prev]);

        if (detailsComment.userId._id !== profile._id) {
          const notificationParams = {
            senderId: profile._id,
            receiverId: detailsComment.userId._id,
            type: "reply_comment",
            commentId: detailsComment._id,
            ...(postId && { postId }),
            ...(mediaId && { mediaId }),
          };

          await createNotification(notificationParams, token);
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
            source={{ uri: reply.userId.avatar }}
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
              {reply.userId.firstName} {reply.userId.lastName}{" "}
              {parentComment && (
                <>
                  <View className="pt-3">
                    <ArrowRightIcon size={20} color={iconColor} />
                  </View>

                  <Text
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[100]
                          : colors.light[500],
                    }}
                    className="font-msemibold  text-sm"
                  >
                    {parentComment.userId.firstName || ""}{" "}
                    {parentComment.userId.lastName || ""}
                  </Text>
                </>
              )}
            </Text>
            <Text
              className="text-sm mt-1 border-gray-400"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
            >
              {reply.content}
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
                {getTimestamp(reply.createAt)}
              </Text>
              <CommentAction
                comment={reply}
                setReplyingTo={setReplyingTo}
                postId={postId}
                mediaId={mediaId}
              />
            </View>
          </View>
        </View>
        {replyingTo === reply._id && (
          <View className="mt-2 ml-12 flex-row">
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Write a reply..."
              className="border w-52 border-gray-300 rounded-lg p-2 text-sm"
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
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <CommentMenu
            comment={reply}
            setCommentsData={setRepliesData}
            setModalVisible={setModalVisible}
            postId={postId}
            mediaId={mediaId}
          />
        </Modal>
      </TouchableOpacity>
    </View>
  );
};

export default ReplyCard;
