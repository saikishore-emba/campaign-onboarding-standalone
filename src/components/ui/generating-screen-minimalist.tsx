"use client";

import { Loader2 } from 'lucide-react';

type GeneratingScreenMinimalistProps = {
    progress: number;
};

export const GeneratingScreenMinimalist = ({ progress }: GeneratingScreenMinimalistProps) => {
    return (
        <div className="w-full max-w-md space-y-8 text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
            <p className="text-slate-400">Generating... {progress}%</p>
        </div>
    );
};
