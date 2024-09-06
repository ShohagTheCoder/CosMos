// app/layout.tsx
import { Inter } from "next/font/google";
import axios from "axios";
import "./globals.css";
import ReduxProvider from "./store/ReduxProvider";

const inter = Inter({ subsets: ["latin"] });

// Define your RootLayout as an async function to perform server-side operations
export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let settings;
    try {
        // // Fetch settings directly
        const { data }: any = await axios.get("http://localhost:3001/settings");
        settings = data;
    } catch (error) {
        console.log("faild to fetch settings");
    }

    // If dark mode available add it
    let interCalss = inter.className;
    if (settings) {
        const darkMode = settings.darkMode ? "dark" : "light";
        interCalss = `${darkMode} ${inter.className}`;
    }

    return (
        <html lang="en">
            <body className={interCalss}>
                <ReduxProvider>{children}</ReduxProvider>
            </body>
        </html>
    );
}
