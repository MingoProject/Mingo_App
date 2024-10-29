import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
} from "react-native";
import {
  ArrowIcon,
  UserIcon,
  NotificationIcon,
  NotificationOffIcon,
  SearchIcon,
  ImageIcon,
  FileIcon,
  ReportIcon,
  BlockIcon,
  TrashIcon,
} from "../../icons/Icons"; // Đảm bảo đường dẫn đúng
import { useTheme } from "../../../context/ThemeContext";
import { colors } from "../../../styles/colors";

const picturesData = [
  "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg",
  "https://i.pinimg.com/originals/ff/ec/81/ffec81a1a3ee6a557433bcc626e1dfc6.jpg",
  "https://i.pinimg.com/originals/ce/16/72/ce16725b94d75e6434bbe3ac0f005814.jpg",
  "https://i.pinimg.com/originals/70/3f/f8/703ff89cf6cad803da55cf5cc9ff42fd.jpg",
  "https://i.pinimg.com/originals/8d/87/4b/8d874bdf21d904fece1f06a83bfb8160.jpg",
  "https://i.pinimg.com/originals/22/ac/ca/22accaa81d76b8e6aace6c5562e00f8e.jpg",
  "https://i.pinimg.com/originals/9c/8d/c8/9c8dc806006f2da4154d68e85a9dd7cc.jpg",
  "https://i.pinimg.com/originals/1c/6d/80/1c6d806c88fe716566fb83713396b195.jpg",
  "https://i.pinimg.com/originals/95/0d/0d/950d0d7b19b956a5052b7d2c362c9871.jpg",
  "https://i.pinimg.com/originals/4c/94/8f/4c948f59bd94a59dd88cc4636a7016ad.jpg",
];

const filesData = [
  { id: "1", name: "Tệp 1.pdf", uri: "https://example.com/file1.pdf" },
  { id: "2", name: "Tệp 2.docx", uri: "https://example.com/file2.docx" },
  { id: "3", name: "Tệp 3.xlsx", uri: "https://example.com/file3.xlsx" },
];

