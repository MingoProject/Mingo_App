import React, { useState } from "react";
import Svg, { Path } from "react-native-svg";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";
// import { ThreeDot } from "../icons/Icons.js";
import { useAuth } from "@/context/AuthContext";
import {
  acceptAddBff,
  acceptAddFriend,
  unfollowOrRefuseFriendRequest,
  unrequestBffOrRefuseBffRequest,
} from "@/lib/service/friend.service";
import {
  createNotification,
  deleteNotification,
} from "@/lib/service/notification.service";
import { getPostByPostId } from "@/lib/service/post.service";
import { getMediaByMediaId } from "@/lib/service/media.service";
import { Link } from "expo-router";
import DetailsPost from "../forms/post/DetailsPost";
import DetailImage from "../forms/media/DetailImage";

const calculateTimeDifference = (date: any) => {
  const now = new Date();
  const minutesAgo = differenceInMinutes(now, date);
  const hoursAgo = differenceInHours(now, date);
  const daysAgo = differenceInDays(now, date);

  if (daysAgo > 0) {
    return `${daysAgo} ngày trước`;
  } else if (hoursAgo > 0) {
    return `${hoursAgo} giờ trước`;
  } else {
    return `${minutesAgo} phút trước`;
  }
};

const getNotificationContent = (notification: any) => {
  switch (notification.type) {
    case "friend_request":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} sent you a friend request.`;
    case "bff_request":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} sent you a BFF request.`;
    case "friend_accept":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} accepted your friend request.`;
    case "bff_accept":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} accepted your BFF request.`;
    case "comment":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} commented on your post.`;
    case "comment_media":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} commented on your media.`;
    case "like":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} liked your post.`;
    case "like_comment":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} liked your comment.`;
    case "like_media":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} liked your media.`;
    case "reply_comment":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} replied to your comment.`;
    case "message":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} sent you a message.`;
    case "tags":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} tagged you in a post.`;
    default:
      return "You have a new notification.";
  }
};

