"use client";

import { Sparkles } from 'lucide-react';

type GeneratingScreenPetTechniquesProps = {
    progress: number;
};

const tips = [
    "Pro-Tip: Our AI maintains your brand voice by analyzing your existing content.",
    "Used by 10,000+ Founders to launch campaigns faster.",
    "Almost there! Your full campaign is going to be awesome."
];

export const GeneratingScreenPetTechniques = ({ progress }: GeneratingScreenPetTechniquesProps) => {
    const tipIndex = Math.floor(progress / 33.4);

    return (
        <div className="w-full max-w-md space-y-8 text-center">
            <div className="flex justify-center">
                <div className="bg-primary/10 p-4 rounded-full">
                    <Sparkles className="w-12 h-12 text-primary" />
                </div>
            </div>
            <h2 className="text-3xl font-bold text-white">Generating your assets...</h2>
            <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-300">{tips[tipIndex]}</p>
            </div>
        </div>
    );
};
