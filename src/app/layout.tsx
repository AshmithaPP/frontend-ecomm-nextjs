import type { Metadata } from "next";
import { Jost, Manrope, Noto_Serif, Readex_Pro } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import { Providers } from "./providers";
import Layout from "components/layout/Layout";

const jost = Jost({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-jost",
});

const manrope = Manrope({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-manrope",
});

const notoSerif = Noto_Serif({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-noto-serif",
});

const readexPro = Readex_Pro({
    subsets: ["latin"],
    weight: ["400", "600"],
    variable: "--font-readex-pro",
});

export const metadata: Metadata = {
  title: "SareeEcom - Premium Silks",
  description: "Exquisite designs for your special day",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jost.variable} ${manrope.variable} ${notoSerif.variable} ${readexPro.variable}`}>
      <body className={jost.className}>
        <Providers>
            <Layout>
                {children}
            </Layout>
        </Providers>
      </body>
    </html>
  );
}