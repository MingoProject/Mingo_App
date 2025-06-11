import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  FlatList,
} from "react-native";
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
  CancelIcon,
} from "@/components/icons/Icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateInfo } from "@/lib/service/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import Button from "@/components/share/ui/button";
import MyInput from "@/components/share/MyInput";
import CustomPicker from "@/components/share/ui/picker";
import HobbySelector from "@/components/share/ui/hobby-selector";

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

const UpdateInformation = ({ profileUser, setProfileUser, onClose }: any) => {
  const { profile } = useAuth();
  const { colorScheme } = useTheme();
  const [formValues, setFormValues] = useState({
    firstName: profileUser.firstName,
    lastName: profileUser.lastName,
    nickName: profileUser.nickName,
    gender: profileUser.gender,
    job: profileUser.job,
    hobbies: profileUser.hobbies,
    address: profileUser.address,
    relationShip: profileUser.relationShip,
    birthDay: new Date(profileUser.birthDay),
    phoneNumber: profileUser.phoneNumber,
    email: profileUser.email,
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Tạo các state cho ngày, tháng, năm
  const [selectedDay, setSelectedDay] = useState(formValues.birthDay.getDate());
  const [selectedMonth, setSelectedMonth] = useState(
    formValues.birthDay.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(
    formValues.birthDay.getFullYear()
  );

  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(
    profileUser.hobbies
  );

  const handleChange = (name: string, value: any) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleHobbyToggle = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    );
  };

  const handleSave = async () => {
    try {
      const selectedDate = new Date(
        selectedYear,
        selectedMonth - 1,
        selectedDay
      );
      const token: string | null = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("User is not authenticated");
        return;
      }

      const params = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        nickName: formValues.nickName,
        gender: formValues.gender,
        job: formValues.job,
        hobbies: selectedHobbies,
        address: formValues.address,
        relationShip: formValues.relationShip,
        birthDay: selectedDate,
      };

      const response = await updateInfo(params, token);

      if (response?.status) {
        setProfileUser((prevProfile: any) => ({
          ...prevProfile,
          firstName: response?.newProfile.firstName,
          lastName: response?.newProfile.lastName,
          nickName: response?.newProfile.nickName,
          gender: response?.newProfile.gender,
          job: response?.newProfile.job,
          hobbies: response?.newProfile.hobbies,
          address: response?.newProfile.address,
          relationShip: response?.newProfile.relationShip,
          birthDay: response?.newProfile.birthDay,
        }));
        onClose();
      } else {
        console.error("Failed to update user information");
      }
    } catch (err) {
      console.error("Error updating user information:", err);
    }
  };

  const relationshipItems = [
    { label: "Select Relationship", value: "" },
    { label: "Single", value: "Single" },
    { label: "In a relationship", value: "In a relationship" },
    { label: "Married", value: "Married" },
    { label: "Divorced", value: "Divorced" },
    { label: "Widowed", value: "Widowed" },
  ];

  const dayItems = days.map((day) => ({
    label: day.toString(),
    value: day.toString(),
  }));

  const monthItems = months.map((month) => ({
    label: month.toString(),
    value: month.toString(),
  }));

  const yearItems = years.map((year) => ({
    label: year.toString(),
    value: year.toString(),
  }));
  return (
    <FlatList
      data={[{}]}
      keyExtractor={(_, index) => index.toString()}
      renderItem={() => (
        <View className="pt-8 pb-14 px-5 w-full space-y-6">
          <View className="flex flex-row w-full items-center justify-between">
            <Text
              style={{
                fontSize: 24,
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
              className="font-mbold"
            >
              Update Information
            </Text>
            <Button
              title="Close"
              size="small"
              color="transparent"
              onPress={onClose}
            />
          </View>
          <View className="flex flex-row">
            <View className="w-[48%]">
              <View className="relative">
                <View
                  className="absolute left-3 -top-2 flex flex-row items-center px-1 z-10"
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? colors.dark[500]
                        : colors.light[500],
                  }}
                >
                  <Text
                    className="font-mregular text-[12px]"
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[100]
                          : colors.light[100],
                    }}
                  >
                    First Name <Text style={{ color: "red" }}>*</Text>
                  </Text>
                </View>
                <MyInput
                  value={formValues.firstName}
                  onChangeText={(text) => handleChange("firstName", text)}
                  placeholder="First Name"
                  // secureTextEntry
                  height={56}
                  fontSize={14}
                  fontFamily="Montserrat-Regular"
                />
              </View>
            </View>
            <View className="w-[48%] ml-[4%]">
              <View className="relative">
                <View
                  className="absolute left-3 -top-2 flex flex-row items-center px-1 z-10"
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? colors.dark[500]
                        : colors.light[500],
                  }}
                >
                  <Text
                    className="font-mregular text-[12px]"
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[100]
                          : colors.light[100],
                    }}
                  >
                    Last Name <Text style={{ color: "red" }}>*</Text>
                  </Text>
                </View>
                <MyInput
                  value={formValues.lastName}
                  onChangeText={(text) => handleChange("lastName", text)}
                  placeholder="Last Name"
                  // secureTextEntry
                  height={56}
                  fontSize={14}
                  fontFamily="Montserrat-Regular"
                />
              </View>
            </View>
          </View>
          <View className="relative">
            <View
              className="absolute left-3 -top-2 flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[500] : colors.light[500],
              }}
            >
              <Text
                className="font-mregular text-[12px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                Nick Name
              </Text>
            </View>
            <MyInput
              value={formValues.nickName}
              onChangeText={(text) => handleChange("nickName", text)}
              placeholder="Nick Name"
              // secureTextEntry
              height={56}
              fontSize={14}
              fontFamily="Montserrat-Regular"
            />
          </View>
          {/* Gender */}
          <View>
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
              className="mb-1 font-mmedium"
            >
              Gender
            </Text>
            <CustomPicker
              value={formValues.gender}
              setValue={(val) => handleChange("gender", val)}
              items={[
                { label: "Male", value: "true" },
                { label: "Female", value: "false" },
              ]}
              placeholder="Select Gender"
            />
          </View>

          <View className="relative">
            <View
              className="absolute left-3 -top-2 flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[500] : colors.light[500],
              }}
            >
              <Text
                className="font-mregular text-[12px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                Job
              </Text>
            </View>
            <MyInput
              value={formValues.job}
              onChangeText={(text) => handleChange("job", text)}
              placeholder="Job"
              // secureTextEntry
              height={56}
              fontSize={14}
              fontFamily="Montserrat-Regular"
            />
          </View>
          <View className="relative">
            <View
              className="absolute left-3 -top-2 flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[500] : colors.light[500],
              }}
            >
              <Text
                className="font-mregular text-[12px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                Address
              </Text>
            </View>
            <MyInput
              value={formValues.address}
              onChangeText={(text) => handleChange("address", text)}
              placeholder="Address"
              // secureTextEntry
              height={56}
              fontSize={14}
              fontFamily="Montserrat-Regular"
            />
          </View>
          {/* Relationship */}
          <View>
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
              className="mb-1 font-mmedium"
            >
              Relationship
            </Text>
            <CustomPicker
              value={formValues.relationShip}
              setValue={(val) => handleChange("relationShip", val)}
              items={relationshipItems}
              placeholder="Select Relationship"
              height={56}
            />
          </View>

          {/* Birthday */}
          <View className="">
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
              className="mb-1 font-mmedium"
            >
              Date of Birth
            </Text>
            <View className="flex-row justify-between gap-2">
              <View style={{ flex: 1 }}>
                <CustomPicker
                  value={selectedDay.toString()}
                  setValue={(val) => setSelectedDay(Number(val))}
                  items={dayItems}
                  placeholder="Day"
                  height={50}
                />
              </View>
              <View style={{ flex: 1 }}>
                <CustomPicker
                  value={selectedMonth.toString()}
                  setValue={(val) => setSelectedMonth(Number(val))}
                  items={monthItems}
                  placeholder="Month"
                  height={50}
                />
              </View>
              <View style={{ flex: 1 }}>
                <CustomPicker
                  value={selectedYear.toString()}
                  setValue={(val) => setSelectedYear(Number(val))}
                  items={yearItems}
                  placeholder="Year"
                  height={50}
                />
              </View>
            </View>
          </View>
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[100],
            }}
            className="mb-1 font-mmedium"
          >
            Hobbies
          </Text>
          <HobbySelector
            hobbies={Object.keys(hobbyIcons)}
            selectedHobbies={selectedHobbies}
            onToggle={handleHobbyToggle}
          />
          <View className="pb-14">
            <View className="">
              <Button
                title="Save"
                onPress={handleSave}
                fontColor={
                  colorScheme === "dark" ? colors.dark[100] : colors.light[200]
                }
              />
            </View>
          </View>
        </View>
      )}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
};

export default UpdateInformation;
