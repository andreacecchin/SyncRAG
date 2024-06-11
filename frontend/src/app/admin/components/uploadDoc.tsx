'use client'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react'


function UploadDoc({ fetchDocuments }: { fetchDocuments: () => void }) {

    const [file, setFile] = useState<File | undefined>(undefined);

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (!file) return;

        try {
            const data = new FormData();
            data.set('file', file);


            const res = await fetch('http://localhost:8080/api/documents', {   
            method: 'POST',
            body: data,
            });
            const result = await res.text();
            if (!res.ok) throw new Error(await res.text());
            toast(result, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: {
                    backgroundColor: '#333',
                    color: '#fff'
                }
            });
            fetchDocuments();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <ToastContainer />
            <form className=" bg-[--background-contrast] lg:w-full flex lg:mx-0 md:mx-0 mx-auto flex-col gap-5 rounded-xl p-4 shadow-2xl " onSubmit={onSubmit} >
                <label className="text-sky-950 text-xl font-medium text-center ">
                    Add a document
                </label>
                <input
                    type="file"
                    name="file"
                    accept=".pdf"
                    className="bg-[--background-input] rounded-lg p-2 text-left cursor-pointer"
                    onChange={(e) => setFile(e.target.files?.[0])}
                />
                <input type="submit" value="Upload" className="cursor-pointer bg-[--primary] w-full p-2 mx-auto rounded-lg hover:scale-105
                animation duration-300 ease-out" title='Upload'/>
            </form>
        </>
    );
}

export default UploadDoc;