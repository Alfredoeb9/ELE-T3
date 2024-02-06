// "use client";
// // import { register } from "@/redux/features/AuthContext";
// // import { useAppDispatch } from "@/redux/hooks";
// import { redirect, useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// export default function Regiter() {
//     // const navigate = useNavigate();
//     // const dispatch = useAppDispatch();
//     const router = useRouter();
//     const [email, setEmail] = useState<string>("");
//     const [password, setPassword] = useState<string>("");
//     const [firstName, setFirstName] = useState<string>("");
//     const [lastName, setLastName] = useState<string>("");
//     const [username, setUsername] = useState<string>("");
//     const [isVerified, setIsVerified] = useState<boolean>(false);
//     const [spinnerLoading, setSpinnerLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | any>("");
//     const [show, setShow] = useState<any>({ password: false });
//     // const { signup, error, isLoading } = useSignup();
//     // const { resend, error2, isLoading2 } = useResend();
//     // const user = useSelector(selectUserAuth);
//     // const { message } = useSelector((state) => state.user);
    

//     const handleSubmit = async (e: any) => {
//         e.preventDefault();
//         setError("")
        

//         if (email === "") return setError("Please provide a proper email");
//         if (password === "") return setError("Please provide a proper password");
//         if (username === "") return setError("Please provide a proper username");
//         if (firstName === "") return setError("Please provide a proper first name");
//         if (lastName === "") return setError("Please provide a proper last name");
    
//         const user = {
//           username,
//           firstName,
//           lastName,
//           email,
//           password,
//         };
    
//         try {
//             const data = await fetch("/api/auth/register", {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(user)
//             })

//             if (!data.ok) {
                
//                 let error = await data.json();
//                 setError(error.message)
//             }

//             await data.json()

//             // dispatch(register());
//             router.push('/auth/sign-in')
//         } catch (error) {
//             return error
//         }
//     };

//     return (
//         <div className="flex bg-stone-900 min-h-screen flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
//             {isVerified ? (
//                 <div>This is a loadeer</div>
//             ) : (
//                 <div className="flex min-h-full flex-1 flex-col justify-center w-96 px-6 py-12 lg:px-8">
//                     <form className="signup" onSubmit={handleSubmit}>
//                         <h3 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Sign up</h3>

//                         <label className="block text-sm font-medium leading-6 text-white">Email:</label>
//                         <input
//                             className="block w-full rounded-md border-0 py-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                             type="email"
//                             onChange={(e) => setEmail(e.target.value)}
//                             value={email}
//                         />

//                         <div className="flex items-center justify-between">
//                             <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">Password:</label>
//                             <span
//                                 className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
//                                 onClick={() => setShow({ ...show, password: !show.password })}
//                             >
//                                 <p className="font-semibold text-indigo-600 hover:text-indigo-500">Show Password</p>
//                             </span>
                            
//                         </div>
//                         <input
//                             className="block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                             type={`${show.password ? "text" : "password"}`}
//                             onChange={(e) => setPassword(e.target.value)}
//                             value={password}
//                         />

//                         <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">Username:</label>
//                         <input
//                             className="block w-full rounded-md border-0 py-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                             type="name"
//                             onChange={(e) => setUsername(e.target.value)}
//                             value={username}
//                         />

//                         <label htmlFor="fist name" className="block text-sm font-medium leading-6 text-white">First Name:</label>
//                         <input
//                             className="block w-full rounded-md border-0 py-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                             type="name"
//                             onChange={(e) => setFirstName(e.target.value)}
//                             value={firstName}
//                         />

//                         <label htmlFor="last name" className="block text-sm font-medium leading-6 text-white">Last Name:</label>
//                         <input
//                             className="block w-full rounded-md border-0 py-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                             type="name"
//                             onChange={(e) => setLastName(e.target.value)}
//                             value={lastName}
//                         />

//                         <button
//                             disabled={email.length === 0 || username.length === 0 || firstName.length === 0 || lastName.length === 0 || password.length === 0}
//                             className="flex w-full justify-center rounded-md mt-4 bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500"
//                         >
//                             Sign Up
//                         </button>

//                         {error && <div className="text-red-500">{error.toString()}</div>}
//                     </form>
//                 </div>
//             )}
//         </div>
//     )
// }



"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/trpc/react";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setEmail("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createUser.mutate({
            email,
            password,
            username
        });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="email"
        placeholder="johndoe@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />

<input
        type="password"
        placeholder="johndoe@gmail.com"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />

      <input
        type="text"
        placeholder="johndoe@gmail.com"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createUser.isLoading}
      >
        {createUser.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
