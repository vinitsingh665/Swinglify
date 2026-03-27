import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth';
import dbConnect from '../../../../../../lib/mongodb';
import Post from '../../../../../../models/Post';
import User from '../../../../../../models/User';

// POST — Vote on a post
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Sign in to vote' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const { vote } = body; // "up" or "down"

    const dbUser = await User.findOne({ email: session.user.email }).lean();
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = dbUser._id.toString();
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (vote === 'up') {
      // Toggle upvote
      if (post.upvotes.includes(userId)) {
        post.upvotes = post.upvotes.filter(id => id !== userId);
      } else {
        post.upvotes.push(userId);
        post.downvotes = post.downvotes.filter(id => id !== userId);
      }
    } else if (vote === 'down') {
      // Toggle downvote
      if (post.downvotes.includes(userId)) {
        post.downvotes = post.downvotes.filter(id => id !== userId);
      } else {
        post.downvotes.push(userId);
        post.upvotes = post.upvotes.filter(id => id !== userId);
      }
    }

    await post.save();

    return NextResponse.json({
      success: true,
      data: {
        upvotes: post.upvotes.length,
        downvotes: post.downvotes.length,
        score: post.upvotes.length - post.downvotes.length,
        userVote: post.upvotes.includes(userId) ? 'up' : post.downvotes.includes(userId) ? 'down' : null
      }
    });
  } catch (error) {
    console.error('Vote Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
