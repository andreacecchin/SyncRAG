"use client"
import React, {useState} from "react";
import ChatBody from "@/app/chat/components/chatBody";
import ChatInput from "@/app/chat/components/chatInput";
import LlmBody from "@/app/chat/components/llmBody";
import DocMenu from "./components/docMenu";
import requireAuth from "../hoc/requireAuth";
import Link from "next/link";

interface Message {
    role: string;
    content: string;
}

const Page = () => {

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
    };

    const [modelName,setModelName] = useState("GPT3.5")
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const updateModel = (newModelName: string) => {
        setModelName(newModelName);
    }

    const handleInputChange = (e: any) => {
        setInput(e.target.value);
    }

    const sendMessage = async (e: any) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsLoading(true);
        const userMessage = { role: "user", content: input };
        setMessages([...messages, userMessage]);

        try {
            setInput("ANSWERING. PLEASE WAIT ...");

            const response = await fetch(`http://localhost:8080/api/ask?question=${encodeURIComponent(input)}&model=${encodeURIComponent(modelName)}`);
            const data = await response.text();

            const aiMessage = { role: "ai", content: data };
            setMessages([...messages, userMessage, aiMessage]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
            setInput("");
        }
    }

    return (
        <main className="flex flex-row w-full h-full justify-around relative">
            <div className="flex flex-col justify-center  h-full lg:w-4/12 pr-10">
                <DocMenu/>
            </div>
            <div className="flex flex-col w-6/12 lg:w-6/12">
                <ChatBody messages={messages} model={modelName}></ChatBody>
                <ChatInput input={input} handleInputChange={handleInputChange} sendMessage={sendMessage}/>
            </div>
            <div className="flex flex-col w-3/12 h-full justify-center items-center">
                <LlmBody classProp="flex flex-col shadow-2xl w-1/2 bg-[--background-contrast] p-4 rounded-2xl
                h-fit my-auto justify-evenly gap-4"
                updateModel={updateModel}
                >
                {""}
                </LlmBody>
                <div className="absolute top-4 right-4 h-50">
                    <Link className="flex cursor-pointer w-full bg-[--primary] rounded-2xl p-2
                    h-fit my-auto justify-evenly hover:scale-105
                    animation duration-300 ease-out" href="/" title="Log out">
                        <button onClick={handleLogout}>
                            Log out <i className=" text-[--text-button] fa-solid fa-door-open"></i>
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    )
}
export default requireAuth(Page);