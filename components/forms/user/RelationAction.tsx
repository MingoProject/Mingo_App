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
import { createNotification } from "@/lib/service/notification.service";
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
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
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
          break;
        case "block":
          await block(params, token);
          setRelation("blocked");
          break;
        case "unBlock":
          await unblock(params, token);
          setRelation("stranger");
          break;
        case "addBFF":
          await requestAddBFF(params, token);
          setRelation("senderRequestBff");
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
          break;
        case "refuseRequestBff":
          // Refuse the received BFF request
          await unrequestBffOrRefuseBffRequest(
            {
              sender: id,
              receiver: userId,
            },
            token
          );
          setRelation("friend");
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

      onClose();
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
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
            colorScheme === "dark" ? colors.dark[300] : colors.light[700],
        }}
      >
        <Text
          className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4"
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
            className="text-center text-blue-600 dark:text-blue-400 font-semibold"
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
