import dbConnect from "@/lib/db";
import User from "@/Models/UserModel";
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      })
    // ...add more providers here
  ],
  callbacks:{
    async jwt({token,user, account}) {

        if(user){
            token.id = user.id
        }
        if(account){
            token.accessToken = account.access_token
        }
      return token;
    },
    async session({session, token}) {
      // Add user to session // client side mein use karne ke liye use ho rha hai
      session.user.id = token.id;
      return session;
    },
    async signIn({user,profile}){
      console.log("user ",user)
        await dbConnect();
        
        let dbUser = await User.findOne({email:user.email});
        if(!dbUser) {
            dbUser = await User.create({
                name: profile.name,
                email: user.email || null,
                profilePicture: profile.picture,
                isVerified: profile.email_verified ? true : false
            }); 
        }
        user.id = dbUser._id.toString();
        return true;
    }
  },
  session:{
    strategy:"jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages:{
    signIn:"user-auth"
  }
}

const handle = NextAuth(authOptions)
export {handle as POST , handle as GET}