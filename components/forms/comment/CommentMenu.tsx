import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { getTimestamp } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  deleteComment,
  deleteCommentMedia,
  deleteCommentReply,
  deleteCommentReplyMedia,
  updateComment,
} from "@/lib/service/comment.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReportCard from "@/components/card/report/ReportCard";

const CommentMenu = ({
  comment,
  commentsData,
  setCommentsData,
  setModalVisible,
  postId,
  mediaId,
  setNumberOfComments,
  numberOfComments,
  repliesCount,
}: any) => {
  const [newComment, setNewComment] = useState(comment.content); // Khởi tạo giá trị mặc định là content
  const [isEditing, setIsEditing] = useState(false);
  const [isReport, setIsReport] = useState(false);

  const { profile } = useAuth();

  const closeReport = () => {
    setIsReport(false);
  };

  const handleEditComment = async (
    commentId: string,
    updatedContent: string
  ) => {
    const token: string | null = await AsyncStorage.getItem("token");
    if (!token || !updatedContent.trim()) return;

    try {
      const updatedComment = await updateComment(
        { content: updatedContent },
        commentId,
        token
      );
      setCommentsData((prev: any) =>
        prev.map((comment: any) =>
          comment._id === commentId
            ? { ...comment, content: updatedComment.comment.content }
            : comment
        )
      );
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    const token: string | null = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    try {
      if (postId) {
        if (comment.originalCommentId === null) {
          await deleteComment(commentId, postId, token);
          setNumberOfComments(numberOfComments - (repliesCount + 1));
          setCommentsData((prev: any) =>
            prev.filter((comment: any) => comment._id !== commentId)
          );
        } else {
          const childReplies = commentsData.filter(
            (comment: any) => comment.parentId === commentId
          );
          setCommentsData((prev: any) =>
            prev.filter(
              (comment: any) =>
                comment._id !== commentId &&
                !childReplies.some((child: any) => child._id === comment._id)
            )
          );
          await deleteCommentReply(
            commentId,
            postId,
            comment.originalCommentId,
            token
          );
          setNumberOfComments(numberOfComments - (childReplies.length + 1));
        }
      } else {
        if (comment.originalCommentId === null) {
          await deleteCommentMedia(commentId, mediaId, token);
          setNumberOfComments(numberOfComments - (repliesCount + 1));
          setCommentsData((prev: any) =>
            prev.filter((comment: any) => comment._id !== commentId)
          );
        } else {
          const childReplies = commentsData.filter(
            (comment: any) => comment.parentId === commentId
          );
          setCommentsData((prev: any) =>
            prev.filter(
              (comment: any) =>
                comment._id !== commentId &&
                !childReplies.some((child: any) => child._id === comment._id)
            )
          );
          await deleteCommentReplyMedia(
            commentId,
            mediaId,
            comment.originalCommentId,
            token
          );
          setNumberOfComments(numberOfComments - (childReplies.length + 1));
        }
      }

      setCommentsData(
        (prev: any) => prev.filter((comment: any) => comment._id !== commentId) // Remove deleted comment from state
      );
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };
  const handleReportComment = () => {
    setIsReport(true);
    console.log("Báo cáo comment");
  };

  return (
    <View className="flex-1 justify-center items-center">
      <View className="bg-white rounded-lg p-4 w-3/4 shadow-lg">
        {isEditing ? (
          <View>
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              className="border border-gray-300 rounded-lg p-2 text-sm"
              placeholder="Sửa bình luận..."
            />
            <View className="flex-row mt-4">
              <TouchableOpacity
                onPress={() => handleEditComment(comment._id, newComment)}
                className="bg-primary-100 rounded-lg px-3 py-2 mr-2"
              >
                <Text className="text-white text-base">Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                className="bg-gray-300 rounded-lg px-3 py-2"
              >
                <Text className="text-gray-600 text-base">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {comment.userId._id === profile._id ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setIsEditing(true);
                    console.log("isEditing set to true");
                  }}
                  className="mb-4"
                >
                  <Text className="text-blue-500 text-base">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteComment(comment._id, postId)}
                  className="mb-4"
                >
                  <Text className="text-red-500 text-base">Delete</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={handleReportComment} className="mb-4">
                <Text className="text-yellow-500 text-base">Report</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-2"
            >
              <Text className="text-gray-500 text-base">Close</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <Modal
        animationType="none"
        visible={isReport}
        onRequestClose={closeReport}
        transparent={true}
      >
        <ReportCard
          onClose={closeReport}
          type="comment"
          entityId={comment._id}
          reportedId={profile._id || ""}
          postId={postId}
        />
      </Modal>
    </View>
  );
};

export default CommentMenu;
