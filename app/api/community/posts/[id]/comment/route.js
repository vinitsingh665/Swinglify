import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth';
import dbConnect from '../../../../../../lib/mongodb';
import Post from '../../../../../../models/Post';
import Comment from '../../../../../../models/Comment';
import User from '../../../../../../models/User';

// POST — Add a comment
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Sign in to comment' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    if (!body.body || body.body.trim().length === 0) {
      return NextResponse.json({ error: 'Comment body is required' }, { status: 400 });
    }

    const dbUser = await User.findOne({ email: session.user.email }).lean();
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const comment = await Comment.create({
      postId: id,
      author: dbUser._id,
      authorName: dbUser.displayName || dbUser.name,
      authorUsername: dbUser.username || '',
      authorImage: dbUser.profilePic || dbUser.image || '',
      body: body.body.trim(),
      parentId: body.parentId || null
    });

    // Increment comment count on the post
    await Post.findByIdAndUpdate(id, { $inc: { commentCount: 1 } });

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (error) {
    console.error('Comment Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
