import '@/styles/index.scss';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import type { Metadata } from "next";
import { Montserrat } from 'next/font/google';
//import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-montserrat'
});

export const metadata: Metadata = {
  title: "muffme",
  description: "Первая маффинная в России",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={montserrat.variable}>
      <body className="wrapper">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}


// return (
//   <html lang="ru" className={`${alegreya.variable} ${roboto.variable}`}>
//       <body className="wrapper">
//           <Header />
//           <main>{children}</main>
//           <Footer />
//       </body>
//   </html>
// );