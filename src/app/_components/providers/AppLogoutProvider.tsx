'use client';
// import { options } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Error from "next/error";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const events = [
    "load",
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
];
  
const AppLogoutProvider = ({ children }: {children: React.ReactNode}) => {
    const [loadModal, setLoadModal] = useState<boolean>(false);
    const router = useRouter()
    let timer: string | number | NodeJS.Timeout | undefined;

    // console.log("session app logout", session)
    // this function sets the timer that logs out the user after 10 secs
    const handleLogoutTimer = () => {
        setLoadModal(true);
        timer = setTimeout(() => {
        // clears any pending timer.
        resetTimer();
        // Listener clean up. Removes the existing event listener from the window
        Object.values(events).forEach((item) => {
            window.removeEventListener(item, resetTimer);
        });
        // logs out user
        logoutAction().catch((error: Error) => {
            console.log("Error", error)
        })
        }, 300000); // 300000ms = 5mins. You can change the time.
    };
  
    // this resets the timer if it exists.
    const resetTimer = () => {
        if (timer) clearTimeout(timer);
    };

  
  
    // when component mounts, it adds an event listeners to the window
    // each time any of the event is triggered, i.e on mouse move, click, scroll, keypress etc, the timer to logout user after 10 secs of inactivity resets.
    // However, if none of the event is triggered within 10 secs, that is app is inactive, the app automatically logs out.
    useEffect(() => {
        Object.values(events).forEach((item) => {
            window.addEventListener(item, () => {
                resetTimer();
                handleLogoutTimer();
            });
        });

        return () => {
            setLoadModal(false);
        }
    }, []);
  
    // logs out user by clearing out auth token in localStorage and redirecting url to /signin page.
    const logoutAction = async () => {
        // localStorage.clear();
        try {
            await signOut();
            router.push("/auth/sign-in");
        } catch (error) {
            console.log("error", error)
        }
        
    };
  
    return [children, loadModal];
};
  
export default AppLogoutProvider;