import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata = {
  title: "PrimeIndexer Clone - SaaS App",
  description: "Fast link indexing SaaS application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}