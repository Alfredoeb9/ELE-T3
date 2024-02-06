"use client";
import React from "react";
import SignIn from "@/app/_components/signIn";

export default async function SignInPage() {
    
    // console.log("sess", session)
    return(
        <div className="flex bg-stone-900 min-h-screen flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <SignIn />
        </div>
    );
}