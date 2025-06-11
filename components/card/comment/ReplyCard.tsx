import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import { ArrowRightIcon } from "@/components/icons/Icons";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { getCommentByCommentId } from "@/lib/service/comment.service";
import CommentMenu from "@/components/forms/comment/CommentMenu";
import CommentActionCard from "./CommentActionCard";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import { UserBasicInfo } from "@/dtos/UserDTO";

interface ReplyCardProps {
  reply: CommentResponseDTO;
  setRepliesData: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  repliesData: CommentResponseDTO[];
  profileBasic: UserBasicInfo;
  commentId: string;
  author: UserBasicInfo;
  postId?: string;
  mediaId?: string;
  setNumberOfComments: React.Dispatch<React.SetStateAction<number>>;
  numberOfComments: number;
  setCommentsData: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
}

const ReplyCard = ({
  reply,
  repliesData,
  setRepliesData,
  commentId,
  profileBasic,
  author,
  postId,
  mediaId,
  setNumberOfComments,
  numberOfComments,
  setCommentsData,
}: ReplyCardProps) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  const [isModalVisible, setModalVisible] = useState(false);

  const handleLongPress = () => {
    setModalVisible(true);
  };

  return (
    <View>
      <TouchableOpacity onLongPress={handleLongPress}>
        <View className="flex-row my-2">
          <Image
            source={{
              uri:
                reply?.author?.avatar ||
                "https://i.pinimg.com/736x/9a/00/82/9a0082d8f710e7b626a114657ec5b781.jpg",
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
              {reply?.author?.firstName} {reply?.author?.lastName}{" "}
              {reply?.parentId?._id !== reply?.originalCommentId && (
                <>
                  <View className="">
                    <ArrowRightIcon size={20} color={iconColor} />
                  </View>

                  <Text
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[100]
                          : colors.light[100],
                    }}
                    className="font-mmedium text-[16px]"
                  >
                    {reply?.parentId?.firstName || reply?.parentId?.lastName
                      ? `${reply?.parentId?.firstName || ""} ${reply?.parentId?.lastName || ""}`
                      : "Comment was deleted"}
                  </Text>
                </>
              )}
            </Text>
            <View
              className=" rounded-r-[20px] rounded-bl-[20px] px-[15px] py-[10px]  self-start"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[400] : colors.light[400],
              }}
            >
              <Text
                className="text-[16px] font-mregular inline-block"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                {reply.content}
              </Text>
            </View>

            <CommentActionCard
              comment={reply}
              setNumberOfComments={setNumberOfComments}
              numberOfComments={numberOfComments}
              profileBasic={profileBasic}
              postId={postId}
              mediaId={mediaId}
              author={author}
              originalCommentId={commentId}
              setRepliesData={setRepliesData}
            />
          </View>
        </View>
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <CommentMenu
            comment={reply}
            // commentsData={repliesData}
            setCommentsData={setRepliesData}
            setModalVisible={setModalVisible}
            postId={postId}
            mediaId={mediaId}
            setNumberOfComments={setNumberOfComments}
            numberOfComments={numberOfComments}
          />
        </Modal>
      </TouchableOpacity>
    </View>
  );
};

export default ReplyCard;
