"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Loader2, 
  Rocket, 
  Target, 
  MessageSquare, 
  Mail, 
  Share2,
  Copy,
  RefreshCw,
  Zap,
  Eye,
  Plus,
  Search,
  Layout
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// --- Types ---
type CampaignData = {
  productName: string;
  productDescription: string;
  targetAudience: string;
};

type GeneratedResult = {
  tagline: string;
  audiencePersona: string;
  socialPost: string;
  emailSubject: string;
  emailBody: string;
  googleAdHeadline: string;
  googleAdDescription: string;
  metaAdPrimaryText: string;
  metaAdHeadline: string;
  metaAdDescription: string;
};

// --- Mock AI Generation ---
const generateCampaign = async (data: CampaignData): Promise<GeneratedResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        tagline: `Experience the future of ${data.productName}.`,
        audiencePersona: "Tech-savvy early adopters who value efficiency and innovation.",
        socialPost: `🚀 Introducing ${data.productName}! \n\n${data.productDescription.slice(0, 50)}... \n\nIt's time to upgrade your workflow. #Tech #Innovation #${data.productName.replace(/\s/g, '')}`,
        emailSubject: `Unlock your potential with ${data.productName}`,
        emailBody: `Hi [Name],\n\nWe are thrilled to announce the launch of ${data.productName}.\n\n${data.productDescription}\n\nDon't miss out on our exclusive launch offer.\n\nBest,\nThe Team`,
        googleAdHeadline: `${data.productName} - Official Site`,
        googleAdDescription: `Discover ${data.productName}. ${data.productDescription.slice(0, 60)}... Shop now for exclusive deals.`,
        metaAdPrimaryText: `Stop scrolling and start experiencing ${data.productName}. 🛑✨ \n\n${data.productDescription}`,
        metaAdHeadline: `The Future of ${data.productName} is Here`,
        metaAdDescription: "Shop Now"
      });
    }, 3000); // Simulate 3s generation time
  });
};

