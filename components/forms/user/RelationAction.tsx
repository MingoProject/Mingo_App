import { useTheme } from "@/context/ThemeContext";
import {
  acceptAddBff,
  acceptAddFriend,
  block,
  requestAddBFF,
  requestAddFriend,
  unBFF,
  unblock,
  unfollowOrRefuseFriendRequest,
  unfriend,
  unrequestBffOrRefuseBffRequest,
} from "@/lib/service/friend.service";
import {
  createNotification,
  deleteNotification,
  getNotification,
} from "@/lib/service/notification.service";
import { colors } from "@/styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";

const RelationModal = ({ relation, onClose, id, setRelation }: any) => {
  const { colorScheme } = useTheme();
  const handleRelationAction = async (action: string) => {
    try {
      console.log(`Action: ${action}`);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("You need to log in to perform this action.");
        return;
      }
      const userId = await AsyncStorage.getItem("userId");
      const params = {
        sender: userId,
        receiver: id,
      };

      switch (action) {
        case "addFriend":
          await requestAddFriend(params, token);
          setRelation("following");
          onClose();
          await createNotification(
            {
              senderId: userId,
              receiverId: id,
              type: "friend_request",
            },
            token
          );
          break;
        case "unfriend":
          await unfriend(params, token);
          setRelation("stranger");
          onClose();
          break;
        case "block":
          await block(params, token);
          setRelation("blocked");
          onClose();
          break;
        case "unBlock":
          await unblock(params, token);
          setRelation("stranger");
          onClose();
          break;
        case "addBFF":
          await requestAddBFF(params, token);
          setRelation("senderRequestBff");
          onClose();
          await createNotification(
            {
              senderId: userId,
              receiverId: id,
              type: "bff_request",
            },
            token
          );
          break;
        case "unBFF":
          await unBFF(params, token);
          setRelation("friend");
          onClose();
          break;
        case "unRequestBff":
          // Cancel the sent BFF request
          await unrequestBffOrRefuseBffRequest(
            {
              sender: userId,
              receiver: id,
            },
            token
          );
          setRelation("friend");
          onClose();
          try {
            const notification = await getNotification(
              userId,
              id,
              "bff_request"
            );
            await deleteNotification(notification._id, token);
          } catch (error) {
            console.error("Error fetching notification:", error);
          }

          break;
        case "refuseRequestBff":
          await unrequestBffOrRefuseBffRequest(
            {
              sender: id,
              receiver: userId,
            },
            token
          );
          setRelation("friend");
          onClose();
          try {
            const notification = await getNotification(
              id,
              userId,
              "bff_request"
            );
            await deleteNotification(notification._id, token);
          } catch (error) {
            console.error("Error fetching notification:", error);
          }

          break;
        case "unfollow":
          await unfollowOrRefuseFriendRequest(
            {
              sender: userId,
              receiver: id,
            },
            token
          );
          setRelation("stranger");
          onClose();
          try {
            const notification = await getNotification(
              userId,
              id,
              "friend_request"
            );
            await deleteNotification(notification._id, token);
          } catch (error) {
            console.error("Error fetching notification:", error);
          }

          break;
        case "refuseRequestFriend":
          // Refuse a friend request
          await unfollowOrRefuseFriendRequest(
            {
              sender: id,
              receiver: userId,
            },
            token
          );
          setRelation("stranger");
          onClose();
          try {
            const notification = await getNotification(
              id,
              userId,
              "friend_request"
            );
            await deleteNotification(notification._id, token);
          } catch (error) {
            console.error("Error fetching notification:", error);
          }

          break;
        case "acceptRequestFriend":
          await acceptAddFriend(
            {
              sender: id,
              receiver: userId,
            },
            token
          );
          setRelation("friend");
          onClose();
          try {
            const notification = await getNotification(
              id,
              userId,
              "friend_request"
            );
            await deleteNotification(notification._id, token);
          } catch (error) {
            console.error("Error fetching notification:", error);
          }

          await createNotification(
            {
              senderId: userId,
              receiverId: id,
              type: "friend_accept",
            },
            token
          );
          break;
        case "acceptRequestBff":
          await acceptAddBff(
            {
              sender: id,
              receiver: userId,
            },
            token
          );
          setRelation("bff");
          onClose();
          try {
            const notification = await getNotification(
              id,
              userId,
              "bff_request"
            );
            await deleteNotification(notification._id, token);
          } catch (error) {
            console.error("Error fetching notification:", error);
          }

          await createNotification(
            {
              senderId: userId,
              receiverId: id,
              type: "bff_accept",
            },
            token
          );
          break;
        default:
          break;
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Error");
    }
  };

  const renderOptions = () => {
    switch (relation) {
      case "stranger":
        return (
          <>
            <TouchableOpacity onPress={() => handleRelationAction("addFriend")}>
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Add Friend
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRelationAction("block")}>
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Block
              </Text>
            </TouchableOpacity>
          </>
        );
      case "following":
        return (
          <>
            <TouchableOpacity onPress={() => handleRelationAction("unfollow")}>
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Unfollow
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRelationAction("block")}>
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Block
              </Text>
            </TouchableOpacity>
          </>
        );
      case "friend":
        return (
          <>
            <TouchableOpacity onPress={() => handleRelationAction("unfriend")}>
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Unfriend
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRelationAction("addBFF")}>
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Add Best Friend
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRelationAction("block")}>
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Block
              </Text>
            </TouchableOpacity>
          </>
        );
      case "bff":
        return (
          <>
            <TouchableOpacity onPress={() => handleRelationAction("unBFF")}>
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Remove Best Friend
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRelationAction("block")}>
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Block
              </Text>
            </TouchableOpacity>
          </>
        );
      case "blocked":
        return (
          <TouchableOpacity onPress={() => handleRelationAction("unBlock")}>
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className="font-mmedium"
            >
              Unblock
            </Text>
          </TouchableOpacity>
        );
      case "senderRequestBff":
        return (
          <>
            <TouchableOpacity
              onPress={() => handleRelationAction("unRequestBff")}
            >
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Cancel Best Friend Request
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRelationAction("block")}>
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Block
              </Text>
            </TouchableOpacity>
          </>
        );
      case "receiverRequestBff":
        return (
          <>
            <TouchableOpacity
              onPress={() => handleRelationAction("refuseRequestBff")}
            >
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Refuse Best Friend Request
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleRelationAction("acceptRequestBff")}
            >
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Accept Best Friend Request
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRelationAction("block")}>
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Block
              </Text>
            </TouchableOpacity>
          </>
        );
      case "follower":
        return (
          <>
            <TouchableOpacity
              onPress={() => handleRelationAction("refuseRequestFriend")}
            >
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Refuse Friend Request
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleRelationAction("acceptRequestFriend")}
            >
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Accept Friend Request
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRelationAction("block")}>
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium"
              >
                Block
              </Text>
            </TouchableOpacity>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View className="fixed inset-0 flex items-center justify-cente mt-72">
      <View
        className="w-[320px] rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg"
        style={{
          backgroundColor:
            colorScheme === "dark" ? colors.dark[400] : colors.light[400],
        }}
      >
        <Text
          className="text-xl font-mbold text-gray-900 dark:text-gray-100 mb-4"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
        >
          Relationship Options
        </Text>
        <View className="space-y-4">{renderOptions()}</View>
        <TouchableOpacity onPress={onClose} className="mt-6">
          <Text
            className="text-center font-msemibold"
            style={{
              color: colors.primary[100],
            }}
          >
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RelationModal;
