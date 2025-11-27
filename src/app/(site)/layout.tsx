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
        <div className={`w-full h-screen`}>
          <Header />
          <main
            style={{
              background:
                "linear-gradient(91.17deg,#f6fbfb 0.72%,#d7def6 59.53%,#efd8d8 98.91%)",
            }}
          >
            <div className="">
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
