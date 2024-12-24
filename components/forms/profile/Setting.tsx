import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, Modal } from "react-native";
import {
  ArrowIcon,
  SaveIcon,
  HistoryIcon,
  PostIcon,
  FriendIcon,
  MediaIcon,
  ProfileIcon,
  KeyIcon,
  LogoutIcon,
} from "../../icons/Icons"; // Đảm bảo đường dẫn đúng
import { useTheme } from "../../../context/ThemeContext";
import { colors } from "../../../styles/colors";
import SavedPosts from "./SavedPosts";
import LikedPosts from "./LikedPosts";
import ChangePassword from "./ChangePassword";
import { useAuth } from "@/context/AuthContext";

const Setting = ({ setSetting }: any) => {
  const { logout } = useAuth();
  const { colorScheme, toggleColorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [isSavedPostModalVisible, setSavedPostModalVisible] = useState(false);
  const [isLikedPostModalVisible, setLikedPostModalVisible] = useState(false);

  const [isChangePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);

  const toggleSavedPostModal = () =>
    setSavedPostModalVisible(!isSavedPostModalVisible);

  const toggleLikedPostModal = () =>
    setLikedPostModalVisible(!isLikedPostModalVisible);

  const toggleChangePasswordModal = () =>
    setChangePasswordModalVisible(!isChangePasswordModalVisible);

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error("Error logout:", error);
    }
  };
  return (
    <>
      <View
        className="flex-1 "
        style={{
          backgroundColor:
            colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
          flex: 1,
        }}
      >
        <View
          className="flex-1 rounded-t-lg p-4"
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
            flex: 1,
          }}
        >
          <View
            className="flex flex-row pt-5 max-h-16"
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
              flex: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => setSetting(false)}
              className="mt-3"
            >
              <ArrowIcon size={30} color={"#FFAABB"} />
            </TouchableOpacity>
            <View>
              <Text
                style={{ color: colors.primary[100] }}
                className="font-msemibold text-[17px] mt-4 ml-1"
              >
                Setting
              </Text>
            </View>
          </View>
          <View className=" pl-4">
            <Text
              className=" font-mbold mt-6"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
            >
              Dark mode
            </Text>
            <Switch
              value={colorScheme === "dark"}
              onValueChange={toggleColorScheme}
              className=" mt-2"
            />
          </View>

          <View className="mt-4">
            <TouchableOpacity className="brounded p-4  flex flex-row">
              <Text
                className=" font-mbold"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                Activities
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded p-3 flex flex-row items-center"
              onPress={toggleSavedPostModal}
            >
              <SaveIcon size={28} color={iconColor} />

              <Text
                className=" font-mmedium ml-2"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                Saved post
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded p-3 flex flex-row items-center"
              onPress={toggleLikedPostModal}
            >
              <HistoryIcon size={28} color={iconColor} />

              <Text
                className="font-mmedium ml-2"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                Liked posts
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="rounded p-4">
              <Text
                className="font-mbold"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                Account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className=" rounded p-3 flex flex-row items-center"
              onPress={toggleChangePasswordModal}
            >
              <KeyIcon size={28} color={iconColor} />

              <Text
                className=" font-mmedium ml-2"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                Change password
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className=" rounded p-3 flex flex-row items-center"
              onPress={handleLogout}
            >
              <LogoutIcon size={28} color={iconColor} />
              <Text
                className=" font-mmedium ml-2"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setSetting(false)}
            className="mt-2 bg-primary-100 rounded p-2"
          >
            <Text className="text-white text-center font-mmedium">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={isSavedPostModalVisible}
        onRequestClose={toggleSavedPostModal}
        animationType="slide"
      >
        <View
          className="flex-1"
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[300] : colors.light[700],
          }}
        >
          <View className="flex-row mt-16">
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className="font-msemibold text-lg ml-3"
            >
              Saved Posts
            </Text>
            <TouchableOpacity
              onPress={toggleSavedPostModal}
              className="ml-auto pr-5"
            >
              <Text
                style={{
                  color: colorScheme === "dark" ? colors.dark[100] : "#D9D9D9",
                }}
                className="font-msemibold mt-2"
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>

          <SavedPosts />
        </View>
      </Modal>

      <Modal
        visible={isLikedPostModalVisible}
        onRequestClose={toggleLikedPostModal}
        animationType="slide"
      >
        <View
          className="flex-1 "
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[300] : colors.light[700],
          }}
        >
          <View className="flex-row mt-16">
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className="font-msemibold text-lg ml-3"
            >
              Liked Posts
            </Text>
            <TouchableOpacity
              onPress={toggleLikedPostModal}
              className="ml-auto pr-5"
            >
              <Text
                style={{
                  color: colorScheme === "dark" ? colors.dark[100] : "#D9D9D9",
                }}
                className="font-msemibold mt-2"
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>

          <LikedPosts />
        </View>
      </Modal>

      <Modal
        visible={isChangePasswordModalVisible}
        onRequestClose={toggleChangePasswordModal}
        animationType="slide"
      >
        <View
          className="flex-1"
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[300] : colors.light[700],
          }}
        >
          <View className="flex-row  mt-16">
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className="font-msemibold text-lg ml-3"
            >
              Change password
            </Text>
            <TouchableOpacity
              onPress={toggleChangePasswordModal}
              className="ml-auto pr-5"
            >
              <Text
                style={{
                  color: colorScheme === "dark" ? colors.dark[100] : "#D9D9D9",
                }}
                className="font-msemibold mt-2"
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
          <ChangePassword
            toggleChangePasswordModal={toggleChangePasswordModal}
          />
        </View>
      </Modal>
    </>
  );
};

export default Setting;