const InfoChat = ({ fakeData, setModalVisible }) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [notification, setNotification] = useState(true);
  const [showAllImages, setShowAllImages] = useState(false);
  const [showAllFiles, setShowAllFiles] = useState(false);

  const toggleNotification = () => {
    setNotification((prev) => !prev);
  };

  return (
    <>
      <View
        className="flex-1 mt-10"
        style={{
          backgroundColor:
            colorScheme === "dark" ? colors.dark[300] : colors.light[700],
        }}
      >
        <View className="flex flex-row">
          <TouchableOpacity
            className="pt-3"
            onPress={() => setModalVisible(false)}
          >
            <ArrowIcon size={30} color={"#FFAABB"} />
          </TouchableOpacity>
          <View>
            <Text
              style={{ color: colors.primary[100] }}
              className="font-msemibold text-[17px] mt-4 ml-1"
            >
              Chi tiết
            </Text>
          </View>
        </View>

        <View className="justify-center mx-auto">
          <Image
            source={{ uri: fakeData.avatar }}
            className="w-32 mt-5 h-32 rounded-full mr-2"
          />
        </View>

        <View className="flex justify-center h-12">
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
            className={`text-[18px] text-center font-mmedium mt-2`}
          >
            {fakeData.name}
          </Text>
        </View>

        <View className="flex flex-row mx-auto">
          <View className="justify-center items-center w-28">
            <TouchableOpacity
              className="items-center justify-center w-10 h-10 rounded-full "
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[200] : colors.light[800],
              }}
            >
              <UserIcon size={28} color={iconColor} />
            </TouchableOpacity>
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[12px] text-center font-mregular`}
            >
              Trang cá nhân
            </Text>
          </View>

          <View className="h-20 justify-center items-center w-24">
            <TouchableOpacity
              className="ml-2 items-center justify-center w-10 h-10 rounded-full "
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[200] : colors.light[800],
              }}
              onPress={toggleNotification}
            >
              {notification ? (
                <NotificationIcon size={30} color={iconColor} />
              ) : (
                <NotificationOffIcon size={30} color={iconColor} />
              )}
            </TouchableOpacity>
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[12px] text-center font-mregular`}
            >
              {notification ? "Tắt thông báo" : "Bật thông báo"}
            </Text>
          </View>

          <View className="h-20 justify-center items-center w-24">
            <TouchableOpacity
              className="ml-2 items-center justify-center w-10 h-10 rounded-full "
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[200] : colors.light[800],
              }}
            >
              <SearchIcon size={28} color={iconColor} />
            </TouchableOpacity>
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[12px] text-center font-mregular`}
            >
              Tìm kiếm
            </Text>
          </View>
        </View>

        <View className="mt-3 ml-5">
          <View className="flex flex-row">
            <ImageIcon size={28} color={iconColor} />
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[16px] ml-3 mt-1 font-mregular`}
            >
              Phương tiện
            </Text>
            <TouchableOpacity
              onPress={() => setShowAllImages(true)}
              className="ml-auto"
            >
              <Text className="text-primary-100 text-sm text-right mr-5">
                Xem tất cả
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex flex-row mt-3 mx-10">
          {picturesData.slice(0, 4).map((url, index) => (
            <Image
              key={index}
              source={{ uri: url }}
              className="w-20 h-20 rounded-md mr-2"
            />
          ))}
        </View>
        <View className="ml-5 mt-5">
          <View className="flex flex-row">
            <FileIcon size={28} color={iconColor} />
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[16px] ml-3 mt-1 font-mregular`}
            >
              File
            </Text>
            <TouchableOpacity
              onPress={() => setShowAllFiles(true)}
              className="ml-auto"
            >
              <Text className="text-primary-100 text-sm text-right mr-5">
                Xem tất cả
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-1 mt-3 max-h-24">
          {filesData.slice(0, 2).map((file, index) => (
            <View
              className={`flex-1 flex-row h-[32px] mb-2 items-center font-mregular px-4 mx-8 rounded-lg text-sm border border-[#D9D9D9] ${
                colorScheme === "dark" ? "bg-dark-200" : "bg-light-800"
              }`}
              key={index}
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[200] : colors.light[800], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
            >
              <FileIcon size={28} color={iconColor} />
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                  flex: 1,
                }}
                className={`text-[14px] ml-1 font-mmedium `}
              >
                {file.name}
              </Text>
            </View>
          ))}
        </View>

        <View className="ml-5 mt-5">
          <View className="flex flex-row">
            <ReportIcon size={30} color={iconColor} />
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[16px] ml-3 mt-1 font-mregular`}
            >
              Báo cáo
            </Text>
          </View>
        </View>
        <View className="ml-5 mt-5">
          <View className="flex flex-row">
            <BlockIcon size={28} color={iconColor} />
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[16px] ml-3 mt-1 font-mregular`}
            >
              Chặn
            </Text>
          </View>
        </View>
        <View className="ml-5 mt-5">
          <View className="flex flex-row">
            <TrashIcon size={28} color={iconColor} />
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[16px] ml-3 mt-1 font-mregular`}
            >
              Xóa đoạn chat
            </Text>
          </View>
        </View>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        className="p-10"
        visible={showAllImages}
        onRequestClose={() => setShowAllImages(false)}
      >
        <View
          className="flex-1 "
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
            flex: 1,
          }}
        >
          <View
            className="flex-1 rounded-t-lg p-4"
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
              flex: 1,
            }}
          >
            <View
              className="flex flex-row pt-5 max-h-20"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowAllImages(false)}
                className="mt-3"
              >
                <ArrowIcon size={30} color={"#FFAABB"} />
              </TouchableOpacity>
              <View>
                <Text
                  style={{ color: colors.primary[100] }}
                  className="font-msemibold text-[17px] mt-4 ml-1"
                >
                  Phương tiện
                </Text>
              </View>
            </View>
            <FlatList
              data={picturesData}
              className="mt-5"
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  className="w-28 h-28 rounded-md mb-2" // Kích thước hình ảnh
                />
              )}
              numColumns={3} // Hiển thị 3 hình trong 1 hàng
              columnWrapperStyle={{ justifyContent: "space-between" }} // Căn chỉnh các cột
            />
            <TouchableOpacity
              onPress={() => setShowAllImages(false)}
              className="mt-2 bg-primary-100 rounded p-2"
            >
              <Text className="text-white text-center font-mmedium">Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        animationType="slide"
        visible={showAllFiles}
        onRequestClose={() => setShowAllFiles(false)}
      >
        <View
          className="flex-1 p-4"
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
            flex: 1,
          }}
        >
          <View
            className="flex flex-row pt-5 max-h-16"
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
              flex: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowAllFiles(false)}
              className="mt-3"
            >
              <ArrowIcon size={30} color={"#FFAABB"} />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
            >
              <Text
                style={{ color: colors.primary[100] }}
                className="font-msemibold text-[17px] mt-4 ml-1"
              >
                Files
              </Text>
            </View>
          </View>
          <View
            className="w-full  rounded-lg py-5 px-1"
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
              flex: 1,
            }}
          >
            <FlatList
              data={filesData}
              className="h-[700px]"
              renderItem={({ item }) => (
                <View
                  className={`flex-1 flex-row h-[50px] mb-2 items-center font-mregular px-4  rounded-lg text-sm border border-[#D9D9D9] ${
                    colorScheme === "dark" ? "bg-dark-200" : "bg-light-800"
                  }`}
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? colors.dark[200]
                        : colors.light[800], // Sử dụng giá trị màu từ file colors.js
                    flex: 1,
                  }}
                >
                  <FileIcon size={28} color={iconColor} />
                  <Text
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[100]
                          : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                      flex: 1,
                    }}
                    className={`text-[14px] ml-1 font-mmedium `}
                  >
                    {item.name}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
            <View className="justify-end mt-auto ">
              <TouchableOpacity
                onPress={() => setShowAllFiles(false)}
                className="mt-4 bg-primary-100 rounded-full py-2"
              >
                <Text className="text-white text-center font-mmedium">
                  Đóng
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default InfoChat;
