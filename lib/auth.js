import GoogleProvider from 'next-auth/providers/google';
import dbConnect from './mongodb';
import User from '../models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await dbConnect();
        const existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          await User.create({
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            googleId: profile.sub,
            displayName: profile.name,
            isProfileComplete: false,
          });
        } else {
          // Only update Google-sourced fields, not user-edited ones
          if (!existingUser.profilePic) {
            existingUser.image = profile.picture;
          }
          await existingUser.save();
        }
        return true;
      } catch (error) {
        console.error('Error during sign in:', error);
        return true;
      }
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      try {
        await dbConnect();
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          session.user.dbId = dbUser._id.toString();
          session.user.username = dbUser.username || '';
          session.user.displayName = dbUser.displayName || dbUser.name;
          session.user.profilePic = dbUser.profilePic || dbUser.image;
          session.user.isProfileComplete = dbUser.isProfileComplete || false;
        }
      } catch (e) {}
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
