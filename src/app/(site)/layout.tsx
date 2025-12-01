"use client";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/layout/GoogleAnalytics";

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
        <title>Төрийн мета өгөгдлийн нэгдсэн сан</title>
      </head>
      <GoogleAnalytics />
      <body>
        <div className="relative w-full h-screen bg-[#080812]">
          <div className="absolute inset-0 -top-[220px] bg-[url('/v2/bg-pattern.png')] bg-cover bg-no-repeat z-0"></div>
          <Header />
          <main className="flex flex-col items-center justify-between min-h-screen">
            <div className="w-full flex-grow">
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
