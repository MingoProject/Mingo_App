import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useState } from "react";
import { bgLight500Dark10, textLight0Dark500 } from "@/styles/theme";
import Previous from "@/components/ui/Previous";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { SafeAreaView, FlatList, Dimensions } from "react-native";
import { Image } from "react-native";
import VideoPlayer from "@/components/shared/multimedia/VideoPlayer";
import { getFilesOfAMessageBox } from "@/lib/media";
import { FileProps } from "@/types/file";
import { IconURL } from "@/constants/IconURL";
import Icon from "@/components/ui/Icon";
import ImageViewing from "react-native-image-viewing";
import { openWebFile, playSound } from "@/utils/File";
import AudioViewer from "@/components/shared/multimedia/AudioViewer";

const ChatMultimediaPage = () => {
  const { boxId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [selected, setSelected] = useState("images");
  const [images, setImages] = useState<FileProps[]>([]);
  const [videos, setVideos] = useState<FileProps[]>([]);
  const [audios, setAudios] = useState<FileProps[]>([]);
  const [others, setOthers] = useState<FileProps[]>([]);

  const screenWidth = Dimensions.get("window").width;
  const numColumns = 4;
  const mediaSize = screenWidth / numColumns - 10;

  const [isImageViewingOpen, setIsImageViewingOpen] = useState(false);
  const [imageViewing, setImageViewing] = useState("");

  const [isAudioViewingOpen, setIsAudioViewingOpen] = useState(false);
  const [audioViewing, setAudioViewing] = useState("");
  const [audioViewingName, setAudioViewingName] = useState("");
  useFocusEffect(
    useCallback(() => {
      const getMultimediaFUNC = async () => {
        const files: FileProps[] = await getFilesOfAMessageBox(
          boxId.toString()
        );
        const images = files.filter((item) => item.type === "Image");
        const videos = files.filter((item) => item.type === "Video");
        const audios = files.filter((item) => item.type === "Audio");
        const others = files.filter(
          (item) =>
            item.type !== "Image" &&
            item.type !== "Video" &&
            item.type !== "Audio"
        );
        setImages(images);
        setVideos(videos);
        setAudios(audios);
        setOthers(others);
      };
      getMultimediaFUNC();
    }, [boxId])
  );


  const renderImageItem = ({ item }: { item: FileProps }) => (
    <TouchableOpacity onPress={()=>{setImageViewing(item.url!); setIsImageViewingOpen(true)}}>
      <Image
        source={{ uri: item.url }}
        style={{
          width: mediaSize,
          height: mediaSize,
          margin: 5,
          borderRadius: 8,
        }}
      />
    </TouchableOpacity>
  );

  const renderVideoItem = ({ item }: { item: FileProps }) => (
    <TouchableOpacity
      style={{
        width: mediaSize,
        height: mediaSize,
        margin: 5,
        borderRadius: 8,
      }}
    >
      <VideoPlayer videoSource={item.url!} />
    </TouchableOpacity>
  );

  const renderAudioItem = ({ item }: { item: FileProps }) => (
    <TouchableOpacity
      className={`flex items-center justify-center`}
      style={{
        width:mediaSize,
        margin: 5,
        borderRadius: 8,
        rowGap:4,
      }}
      onPress={()=>{setAudioViewing(item.url!); setAudioViewingName(item.fileName!
      ); setIsAudioViewingOpen(true); }}
    >
      <View className=" bg-light-300 dark:bg-dark-20 flex-1 w-full rounded-2xl items-center justify-center" style={{width:mediaSize, height:mediaSize}}><Icon iconURL={IconURL.voice} size={40} /></View>
        <View className="w-full" style={{rowGap:2}}>
          <View>
            <Text
              className={`${textLight0Dark500} text-12 font-helvetica-bold`}
            >
              {item.fileName}
            </Text>
          </View>
          <Text className={`${textLight0Dark500} text-10 font-helvetica-light`}>
            {item.bytes! * 0.001}KB
          </Text>
        </View>
    </TouchableOpacity>
  );

  const renderFileItem = ({ item }: { item: FileProps }) => (
    <TouchableOpacity  className={`flex items-center justify-center `}
    style={{
      width: mediaSize,
      margin: 5,
      borderRadius: 8,
      rowGap:4
    }} onPress={async ()=>await openWebFile(item.url!)}>
       <View className=" bg-light-300 dark:bg-dark-20 flex-1 w-full rounded-2xl items-center justify-center" style={{width:mediaSize, height:mediaSize}}> <Icon
        size={40}
        iconURL={renderFileIcon(item.url?.split(".").pop()!)}
      /></View>
       <View className="w-full" style={{rowGap:2}}>
          <View>
            <Text
              className={`${textLight0Dark500} text-12 font-helvetica-bold`}
              numberOfLines={2}
            >
              {item.fileName}
            </Text>
          </View>
          <Text className={`${textLight0Dark500} text-10 font-helvetica-light`}>
            {item.bytes! * 0.001}KB
          </Text>
        </View>
    </TouchableOpacity>
  );

  const renderFileIcon = (type: string) => {
    switch (type) {
      case "docx":
        return IconURL.docx;
      case "xls":
        return IconURL.xls;
      case "ppt":
        return IconURL.ppt;
      case "pdf":
        return IconURL.pdf;
      default:
        return IconURL.my_document;
    }
  };

  return (
    <View
      className={`${bgLight500Dark10} flex-1`}
      style={{ rowGap: 10 }}
    >
      {isAudioViewingOpen? <AudioViewer uri={audioViewing} fileName={audioViewingName} onClose={()=>setIsAudioViewingOpen(false)}/>:null}
       {isImageViewingOpen ? (
          <ImageViewing
            images={[{ uri: imageViewing }]}
            imageIndex={0}
            visible={isImageViewingOpen}
            onRequestClose={() => setIsImageViewingOpen(false)}
            doubleTapToZoomEnabled={true}
          />
        ) : null}
      <View className="mt-[10px] ml-[10px]">
        <Previous navigation={navigation} header="Multimedia" />
      </View>
      <View className="w-full flex flex-row justify-between items-center p-[10px]">
        <TouchableOpacity
          onPress={() => setSelected("images")}
          className="flex-1 flex items-center justify-center"
          style={{ rowGap: 12 }}
        >
          <Text className="text-cardinal text-16 font-helvetica-bold text-center">
            Images
          </Text>
          {selected === "images" ? (
            <View className="w-[80px] h-[2px] bg-cardinal"></View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelected("videos")}
          className="flex-1 flex items-center justify-center"
          style={{ rowGap: 12 }}
        >
          <Text className="text-cardinal text-16 font-helvetica-bold text-center">
            Videos
          </Text>
          {selected === "videos" ? (
            <View className="w-[80px] h-[2px] bg-cardinal"></View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelected("audios")}
          className="flex-1 flex items-center justify-center"
          style={{ rowGap: 12 }}
        >
          <Text className="text-cardinal text-16 font-helvetica-bold text-center">
            Audios
          </Text>
          {selected === "audios" ? (
            <View className="w-[80px] h-[2px] bg-cardinal"></View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelected("files")}
          className="flex-1 flex items-center justify-center"
          style={{ rowGap: 12 }}
        >
          <Text className="text-cardinal text-16 font-helvetica-bold text-center">
            Files
          </Text>
          {selected === "files" ? (
            <View className="w-[80px] h-[2px] bg-cardinal"></View>
          ) : null}
        </TouchableOpacity>
      </View>
      <View className="flex-1">
        {selected === "images" ? (
          <FlatList
            data={images}
            renderItem={renderImageItem}
            numColumns={numColumns}
          />
        ) : selected === "videos" ? (
          <FlatList
            data={videos}
            renderItem={renderVideoItem}
            numColumns={numColumns}
          />
        ) : selected === "audios" ? (
          <FlatList
            data={audios}
            renderItem={renderAudioItem}
            numColumns={numColumns}
          />
        ) : (
          <FlatList
            data={others}
            renderItem={renderFileItem}
            numColumns={numColumns}
          />
        )}
      </View>
    </View>
  );
};

export default ChatMultimediaPage;
