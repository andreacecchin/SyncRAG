"use client"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Roboto } from 'next/font/google'
import Image from 'next/image'
import logo from '/public/syncrag.png'
import { useState } from 'react';
import Link from "next/link";


const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
})

export default function Page() {
    const btn =`text-2xl flex flex-row justify-evenly gap-5 mx-auto w-6/12 lg:w-4/12 border-2 rounded-2xl shadow-2xl dark:shadow-xl
    transition duration-300 ease-out hover:scale-105 p-3 bg-[--primary] border-[--primary] `

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
    
        const response = await fetch('http://localhost:8080/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: password
        });
    
        const isAuthenticated = await response.json();
        
        if (isAuthenticated) {
            localStorage.setItem('isAdmin', 'true');
            window.location.href ='/admin';
        } else {
            toast("Error: wrong password.", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: {
                    backgroundColor: '#360101',
                    color: '#fff'
                }
            });
        }
      };

    return (
        <main className={`${roboto.className} lg:flex-row flex-col justify-between  `}>
            <ToastContainer />
            <h1 className="lg:w-full flex justify-center py-6 my-auto mx-auto ">
                <Image 
                    src={logo} 
                    alt="Sync RAG"
                    width={500}
                    height={300}
                    className="lg:w-auto w-full"
                />
            </h1>
            <div className="flex flex-col justify-center gap-20 h-full w-full rounded-xl shadow-2xl bg-[--background-contrast]  ">
                <form className=" bg-[--background-contrast] lg:w-full flex lg:mx-0 md:mx-0 mx-auto flex-col gap-5 rounded-xl p-4 " onSubmit={handleSubmit}>
                    <label className="text-sky-950 dark:text-sky-50 text-xl font-medium text-center">
                        Password
                        <br/>
                        <input value={password} className="w-1/2" onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} title={showPassword? "Hide password" : "Show password"}>
                            <i className={showPassword? " text-[--text-button] fa-solid fa-eye-slash ml-1" : " text-[--text-button] fa-solid fa-eye ml-2 " }></i>
                        </button>
                    </label>
                    <button type="submit" className="cursor-pointer bg-[--primary] w-1/2 p-2 mx-auto rounded-lg hover:scale-105
                        animation duration-300 ease-out" title="Log in">
                        Log in as administrator
                    </button>
                </form>
                <div className="absolute top-5 right-5 h-50">
                    <Link className="flex cursor-pointer w-full bg-[--primary] rounded-2xl p-2
                    h-fit my-auto justify-evenly hover:scale-105
                    animation duration-300 ease-out" href="/" title="Back to home page">
                        <button>
                            Back <i className=" text-[--text-button] fa-solid fa-arrow-left"></i>
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    )
}