import { CancelIcon, PenIcon } from "@/components/icons/Icons";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { updateUserBio } from "@/lib/service/user.service";
import { colors } from "@/styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";

const Bio = ({ profileUser, setProfile }: any) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [showEdit, setShowEdit] = useState(false);
  const [isMe, setIsMe] = useState(false);
  const { profile } = useAuth();
  const [bio, setBio] = useState(profileUser?.bio);

  const handleSave = async () => {
    try {
      const token: string | null = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("User is not authenticated");
        return;
      }

      const params = {
        bio,
      };

      const response = await updateUserBio(params, token);

      if (response?.status) {
        setProfile((prevProfile: any) => ({
          ...prevProfile,
          bio: response?.newProfile.bio,
        }));
        setShowEdit(false);
      } else {
        console.error("Failed to update user information");
      }
    } catch (err) {
      console.error("Error updating user information:", err);
    }
  };

  useEffect(() => {
    if (profile?._id && profile?._id === profileUser?._id) {
      setIsMe(true);
    }
  }, [profileUser?._id]);
  return (
    <>
      <View className="p-3 w-[266px]">
        {profileUser?.nickName && (
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
            className="font-mbold text-[16px] "
          >
            {"("}
            {profileUser?.nickName || "No bio"}
            {")"}
          </Text>
        )}

        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="font-mregular text-[14px] mt-3"
        >
          {profileUser?.bio || "No bio"}
        </Text>
        {isMe && (
          <TouchableOpacity
            className="ml-auto"
            onPress={() => setShowEdit(true)}
          >
            <PenIcon size={23} color={colors.primary[100]} />
          </TouchableOpacity>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEdit}
        onRequestClose={() => setShowEdit(false)}
      >
        <View
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[300] : colors.light[700],
            flex: 1,
          }}
          className="pt-10"
        >
          <View className="flex-1 justify-center items-center">
            <View
              className="mt-4 py-4 "
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[300] : colors.light[700],
                flex: 1,
              }}
            >
              <View className="flex-row h-[39px] w-full px-5 items-center justify-center rounded-r-lg mb-4">
                <Text
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors["title-pink"],
                  }}
                  className="text-[20px] font-msemibold"
                >
                  Update Bio
                </Text>
                <TouchableOpacity
                  onPress={() => setShowEdit(false)}
                  className="ml-auto"
                >
                  <CancelIcon size={28} color={iconColor} />
                </TouchableOpacity>
              </View>
              <TextInput
                value={bio}
                onChangeText={setBio}
                style={{
                  backgroundColor:
                    colorScheme === "dark"
                      ? colors.dark[300]
                      : colors.light[700],
                  padding: 10,
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                  marginBottom: 15,
                }}
                placeholder="Enter your new bio"
                placeholderTextColor={
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500]
                }
                className="border border-gray-200 rounded-lg px-2 py-3 mx-5"
              />
              <TouchableOpacity
                onPress={handleSave}
                className="bg-primary-100 rounded-lg mx-5 mt-3 py-2"
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#FFFFFF",
                    textAlign: "center",
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Bio;
