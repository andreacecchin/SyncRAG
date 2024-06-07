'use client'
import Link from "next/link";
import { Roboto } from 'next/font/google'
import Image from 'next/image'
import logo from '/public/syncrag.png'

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
})


export default function Page() {
    const btn =`text-2xl flex flex-row justify-evenly gap-5 mx-auto w-6/12 lg:w-4/12 border-2 rounded-2xl shadow-2xl dark:shadow-xl
    transition duration-300 ease-out hover:scale-105 p-3 bg-[--primary] border-[--primary] `

    return (
        <main className={`${roboto.className} lg:flex-row flex-col justify-between  `}>
            <h1 className="lg:w-full flex justify-center py-6 my-auto mx-auto ">
                <Image 
                    src={logo} 
                    alt="SyncRAG"
                    width={500}
                    height={300}
                    className="lg:w-auto w-full"
                />
            </h1>
            <div className="flex flex-col justify-center gap-20 h-full w-full rounded-xl shadow-2xl bg-[--background-contrast]  ">
                <Link className={btn} href="/admin" title="Administrator page">
                    <button>
                        Admin <i className=" text-[--text-button] my-10 fa-solid fa-cogs fa-2xl"></i>
                    </button>
                </Link>
                <Link className={btn} href="/chat" title="Chat page" >
                    <button>
                        Chat <i className=" text-[--text-button] my-10 fa-solid fa-comments fa-2xl"></i>
                    </button>
                </Link>
            </div>
        </main>
    )
}