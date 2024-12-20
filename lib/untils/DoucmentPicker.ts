import * as DocumentPicker from "expo-document-picker";

export const pickDocument = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      multiple:true,
      
    });

    if (!result || typeof result.canceled === "undefined") {
      console.warn(
        "Error: Unexpected result structure or user exited unexpectedly."
      );
      return [];
    }

    if (result.canceled) {
      console.log("User canceled media picking");
      return [];
    }
    const selectedAssets = result.assets.map((asset) => ({
      uri: asset.uri,
      type: asset.mimeType,
      name: asset.name,
    }));
    return selectedAssets;
  } catch (error) {
    console.error("Error picking document:", error);
  }
};


export const singlePickDocument = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      multiple:false,
    });

    if (!result || typeof result.canceled === "undefined") {
      console.warn(
        "Error: Unexpected result structure or user exited unexpectedly."
      );
      return [];
    }

    if (result.canceled) {
      console.log("User canceled media picking");
      return [];
    }
    const selectedAsset={
      uri: result.assets[0].uri,
      type: result.assets[0].mimeType,
      name: result.assets[0].name,
    }
    return selectedAsset;
  } catch (error) {
    console.error("Error picking document:", error);
  }
};
