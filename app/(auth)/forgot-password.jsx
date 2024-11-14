import { View, Text, Image, TextInput } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";

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

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer); // Dọn dẹp timer khi component bị unmount
    } else {
      setOtpExpired(true); // Đánh dấu OTP đã hết hạn
    }
  }, [timeLeft]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text; // Cập nhật giá trị cho ô input tương ứng
    setOtp(newOtp);

    // Tự động chuyển đến ô tiếp theo nếu có giá trị nhập vào
    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1].focus(); // Di chuyển focus đến ô input tiếp theo
    }
  };

  const handleResendOtp = () => {
    // Reset lại OTP và thời gian còn lại
    setOtp(["", "", "", "", "", ""]);
    setTimeLeft(60);
    setOtpExpired(false);
    // Gửi lại mã OTP ở đây
  };

  return (
    <View
      className="w-full h-full p-4 bg-white"
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
    >
      <View className="flex flex-col justify-between">
        <View>
          <View>
            <ChevronIcon onPress={() => router.back()} />
          </View>
          <View className="flex items-center justify-center pt-10">
            <Image
              source={
                colorScheme === "dark"
                  ? require("../../assets/images/OTPdark.png")
                  : require("../../assets/images/OTP.png")
              }
              style={{ width: 233, height: 235 }} // Tránh lỗi style
            />
          </View>

          <View className="flex items-center justify-center">
            <Text
              className="font-mbold text-[32px] text-light-500 "
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
              }}
            >
              OTP Verification
            </Text>
            <Text
              className="font-mmedium text-[16px] text-light-500 pt-4"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
              }}
            >
              Nhập OTP được gửi đến số điện thoại{" "}
            </Text>
            <Text
              className="font-mbold text-[16px] text-light-500 pt-1"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
              }}
            >
              +84 123456789
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
                  borderColor: "#92898A", // Màu viền
                  textAlign: "center", // Căn giữa nội dung
                  fontSize: 18, // Kích thước font
                  color: "#92898A",
                }}
              />
            ))}
          </View>

          <View className="flex items-center justify-center pt-8">
            {otpExpired ? (
              <Text
                className="font-mmedium text-[16px] text-light-500 "
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                }}
              >
                Bạn chưa nhận được OTP?{" "}
                <Text
                  className="font-mbold text-[16px] text-light-500 cursor-pointer"
                  onPress={handleResendOtp} // Gửi lại mã OTP
                  style={{
                    color: colorScheme === colors.primary[100], // Sử dụng giá trị màu từ file colors.js
                  }}
                >
                  Gửi lại
                </Text>
              </Text>
            ) : (
              <Text
                className="font-mmedium text-[16px] text-light-500 "
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                }}
              >
                OTP hết hạn sau: {timeLeft} giây
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ForgotPassword;
