import {
  getCommentsByMediaId,
  // getAuthorByMediaId,
  getLikesByMediaId,
} from "@/lib/services/media.service";

const fetchDetailedMedias = async (medias) => {
  if (!Array.isArray(medias)) {
    console.error("Invalid posts input. Expected an array.");
    return [];
  }

  const detailedMedias = await Promise.all(
    medias.map(async (media) => {
      try {
        const comments = await getCommentsByMediaId(media._id);
        // const createBy = await getAuthorByMediaId(media._id);
        const likes = await getLikesByMediaId(media._id);
        return { ...media, comments, likes };
      } catch (error) {
        console.error(`Error fetching details for media ${media._id}:`, error);
        return { ...media, comments: [], likes: [] };
      }
    })
  );

  return detailedMedias;
};

export default fetchDetailedMedias;
