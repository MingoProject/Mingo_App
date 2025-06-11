import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import MyInput from "@/components/share/MyInput";
import Button from "@/components/share/ui/button";
import { colors } from "@/styles/colors";

interface Props {
  step: number;
  colorScheme: "light" | "dark";
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    password: string;
    confirmPassword: string;
    selectedDay: number;
    selectedMonth: number;
    selectedYear: number;
  };
  setters: {
    setFirstName: (v: string) => void;
    setLastName: (v: string) => void;
    setEmail: (v: string) => void;
    setPhoneNumber: (v: string) => void;
    setGender: (v: string) => void;
    setPassword: (v: string) => void;
    setConfirmPassword: (v: string) => void;
    setSelectedDay: (v: number) => void;
    setSelectedMonth: (v: number) => void;
    setSelectedYear: (v: number) => void;
    setStep: (v: number) => void;
  };
  dateOptions: {
    days: number[];
    months: number[];
    years: number[];
  };
  onRegisterPress: () => void;
}

const SignUpSteps: React.FC<Props> = ({
  step,
  colorScheme,
  data,
  setters,
  dateOptions,
  onRegisterPress,
}) => {
  const {
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
  } = data;

  const {
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
  } = setters;

  const { days, months, years } = dateOptions;

  switch (step) {
    case 1:
      return (
        <View className="flex flex-col space-y-8 w-full">
          <View className="relative w-full">
            <View
              className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[500] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
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
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
              fontFamily="Montserrat-Regular"
              height={56}
            />
          </View>
          <View className="relative w-full">
            <View
              className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[500] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
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
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
              fontFamily="Montserrat-Regular"
              height={56}
            />
          </View>
          <View className="relative">
            <View
              className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[500] : colors.light[500],
                flex: 1,
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
                Phone Number <Text style={{ color: "red" }}>*</Text>
              </Text>
            </View>

            {/* Input */}
            <MyInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Phone Number"
              fontFamily="Montserrat-Regular"
              height={56}
              fontSize={14}
              style={{ zIndex: 1 }} // Đảm bảo input có z-index thấp hơn nhãn
            />
          </View>
          <View className="relative mb-8">
            <View
              className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[500] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
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
                Email <Text style={{ color: "red" }}>*</Text>
              </Text>
            </View>

            {/* Input */}
            <MyInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email@gmail.com"
              fontFamily="Montserrat-Regular"
              height={56}
            />
          </View>
          <Button
            title="Next"
            onPress={() => setStep(2)}
            fontColor={
              colorScheme === "dark" ? colors.dark[100] : colors.light[200]
            }
          />
        </View>
      );
    case 2:
      return (
        <View className="w-full space-y-10">
          <View className="mb-3">
            <Text className="mb-1 text-sm ">
              Gender <Text style={{ color: "red" }}>*</Text>
            </Text>
            <Picker selectedValue={gender} onValueChange={setGender}>
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>
          <View>
            <Text className="mb-1 text-sm ">
              Date of Birth <Text style={{ color: "red" }}>*</Text>
            </Text>
            <View className="flex-row justify-between mb-8">
              <Picker
                selectedValue={selectedDay.toString()}
                style={{ flex: 1 }}
                onValueChange={(v) => setSelectedDay(Number(v))}
              >
                {days.map((d) => (
                  <Picker.Item
                    key={d}
                    label={d.toString()}
                    value={d.toString()}
                  />
                ))}
              </Picker>
              <Picker
                selectedValue={selectedMonth.toString()}
                style={{ flex: 1 }}
                onValueChange={(v) => setSelectedMonth(Number(v))}
              >
                {months.map((m) => (
                  <Picker.Item
                    key={m}
                    label={m.toString()}
                    value={m.toString()}
                  />
                ))}
              </Picker>
              <Picker
                selectedValue={selectedYear.toString()}
                style={{ flex: 1 }}
                onValueChange={(v) => setSelectedYear(Number(v))}
              >
                {years.map((y) => (
                  <Picker.Item
                    key={y}
                    label={y.toString()}
                    value={y.toString()}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <Button
            title="Next"
            onPress={() => setStep(3)}
            fontColor={
              colorScheme === "dark" ? colors.dark[100] : colors.light[200]
            }
          />
        </View>
      );
    case 3:
      return (
        <View className="w-full space-y-8">
          <View className="relative w-full">
            <View
              className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[500] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
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
                Password <Text style={{ color: "red" }}>*</Text>
              </Text>
            </View>

            <MyInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              fontFamily="Montserrat-Regular"
              height={56}
            />
          </View>
          <View className="relative w-full mb-8">
            {/* Nhãn (Label) */}
            <View
              className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[500] : colors.light[500],
                flex: 1,
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
                Confirm password <Text style={{ color: "red" }}>*</Text>
              </Text>
            </View>

            <MyInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              fontFamily="Montserrat-Regular"
              height={56}
            />
          </View>

          <Button
            title="Register"
            onPress={onRegisterPress}
            fontColor={
              colorScheme === "dark" ? colors.dark[100] : colors.light[200]
            }
          />
        </View>
      );

    default:
      return null;
  }
};

export default SignUpSteps;
