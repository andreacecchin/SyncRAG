import React from 'react';
import UploadDoc from "./uploadDoc";
import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Document {
    name: string;
  }

function DocMenu () {
    const [documents, setDocuments] = useState<Document[]>([]);

    const fetchDocuments = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/documents');
            if (!res.ok) throw new Error(await res.text());
            const data: string[] = await res.json();
            const documentList: Document[] = data.map(name => ({ name }));
            setDocuments(documentList);
        } catch (e) {
            toast.error('Error fetching documents');
        }
      };

    const handleDelete = async (docName: string) => {
        try {
            const res = await fetch(`http://localhost:8080/api/documents?toDelete=${encodeURIComponent(docName)}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error(await res.text());
            const result = await res.text();
            
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
        } catch (e: any) {
            toast.error('Error deleting document');
        }
    };
    
    useEffect(() => {
        fetchDocuments();
    }, []);


    return (
        <div className='h-full flex flex-col justify-center pt-2 w-full rounded-xl p-2 '>
            <ToastContainer />
            <UploadDoc  fetchDocuments={fetchDocuments}/>
            <div className="mt-4 overflow-y-auto max-h-80 bg-[--background-contrast] rounded-2xl">
                {documents.map((doc, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b font-medium">
                    <span>{doc.name}</span>
                    <button
                    className="p-1 rounded"
                    onClick={() => handleDelete(doc.name)}
                    title='Delete'
                    >
                    <i className=" text-[--background-input] fa-solid fa-trash"></i>
                    </button>
                </div>
                ))}
            </div>
        </div>
    );
};

export default DocMenu;