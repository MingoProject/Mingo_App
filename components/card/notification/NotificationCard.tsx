import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { getTimestamp } from "@/lib/utils";
import PostDetailCard from "../post/PostDetailCard";
import DetailVideo from "@/components/forms/media/DetailVideo";
import DetailImage from "@/components/forms/media/DetailImage";
import { NotificationResponseDTO } from "@/dtos/NotificationDTO";
import { getCommentByCommentId } from "@/lib/service/comment.service";
import { getMediaByMediaId } from "@/lib/service/media.service";
import { getPostByPostId } from "@/lib/service/post.service";
import FriendRequestAction from "@/components/shared/friend/FriendRequestAction";
import BffRequestAction from "@/components/shared/friend/BffRequestAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageDetailCard from "../media/ImageDetailCard";
interface NotificationCardProps {
  notification: NotificationResponseDTO;
  profile: any;
  setNotifications: React.Dispatch<
    React.SetStateAction<NotificationResponseDTO[]>
  >;
  //   handleAcceptFriend: (senderId: string) => void;
  //   handleRefuseFriend: (senderId: string) => void;
  //   handleAcceptBff: (senderId: string) => void;
  //   handleRefuseBff: (senderId: string) => void;
}

const getNotificationContent = (notification: NotificationResponseDTO) => {
  const name = `${notification?.senderId.firstName} ${notification?.senderId.lastName}`;
  switch (notification.type) {
    case "friend_request":
      return `${name} sent you a friend request.`;
    case "bff_request":
      return `${name} sent you a BFF request.`;
    case "friend_accept":
      return `${name} accepted your friend request.`;
    case "bff_accept":
      return `${name} accepted your BFF request.`;
    case "comment":
      return `${name} commented on your post.`;
    case "comment_media":
      return `${name} commented on your media.`;
    case "like":
      return `${name} liked your post.`;
    case "like_comment":
      return `${name} liked your comment.`;
    case "like_media":
      return `${name} liked your media.`;
    case "reply_comment":
      return `${name} replied to your comment.`;
    case "message":
      return `${name} sent you a message.`;
    case "tags":
      return `${name} tagged you in a post.`;
    default:
      return "You have a new notification.";
  }
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  profile,
  setNotifications,
  //   handleAcceptFriend,
  //   handleRefuseFriend,
  //   handleAcceptBff,
  //   handleRefuseBff,
}) => {
  const { colorScheme } = useTheme();

  const [post, setPost] = useState<any>();
  const [image, setImage] = useState<any>();
  const [video, setVideo] = useState<any>();
  const [openDetailPost, setOpenDetailPost] = useState(false);
  const [openDetailImage, setOpenDetailImage] = useState(false);
  const [openDetailVideo, setOpenDetailVideo] = useState(false);
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [numberOfLikes, setNumberOfLikes] = useState(0);

  const profileBasic = {
    _id: profile?._id,
    avatar: profile?.avatar,
    firstName: profile?.firstName,
    lastName: profile?.lastName,
  };

  const fetchComments = async (commentIds: string[]) => {
    return await Promise.all(commentIds.map(getCommentByCommentId));
  };

  const fetchAndHandleMedia = async (mediaId: string) => {
    const data = await getMediaByMediaId(mediaId);
    const comments = await fetchComments(data.comments);
    const userId = await AsyncStorage.getItem("userId");
    setIsLiked(userId ? data.likes.includes(userId) : false);

    if (data.type === "image") {
      setImage(data);
      setOpenDetailImage(true);
    } else {
      setVideo(data);
      setOpenDetailVideo(true);
    }

    setCommentsData(comments);
    setNumberOfLikes(data.likes.length);
    setNumberOfComments(data.comments.length);
  };

  const fetchAndHandlePost = async (postId: string) => {
    const data = await getPostByPostId(postId);
    const comments = await fetchComments(data.comments);
    const userId = await AsyncStorage.getItem("userId");
    setIsLiked(userId ? data.likes.includes(userId) : false);
    setPost(data);
    setCommentsData(comments);
    setNumberOfLikes(data.likes.length);
    setNumberOfComments(data.comments.length);
    setOpenDetailPost(true);
  };

  const handleClick = async (notification: NotificationResponseDTO) => {
    try {
      switch (notification.type) {
        case "like":
        case "comment":
        case "tags":
          if (notification.postId)
            await fetchAndHandlePost(notification.postId);
          break;
        case "like_media":
        case "comment_media":
          if (notification.mediaId)
            await fetchAndHandleMedia(notification.mediaId);
          break;
        case "like_comment":
        case "reply_comment":
          if (notification.postId)
            await fetchAndHandlePost(notification.postId);
          else if (notification.mediaId)
            await fetchAndHandleMedia(notification.mediaId);
          break;
        default:
          console.log("Notification type not handled:", notification.type);
      }
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  };

  return (
    <View
      className="flex flex-row items-start mb-4 p-2 mx-3 rounded-xl"
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[500] : colors.light[500],
      }}
    >
      <Link href={`/user/${notification.senderId._id}`} className="mr-4">
        <Image
          source={{
            uri:
              notification?.senderId.avatar ||
              "https://i.pinimg.com/736x/5b/a6/cb/5ba6cb587d47b7bc29822a60cc61a840.jpg",
          }}
          className="w-12 h-12 rounded-full"
        />
      </Link>

      <TouchableOpacity
        className="flex-1"
        onPress={() => handleClick(notification)}
      >
        <Text className="text-[14px] font-mmedium text-dark100_light100">
          {getNotificationContent(notification)}
        </Text>

        {notification.type === "friend_request" && (
          <FriendRequestAction
            senderId={notification.senderId._id}
            receiverId={notification.receiverId}
            setNotifications={setNotifications}
          />
        )}

        {notification.type === "bff_request" && (
          <BffRequestAction
            senderId={notification.senderId._id}
            receiverId={notification.receiverId}
            setNotifications={setNotifications}
          />
        )}

        <Text className="text-sx font-mregular mt-1 text-gray-400">
          {getTimestamp(notification.createAt)}
        </Text>
      </TouchableOpacity>

      <Modal visible={openDetailPost} transparent animationType="slide">
        <PostDetailCard
          isModalVisible={openDetailPost}
          setModalVisible={setOpenDetailPost}
          post={post}
          profileBasic={profileBasic}
          // setPostsData={setPostsData}
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

      <Modal visible={openDetailImage} transparent animationType="slide">
        <ImageDetailCard
          image={image}
          isModalVisible={openDetailImage}
          setModalVisible={setOpenDetailImage}
          profileUser={image?.createBy}
          profileBasic={profileBasic}
          commentsData={commentsData}
          setCommentsData={setCommentsData}
        />
      </Modal>

      <Modal visible={openDetailVideo} transparent animationType="slide">
        <DetailVideo
          video={video}
          onClose={() => setOpenDetailVideo(false)}
          profileUser={video?.createBy}
          profileBasic={profileBasic}
          commentsData={commentsData}
          setCommentsData={setCommentsData}
        />
      </Modal>
    </View>
  );
};

export default NotificationCard;
