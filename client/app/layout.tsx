// app/layout.tsx
import { Inter } from "next/font/google";
import axios from "axios";
import "./globals.css";
import ReduxProvider from "./store/ReduxProvider";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

// Define your RootLayout as an async function to perform server-side operations
export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let darkMode = true;
    try {
        // Fetch settings directly
        const cookieStore = cookies();
        let userId = cookieStore.get("user-id")?.value;
        if (userId) {
            const { data }: any = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/settings/byUserId/${userId}/darkMode`
            );
            darkMode = data;
        }
    } catch (error) {
        console.log(
            "From Layout.tsx : faild to fetch user settings dark mode field"
        );
    }

    // If dark mode availabel add it
    let interCalss = inter.className;
    const darkModeCalss = darkMode ? "dark" : "light";
    interCalss = `${darkModeCalss} ${inter.className}`;

    return (
        <html lang="en">
            <body className={interCalss + "text-black dark:text-white"}>
                <ReduxProvider>{children}</ReduxProvider>
            </body>
        </html>
    );
}
