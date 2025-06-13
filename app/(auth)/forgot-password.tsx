import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "@/styles/colors";
import { findUserByPhoneNumber } from "@/lib/service/user.service";
import { sendOTP, verifyOTP, resetPassword } from "@/lib/service/auth.service";
import { ArrowIcon } from "@/components/shared/icons/Icons";
import ForgotPasswordSteps from "@/components/modal/forgot-password/ForgotPasswordStep";

const ForgotPassword = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [otpExpired, setOtpExpired] = useState(false);
  const { colorScheme } = useTheme();
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];

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

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className="w-full h-full px-7 relative"
        style={{
          backgroundColor:
            colorScheme === "dark" ? colors.dark[500] : colors.light[500],
          flex: 1,
        }}
      >
        <View className="absolute top-8 left-4 z-50">
          <ArrowIcon size={27} color={iconColor} />
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ForgotPasswordSteps
            step={step}
            colorScheme={colorScheme}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            handlePhoneSubmit={handlePhoneSubmit}
            otp={otp}
            inputRefs={inputRefs}
            handleChange={handleChange}
            handleOtpSubmit={handleOtpSubmit}
            handleResendOTP={handleResendOTP}
            timeLeft={timeLeft}
            otpExpired={otpExpired}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handlePasswordSubmit={handlePasswordSubmit}
            errorMessage={errorMessage}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPassword;
