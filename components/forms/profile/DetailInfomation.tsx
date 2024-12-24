import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import {
  SoccerIcon,
  PenIcon,
  SwimIcon,
  RunIcon,
  BookIcon,
  GameIcon,
  ChefIcon,
  PlaneIcon,
  CodeIcon,
  CameraIcon,
  PaletteIcon,
  DanceIcon,
  YogaIcon,
  BikeIcon,
  FishingIcon,
  FlowerIcon,
  CraftingIcon,
  MovieIcon,
  MusicIcon,
  ChessIcon,
  MicroIcon,
} from "@/components/icons/Icons";
import UpdateInformation from "./UpdateInformation";

export const hobbyIcons: Record<string, any> = {
  Soccer: SoccerIcon,
  Swimming: SwimIcon,
  Running: RunIcon,
  Reading: BookIcon,
  Gaming: GameIcon,
  Cooking: ChefIcon,
  Traveling: PlaneIcon,
  Programming: CodeIcon,
  Photography: CameraIcon,
  Painting: PaletteIcon,
  Dancing: DanceIcon,
  Yoga: YogaIcon,
  Cycling: BikeIcon,
  Fishing: FishingIcon,
  Gardening: FlowerIcon,
  Crafting: CraftingIcon,
  "Watching Movies": MovieIcon,
  "Listening to Music": MusicIcon,
  "Playing Chess": ChessIcon,
  Singing: MicroIcon,
};

const DetailInformation = ({ profileUser, setProfileUser }: any) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isMe, setIsMe] = useState(false);
  const { profile } = useAuth();
  const { colorScheme, toggleColorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  useEffect(() => {
    if (profile._id && profile._id === profileUser._id) {
      setIsMe(true);
    }
  }, [profileUser._id]);

  const formattedDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <View className=" mt-4 rounded-lg border border-gray-200 py-4">
      <View className="flex h-[39px] w-[186px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100">
        <Text className="text-white">Detailed Information</Text>
      </View>

      <ScrollView className="ml-[5%] mt-1 w-full">
        {profileUser.job && (
          <Text
            className="text-dark100_light500 mt-4"
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
          >
            Job:
            <Text
              className="font-semibold"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
            >
              {" "}
              {profileUser.job}
            </Text>
          </Text>
        )}

        {profileUser.address && (
          <View className="mt-4">
            <Text
              className="text-dark100_light500"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
            >
              Address:
              <Text
                className="font-semibold"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                {" "}
                {profileUser.address}
              </Text>
            </Text>
          </View>
        )}

        {profileUser.hobbies?.length > 0 && (
          <View className="mt-4">
            <Text
              className="text-dark100_light500"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
            >
              Hobbies:
            </Text>
            <ScrollView horizontal className="flex flex-row mt-2 w-[350px]">
              {profileUser.hobbies.map((hobby: string, index: number) => {
                const HobbyIcon = hobbyIcons[hobby]; // Lấy icon từ hobbyIcons dựa trên tên hobby
                return (
                  <View
                    key={index}
                    className="mx-2 flex-row items-center rounded-lg border border-gray-400 px-2 py-1"
                  >
                    {HobbyIcon && (
                      <HobbyIcon size={20} color={colors.primary[100]} />
                    )}
                    <Text
                      className="ml-1"
                      style={{
                        color:
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[500],
                      }}
                    >
                      {hobby}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {profileUser.relationShip && (
          <Text
            className="mt-4 text-dark100_light500"
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
          >
            Relationship:
            <Text
              className="font-semibold"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
            >
              {" "}
              {profileUser.relationShip}
            </Text>
          </Text>
        )}

        {showDetails && (
          <>
            {profileUser.birthDay && (
              <Text
                className="mt-4 text-dark100_light500"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                Birthday:
                <Text
                  className="font-semibold"
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                >
                  {" "}
                  {formattedDate(profileUser.birthDay)}
                </Text>
              </Text>
            )}
            {profileUser.gender !== undefined && (
              <Text
                className="mt-4 text-dark100_light500"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                Gender:
                <Text
                  className="font-semibold"
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                >
                  {" "}
                  {profileUser.gender ? "Male" : "Female"}
                </Text>
              </Text>
            )}
            {profileUser.attendDate && (
              <Text
                className="mt-4 text-dark100_light500"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                Attend date:
                <Text
                  className="font-semibold"
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                >
                  {" "}
                  {formattedDate(profileUser.attendDate)}
                </Text>
              </Text>
            )}
            {profileUser.phoneNumber && (
              <Text
                className="mt-4 text-dark100_light500"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                Phone number:
                <Text
                  className="font-semibold"
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                >
                  {" "}
                  {profileUser.phoneNumber}
                </Text>
              </Text>
            )}
            {profileUser.email && (
              <Text
                className="mt-4 text-dark100_light500"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                Email:
                <Text
                  className="font-semibold"
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                >
                  {" "}
                  {profileUser.email}
                </Text>
              </Text>
            )}
          </>
        )}
      </ScrollView>

      <View className="mr-[5%] flex-row items-center">
        <TouchableOpacity
          className="ml-[5%] mr-[2%] mt-4"
          onPress={() => setShowDetails(!showDetails)}
        >
          <Text className="text-primary-100">
            {showDetails ? "Hidden" : "See all"}
          </Text>
        </TouchableOpacity>
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
          <View>
            <UpdateInformation
              profileUser={profileUser}
              setProfileUser={setProfileUser}
              onClose={() => setShowEdit(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DetailInformation;
