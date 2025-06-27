import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";
import Header from "./components/Header";
import { NotificationProvider } from "./components/Notification";
import { Separator } from "@radix-ui/react-separator";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      className="bg-gray-800 min-h-screen"
       
      >
       <NotificationProvider>
          <Providers>
            <Header />
            <main>{children}</main>
            <Separator />
          </Providers>
        </NotificationProvider>
      </body>
    </html>
  );
}
