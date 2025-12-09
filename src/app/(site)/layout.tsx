"use client";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/layout/GoogleAnalytics";
import UserProvider from "@/components/providers/UserProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <html lang="en">
      <head>
        <title>Төрөлжсөн бүртгэлийн нэгдсэн сан</title>
      </head>
      <GoogleAnalytics />
      <body>
        <div className="relative w-full h-full bg-[#080812] top-glow">
          <div className="absolute inset-0 -top-[220px] bg-[url('/v2/bg-pattern.png')] bg-cover bg-no-repeat z-0"></div>
          <Header />
          <main className="flex flex-col items-center justify-between min-h-screen relative z-10 ">
            <div className="w-full flex-grow">
              <QueryClientProvider client={queryClient}>
                <UserProvider>{children}</UserProvider>
              </QueryClientProvider>
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
