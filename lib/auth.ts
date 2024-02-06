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
import { NextAuthOptions, User } from "next-auth";
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
                // Add logic here to look up the user from the credentials supplied
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and or password is not registered");
                }

                if (!validator.isEmail(credentials?.email )) throw new Error("Please provide a proper email");

                const existingUserByEmail = await db.select().from(users).where(eq(users.email, credentials.email))
                                
                if (!existingUserByEmail[0]){
                    throw new Error("Email and or password is not registered");
                }

                const passwordMatch = await compare(credentials.password, existingUserByEmail[0].password);

                if (!passwordMatch) {
                    throw new Error("Email and or password is not registered");
                }

                if (existingUserByEmail[0].isVerified == false) {
                    throw new Error('Email is not verified, Please verify email!')
                    // return NextResponse.json({ user: null, message: "Email is not verified, Please verify email!"}, { status: 500 })
                };

                return {
                    id: `${existingUserByEmail[0].id}`,
                    username: existingUserByEmail[0].username!,
                    email: existingUserByEmail[0].email,
                    firstName: existingUserByEmail[0].firstName!,
                    lastName: existingUserByEmail[0].lastName!
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
        jwt({token, account, user}) {   
            if (user){
                return {
                    ...token,
                    id: (user as unknown as User).id,
                    username: (user as unknown as User).username,
                    firstName: (user as unknown as User).firstName,
                    lastName: (user as unknown as User).lastName
                }
            }  
            if (account) {
                token.accessToken = account.access_token;
                token.id = token.id;
                token.username = (user as unknown as User).username;
                token.firstName = (user as unknown as User).firstName,
                token.lastName = (user as unknown as User).lastName
            }

            return token
        },
        session({session, token, user}) {
            if (token) {            
                return {
                    ...session,
                    
                    user: {
                        ...session.user,
                        id: token.id,
                        username: token.username,
                        firstName: token.firstName,
                        lastName: token.lastName
                        
                    }
                }
            }
            return session
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