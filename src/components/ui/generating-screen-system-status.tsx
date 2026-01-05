"use client";

import { Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

type GeneratingScreenSystemStatusProps = {
    progress: number;
    selectedTemplates: string[];
};

export const GeneratingScreenSystemStatus = ({ progress, selectedTemplates }: GeneratingScreenSystemStatusProps) => {
    return (
        <div className="w-full max-w-md space-y-8 text-center">
            <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                <div className="relative bg-primary/10 p-6 rounded-full border border-primary/50">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
            </div>
            
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold animate-pulse">
                    {progress < 30 && "Analyzing your product details..."}
                    {progress >= 30 && progress < 60 && `Drafting content for ${selectedTemplates.length} assets...`}
                    {progress >= 60 && "Polishing the final copy..."}
                </h2>
                <p className="text-slate-400">This usually takes about 30 seconds...</p>
            </div>

            <div className="space-y-2">
                <Progress value={progress} className="h-2 bg-slate-800" />
                <div className="flex justify-between text-xs text-slate-500">
                    <span>Start</span>
                    <span>{progress}%</span>
                    <span>Finish</span>
                </div>
            </div>
        </div>
    );
};
