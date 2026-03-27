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
