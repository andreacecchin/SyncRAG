import { useState } from 'react';

import {FormEvent} from "react";

interface InsertProps{
    input: string;
    handleInputChange: (e: any) => void;
    sendMessage: (e: FormEvent<HTMLFormElement>) => void;
}
function ChatInput({ input, handleInputChange, sendMessage }: InsertProps){


    const [newQuestion, setNewQuestion] = useState('');

    return (
        <div className="w-full h-1/12 relative">
            <form onSubmit={sendMessage}>
                <textarea
                    id="questionArea"
                    className="rounded-2xl p-3 pt-4 shadow-xl pr-16 resize-none w-full outline-none text-[--text]"
                    rows={3}
                    placeholder="Insert a question ..."
                    value={input}
                    onChange={handleInputChange}
                        onKeyDown={(e: any) => {if (e.key === 'Enter'){
                            e.preventDefault();
                            sendMessage(e);
                        }}}
                >
                </textarea>
                <button className="absolute right-0 top-4 p-2 m-3 bg-[--primary] dark:bg-[--background] text-[--text-button] rounded-md shadow-xl w-10 h-fit border-white border-2 border-opacity-5
                    hover:border-opacity-30 transition duration-300 ease-in-out hover:scale-110 hover:shadow-2xl"
                    type="submit" title='Submit message'>
                    <i className=" dark:text-[--primary] fa-solid fa-play"></i>
                </button>
            </form>
        </div>

    );
}

export default ChatInput;