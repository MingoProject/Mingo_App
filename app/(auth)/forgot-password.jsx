import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "@/styles/colors";
import { findUserByPhoneNumber } from "@/lib/service/user.service";
import { sendOTP, verifyOTP, resetPassword } from "@/lib/service/auth.service";

const ForgotPassword = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // State để lưu trữ giá trị OTP
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(60); // Thời gian còn lại cho OTP
  const [otpExpired, setOtpExpired] = useState(false); // Kiểm tra xem OTP đã hết hạn chưa
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const ChevronIcon = ({
    color = iconColor,
    width = 24,
    height = 24,
    onPress,
  }) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      onPress={onPress}
    >
      <Path
        fill={color}
        d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0l-6.59 6.59a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1"
      />
    </Svg>
  );

  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);

  const handlePhoneSubmit = async () => {
    try {
      const userExists = await findUserByPhoneNumber(phoneNumber);
      if (!userExists) {
        setErrorMessage("No user found with this phone number.");
        return;
      }
      await sendOTP(phoneNumber);
      setStep(2);
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const fullOtp = otp.join("");
      console.log("Full OTP:", fullOtp);
      const isOtpValid = await verifyOTP(phoneNumber, fullOtp);
      if (!isOtpValid) {
        setErrorMessage("Invalid OTP. Please try again.");
        return;
      }
      setStep(3);
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    try {
      await resetPassword(phoneNumber, newPassword);
      setStep(1);
      setErrorMessage("");
      alert("Password reset successfully!");
      router.push("/signin");
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    try {
      await sendOTP(phoneNumber);
    } catch (error) {
      setErrorMessage("resend failed. Please try again.");
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setOtpExpired(true);
    }
  }, [timeLeft]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className="w-full h-full p-4 bg-white pt-12"
        style={{
          backgroundColor:
            colorScheme === "dark" ? colors.dark[300] : colors.light[700],
          flex: 1,
        }}
      >
        <View className="flex flex-col justify-between">
          <View>
            <ChevronIcon onPress={() => router.back()} />
          </View>
          {step === 1 && (
            <View
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                // flex: 1,
              }}
            >
              <View className="w-full items-center justify-end pb-5 mt-28">
                <Text
                  className="font-msemibold text-[36px]"
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                >
                  Forgot Password
                </Text>
                <Image
                  source={
                    colorScheme === "dark"
                      ? require("../../assets/images/password-dark.png")
                      : require("../../assets/images/password-light.png")
                  }
                  style={{ width: 233, height: 235 }} // Tránh lỗi style
                />
              </View>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter phone number"
                keyboardType="numeric"
                className="mt-2 border border-gray-200 rounded-[8px] p-4 font-mregular"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              />
              <TouchableOpacity
                onPress={handlePhoneSubmit}
                className="mt-4 p-[14px] bg-primary-100 rounded-[8px]"
              >
                <Text
                  className="text-white text-center text-[16px] font-msemibold"
                  style={{
                    color: "#ffffff",
                  }}
                >
                  Send OTP
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {step === 2 && (
            <View>
              <View className="flex items-center justify-center pt-10">
                <Image
                  source={
                    colorScheme === "dark"
                      ? require("../../assets/images/OTPdark.png")
                      : require("../../assets/images/OTP.png")
                  }
                  style={{ width: 200, height: 200 }}
                />
              </View>

              <View className="flex items-center justify-center">
                <Text
                  className="font-mbold text-[32px] text-light-500 "
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                >
                  OTP Verification
                </Text>
                <Text
                  className="font-mmedium text-[16px] text-light-500 pt-4"
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                >
                  Entry the OTP sent to the phone number{" "}
                </Text>
                <Text
                  className="font-mbold text-[16px] text-light-500 pt-1"
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                >
                  {phoneNumber}
                </Text>
              </View>

              <View className="flex flex-row w-full justify-around pt-8">
                {otp.map((value, index) => (
                  <TextInput
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    value={value}
                    onChangeText={(text) => handleChange(text, index)}
                    keyboardType="numeric"
                    maxLength={1} // Giới hạn mỗi ô input chỉ nhận 1 ký tự
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#92898A",
                      textAlign: "center",
                      fontSize: 18,
                      color: "#92898A",
                    }}
                  />
                ))}
              </View>
              <TouchableOpacity
                onPress={handleOtpSubmit}
                className="mt-4 p-3 bg-primary-100 rounded font-mmedium"
              >
                <Text className="text-white text-center">Verify OTP</Text>
              </TouchableOpacity>

              <View className="flex items-center justify-center pt-8">
                {otpExpired ? (
                  <Text
                    className="font-mmedium text-[16px] text-light-500 "
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[100]
                          : colors.light[500],
                    }}
                  >
                    You haven't recieved OTP?{" "}
                    <Text
                      className="font-mbold text-[16px] text-light-500 cursor-pointer"
                      onPress={handleResendOTP}
                      style={{
                        color: colorScheme === colors.primary[100],
                      }}
                    >
                      Resend
                    </Text>
                  </Text>
                ) : (
                  <Text
                    className="font-mmedium text-[16px] text-light-500 "
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[100]
                          : colors.light[500],
                    }}
                  >
                    OTP expires later: {timeLeft} second
                  </Text>
                )}
              </View>
            </View>
          )}
          {step === 3 && (
            <View>
              <View className="w-full items-center justify-end pb-10 mt-10">
                <Text
                  className="font-msemibold text-[30px] text-light-500 "
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                >
                  Reset Password
                </Text>
              </View>

              <TextInput
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
                className="border border-gray-200 p-4 rounded-[8px] my-4"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              />
              <TextInput
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                className="border p-4 border-gray-200 rounded-[8px] my-4"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              />
              <TouchableOpacity
                onPress={handlePasswordSubmit}
                className="mt-4 p-[14px] bg-primary-100 rounded-[8px]"
              >
                <Text className="text-white text-center text-[16px] font-msemibold">
                  Reset Password
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {errorMessage ? (
            <Text className="text-red-500 mt-4 text-center">
              {errorMessage}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPassword;
