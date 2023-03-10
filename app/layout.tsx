import { SessionProvider } from "../components/SessionProvider";
import SideBar from "../components/SideBar";
import "../styles/globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import LoginPage from "../components/LoginPage";
import ClientProvider from "../components/ClientProvider";
export const metadata = {
  title: "對話式 bot",
  description: "none",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  // console.log(session);

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {!session ? (
            <LoginPage />
          ) : (
            <div className="flex">
              {/* sidebar */}
              <SideBar />
              {/* chatGPT thinking notification  -> ClientProvider */}
              <ClientProvider />

              {/* main page */}
              <div className="bg-[#343541] flex-1">{children}</div>
            </div>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
