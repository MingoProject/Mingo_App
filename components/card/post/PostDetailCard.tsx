import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { getTimestamp } from "@/lib/utils";
import { createNotification } from "@/lib/service/notification.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createComment } from "@/lib/service/comment.service";
import { useAuth } from "@/context/AuthContext";
import CommentCard from "@/components/card/comment/CommentCard";
import { ResizeMode, Video } from "expo-av";
import { FriendIcon, LocationIcon, ThreeDot } from "@/components/icons/Icons";
import TagModal from "../../modal/post/TagsModal";
import { useRouter } from "expo-router";
import PostAction from "@/components/forms/post/PostAction";
import PostMenu from "@/components/forms/post/PostMenu";
import { PostResponseDTO } from "@/dtos/PostDTO";
import { UserBasicInfo } from "@/dtos/UserDTO";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import PostHeader from "@/components/share/post/PostHeader";
import Button from "@/components/share/ui/button";
import Input from "@/components/share/ui/input";

interface PostDetailCardProps {
  post: PostResponseDTO;
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  profileBasic: UserBasicInfo;
  numberOfLikes: number;
  setNumberOfLikes: React.Dispatch<React.SetStateAction<number>>;
  isLiked: boolean;
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>;
  setNumberOfComments: React.Dispatch<React.SetStateAction<number>>;
  numberOfComments: number;
  commentsData: CommentResponseDTO[];
  setCommentsData: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  setPostsData?: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>;
}

const PostDetailCard = ({
  isModalVisible,
  setModalVisible,
  post,
  profileBasic,
  setPostsData,
  numberOfLikes,
  setNumberOfLikes,
  isLiked,
  setIsLiked,
  setNumberOfComments,
  numberOfComments,
  commentsData,
  setCommentsData,
}: PostDetailCardProps) => {
  const { colorScheme } = useTheme();
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];
  const [comment, setComment] = useState("");
  const { profile } = useAuth();
  const menuRef = useRef<TouchableOpacity | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isMenuVisible, setMenuVisible] = useState(false);
  const isAuthor = profile?._id === post.author._id;
  const router = useRouter();
  const handleSendComment = async () => {
    const token: string | null = await AsyncStorage.getItem("token");

    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    if (!comment.trim()) {
      console.warn("Comment cannot be empty");
      return;
    }

    try {
      const newCommentData = await createComment(
        { content: comment },
        token,
        post?._id
      );

      const currentTime = new Date();
      const enrichedComment: CommentResponseDTO = {
        ...newCommentData,
        author: {
          _id: profileBasic?._id,
          avatar: profileBasic?.avatar || "/assets/images/default-avatar.jpg",
          firstName: profileBasic?.firstName || "Anonymous",
          lastName: profileBasic?.lastName || "Anonymous",
        },
        createAt: currentTime,
        likes: [],
      };
      post.comments = [newCommentData._id, ...post.comments];

      setCommentsData((prev: any) => [enrichedComment, ...prev]);

      if (post?.author._id !== profileBasic._id) {
        const notificationParams = {
          senderId: profileBasic._id,
          receiverId: post?.author._id,
          type: "comment",
          postId: post?._id,
        };

        await createNotification(notificationParams, token);
      }
      setNumberOfComments(numberOfComments + 1);
      setComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <View className="flex-1 bg-black bg-opacity-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[200] : colors.light[200],
          }}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
          className="flex-1 px-[20px] pt-[10px]"
        >
          <View className="flex-row mt-7 justify-between items-center mb-4">
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
              className="font-msemibold text-lg"
            >
              Post Details
            </Text>
            <Button
              title="Close"
              size="small"
              color="transparent"
              border="border border-border-100"
              fontColor="text-dark100_light100"
              onPress={() => setModalVisible(false)}
            />
          </View>
          //Header
          <View className="flex-row items-center mb-2">
            <PostHeader
              post={post}
              setPostsData={setPostsData}
              profileBasic={profileBasic}
            />

            <TouchableOpacity
              ref={menuRef}
              className="ml-auto mb-2"
              onPress={() => {
                menuRef.current?.measure(
                  (
                    fx: any,
                    fy: any,
                    width: any,
                    height: any,
                    px: any,
                    py: any
                  ) => {
                    setMenuPosition({ x: px, y: py + height });
                  }
                );
                setMenuVisible(true);
              }}
            >
              <ThreeDot size={20} color={iconColor} />
            </TouchableOpacity>
          </View>
          {isMenuVisible && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={isMenuVisible}
              onRequestClose={() => setMenuVisible(false)}
            >
              <View
                style={{
                  position: "absolute",
                  top: menuPosition.y,
                  right: menuPosition.x - 250,
                  backgroundColor: "white",
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <PostMenu
                  isAuthor={isAuthor}
                  item={post}
                  setMenuVisible={setMenuVisible}
                  setPostsData={setPostsData}
                />
              </View>
            </Modal>
          )}
          //caption
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[100],
            }}
            className="mb-4 font-mregular text-[16px]"
          >
            {post.content}
          </Text>
          {post.location && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
              className="flex"
            >
              <LocationIcon size={14} color={colors.primary[100]} />
              <Text> </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.primary[100],
                }}
                className="font-mregular"
              >
                {post.location}
              </Text>
            </View>
          )}
          //Media
          {post.media && (
            <FlatList
              data={post.media}
              horizontal
              keyExtractor={(media) => media._id}
              renderItem={({ item: media }) => (
                <View className="mr-2">
                  {media.type === "image" ? (
                    <Image
                      source={{ uri: media.url }}
                      className="w-96 h-96 rounded-lg"
                    />
                  ) : media.type === "video" ? (
                    <VideoPlayer videoUrl={media.url} />
                  ) : (
                    <Text>Unsupported Media</Text>
                  )}
                </View>
              )}
            />
          )}
          <PostAction
            post={post}
            numberOfLikes={numberOfLikes}
            setNumberOfLikes={setNumberOfLikes}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            numberOfComments={numberOfComments}
          />
          {commentsData.length > 0 && (
            <View className="mt-2">
              {commentsData.map(
                (comment) =>
                  comment.parentId === null && (
                    <View key={comment._id}>
                      <CommentCard
                        comment={comment}
                        commentsData={commentsData}
                        setCommentsData={setCommentsData}
                        author={post.author}
                        postId={post._id}
                        setNumberOfComments={setNumberOfComments}
                        numberOfComments={numberOfComments}
                      />
                    </View>
                  )
              )}
            </View>
          )}
        </ScrollView>
        <View className="absolute bottom-6 left-0 right-0 px-4 py-2">
          <View className="flex flex-row">
            <View className="w-64">
              <Input
                avatarSrc={profileBasic?.avatar || "/assets/images/capy.jpg"}
                placeholder="Write a comment"
                readOnly={false}
                value={comment}
                onChange={(e) => setComment(e)}
              />
            </View>
            <Button
              title="Comment"
              size="small"
              onPress={handleSendComment}
              color="bg-primary-100"
              fontColor="text-dark100_light200"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});

  return (
    <View>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={{ width: 350, height: 200, borderRadius: 10 }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
    </View>
  );
};

export default PostDetailCard;
