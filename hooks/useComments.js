import {
  getAuthorByCommentId,
  getLikesByCommentId,
  getRepliesByCommentId,
} from "@/lib/service/comment.service";

const fetchDetailedComments = async (comments) => {
  if (!Array.isArray(comments)) {
    console.error("Invalid Comments input. Expected an array.");
    return [];
  }

  const detailedComments = await Promise.all(
    comments.map(async (comment) => {
      try {
        const userId = await getAuthorByCommentId(comment._id);
        const likes = await getLikesByCommentId(comment._id);
        const replies = await getRepliesByCommentId(comment._id);
        return { ...comment, userId, likes, replies };
      } catch (error) {
        console.error(
          `Error fetching details for Comment ${comment._id}:`,
          error
        );
        return { ...comment, userId: null, likes: [], replies: [] };
      }
    })
  );
  return detailedComments;
};

export default fetchDetailedComments;
