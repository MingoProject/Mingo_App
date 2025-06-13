import { CancelIcon, PenIcon } from "@/components/shared/icons/Icons";
import Button from "@/components/shared/ui/button";
import MyTextarea from "@/components/shared/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { updateUserBio } from "@/lib/service/user.service";
import { colors } from "@/styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";

const Bio = ({ profileUser, setProfile }: any) => {
  const { colorScheme } = useTheme();
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
                colorScheme === "dark" ? colors.dark[100] : colors.light[100],
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
              colorScheme === "dark" ? colors.dark[100] : colors.light[100],
          }}
          className="font-mregular text-[16px] mt-2"
        >
          {profileUser?.bio || "No bio"}
        </Text>
        {isMe && (
          <TouchableOpacity
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[400] : colors.light[400],
            }}
            className="ml-auto py-3 px-3 rounded-full"
            onPress={() => setShowEdit(true)}
          >
            <PenIcon size={18} color={colors.primary[100]} />
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
              colorScheme === "dark" ? colors.dark[500] : colors.light[500],
            flex: 1,
          }}
          // className="pt-10"
        >
          <View className="flex-1 justify-between items-center">
            <View
              className=" py-8 px-5 w-full space-y-6"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[500] : colors.light[500],
                flex: 1,
              }}
            >
              <View className="flex-row w-full items-center justify-between">
                <Text
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[100],
                  }}
                  className="font-msemibold text-[24px]"
                >
                  Update Bio
                </Text>
                <Button
                  title="Close"
                  size="small"
                  color="transparent"
                  onPress={() => setShowEdit(false)}
                />
              </View>
              <View>
                <MyTextarea
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Enter your new bio"
                  fontFamily="Montserrat-Regular"
                />
              </View>

              <View className="w-full">
                <Button
                  title="Save"
                  onPress={handleSave}
                  fontColor={
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[200]
                  }
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Bio;
