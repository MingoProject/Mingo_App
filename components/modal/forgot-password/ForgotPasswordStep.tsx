import React from "react";
import { View, Text, Image, TextInput } from "react-native";
import MyInput from "@/components/share/MyInput";
import Button from "@/components/share/ui/button";
import { colors } from "@/styles/colors";

interface Props {
  step: number;
  colorScheme: "light" | "dark";
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  handlePhoneSubmit: () => void;
  otp: string[];
  inputRefs: React.RefObject<(TextInput | null)[]>;
  handleChange: (text: string, index: number) => void;
  handleOtpSubmit: () => void;
  handleResendOTP: () => void;
  timeLeft: number;
  otpExpired: boolean;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  handlePasswordSubmit: () => void;
  errorMessage: string;
}

const ForgotPasswordSteps: React.FC<Props> = ({
  step,
  colorScheme,
  phoneNumber,
  setPhoneNumber,
  handlePhoneSubmit,
  otp,
  inputRefs,
  handleChange,
  handleOtpSubmit,
  handleResendOTP,
  timeLeft,
  otpExpired,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handlePasswordSubmit,
  errorMessage,
}) => {
  return (
    <View className="w-full space-y-8 flex flex-col justify-center items-center">
      {step === 1 && (
        <View
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[500] : colors.light[500],
            // flex: 1,
          }}
          className="w-full space-y-8 flex flex-col justify-center items-center"
        >
          <View className="w-full flex flex-col items-center justify-end">
            <Text
              className="font-msemibold text-[36px]"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
            >
              Forgot Password
            </Text>
            <Image
              source={
                colorScheme === "dark"
                  ? require("../../../assets/images/password-dark.png")
                  : require("../../../assets/images/password-light.png")
              }
              style={{ width: 233, height: 235 }} // Tránh lỗi style
            />
          </View>

          <View className="relative w-full">
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
                Phone number <Text style={{ color: "red" }}>*</Text>
              </Text>
            </View>
            <MyInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Password"
              secureTextEntry
              height={56}
              fontSize={14}
              fontFamily="Montserrat-Regular"
            />
          </View>
          <View className="w-full">
            <Button
              title="Send OTP"
              onPress={handlePhoneSubmit}
              fontColor={
                colorScheme === "dark" ? colors.dark[100] : colors.light[200]
              }
            />
          </View>
        </View>
      )}
      {step === 2 && (
        <View
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[500] : colors.light[500],
            // flex: 1,
          }}
          className="w-full space-y-8 flex flex-col justify-center items-center"
        >
          <View className="flex items-center justify-center pt-10">
            <Image
              source={
                colorScheme === "dark"
                  ? require("../../../assets/images/OTPdark.png")
                  : require("../../../assets/images/OTP.png")
              }
              style={{ width: 200, height: 200 }}
            />
          </View>

          <View className="flex items-center justify-center">
            <Text
              className="font-msemibold text-[36px]"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
            >
              OTP Verification
            </Text>
            <Text
              className="font-mmedium text-[16px]  pt-4"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
            >
              Entry the OTP sent to the phone number{" "}
            </Text>
            <Text
              className="font-mbold text-[16px]  pt-1"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
            >
              {phoneNumber}
            </Text>
          </View>

          <View className="flex flex-row w-full justify-around pt-8">
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={value}
                onChangeText={(text) => handleChange(text, index)}
                keyboardType="numeric"
                maxLength={1} // Giới hạn mỗi ô input chỉ nhận 1 ký tự
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#CCCCCC",
                  textAlign: "center",
                  fontSize: 18,
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              />
            ))}
          </View>
          <View className="w-full">
            <Button
              title="Send OTP"
              onPress={handleOtpSubmit}
              fontColor={
                colorScheme === "dark" ? colors.dark[100] : colors.light[200]
              }
            />
          </View>

          <View className="flex items-center justify-center pt-8">
            {otpExpired ? (
              <Text
                className="font-mmedium text-[16px]  "
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                You haven't recieved OTP?{" "}
                <Text
                  className="font-mbold text-[16px] cursor-pointer"
                  onPress={handleResendOTP}
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.primary[100]
                        : colors.light[100],
                  }}
                >
                  Resend
                </Text>
              </Text>
            ) : (
              <Text
                className="font-mmedium text-[16px]  "
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
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
          <View className="w-full items-center justify-end">
            <Text
              className="font-msemibold text-[36px]"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
            >
              Reset Password
            </Text>
          </View>

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
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
            >
              New Password <Text style={{ color: "red" }}>*</Text>
            </Text>
          </View>
          <MyInput
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            placeholder="New Password"
            secureTextEntry
            height={56}
            fontSize={14}
            fontFamily="Montserrat-Regular"
          />
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
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
            >
              New Password <Text style={{ color: "red" }}>*</Text>
            </Text>
          </View>
          <MyInput
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            placeholder="Confirm Password"
            secureTextEntry
            height={56}
            fontSize={14}
            fontFamily="Montserrat-Regular"
          />
          <View className="">
            <Button
              title="Reset Password"
              onPress={handlePasswordSubmit}
              fontColor={
                colorScheme === "dark" ? colors.dark[100] : colors.light[200]
              }
            />
          </View>
        </View>
      )}
      {errorMessage ? (
        <Text className="text-red-500 mt-4 text-center">{errorMessage}</Text>
      ) : null}
    </View>
  );
};

export default ForgotPasswordSteps;
