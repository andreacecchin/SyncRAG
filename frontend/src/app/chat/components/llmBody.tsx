"use client"
import LlmModel from "./llmModel";
import React, { useState } from "react";

export const models = [
    "GPT3.5",
    "Phi3",
    "Gemini",
    "PaLM2"
]

interface LlmBodyProps {
    classProp: string;
    updateModel: (newModelName: string) => void;
    children : any
}

function LlmBody({classProp, updateModel,   children } : LlmBodyProps) {
        const [selectedButton, setSelectedButton] = useState(0);

        const handleButtonClick = (index: number) => {
            setSelectedButton(index);
            updateModel(models[index])
        };
        return (
            <div className={classProp}>
                {children}
                {models.map((modelName, index) => (
                    <LlmModel
                        text={modelName}
                        key={index}
                        isSelected={selectedButton === index}
                        onClick={() => handleButtonClick(index)}
                    />
                ))}
            </div>
        );
    }

export default LlmBody;
