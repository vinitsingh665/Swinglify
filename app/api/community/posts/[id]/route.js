import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import dbConnect from '../../../../../lib/mongodb';
import Post from '../../../../../models/Post';
import Comment from '../../../../../models/Comment';

// GET — Single post + comments
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const post = await Post.findById(id).lean();
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const comments = await Comment.find({ postId: id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: { post, comments }
    });
  } catch (error) {
    console.error('Post detail GET Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE — Delete own post
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Define admin emails
    const ADMIN_EMAILS = [
      "vinitsingh665@gmail.com",
      "vinits.7kushwaha@gmail.com"
    ];
    const isAdmin = ADMIN_EMAILS.includes(session.user.email);

    // Only the author or an admin can delete their post
    // Resolve the MongoDB user ID from the session email
    const dbUser = await (await import('../../../../../models/User')).default.findOne({ email: session.user.email });
    
    if (!isAdmin && (!dbUser || post.author.toString() !== dbUser._id.toString())) {
      return NextResponse.json({ error: 'You can only delete your own posts' }, { status: 403 });
    }

    // Delete the post and all its comments
    await Comment.deleteMany({ postId: id });
    await Post.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('Post DELETE Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

