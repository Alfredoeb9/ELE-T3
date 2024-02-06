import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";

// import { AuthOptions } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server/db";
// import { useAppDispatch } from "../src/app/redux/hooks";
// import { useState } from "react";
// import { login } from "../src/app/redux/features/AuthContext";
import { compare } from "bcrypt";
// import { User } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import validator from 'validator';
import { api } from "@/trpc/server";
import { eq } from "drizzle-orm";
import { users } from "@/server/db/schema";
import NextAuth from "next-auth/next";
import { Adapter } from "next-auth/adapters";

export const options: NextAuthOptions = {
    providers: [

		// EmailProvider({
		// 	server: process.env.EMAIL_SERVER,
		// 	from: process.env.EMAIL_FROM
		// })

        CredentialsProvider({
            name: "Credentials",

            credentials: {
              email: { label: "Email", type: "email", placeholder: "jsmith" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("cred", credentials)
                // Add logic here to look up the user from the credentials supplied
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and or password is not registered");
                }

                // if (!validator.isEmail(credentials?.email )) throw new Error("Please provide a proper email");

                // const existingUserByEmail = await db.user.findUnique({
                //     where: {
                //         email: credentials.email,
                //     }
                // });

                const existingUserByEmail = await db.select().from(users).where(eq(users.email, credentials.email))

                console.log("sdf", existingUserByEmail)

                // console.log("dfa", existingUserByEmail.)
                
                // if (!existingUserByEmail){
                //     throw new Error("Email and or password is not registered");
                // }

                // const passwordMatch = await compare(credentials.password, existingUserByEmail.password);

                // if (!passwordMatch) {
                //     throw new Error("Email and or password is not registered");
                // }

                // if (existingUserByEmail.isVerified == false) {
                //     throw new Error('Email is not verified, Please verify email!')
                //     // return NextResponse.json({ user: null, message: "Email is not verified, Please verify email!"}, { status: 500 })
                // };

                return {
                    id: "test"
                    // id: `${existingUserByEmail}`,
                    // username: existingUserByEmail.username,
                    // email: existingUserByEmail.email,
                    // firstName: existingUserByEmail.firstName,
                    // lastName: existingUserByEmail.lastName
                }
            }
        })
	],
    jwt: {
        maxAge: 24 * 60 * 60 * 1000
    },
    secret: process.env.NEXTAUTH_SECRET,
    adapter: DrizzleAdapter(db) as Adapter,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60* 60
    },
    pages: {
        signIn: "/sign-in"
    },
    callbacks: {
        async jwt({token, account, user}) {   
            if (user){
                return {
                    ...token,
                    // username: (user as unknown as User).username,
                    // firstName: user.firstName,
                    // lastName: user.lastName
                }
            }  
            if (account) {
                token.accessToken = account.access_token;
                token.id = token.id;
                // token.username = (user as unknown as User).username;
                // token.firstName = user.firstName,
                // token.lastName = user.lastName

            }

            return token
        },
        async session({session, token}) {
            return {
                ...session,
                
                user: {
                    ...session.user,
                    // username: token.username,
                    // firstName: token.firstName,
                    // lastName: token.lastName
                    
                }
            }
        },
    },
    events: {
        // async signIn({user}) {
        //     console.log("user signed in ", user)
        //     // if (user === null || user === undefined || user.email == "") return null
        //     const dispatch = useAppDispatch();

        //     const existingUserByEmail = await db.user.findUnique({
        //         where: {
        //             email: user.email,
        //             username: "a3aad33c"
        //         }
        //     });

        //     console.log("user", existingUserByEmail)

        //     if (existingUserByEmail) {
        //         localStorage.setItem("user", JSON.stringify(user));
        //         dispatch(login(user));
        //     }
        // }
    }
}