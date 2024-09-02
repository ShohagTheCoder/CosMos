// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
    const [username, setUsername] = useState("Shohag Ahmed");
    const [password, setPassword] = useState("pass");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const { data } = await axios.post("/api/auth", {
            username,
            password,
        });

        console.log(data);
        if (data.success) {
            // Handle successful login, e.g., redirect to dashboard
            router.push("/actions/sell");
        } else {
            setError(data.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="username"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                {error && (
                    <p className="text-red-500 text-xs italic">{error}</p>
                )}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    );
}

// "use client";
// import { useState } from "react";
// // import { login } from "../utils/auth";

// export default function LoginPage() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const handleSubmit = async (e: any) => {
//         e.preventDefault();
//         console.log(email, password);
//         // try {
//         //     // await login(email, password);
//         //     window.location.href = "/protected";
//         // } catch (error) {
//         //     console.error(error);
//         //     alert("Login failed!");
//         // }
//     };

//     return (
//         <div className="w-full max-w-md mx-auto my-[100px] p-8 border border-gray-300 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <input
//                     className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-900"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Email"
//                     required
//                 />
//                 <input
//                     className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-900"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Password"
//                     required
//                 />
//                 <button
//                     type="submit"
//                     className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                     Login
//                 </button>
//             </form>
//         </div>
//     );
// }
