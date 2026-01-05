"use client";

import { Sparkles, Mail, Share2, Layout } from 'lucide-react';

type GeneratingScreenMagicShowProps = {
    progress: number;
};

export const GeneratingScreenMagicShow = ({ progress }: GeneratingScreenMagicShowProps) => {
    return (
        <div className="w-full max-w-2xl space-y-8 text-center">
            <div className="flex justify-center">
                <div className="bg-primary/10 p-4 rounded-full">
                    <Sparkles className="w-12 h-12 text-primary" />
                </div>
            </div>
            <h2 className="text-3xl font-bold text-white">Your campaign is being created...</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className={`p-4 bg-slate-800/50 rounded-lg transition-opacity duration-500 ${progress > 20 ? 'opacity-100' : 'opacity-20'}`}>
                    <Share2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="h-2 bg-slate-700 rounded-full w-1/2 mx-auto"></div>
                </div>
                <div className={`p-4 bg-slate-800/50 rounded-lg transition-opacity duration-500 ${progress > 50 ? 'opacity-100' : 'opacity-20'}`}>
                    <Mail className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="h-2 bg-slate-700 rounded-full w-2/3 mx-auto"></div>
                </div>
                <div className={`p-4 bg-slate-800/50 rounded-lg transition-opacity duration-500 ${progress > 80 ? 'opacity-100' : 'opacity-20'}`}>
                    <Layout className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                    <div className="h-2 bg-slate-700 rounded-full w-1/2 mx-auto"></div>
                </div>
            </div>
        </div>
    );
};
