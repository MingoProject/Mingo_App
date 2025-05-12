import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import MyInput from "../../components/share/MyInput";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import MyButton from "../../components/share/MyButton";
import { useRouter } from "expo-router";
import { register } from "@/lib/service/user.service";
import { sendOTP, verifyOTP } from "@/lib/service/auth.service";
import { Picker } from "@react-native-picker/picker";

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
  const [isOtpStep, setIsOtpStep] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setGender("");
    setPassword("");
    setConfirmPassword("");
    setSelectedDay("");
    setSelectedMonth("");
    setSelectedYear("");
    setOtp("");
    setIsOtpStep(false);
  };

  const handleOtpRequest = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }
    if (!phoneNumber) {
      setErrorMessage("Please enter your phone number.");
      return;
    }
    try {
      await sendOTP(phoneNumber);
      setIsOtpStep(true);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to send OTP.");
    }
  };

  const handleOtpSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const verifyResult = await verifyOTP(phoneNumber, otp);
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
        birthDay: new Date(
          Number(selectedYear),
          Number(selectedMonth) - 1,
          Number(selectedDay)
        ),
      };

      const newUser = await register(userData);
      if (newUser) {
        setSuccessMessage("Registration successful! Please log in.");
        resetForm();
        router.push("signin");
      } else {
        setErrorMessage("Registration failed!");
      }
    } catch (error) {
      console.error("Error during OTP verification or registration:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="w-full h-full p-4 pt-14 bg-white">
        {/* UI phần nhập liệu và OTP Modal (bạn có thể giữ nguyên phần này như trước) */}

        <Modal
          visible={isOtpStep}
          onRequestClose={() => setIsOtpStep(false)}
          animationType="slide"
        >
          <View
            className="flex-1 mt-16"
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[500] : colors.light[500],
            }}
          >
            <View className="flex-row">
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
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
                    color:
                      colorScheme === "dark" ? colors.dark[100] : "#D9D9D9",
                  }}
                  className="font-msemibold mt-2"
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
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
                className="border-gray-200 border rounded p-3"
                keyboardType="numeric"
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
        </Modal>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;
