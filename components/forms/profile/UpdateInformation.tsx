import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
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
} from "@/components/icons/Icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateInfo } from "@/lib/service/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

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
  const { colorScheme, toggleColorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
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
  const [showDatePicker, setShowDatePicker] = useState(false);

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
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View className="flex-row">
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
        >
          Update Information
        </Text>
        <View className="ml-auto  mt-1 flex-row">
          <TouchableOpacity
            onPress={onClose}
            className="px-3 h-10 py-2 rounded-lg"
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: colors.primary[100],
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            className="px-3 h-10 py-2 rounded-lg"
            style={{
              backgroundColor: colors.primary[100],
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
              }}
              className="text-white"
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-row">
        <View className="w-1/2">
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
            className="mb-1"
          >
            First Name
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 5,
              marginBottom: 10,
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
            className="border w-[98%] mr-1 border-gray-400 rounded-lg"
            placeholder="First Name"
            value={formValues.firstName}
            onChangeText={(text) => handleChange("firstName", text)}
          />
        </View>
        <View className="w-1/2">
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
            className="mb-1"
          >
            Last Name
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 5,
              marginBottom: 10,
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
            className="border w-[98%] ml-1 border-gray-400 rounded-lg"
            placeholder="Last Name"
            value={formValues.lastName}
            onChangeText={(text) => handleChange("lastName", text)}
          />
        </View>
      </View>

      <View>
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="mb-1"
        >
          Nick Name
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="border border-gray-400 rounded-lg"
          placeholder="Nick Name"
          value={formValues.nickName}
          onChangeText={(text) => handleChange("nickName", text)}
        />
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="mb-1"
        >
          Gender
        </Text>
        <Picker
          selectedValue={formValues.gender}
          onValueChange={(itemValue: any) => handleChange("gender", itemValue)}
          className="border rounded-lg"
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="true" />
          <Picker.Item label="Female" value="false" />
        </Picker>
      </View>
      <View className="mb-5">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="mb-1"
        >
          Job
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="border border-gray-400 rounded-lg"
          placeholder="Job"
          value={formValues.job}
          onChangeText={(text) => handleChange("job", text)}
        />
      </View>
      <View className="mb-5">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="mb-1"
        >
          Address
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="border border-gray-400 rounded-lg"
          placeholder="Address"
          value={formValues.address}
          onChangeText={(text) => handleChange("address", text)}
        />
      </View>

      <View className="mb-5">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="mb-1"
        >
          Relationship
        </Text>
        <Picker
          selectedValue={formValues.relationShip}
          onValueChange={(itemValue: any) =>
            handleChange("relationShip", itemValue)
          }
          className="border rounded-lg text-base"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
        >
          <Picker.Item
            label="Select Relationship"
            value=""
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
          />
          <Picker.Item
            label="Single"
            value="Single"
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
          />
          <Picker.Item
            label="In a relationship"
            value="In a relationship"
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
          />
          <Picker.Item
            label="Married"
            value="Married"
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
          />
          <Picker.Item
            label="Divorced"
            value="Divorced"
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
          />
          <Picker.Item
            label="Widowed"
            value="Widowed"
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
          />
        </Picker>
      </View>

      {/* Birthday */}
      <View className="mb-5 h-56">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="mb-1"
        >
          Birthday
        </Text>
        <View className="flex-row">
          {/* Day Picker */}
          <Picker
            selectedValue={selectedDay.toString()}
            style={{ flex: 1, height: 50 }}
            onValueChange={(itemValue: any) => setSelectedDay(itemValue)}
          >
            {days.map((day) => (
              <Picker.Item
                key={day}
                label={day.toString()}
                value={day.toString()}
              />
            ))}
          </Picker>

          {/* Month Picker */}
          <Picker
            selectedValue={selectedMonth.toString()}
            style={{ flex: 1, height: 50 }}
            onValueChange={(itemValue: any) => setSelectedMonth(itemValue)}
          >
            {months.map((month) => (
              <Picker.Item
                key={month}
                label={month.toString()}
                value={month.toString()}
              />
            ))}
          </Picker>

          {/* Year Picker */}
          <Picker
            selectedValue={selectedYear.toString()}
            style={{ flex: 1, height: 50 }}
            onValueChange={(itemValue: any) => setSelectedYear(itemValue)}
          >
            {years.map((year) => (
              <Picker.Item
                key={year}
                label={year.toString()}
                value={year.toString()}
              />
            ))}
          </Picker>
        </View>
      </View>

      <Text
        style={{
          color: colorScheme === "dark" ? colors.dark[100] : colors.light[500],
        }}
        className="mb-1"
      >
        Hobbies
      </Text>
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 20 }}
      >
        {Object.keys(hobbyIcons).map((hobby) => {
          const HobbyIcon = hobbyIcons[hobby]; // Lấy icon tương ứng từ hobbyIcons
          return (
            <TouchableOpacity
              key={hobby}
              onPress={() => handleHobbyToggle(hobby)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 10,
                marginBottom: 10,
                padding: 10,
                backgroundColor: selectedHobbies.includes(hobby)
                  ? colors.primary[100]
                  : "#ffffff",
              }}
              className="border border-gray-400 rounded-lg"
            >
              {HobbyIcon && (
                <HobbyIcon
                  size={20}
                  color={
                    selectedHobbies.includes(hobby)
                      ? "#ffffff"
                      : colors.primary[100]
                  }
                  style={{ marginRight: 5 }}
                />
              )}
              <Text
                style={{
                  marginRight: 5,
                  color: selectedHobbies.includes(hobby)
                    ? "#ffffff"
                    : colorScheme === "dark"
                    ? colors.dark[100]
                    : colors.light[500],
                }}
              >
                {hobby}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default UpdateInformation;