export default function OnboardingPage() {
  // --- State ---
  const [step, setStep] = useState<'login' | 'team-size' | 'teammate' | 'chat-hub' | 'workflows' | 'final-cta' | 'welcome' | 'input' | 'generating' | 'results'>('login');
  const [formData, setFormData] = useState<CampaignData>({
    productName: '',
    productDescription: '',
    targetAudience: ''
  });
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Initializing AI...");
  const [result, setResult] = useState<GeneratedResult | null>(null);

  // --- Handlers ---
  const handleStart = () => setStep('input');

  const handleGenerate = async () => {
    setStep('generating');
    
    // Simulate progress steps
    const messages = [
      "Analyzing market trends...",
      "Identifying buyer personas...",
      "Drafting high-converting copy...",
      "Finalizing campaign assets..."
    ];
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      const messageIndex = Math.floor((currentProgress / 100) * messages.length);
      if (messages[messageIndex]) {
        setLoadingMessage(messages[messageIndex]);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 150);

    // Call Mock AI
    const generated = await generateCampaign(formData);
    setResult(generated);
    
    // Wait for progress bar to finish visually
    setTimeout(() => {
      clearInterval(interval);
      setStep('results');
    }, 3000);
  };

  const handleRestart = () => {
    setStep('welcome');
    setFormData({ productName: '', productDescription: '', targetAudience: '' });
    setResult(null);
    setProgress(0);
  };

  // --- Render Steps ---

  // 0. Login Screen
  if (step === 'login') {
    return (
      <div 
        className="min-h-screen bg-white flex flex-col items-center justify-center p-4"
        style={{
          "--primary": "221.2 83.2% 53.3%",
          "--primary-foreground": "210 40% 98%",
          "--ring": "221.2 83.2% 53.3%",
        } as React.CSSProperties}
      >
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-2">
             {/* copy.ai in black */}
            <h2 className="text-2xl font-bold text-black">copy.ai</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sign in</h1>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="h-12 bg-white"
                />
              </div>
              <Button className="w-full h-12 text-lg" onClick={() => setStep('team-size')}>
                Continue
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full h-12 bg-white" onClick={() => setStep('team-size')}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#6b7280" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full h-12 bg-white" onClick={() => setStep('team-size')}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                Continue with Microsoft
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-slate-600">Don't have an account? </span>
              <button onClick={() => {}} className="font-semibold text-slate-900 hover:underline">Sign up</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 0.5 Team Size Screen
  if (step === 'team-size') {
    return (
      <div 
        className="min-h-screen bg-white flex flex-col"
        style={{
          "--primary": "221.2 83.2% 53.3%",
          "--primary-foreground": "210 40% 98%",
          "--ring": "221.2 83.2% 53.3%",
        } as React.CSSProperties}
      >
        <div className="w-full max-w-md mx-auto pt-8 px-4 mb-8">
          <Progress value={20} className="h-2 [&>div]:bg-black" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">Welcome to Copy.ai!</h1>
              <p className="text-slate-500">Let's get to know you better.</p>
            </div>
            
            <div className="space-y-4">
              <Label className="text-base font-medium">How many marketers does your company have?</Label>
              <RadioGroup defaultValue="just-me" className="space-y-4">
                <div className="flex items-center space-x-4 border-2 p-6 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all">
                  <RadioGroupItem value="just-me" id="r1" className="w-6 h-6" />
                  <Label htmlFor="r1" className="cursor-pointer flex-1 font-medium text-lg">Just me</Label>
                </div>
                <div className="flex items-center space-x-4 border-2 p-6 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all">
                  <RadioGroupItem value="2-5" id="r2" className="w-6 h-6" />
                  <Label htmlFor="r2" className="cursor-pointer flex-1 font-medium text-lg">2-5</Label>
                </div>
                <div className="flex items-center space-x-4 border-2 p-6 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all">
                  <RadioGroupItem value="6-10" id="r3" className="w-6 h-6" />
                  <Label htmlFor="r3" className="cursor-pointer flex-1 font-medium text-lg">6-10</Label>
                </div>
                <div className="flex items-center space-x-4 border-2 p-6 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all">
                  <RadioGroupItem value="10+" id="r4" className="w-6 h-6" />
                  <Label htmlFor="r4" className="cursor-pointer flex-1 font-medium text-lg">10+</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-start pt-4">
              <Button size="lg" onClick={() => setStep('teammate')} className="px-8 h-12 text-lg">
                Continue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 0.75 Teammate Feature Screen
  if (step === 'teammate') {
    return (
      <div 
        className="min-h-screen flex flex-col bg-slate-50"
        style={{
          "--primary": "262.1 83.3% 57.8%", // Purple primary
          "--primary-foreground": "210 40% 98%",
        } as React.CSSProperties}
      >
        {/* Top Progress */}
        <div className="w-full max-w-md mx-auto pt-8 px-4 mb-8">
           <Progress value={40} className="h-2 [&>div]:bg-black" />
        </div>

        {/* Main Content Area - Purple Background */}
        <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-[#1a0b2e] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                
                {/* Left Content */}
                <div className="flex-1 p-12 flex flex-col justify-center space-y-8 text-white">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            AI That Feels Like a <span className="text-purple-400">Teammate</span>
                        </h1>
                        <div className="space-y-6 pt-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-500/20 p-2 rounded-lg mt-1">
                                    <Target className="w-6 h-6 text-purple-300" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-purple-100">Trained on your content</h3>
                                    <p className="text-purple-200/60">Upload your docs and let AI do the rest.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-500/20 p-2 rounded-lg mt-1">
                                    <MessageSquare className="w-6 h-6 text-purple-300" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-purple-100">Knows your brand voice</h3>
                                    <p className="text-purple-200/60">Consistent messaging across every channel.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-500/20 p-2 rounded-lg mt-1">
                                    <Rocket className="w-6 h-6 text-purple-300" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-purple-100">Delivers in minutes</h3>
                                    <p className="text-purple-200/60">Launch campaigns faster than ever before.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Image Placeholder */}
                <div className="flex-1 bg-purple-900/50 relative min-h-[400px] md:min-h-auto">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3/4 h-3/4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm flex items-center justify-center">
                             <div className="text-center space-y-4 p-6">
                                <div className="w-20 h-20 bg-purple-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-32 bg-white/20 rounded mx-auto"></div>
                                    <div className="h-4 w-24 bg-white/20 rounded mx-auto"></div>
                                </div>
                             </div>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-10 right-10 w-20 h-20 bg-purple-500/30 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t p-6 mt-auto">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
                <Button variant="ghost" size="lg" onClick={() => setStep('team-size')} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                    <ArrowRight className="mr-2 w-5 h-5 rotate-180" /> Previous
                </Button>
                <Button size="lg" onClick={() => setStep('chat-hub')} className="px-8 h-12 text-lg bg-black hover:bg-slate-800 text-white shadow-lg">
                    Continue <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
      </div>
    );
  }

  // 0.8 Chat Hub Screen
  if (step === 'chat-hub') {
    return (
      <div 
        className="min-h-screen flex flex-col bg-slate-50"
        style={{
          "--primary": "262.1 83.3% 57.8%", // Purple primary
          "--primary-foreground": "210 40% 98%",
        } as React.CSSProperties}
      >
        {/* Top Progress */}
        <div className="w-full max-w-md mx-auto pt-8 px-4 mb-8">
           <Progress value={60} className="h-2 [&>div]:bg-black" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-gradient-to-br from-[#542de8] via-[#8544e3] to-[#d95b9a] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                
                {/* Left Content */}
                <div className="flex-1 p-12 flex flex-col justify-center space-y-8 text-white">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Your AI Chat Hub
                        </h1>
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center text-white text-lg font-medium">
                                <span className="w-1.5 h-1.5 bg-white rounded-full mr-4 shrink-0" />
                                Chat with OpenAI, Anthropic, and Gemini, all in one place
                            </div>
                            <div className="flex items-center text-white text-lg font-medium">
                                <span className="w-1.5 h-1.5 bg-white rounded-full mr-4 shrink-0" />
                                Compare answers instantly
                            </div>
                            <div className="flex items-center text-white text-lg font-medium">
                                <span className="w-1.5 h-1.5 bg-white rounded-full mr-4 shrink-0" />
                                Draft fast with the built-in editor
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Graphic */}
                <div className="flex-1 flex items-center justify-center p-12 bg-white/5 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-[320px] border border-gray-100">
                       <div className="flex gap-2 mb-3 border-b pb-2">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                          <div className="w-2 h-2 rounded-full bg-yellow-400" />
                          <div className="w-2 h-2 rounded-full bg-white" />
                       </div>
                       <div className="space-y-2">
                          <div className="h-2 w-3/4 bg-gray-100 rounded" />
                          <div className="h-2 w-full bg-gray-100 rounded" />
                          <div className="mt-4 border p-2 rounded flex justify-between items-center text-[10px] text-gray-500">
                            <span>Claude 3.5 Sonnet</span>
                            <span className="bg-blue-50 text-blue-600 px-1 rounded text-[8px]">PRO</span>
                          </div>
                       </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t p-6 mt-auto">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
                <Button variant="ghost" size="lg" onClick={() => setStep('teammate')} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                    <ArrowRight className="mr-2 w-5 h-5 rotate-180" /> Previous
                </Button>
                <Button size="lg" onClick={() => setStep('workflows')} className="px-8 h-12 text-lg bg-black hover:bg-slate-800 text-white shadow-lg">
                    Continue <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
      </div>
    );
  }

  // 0.9 Workflows Screen
  if (step === 'workflows') {
    return (
      <div 
        className="min-h-screen flex flex-col bg-slate-50"
        style={{
          "--primary": "262.1 83.3% 57.8%", // Purple primary
          "--primary-foreground": "210 40% 98%",
        } as React.CSSProperties}
      >
        {/* Top Progress */}
        <div className="w-full max-w-md mx-auto pt-8 px-4 mb-8">
           <Progress value={80} className="h-2 [&>div]:bg-black" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-gradient-to-br from-[#542de8] via-[#8544e3] to-[#d95b9a] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                
                {/* Left Content */}
                <div className="flex-1 p-12 flex flex-col justify-center space-y-8 text-white">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Go Beyond One-Offs
                        </h1>
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center text-white text-lg font-medium">
                                <span className="w-1.5 h-1.5 bg-white rounded-full mr-4 shrink-0" />
                                Automate end-to-end workflows
                            </div>
                            <div className="flex items-center text-white text-lg font-medium">
                                <span className="w-1.5 h-1.5 bg-white rounded-full mr-4 shrink-0" />
                                Bulk create assets fast
                            </div>
                            <div className="flex items-center text-white text-lg font-medium">
                                <span className="w-1.5 h-1.5 bg-white rounded-full mr-4 shrink-0" />
                                Connect tools with Zapier
                            </div>
                            <div className="flex items-center text-white text-lg font-medium">
                                <span className="w-1.5 h-1.5 bg-white rounded-full mr-4 shrink-0" />
                                Free your team from repeat work
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Graphic */}
                <div className="flex-1 flex items-center justify-center p-12 bg-white/5 backdrop-blur-sm">
                    <div className="relative w-72 h-80 bg-gradient-to-br from-pink-400 via-red-400 to-orange-300 rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl">
                      <div className="bg-white w-full h-full rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden">
                        {/* Dots Pattern Background */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" 
                             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                        
                        {/* Workflow Step 1 */}
                        <div className="relative z-10 bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
                          <div className="bg-yellow-50 p-1.5 rounded-md text-yellow-500"><Zap size={14} /></div>
                          <span className="text-xs font-bold text-gray-700">Input</span>
                        </div>

                        <div className="h-4 w-px bg-gray-200 self-center" />

                        {/* Workflow Step 2 */}
                        <div className="relative z-10 bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-100 p-1.5 rounded-md text-gray-800"><Eye size={14} /></div>
                            <span className="text-xs font-bold text-gray-700">Research Agent</span>
                          </div>
                          <span className="text-[7px] border border-gray-300 rounded px-1 text-gray-400 font-bold tracking-tighter">PLATINUM</span>
                        </div>

                        <div className="h-4 w-px bg-gray-200 self-center" />

                        {/* Workflow Step 3 */}
                        <div className="relative z-10 bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
                          <div className="bg-purple-50 p-1.5 rounded-md text-purple-500"><Sparkles size={14} /></div>
                          <span className="text-xs font-bold text-gray-700">Generate Blog</span>
                        </div>

                        {/* Add Button */}
                        <div className="mt-auto self-center bg-purple-100 text-purple-600 rounded-full p-1 border border-white shadow-sm">
                          <Plus size={12} />
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t p-6 mt-auto">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
                <Button variant="ghost" size="lg" onClick={() => setStep('chat-hub')} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                    <ArrowRight className="mr-2 w-5 h-5 rotate-180" /> Previous
                </Button>
                <Button size="lg" onClick={() => setStep('final-cta')} className="px-8 h-12 text-lg bg-black hover:bg-slate-800 text-white shadow-lg">
                    Continue <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
      </div>
    );
  }

  // 0.95 Final CTA Screen
  if (step === 'final-cta') {
    return (
      <div 
        className="min-h-screen flex flex-col bg-slate-50"
        style={{
          "--primary": "262.1 83.3% 57.8%", // Purple primary
          "--primary-foreground": "210 40% 98%",
        } as React.CSSProperties}
      >
        {/* Top Progress */}
        <div className="w-full max-w-md mx-auto pt-8 px-4 mb-8">
           <Progress value={100} className="h-2 [&>div]:bg-black" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-12 md:p-16 space-y-8 border border-slate-100">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                    Where do you want to start?
                </h1>
                
                <div className="space-y-6 max-w-3xl">
                  <p className="text-slate-600 text-xl leading-relaxed">
                    The world's fastest-growing teams are scaling content creation with Copy.ai.
                  </p>
                  <p className="text-slate-600 text-xl leading-relaxed">
                    They're saving thousands, launching faster, and keeping their brand voice consistent across every channel.
                  </p>
                </div>

                <div className="w-full rounded-2xl bg-gradient-to-r from-[#542de8] via-[#8544e3] to-[#d95b9a] p-8 md:p-10 shadow-lg mt-8 flex items-center justify-center">
                    <h2 className="text-white text-xl md:text-2xl font-bold text-center leading-tight">
                      Don't get left behind. Your AI Marketing Team is waiting.
                    </h2>
                </div>
            </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t p-6 mt-auto">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
                <Button variant="ghost" size="lg" onClick={() => setStep('workflows')} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                    <ArrowRight className="mr-2 w-5 h-5 rotate-180" /> Previous
                </Button>
                <Button size="lg" onClick={() => setStep('welcome')} className="px-8 h-12 text-lg bg-black hover:bg-slate-800 text-white shadow-lg">
                    Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
      </div>
    );
  }

  // 1. Welcome Screen
  if (step === 'welcome') {
    return (
      <div 
        className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4"
        style={{
          "--primary": "221.2 83.2% 53.3%",
          "--primary-foreground": "210 40% 98%",
          "--ring": "221.2 83.2% 53.3%",
        } as React.CSSProperties}
      >
        <div className="max-w-2xl text-center space-y-8">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
            Create your first campaign in <span className="text-primary">seconds</span>.
          </h1>
          <p className="text-xl text-slate-600 max-w-xl mx-auto">
            Stop staring at a blank page. Tell us what you're building, and our AI will generate a complete Go-To-Market strategy for you.
          </p>
          <Button size="lg" onClick={handleStart} className="text-lg px-8 py-6 h-auto animate-pulse">
            Start Magic Generator <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-sm text-slate-400">No credit card required • Generates in &lt; 1 minute</p>
        </div>
      </div>
    );
  }

  // 2. Input Screen (The "Golden Path" - Minimal Input)
  if (step === 'input') {
    return (
      <div 
        className="min-h-screen bg-slate-50 flex items-center justify-center p-4"
        style={{
          "--primary": "221.2 83.2% 53.3%",
          "--primary-foreground": "210 40% 98%",
          "--ring": "221.2 83.2% 53.3%",
        } as React.CSSProperties}
      >
        <Card className="w-full max-w-lg shadow-xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-2xl">Tell us about your product</CardTitle>
            <CardDescription>
              We need just a few details to craft your campaign.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input 
                id="name" 
                placeholder="e.g. Shopwise" 
                value={formData.productName}
                onChange={(e) => setFormData({...formData, productName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">What does it do?</Label>
              <Textarea 
                id="description" 
                placeholder="Describe your product in a sentence or two..." 
                className="min-h-[100px]"
                value={formData.productDescription}
                onChange={(e) => setFormData({...formData, productDescription: e.target.value})}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep('welcome')}>Back</Button>
            <Button 
              onClick={handleGenerate} 
              disabled={!formData.productName || !formData.productDescription}
            >
              Generate Campaign <Sparkles className="ml-2 w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // 3. Generating State (Building Anticipation)
  if (step === 'generating') {
    return (
      <div 
        className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4"
        style={{
          "--primary": "221.2 83.2% 53.3%",
          "--primary-foreground": "210 40% 98%",
          "--ring": "221.2 83.2% 53.3%",
        } as React.CSSProperties}
      >
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
            <div className="relative bg-primary/10 p-6 rounded-full border border-primary/50">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold animate-pulse">{loadingMessage}</h2>
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
      </div>
    );
  }

  // 4. Results Page (The "Aha!" Moment)
  if (step === 'results' && result) {
    return (
      <div 
        className="min-h-screen bg-slate-50 p-4 md:p-8"
        style={{
          "--primary": "221.2 83.2% 53.3%",
          "--primary-foreground": "210 40% 98%",
          "--ring": "221.2 83.2% 53.3%",
        } as React.CSSProperties}
      >
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-700 border-blue-200">
                <CheckCircle className="w-3 h-3 mr-1" /> Campaign Generated
              </Badge>
              <h1 className="text-3xl font-bold text-slate-900">Launch Strategy: {formData.productName}</h1>
              <p className="text-slate-500">Here is your AI-generated starter kit.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRestart}>
                <RefreshCw className="w-4 h-4 mr-2" /> New Campaign
              </Button>
              <Button>
                Export Assets <Share2 className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Strategy */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" /> Target Audience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{result.audiencePersona}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-primary" /> Tagline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-medium text-slate-900">"{result.tagline}"</p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Content Assets */}
            <div className="md:col-span-2">
              <Tabs defaultValue="social" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="google">Google Ads</TabsTrigger>
                  <TabsTrigger value="meta">Meta Ads</TabsTrigger>
                </TabsList>
                
                <TabsContent value="social" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-500" /> LinkedIn / Twitter Post
                      </CardTitle>
                      <CardDescription>Optimized for engagement and clicks.</CardDescription>
                    </CardHeader>
                    <CardContent className="bg-slate-50 p-6 rounded-md mx-6 mb-6 border">
                      <pre className="whitespace-pre-wrap font-sans text-slate-700">{result.socialPost}</pre>
                    </CardContent>
                    <CardFooter className="justify-end">
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4 mr-2" /> Copy Text
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="email" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-purple-500" /> Launch Email
                      </CardTitle>
                      <CardDescription>Send this to your waitlist.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-500 uppercase">Subject Line</Label>
                        <div className="font-medium text-slate-900">{result.emailSubject}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-500 uppercase">Body</Label>
                        <div className="bg-slate-50 p-4 rounded-md border">
                          <pre className="whitespace-pre-wrap font-sans text-slate-700">{result.emailBody}</pre>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4 mr-2" /> Copy Email
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="google" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-slate-600" /> Google Search Ad
                      </CardTitle>
                      <CardDescription>Preview of your search engine listing.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="bg-white p-4 rounded-md border shadow-sm max-w-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-black text-sm">Sponsored</span>
                          <span className="text-xs text-slate-500">·</span>
                          <span className="text-xs text-slate-500">example.com</span>
                        </div>
                        <div className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium mb-1">
                          {result.googleAdHeadline}
                        </div>
                        <div className="text-sm text-[#4d5156]">
                          {result.googleAdDescription}
                        </div>
                        {/* Sitelinks extension mockup */}
                        <div className="mt-4 flex gap-4 text-sm text-[#1a0dab]">
                          <span className="hover:underline cursor-pointer">Features</span>
                          <span className="hover:underline cursor-pointer">Pricing</span>
                          <span className="hover:underline cursor-pointer">Contact Us</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4 mr-2" /> Copy Ad Copy
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="meta" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Layout className="w-5 h-5 text-blue-600" /> Meta Feed Ad
                      </CardTitle>
                      <CardDescription>Preview of your Facebook/Instagram feed ad.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 flex justify-center">
                      <div className="bg-white border rounded-lg max-w-sm w-full overflow-hidden shadow-sm">
                        {/* Header */}
                        <div className="p-3 flex items-center gap-2">
                          <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-slate-900">Your Brand Name</div>
                            <div className="text-xs text-slate-500">Sponsored · <span className="globe-icon">🌍</span></div>
                          </div>
                        </div>
                        
                        {/* Primary Text */}
                        <div className="px-3 pb-3 text-sm text-slate-800 whitespace-pre-wrap bg-white">
                          {result.metaAdPrimaryText}
                        </div>

                        {/* Image Placeholder */}
                        <div className="w-full aspect-square bg-slate-100 flex items-center justify-center text-slate-400">
                          <div className="text-center">
                            <div className="mb-2">[Ad Creative Image]</div>
                            <div className="text-xs">1080 x 1080</div>
                          </div>
                        </div>

                        {/* CTA Section */}
                        <div className="p-3 bg-slate-50 flex justify-between items-center border-t">
                          <div>
                            <div className="text-xs text-slate-500 uppercase">example.com</div>
                            <div className="font-bold text-sm text-slate-900">{result.metaAdHeadline}</div>
                            <div className="text-xs text-slate-600">{result.metaAdDescription}</div>
                          </div>
                          <Button size="sm" variant="outline" className="h-8">Shop Now</Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4 mr-2" /> Copy Ad Copy
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
