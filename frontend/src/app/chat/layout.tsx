import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import 'typeface-roboto';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Chat | SyncRAG',
    description: 'Sync Lab RAG Prototype free access chat page',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    )
}
