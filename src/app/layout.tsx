import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ゆめみ フロントエンドコーディングテスト',
  description: '株式会社ゆめみの新卒採用向けフロントエンドコーディングテスト',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} min-h-screen`}>
        <header className="text-black p-4 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-xl font-bold">日本の総人口推移グラフ</h1>
          </div>
        </header>
        <div className="container mx-auto px-4 py-6">{children}</div>
      </body>
    </html>
  );
}
