import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import { useRouter } from "expo-router";
import { register } from "@/lib/service/user.service";
import { sendOTP, verifyOTP } from "@/lib/service/auth.service";
import OTPModal from "@/components/modal/signup/OTP";
import SignUpSteps from "@/components/modal/signup/SignUpStep";

const SignUp = () => {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const [step, setStep] = useState(1);

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

  const handleOtpSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const verifyResult = await verifyOTP(phoneNumber, otp); // Hàm verifyOTP thực hiện xác thực OTP

      if (!verifyResult.success) {
        setErrorMessage("Invalid or expired OTP.");
        return;
      }

      const birthday = new Date(
        Number(selectedYear),
        Number(selectedMonth) - 1,
        Number(selectedDay)
      );

      if (isNaN(birthday.getTime())) {
        setErrorMessage("Invalid birth date.");
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
          setGender("");
          setPassword("");
          setConfirmPassword("");
          setSelectedDay(0);
          setSelectedMonth(0);
          setSelectedYear(0);
          setIsOtpStep(false);
          router.push("signin" as any);
        } else {
          setErrorMessage("Registration failed!");
        }
      } catch (error: any) {
        console.error("Error during registration:", error);
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    } catch (error: any) {
      console.error("Error during OTP verification or registration:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  const handleOtpRequest = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");
    console.log(phoneNumber);

    try {
      const otpResponse = await sendOTP(phoneNumber);
      setGeneratedOtp(otpResponse.otp);
      setIsOtpStep(true);
    } catch (error: any) {
      console.error("Error during OTP request:", error);
      setErrorMessage(error.message || "Failed to send OTP.");
    }
  };

  const renderStep = () => {
    return (
      <SignUpSteps
        step={step}
        colorScheme={colorScheme}
        data={{
          firstName,
          lastName,
          email,
          phoneNumber,
          gender,
          password,
          confirmPassword,
          selectedDay,
          selectedMonth,
          selectedYear,
        }}
        setters={{
          setFirstName,
          setLastName,
          setEmail,
          setPhoneNumber,
          setGender,
          setPassword,
          setConfirmPassword,
          setSelectedDay,
          setSelectedMonth,
          setSelectedYear,
          setStep,
        }}
        dateOptions={{ days, months, years }}
        onRegisterPress={handleOtpRequest}
      />
    );
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        className="w-full h-full"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:
            colorScheme === "dark" ? colors.dark[500] : colors.light[500],
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="w-full px-7"
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View className="w-full space-y-10 flex flex-col justify-center items-center">
            <View className="items-center mb-10">
              <Text
                className="font-msemibold text-[36px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                Sign Up
              </Text>
            </View>
            {renderStep()}
            <View className="flex flex-row items-center justify-center">
              <Text
                className="font-mbold  text-[16px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                Or
              </Text>
            </View>
            <View className="mt-4 mb-10 w-full flex flex-row items-center justify-center">
              <Text
                className="font-mregular text-[16px]  "
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                Already have an account?{" "}
                <Text
                  onPress={() => router.push("signin" as any)}
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[100],
                  }}
                  className="font-mbold  text-[16px] "
                >
                  Login
                </Text>
              </Text>
            </View>

            <OTPModal
              visible={isOtpStep}
              onClose={() => setIsOtpStep(false)}
              onSubmit={handleOtpSubmit}
              otp={otp}
              setOtp={setOtp}
            />
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;
