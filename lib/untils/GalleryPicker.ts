import * as ImagePicker from "expo-image-picker";

export const pickMedia = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    alert("Permission is required to access media library!");
    return [];
  }

  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images","videos"],
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result || typeof result.canceled === "undefined") {
      console.warn("Error: Unexpected result structure or user exited unexpectedly.");
      return [];
    }

    if (result.canceled) {
      console.log("User canceled media picking");
      return [];
    }
    const selectedAssets = result.assets.map((asset) => ({
      uri: asset.uri,
      type: asset.type || "unknown",
      name:asset.fileName
    }));

    return selectedAssets;

  } catch (error) {
    console.error("Error selecting media: ", error);
    return [];
  }
};

export const singlePickMedia = async ()=>{
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    alert("Sorry, we need camera roll permissions to make this work!");
    return [];
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images','videos'],
    allowsEditing: false,
    quality: 1,
    selectionLimit: 1, 
  });

  if (!result.canceled) {

    const selectedAssets = result.assets.map((asset) => ({
      uri: asset.uri,
      type: asset.type || "unknown", 
      name:asset.fileName
    }));
    
    return selectedAssets;
  } else {
    console.log("User canceled media picking"); 
    return [];
  }
}