const Notifications = ({ notifications, setNotifications }: any) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [post, setPost] = useState<any>();
  const [image, setImage] = useState<any>();
  const [video, setVideo] = useState<any>();
  const [openDetailPost, setOpenDetailPost] = useState(false);
  const [openDetailImage, setOpenDetailImage] = useState(false);
  const [openDetailVideo, setOpenDetailVideo] = useState(false);
  const { profile } = useAuth();

  const handleRefuseBff = async (
    id: string,
    userId: string,
    notificationId: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }
      await unrequestBffOrRefuseBffRequest(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await deleteNotification(notificationId, token);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };
  const handleRefuseFriend = async (
    id: string,
    userId: string,
    notificationId: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      await unfollowOrRefuseFriendRequest(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await deleteNotification(notificationId, token); // Delete the notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };
  const handleAcceptFriend = async (
    id: string,
    userId: string,
    notificationId: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      await acceptAddFriend(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await createNotification(
        {
          senderId: userId,
          receiverId: id,
          type: "friend_accept",
        },
        token
      );
      await deleteNotification(notificationId, token);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };
  const handleAcceptBff = async (
    id: string,
    userId: string,
    notificationId: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }
      await acceptAddBff(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await createNotification(
        {
          senderId: userId,
          receiverId: id,
          type: "bff_accept",
        },
        token
      );
      await deleteNotification(notificationId, token); // Delete the notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };
  const handleClick = async (notification: any) => {
    switch (notification.type) {
      case "like":
        try {
          const data = await getPostByPostId(notification.postId);
          setPost(data);
          setOpenDetailPost(true);
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "like_comment":
        try {
          if (notification.postId) {
            const data = await getPostByPostId(notification.postId);
            setPost(data);
            setOpenDetailPost(true);
          } else {
            const data = await getMediaByMediaId(notification.mediaId);

            if (data.type === "image") {
              setImage(data);
              setOpenDetailImage(true);
            } else {
              setVideo(data);
              setOpenDetailVideo(true);
            }
          }
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "like_media":
        try {
          const data = await getMediaByMediaId(notification.mediaId);

          if (data.type === "image") {
            setImage(data);
            setOpenDetailImage(true);
          } else {
            setVideo(data);
            setOpenDetailVideo(true);
          }
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "comment":
        try {
          const data = await getPostByPostId(notification.postId);
          setPost(data);
          setOpenDetailPost(true);
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "comment_media":
        try {
          const data = await getMediaByMediaId(notification.mediaId);

          if (data.type === "image") {
            setImage(data);
            setOpenDetailImage(true);
          } else {
            setVideo(data);
            setOpenDetailVideo(true);
          }
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "reply_comment":
        try {
          if (notification.postId) {
            const data = await getPostByPostId(notification.postId);
            setPost(data);
            setOpenDetailPost(true);
          } else {
            const data = await getMediaByMediaId(notification.mediaId);

            if (data.type === "image") {
              setImage(data);
              setOpenDetailImage(true);
            } else {
              setVideo(data);
              setOpenDetailVideo(true);
            }
          }
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "tags":
        try {
          const data = await getPostByPostId(notification.postId);
          setPost(data);
          setOpenDetailPost(true);
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      default:
        console.log("Notification type not handled");
        break;
    }
  };

  return (
    <View className="flex flex-row w-full ">
      <View className="w-full">
        {notifications.map((notification: any) => (
          <View
            key={notification?._id}
            className="flex flex-row items-start mb-4 p-2 mx-3 rounded-xl"
            style={{
              flex: 1,
              backgroundColor:
                colorScheme === "dark" ? colors.dark[400] : colors.light[800], // Sử dụng giá trị màu từ file colors.js
            }}
          >
            <Link href={`/user/${notification.senderId._id}`} className="mr-4">
              <Image
                source={{
                  uri:
                    notification?.senderId.avatar ||
                    "https://i.pinimg.com/736x/5b/a6/cb/5ba6cb587d47b7bc29822a60cc61a840.jpg",
                }}
                className="w-12 h-12 rounded-full "
              />
            </Link>

            <TouchableOpacity
              className="flex-1"
              onPress={() => handleClick(notification)}
            >
              <Text
                className="text-base font-medium mt-1 "
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                {getNotificationContent(notification)}
              </Text>

              <View className="flex flex-row justify-between w-1/2 mt-2">
                {notification?.type === "friend_request" && (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        handleAcceptFriend(
                          notification.senderId._id,
                          profile._id,
                          notification._id
                        )
                      }
                      className="rounded-lg px-3 py-2"
                      style={{
                        backgroundColor: colors.primary[100], // Sử dụng giá trị màu từ file colors.js
                      }}
                    >
                      <Text className="text-white font-semibold">Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        handleRefuseFriend(
                          notification.senderId._id,
                          profile._id,
                          notification._id
                        )
                      }
                      className="rounded-lg px-3 py-2"
                      style={{
                        backgroundColor:
                          colorScheme === "dark"
                            ? colors.dark[300]
                            : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                      }}
                    >
                      <Text
                        className=" font-semibold"
                        style={{
                          color:
                            colorScheme === "dark"
                              ? colors.dark[100]
                              : colors.light[500],
                        }}
                      >
                        Refuse
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                {notification?.type === "bff_request" && (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        handleAcceptBff(
                          notification.senderId._id,
                          profile._id,
                          notification._id
                        )
                      }
                      className="rounded-lg px-3 py-2"
                      style={{
                        backgroundColor: colors.primary[100], // Sử dụng giá trị màu từ file colors.js
                      }}
                    >
                      <Text className="text-white font-semibold">Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        handleRefuseBff(
                          notification.senderId._id,
                          profile._id,
                          notification._id
                        )
                      }
                      className="rounded-lg px-3 py-2"
                      style={{
                        backgroundColor:
                          colorScheme === "dark"
                            ? colors.dark[300]
                            : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                      }}
                    >
                      <Text
                        className=" font-semibold"
                        style={{
                          color:
                            colorScheme === "dark"
                              ? colors.dark[100]
                              : colors.light[500],
                        }}
                      >
                        Refuse
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
              <View className="flex flex-row justify-between items-center">
                <Text className="text-gray-400 font-semibold text-xs">
                  {calculateTimeDifference(notification?.createAt)}
                </Text>
              </View>
            </TouchableOpacity>
            {openDetailPost && (
              <Modal
                visible={openDetailPost}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setOpenDetailPost(false)}
              >
                <DetailsPost
                  post={post}
                  isModalVisible={openDetailPost}
                  setModalVisible={() => setOpenDetailPost(false)}
                />
              </Modal>
            )}
            {openDetailImage && (
              <Modal
                visible={openDetailImage}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setOpenDetailImage(false)}
              >
                <DetailImage
                  image={image}
                  isModalVisible={openDetailImage}
                  setModalVisible={setOpenDetailImage}
                />
              </Modal>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Notifications;
