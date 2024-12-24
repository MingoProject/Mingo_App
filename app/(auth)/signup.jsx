import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import MyInput from "../../components/share/MyInput";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import MyButton from "../../components/share/MyButton";
import { useRouter } from "expo-router";
import { register } from "@/lib/service/user.service";
import { sendOTP, verifyOTP } from "@/lib/service/auth.service";
import { Picker } from "@react-native-picker/picker";

const PlusIcon = ({ color = "#dc0404", width = 8, height = 8 }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
  >
    <Path
      fill={color}
      d="M11 21v-6.6l-4.65 4.675l-1.425-1.425L9.6 13H3v-2h6.6L4.925 6.35L6.35 4.925L11 9.6V3h2v6.6l4.65-4.675l1.425 1.425L14.4 11H21v2h-6.6l4.675 4.65l-1.425 1.425L13 14.4V21z"
    />
  </Svg>
);

const SignUp = () => {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const verifyResult = await verifyOTP(phoneNumber, otp); // Hàm verifyOTP thực hiện xác thực OTP

      if (!verifyResult.success) {
        setErrorMessage("Invalid or expired OTP.");
        return;
      }
      const userData = {
        firstName,
        lastName,
        nickName: "",
        phoneNumber,
        email,
        password,
        rePassword: confirmPassword,
        gender: gender === "male",
        birthDay: new Date(birthday),
      };

      try {
        const newUser = await register(userData);

        if (newUser) {
          setSuccessMessage("Registration successful! Please log in.");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhoneNumber("");
          setBirthday("");
          setGender("");
          setPassword("");
          setConfirmPassword("");
          setIsOtpStep(false);
          router.push("signin");
        } else {
          setErrorMessage("Registration failed!");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error during OTP verification or registration:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  const handleOtpRequest = async (e) => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setSuccessMessage("");
    e.preventDefault();
    setErrorMessage("");
    console.log(phoneNumber);

    try {
      const otpResponse = await sendOTP(phoneNumber);
      setGeneratedOtp(otpResponse.otp);
      setIsOtpStep(true);
    } catch (error) {
      console.error("Error during OTP request:", error);
      setErrorMessage(error.message || "Failed to send OTP.");
    }
  };

  return (
    <ScrollView
      className="w-full h-full p-4 bg-white flex flex-col"
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
    >
      <View className="w-full items-center justify-end pb-10">
        <Text
          className="font-msemibold text-[36px] text-light-500"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
        >
          Sign-up
        </Text>
      </View>

      <View className=" w-full">
        <View className="flex flex-col gap-6">
          <View className="flex-row w-full">
            <View className="relative w-[45%]">
              <View
                className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
                style={{
                  backgroundColor:
                    colorScheme === "dark"
                      ? colors.dark[300]
                      : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                  flex: 1,
                }}
              >
                <Text
                  className="font-mregular text-[12px]"
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                >
                  First Name
                </Text>
                <View className="ml-1 pb-1">
                  <PlusIcon />
                </View>
              </View>

              <MyInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                borderRadius={8}
                height={56}
                fontSize={14}
                style={{ zIndex: 1 }} // Đảm bảo input có z-index thấp hơn nhãn
              />
            </View>
            <View className="relative w-[45%] ml-3">
              {/* Nhãn (Label) */}
              <View
                className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
                style={{
                  backgroundColor:
                    colorScheme === "dark"
                      ? colors.dark[300]
                      : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                  flex: 1,
                }}
              >
                <Text
                  className="font-mregular text-[12px]"
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                >
                  Last Name
                </Text>
                <View className="ml-1 pb-1">
                  <PlusIcon />
                </View>
              </View>

              <MyInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                borderRadius={8}
                height={56}
                fontSize={14}
                style={{ zIndex: 1 }} // Đảm bảo input có z-index thấp hơn nhãn
              />
            </View>
          </View>
          <View className="relative ">
            {/* Nhãn (Label) */}
            <View
              className="absolute left-3 -top-2 bg-white flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
            >
              <Text
                className="font-mregular text-[12px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                Gender
              </Text>
              <View className="ml-1 pb-1">
                <PlusIcon />
              </View>
            </View>

            {/* Input */}
            <View
              style={{
                overflow: "hidden",
                height: 140, // Điều chỉnh chiều cao tổng thể của View
              }}
            >
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                  height: 20,
                  fontSize: 12,
                }}
                className="text-sm"
              >
                <Picker.Item
                  className="text-sm"
                  label="Select Gender"
                  value=""
                />
                <Picker.Item className="text-sm" label="Male" value="male" />
                <Picker.Item
                  className="text-sm"
                  label="Female"
                  value="female"
                />
              </Picker>
            </View>
          </View>
          <View className="relative ">
            <View
              className="absolute left-3 -top-2 bg-white flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
            >
              <Text
                className="font-mregular text-[12px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                BirthDay
              </Text>
              <View className="ml-1 pb-1">
                <PlusIcon />
              </View>
            </View>

            <View className="mb-5 h-56">
              <View className="flex-row">
                <Picker
                  selectedValue={selectedDay.toString()}
                  style={{ flex: 1, height: 50 }}
                  onValueChange={(itemValue) => setSelectedDay(itemValue)}
                >
                  {days.map((day) => (
                    <Picker.Item
                      key={day}
                      label={day.toString()}
                      value={day.toString()}
                    />
                  ))}
                </Picker>

                <Picker
                  selectedValue={selectedMonth.toString()}
                  style={{ flex: 1, height: 50 }}
                  onValueChange={(itemValue) => setSelectedMonth(itemValue)}
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
                  onValueChange={(itemValue) => setSelectedYear(itemValue)}
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
          </View>

          <View className="relative">
            <View
              className="absolute left-3 -top-2 bg-white flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
            >
              <Text
                className="font-mregular text-[12px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                Phone Number
              </Text>
              <View className="ml-1 pb-1">
                <PlusIcon />
              </View>
            </View>

            {/* Input */}
            <MyInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Phone Number"
              borderRadius={8}
              height={56}
              fontSize={14}
              style={{ zIndex: 1 }} // Đảm bảo input có z-index thấp hơn nhãn
            />
          </View>

          <View className="relative">
            {/* Nhãn (Label) */}
            <View
              className="absolute left-3 -top-2 bg-white flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
            >
              <Text
                className="font-mregular text-[12px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                Email
              </Text>
              <View className="ml-1 pb-1">
                <PlusIcon />
              </View>
            </View>

            {/* Input */}
            <MyInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email@gmail.com"
              borderRadius={8}
              height={56}
              fontSize={14}
              style={{ zIndex: 1 }} // Đảm bảo input có z-index thấp hơn nhãn
            />
          </View>
          <View className="flex-row w-full">
            <View className="relative w-[45%]">
              <View
                className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
                style={{
                  backgroundColor:
                    colorScheme === "dark"
                      ? colors.dark[300]
                      : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                  flex: 1,
                }}
              >
                <Text
                  className="font-mregular text-[12px]"
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                >
                  Password
                </Text>
                <View className="ml-1 pb-1">
                  <PlusIcon />
                </View>
              </View>

              <MyInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                borderRadius={8}
                height={56}
                fontSize={14}
                style={{ zIndex: 1 }} // Đảm bảo input có z-index thấp hơn nhãn
              />
            </View>
            <View className="relative w-[45%] ml-3">
              {/* Nhãn (Label) */}
              <View
                className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
                style={{
                  backgroundColor:
                    colorScheme === "dark"
                      ? colors.dark[300]
                      : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                  flex: 1,
                }}
              >
                <Text
                  className="font-mregular text-[12px]"
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                >
                  Confirm password
                </Text>
                <View className="ml-1 pb-1">
                  <PlusIcon />
                </View>
              </View>

              <MyInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                borderRadius={8}
                height={56}
                fontSize={14}
                style={{ zIndex: 1 }} // Đảm bảo input có z-index thấp hơn nhãn
              />
            </View>
          </View>
          <View>
            <MyButton
              title="Signup"
              borderRadius={12}
              backgroundColor="#FFAABB"
              fontSize={16}
              color="white"
              fontFamily="Montserrat-Bold"
              onPress={handleOtpRequest}
            />
          </View>
        </View>
      </View>

      <View className="w-full mt-8">
        <View className="flex flex-row items-center justify-center">
          <Text
            className="font-mbold text-light-500 text-[16px]"
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
          >
            Or
          </Text>
        </View>
        <View className="mt-4 mb-10 w-full flex flex-row items-center justify-center">
          <Text
            className="font-mregular text-[16px] text-light-500 "
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
          >
            Already have an account?{" "}
            <Text
              onPress={() => router.push("signin")}
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className="font-mbold text-light-500 text-[16px] "
            >
              Login
            </Text>
          </Text>
        </View>
      </View>
      <Modal
        visible={isOtpStep}
        onRequestClose={() => setIsOtpStep(false)}
        animationType="slide"
      >
        <View
          className="flex-1 mt-16"
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[300] : colors.light[700],
          }}
        >
          <View className="flex-row">
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className="font-msemibold text-lg ml-3"
            >
              Verify OTP
            </Text>
            <TouchableOpacity
              onPress={() => setIsOtpStep(false)}
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
          <View>
            <View className="mt-6 px-5">
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium mb-2"
              >
                OTP
              </Text>
              <TextInput
                value={otp}
                onChangeText={setOtp}
                secureTextEntry
                className="border-gray-200 border rounded p-3"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              />
            </View>
            <TouchableOpacity
              onPress={handleOtpSubmit}
              className="bg-primary-100 rounded p-3 mt-6 mx-6"
            >
              <Text className="text-white text-center font-mmedium">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SignUp;
