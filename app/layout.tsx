import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata = {
  title: "PrimeIndexer Clone - SaaS App",
  description: "Fast link indexing SaaS application",
  verification: {
    google: "9QFHfmFeKS2Rsp0Be_dpM_jann8ZwKLmUKvczGHHMEE",
  },
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