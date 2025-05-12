import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import DetailsPost from "@/components/forms/post/DetailsPost";
import PostAction from "@/components/forms/post/PostAction";
import { Video, ResizeMode } from "expo-av";
import { LocationIcon, ThreeDot } from "@/components/icons/Icons";
import { useAuth } from "@/context/AuthContext";
import PostMenu from "@/components/forms/post/PostMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PostResponseDTO } from "@/dtos/PostDTO";
import { UserBasicInfo } from "@/dtos/UserDTO";
import PostHeader from "@/components/share/post/PostHeader";
import TagModal from "@/components/modal/post/TagsModal";
import PostDetailCard from "./PostDetailCard";
import { getCommentByCommentId } from "@/lib/service/comment.service";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import Input from "@/components/share/ui/input";
import Button from "@/components/share/ui/button";

interface PostCardProps {
  post: PostResponseDTO;
  setPostsData: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>;
}

const PostCard = ({ post, setPostsData }: PostCardProps) => {
  const { colorScheme } = useTheme();
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const { profile } = useAuth();
  const profileBasic: UserBasicInfo = {
    _id: profile?._id,
    avatar: profile?.avatar,
    firstName: profile?.firstName,
    lastName: profile?.lastName,
  };
  const menuRef = useRef<TouchableOpacity | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const isAuthor = profile?._id === post.author._id;
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [numberOfLikes, setNumberOfLikes] = useState(post.likes.length);
  const [numberOfComments, setNumberOfComments] = useState(
    post.comments.length
  );
  const [isLiked, setIsLiked] = useState(false);

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

  const openModal = async () => {
    setModalVisible(true);
    try {
      const detailsComments: CommentResponseDTO[] = await Promise.all(
        post?.comments.map(async (comment: any) => {
          return await getCommentByCommentId(comment);
        })
      );
      setCommentsData(detailsComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  return (
    <View
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[200] : colors.light[200], // Sử dụng giá trị màu từ file colors.js
      }}
      className="p-[10px] rounded-[10px] flex flex-col"
    >
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
              (fx: any, fy: any, width: any, height: any, px: any, py: any) => {
                setMenuPosition({ x: px, y: py + height }); // Lấy vị trí dưới dấu `...`
              }
            );
            setMenuVisible(true);
          }}
        >
          <ThreeDot size={20} color={iconColor} />
        </TouchableOpacity>
        <Modal
          transparent={true}
          animationType="slide"
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <PostDetailCard
            isModalVisible={isModalVisible}
            setModalVisible={setModalVisible}
            post={post}
            profileBasic={profileBasic}
            setPostsData={setPostsData}
            numberOfLikes={numberOfLikes}
            setNumberOfLikes={setNumberOfLikes}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            setNumberOfComments={setNumberOfComments}
            numberOfComments={numberOfComments}
            commentsData={commentsData}
            setCommentsData={setCommentsData}
          />
        </Modal>
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
      </View>

      <Text
        style={{
          color: colorScheme === "dark" ? colors.dark[100] : colors.light[100],
          flex: 1,
        }}
        className="font-mregular text-[16px] mb-2"
      >
        {post.content}
      </Text>
      {post.location && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
          className="flex mb-2"
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
        openModal={openModal}
        numberOfLikes={numberOfLikes}
        setNumberOfLikes={setNumberOfLikes}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        numberOfComments={numberOfComments}
      />
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

export default PostCard;
