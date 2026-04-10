import dbConnect from '../../../lib/mongodb';
import Post from '../../../models/Post';
import Comment from '../../../models/Comment';
import PostClient from './PostClient';

// Ensure this page is rendered dynamically on request due to community data shifting
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    await dbConnect();
    const post = await Post.findById(id).lean();
    if (!post) {
      return { title: 'Post Not Found | Swinglify Community' };
    }

    return {
      title: `${post.title} - Swinglify Community`,
      description: post.body ? post.body.substring(0, 160) : `Community insight on ${post.stockName || 'market'}.`,
    };
  } catch (e) {
    return { title: 'Swinglify Community' };
  }
}

export default async function CommunityPostServer({ params }) {
  const { id } = await params;
  
  await dbConnect();
  
  let initialPost = null;
  let initialComments = [];

  try {
    const postDoc = await Post.findById(id).lean();
    if (postDoc) {
      // Convert ObjectIds to strings to avoid passing non-serializable data to client props
      initialPost = JSON.parse(JSON.stringify(postDoc));
      
      const commentDocs = await Comment.find({ postId: id }).sort({ createdAt: -1 }).lean();
      initialComments = JSON.parse(JSON.stringify(commentDocs));
    }
  } catch (error) {
    console.error('[Community SSR] Error fetching post:', error);
  }

  return (
    <PostClient 
      id={id} 
      initialPost={initialPost} 
      initialComments={initialComments} 
    />
  );
}
