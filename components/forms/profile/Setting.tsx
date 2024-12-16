import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import {
  ArrowIcon,
  SaveIcon,
  HistoryIcon,
  PostIcon,
  FriendIcon,
  MediaIcon,
  ProfileIcon,
  KeyIcon,
} from "../../icons/Icons"; // Đảm bảo đường dẫn đúng
import { useTheme } from "../../../context/ThemeContext";
import { colors } from "../../../styles/colors";

const Setting = ({ setSetting }) => {
  const { colorScheme, toggleColorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
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
            <TouchableOpacity className="rounded p-3 flex flex-row items-center">
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
            <TouchableOpacity className="rounded p-3 flex flex-row items-center">
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

            <TouchableOpacity className=" rounded p-3 flex flex-row items-center">
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
          </View>
          <TouchableOpacity
            onPress={() => setSetting(false)}
            className="mt-2 bg-primary-100 rounded p-2"
          >
            <Text className="text-white text-center font-mmedium">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Setting;
