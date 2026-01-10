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
  Layout,
  Smartphone,
  FileText,
  Video,
  Globe,
  Instagram,
  RotateCcw,
  Download
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
import { StepProgressBar } from "@/components/ui/step-progress-bar";
import { Checkbox } from "@/components/ui/checkbox";

// --- Types ---
type CampaignData = {
  productName: string;
  productDescription: string;
  targetAudience: string;
  keywords?: string;
  tone?: string;
};

type Template = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  inputs: { id: keyof CampaignData; label: string; placeholder: string; type: 'input' | 'textarea' }[];
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
  // New fields
  landingPageHeadline: string;
  landingPageSubheadline: string;
  instagramCaption: string;
  pushNotificationTitle: string;
  pushNotificationBody: string;
  smsMessage: string;
  blogPostTitle: string;
  blogPostOutline: string;
  youtubeVideoTitle: string;
  youtubeVideoDescription: string;
  productHuntTagline: string;
};

type SavedCampaign = {
  id: string;
  name: string;
  date: string;
  templates: string[];
  formData: CampaignData;
  result: GeneratedResult;
  publishedTemplates?: string[]; // new field
};

type GeneratingVariant = 'system-status' | 'magic-show' | 'pet-techniques' | 'minimalist';

// --- Mock AI Generation ---
const generateCampaign = async (data: CampaignData): Promise<GeneratedResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const productDescription = data.productDescription || '';
      resolve({
        tagline: `Experience the future of ${data.productName}.`,
        audiencePersona: "Tech-savvy early adopters who value efficiency and innovation.",
        socialPost: `🚀 Introducing ${data.productName}! \n\n${productDescription.slice(0, 50)}... \n\nIt's time to upgrade your workflow. #Tech #Innovation #${data.productName.replace(/\s/g, '')}`,
        emailSubject: `Unlock your potential with ${data.productName}`,
        emailBody: `Hi [Name],\n\nWe are thrilled to announce the launch of ${data.productName}.\n\n${productDescription}\n\nDon't miss out on our exclusive launch offer.\n\nBest,\nThe Team`,
        googleAdHeadline: `${data.productName} - Official Site`,
        googleAdDescription: `Discover ${data.productName}. ${productDescription.slice(0, 60)}... Shop now for exclusive deals.`,
        metaAdPrimaryText: `Stop scrolling and start experiencing ${data.productName}. 🛑✨ \n\n${productDescription}`,
        metaAdHeadline: `The Future of ${data.productName} is Here`,
        metaAdDescription: "Shop Now",
        // New fields
        landingPageHeadline: `Master Your Workflow with ${data.productName}`,
        landingPageSubheadline: `The all-in-one solution designed to help you ${productDescription.slice(0, 30).toLowerCase()}... and achieve more.`,
        instagramCaption: `✨ Ready to level up? Meet ${data.productName}. \n\n${productDescription.slice(0, 40)}... \n\nLink in bio! 🔗 #NewLaunch #Productivity #${data.productName.replace(/\s/g, '')}`,
        pushNotificationTitle: `It's finally here! 🎉`,
        pushNotificationBody: `See what's new in ${data.productName}. Tap to explore.`,
        smsMessage: `Hey! ${data.productName} is live. Get early access now: bit.ly/launch - Text STOP to opt out.`,
        blogPostTitle: `Why We Built ${data.productName} (And Why You Need It)`,
        blogPostOutline: `1. The Problem: Why current solutions fail.\n2. The Solution: How ${data.productName} changes the game.\n3. Getting Started: Your first steps to success.`,
        youtubeVideoTitle: `${data.productName} Official Launch Trailer | The Future of Work`,
        youtubeVideoDescription: `Welcome to ${data.productName}. In this video, we show you how to ${productDescription.slice(0, 50)}... \n\nLearn more at our website.`,
        productHuntTagline: `The best way to ${productDescription.slice(0, 20)}...`
      });
    }, 3000); // Simulate 3s generation time
  });
};

type Step = 'login' | 'team-size' | 'template-selection' | 'teammate' | 'chat-hub' | 'workflows' | 'final-cta' | 'welcome' | 'input' | 'generating' | 'results' | 'workflow-selection' | 'generating-variant-selection' | 'publish' | 'dashboard';

export default function OnboardingPage() {
  // --- State ---
  const [step, setStep] = useState<Step>('login');
  const [formData, setFormData] = useState<{[key: string]: string}>({});
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Initializing AI...");
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [brandVoice, setBrandVoice] = useState('Professional');
  const [savedCampaigns, setSavedCampaigns] = useState<SavedCampaign[]>([]);
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [selectedForPublish, setSelectedForPublish] = useState<string[]>([]);
  const [viewingCampaign, setViewingCampaign] = useState<SavedCampaign | null>(null);

  const onboardingSteps = ["Welcome", "Team Size", "Select Templates", "Provide Details", "Generate", "View Results", "Publish", "Dashboard"];
  const getCurrentStep = () => {
    switch (step) {
      case 'welcome': return 1;
      case 'team-size': return 2;
      case 'template-selection': return 3;
      case 'input': return 4;
      case 'generating': return 5;
      case 'results': return 6;
      case 'publish': return 7;
      case 'dashboard': return 8;
      default: return 0;
    }
  };

  // Helper to persist current result into the latest saved campaign (if exists)
  const persistResultToLatestCampaign = (updatedResult: GeneratedResult) => {
    const latestCampaign = savedCampaigns[0];
    if (latestCampaign) {
      const updatedCampaign: SavedCampaign = { ...latestCampaign, result: updatedResult };
      const updatedCampaigns = [updatedCampaign, ...savedCampaigns.slice(1)];
      setSavedCampaigns(updatedCampaigns);
      try {
        localStorage.setItem('savedCampaigns', JSON.stringify(updatedCampaigns));
      } catch (e) {
        // ignore localStorage errors
      }
    }
  };

  // Autosave: debounce changes to `result` and persist them
  useEffect(() => {
    if (!result) return;
    setAutosaveStatus('saving');
    const handler = setTimeout(() => {
      persistResultToLatestCampaign(result);
      setAutosaveStatus('saved');
      const clearStatus = setTimeout(() => setAutosaveStatus('idle'), 1500);
      return () => clearTimeout(clearStatus);
    }, 800); // 800ms debounce

    return () => clearTimeout(handler);
  }, [result]);
  const allTemplates: Template[] = [
    {
      id: 'social-suite',
      title: "Social Media Suite",
      description: "Multi-platform updates for Instagram, LinkedIn, & X.",
      icon: <Share2 className="w-6 h-6 text-blue-500" />,
      badge: "Popular for Startups",
      inputs: [
        { id: 'productName', label: 'Product Name', placeholder: 'e.g. Shopwise', type: 'input' },
        { id: 'productDescription', label: 'Product Description', placeholder: 'Describe your product...', type: 'textarea' },
        { id: 'tone', label: 'Tone of Voice', placeholder: 'e.g. Professional, Witty', type: 'input' }
      ]
    },
    {
      id: 'email-campaign',
      title: "Email Marketing Campaign",
      description: "Assets for product launches or newsletters.",
      icon: <Mail className="w-6 h-6 text-purple-500" />,
      badge: "Used by 10,000+ Founders",
      inputs: [
        { id: 'productName', label: 'Product Name', placeholder: 'e.g. Shopwise', type: 'input' },
        { id: 'targetAudience', label: 'Target Audience', placeholder: 'Who is this for?', type: 'input' }
      ]
    },
    {
      id: 'ad-copy',
      title: "High-Conversion Ad Copy",
      description: "Templates for Google and Meta ads.",
      icon: <Layout className="w-6 h-6 text-pink-500" />,
      badge: "",
      inputs: [
        { id: 'productName', label: 'Product Name', placeholder: 'e.g. Shopwise', type: 'input' },
        { id: 'productDescription', label: 'Product Description', placeholder: 'Describe your product...', type: 'textarea' },
        { id: 'targetAudience', label: 'Target Audience', placeholder: 'Who is this for?', type: 'input' }
      ]
    },
    {
      id: 'seo-blog',
      title: "SEO Blog Post",
      description: "Generate a structured, long-form article.",
      icon: <FileText className="w-6 h-6 text-green-500" />,
      badge: "Certified Brand-Voice",
      inputs: [
        { id: 'productName', label: 'Topic / Product', placeholder: 'e.g. The Future of AI', type: 'input' },
        { id: 'keywords', label: 'Target Keywords', placeholder: 'e.g. AI, Marketing, Automation', type: 'input' }
      ]
    },
    { 
      id: 'content-repurpose',
      title: "Content Repurposing", 
      description: "Turn a single blog post or video into a week's worth of social media posts, emails, and short scripts.", 
      icon: <RefreshCw className="w-6 h-6 text-blue-500" />, 
      badge: "",
      inputs: [
        { id: 'productDescription', label: 'Source Content', placeholder: 'Paste your blog post or transcript here...', type: 'textarea' }
      ]
    },
    { 
      id: 'seo-builder',
      title: "SEO Blog Post Builder", 
      description: "Keyword Research → Outline Generation → Full Article Drafting → SEO Optimization.", 
      icon: <FileText className="w-6 h-6 text-green-500" />, 
      badge: "",
      inputs: [
        { id: 'keywords', label: 'Main Keyword', placeholder: 'e.g. Content Marketing', type: 'input' }
      ]
    },
    { 
      id: 'product-launch',
      title: "Product Launch Package", 
      description: "Generate Product Hunt tagline, press release, launch email sequence, and social announcement posts.", 
      icon: <Rocket className="w-6 h-6 text-orange-500" />, 
      badge: "Popular for Startups",
      inputs: [
        { id: 'productName', label: 'Product Name', placeholder: 'e.g. Shopwise', type: 'input' },
        { id: 'productDescription', label: 'Launch Details', placeholder: 'What are you launching?', type: 'textarea' }
      ]
    },
    { 
      id: 'email-drip',
      title: "Email Drip Campaign", 
      description: "Create a multi-step email sequence (Welcome Series, Nurture Sequence, Abandoned Cart).", 
      icon: <Mail className="w-6 h-6 text-purple-500" />, 
      badge: "",
      inputs: [
        { id: 'productName', label: 'Company Name', placeholder: 'e.g. Shopwise', type: 'input' },
        { id: 'targetAudience', label: 'Audience Segment', placeholder: 'e.g. New Signups', type: 'input' }
      ]
    },
    { 
      id: 'ad-variants',
      title: "Ad Creative Variants", 
      description: "Generate 50+ variations of Facebook/Google ad headlines and primary text for A/B testing.", 
      icon: <Layout className="w-6 h-6 text-pink-500" />, 
      badge: "",
      inputs: [
        { id: 'productName', label: 'Product Name', placeholder: 'e.g. Shopwise', type: 'input' },
        { id: 'productDescription', label: 'Value Proposition', placeholder: 'Why should they buy?', type: 'textarea' }
      ]
    },
    { 
      id: 'webinar-promo',
      title: "Webinar Promotion", 
      description: "Create landing page copy, invitation emails, reminder emails, and social promo posts.", 
      icon: <Video className="w-6 h-6 text-red-500" />, 
      badge: "",
      inputs: [
        { id: 'productName', label: 'Webinar Title', placeholder: 'e.g. Master AI Marketing', type: 'input' },
        { id: 'productDescription', label: 'Webinar Details', placeholder: 'Date, Time, Speakers...', type: 'textarea' }
      ]
    },
    { 
      id: 'newsletter',
      title: "Newsletter Creator", 
      description: "Turn raw notes or curated links into a formatted, engaging weekly newsletter.", 
      icon: <Mail className="w-6 h-6 text-indigo-500" />, 
      badge: "",
      inputs: [
        { id: 'productDescription', label: 'Newsletter Content / Links', placeholder: 'Paste your links or notes here...', type: 'textarea' }
      ]
    },
    { 
      id: 'case-study',
      title: "Case Study Generator", 
      description: "Transform customer interview transcripts or bullet points into a structured success story.", 
      icon: <Target className="w-6 h-6 text-teal-500" />, 
      badge: "",
      inputs: [
        { id: 'productName', label: 'Customer Name', placeholder: 'e.g. Acme Corp', type: 'input' },
        { id: 'productDescription', label: 'Success Metrics / Story', placeholder: 'Describe the results...', type: 'textarea' }
      ]
    },
    { 
      id: 'competitor-analysis',
      title: "Competitor Analysis", 
      description: "Research a competitor's website/socials and generate a SWOT analysis or feature comparison table.", 
      icon: <Search className="w-6 h-6 text-slate-500" />, 
      badge: "",
      inputs: [
        { id: 'productName', label: 'Competitor Name', placeholder: 'e.g. CompetitorX', type: 'input' },
        { id: 'keywords', label: 'Competitor Website', placeholder: 'e.g. www.competitorx.com', type: 'input' }
      ]
    },
    { 
      id: 'social-calendar',
      title: "Social Media Calendar", 
      description: "Generate 30 days of post ideas and captions based on a specific theme or content pillar.", 
      icon: <MessageSquare className="w-6 h-6 text-blue-400" />, 
      badge: "",
      inputs: [
        { id: 'productName', label: 'Brand Name', placeholder: 'e.g. Shopwise', type: 'input' },
        { id: 'keywords', label: 'Content Pillars', placeholder: 'e.g. Education, Behind the Scenes', type: 'input' }
      ]
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    if (step === 'template-selection') {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        setShowScrollTop(false); // Reset on leaving the page
      };
    }
  }, [step]);

  // --- Handlers ---
  const handleStart = () => setStep('input');

  useEffect(() => {
    if (step !== 'generating') {
      return;
    }

    setGenerationComplete(false);
    setProgress(0);
    setLoadingMessage("Initializing AI...");

    const messages = [
      "Analyzing your product details...",
      "Researching market trends for you...",
      "Identifying key audience personas...",
      "Drafting high-converting copy...",
      "Polishing the final campaign assets..."
    ];

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const messageIndex = Math.floor((newProgress / 100) * (messages.length - 1));
        if (messages[messageIndex]) {
            setLoadingMessage(messages[messageIndex]);
        }
        return newProgress;
      });
    }, 900);

    // Start AI generation
    generateCampaign(formData).then(generated => {
      setResult(generated);
      try {
        const newCamp: SavedCampaign = {
          id: String(Date.now()),
          name: formData.productName || `Campaign ${new Date().toLocaleString()}`,
          date: new Date().toISOString(),
          templates: selectedTemplates,
          formData: { ...formData },
          result: generated,
        };
        const updated = [newCamp, ...savedCampaigns];
        setSavedCampaigns(updated);
        localStorage.setItem('savedCampaigns', JSON.stringify(updated));
      } catch (e) {
        // ignore localStorage issues
      }
    });

    // Set up navigation to results after 10 seconds
    const navigationTimeout = setTimeout(() => {
      setLoadingMessage("Campaign Generated!");
      setGenerationComplete(true);
      setTimeout(() => {
        if (document.hidden) return; // Don't navigate if tab is not active
        setStep('results');
      }, 1000); // Wait 1s before navigating
    }, 10000); // Total time is 10s

    // Cleanup function to clear intervals and timeouts if the component unmounts
    // or the user navigates away.
    return () => {
      clearInterval(progressInterval);
      clearTimeout(navigationTimeout);
    };
  }, [step]);

  const handleRestart = () => {
    // go back to template selection so user can start a new campaign
    setStep('template-selection');
    setFormData({ productName: '', productDescription: '', targetAudience: '', keywords: '', tone: '' });
    setResult(null);
    setProgress(0);
    setSelectedTemplates([]);
    setSelectedForPublish([]);
  };

  // Load saved campaigns on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('savedCampaigns');
      if (raw) setSavedCampaigns(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
  };

  const handleExportAll = (campaign: SavedCampaign | { templates: string[]; result: GeneratedResult; name?: string }) => {
    const name = ('name' in campaign && campaign.name) ? campaign.name : `campaign-${Date.now()}`;
    const htmlParts: string[] = [];
    htmlParts.push(`<html><head><meta charset="utf-8"><title>${name}</title></head><body>`);
    if ('formData' in campaign) {
      htmlParts.push(`<h1>${campaign.name}</h1><p>Generated on: ${new Date(campaign.date).toLocaleString()}</p>`);
    } else {
      htmlParts.push(`<h1>${name}</h1>`);
    }
    const r = ('result' in campaign) ? campaign.result : (campaign as any).result;
    const templates = ('templates' in campaign) ? campaign.templates : [];
    templates.forEach(tid => {
      const t = allTemplates.find(x => x.id === tid);
      htmlParts.push(`<section style="margin:24px 0;padding:12px;border:1px solid #eee;border-radius:8px;">`);
      htmlParts.push(`<h2>${t?.title || tid}</h2>`);
      // map some known fields
      if (tid === 'social-suite' || tid === 'social-post') htmlParts.push(`<pre>${r.socialPost}</pre>`);
      else if (tid === 'email-campaign') htmlParts.push(`<h3>Subject</h3><div>${r.emailSubject}</div><pre>${r.emailBody}</pre>`);
      else if (tid === 'google-ads') htmlParts.push(`<h3>${r.googleAdHeadline}</h3><p>${r.googleAdDescription}</p>`);
      else if (tid === 'landing-page') htmlParts.push(`<h3>${r.landingPageHeadline}</h3><p>${r.landingPageSubheadline}</p>`);
      else htmlParts.push(`<pre>${r.socialPost}</pre>`);
      htmlParts.push(`</section>`);
    });
    htmlParts.push('</body></html>');
    const blob = new Blob([htmlParts.join('\n')], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/[^a-z0-9_-]/gi, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleTemplate = (id: string) => {
    setSelectedTemplates(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const togglePublishSelection = (id: string) => {
    setSelectedForPublish(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
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
        <div className="w-full max-w-2xl mx-auto pt-8 px-4 mb-8">
          <StepProgressBar steps={onboardingSteps} currentStep={getCurrentStep()} />
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
              <Button size="lg" onClick={() => setStep('template-selection')} className="px-8 h-12 text-lg">
                Continue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 0.6 Template Selection Screen
  if (step === 'template-selection') {
    return (
      <div 
        className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans"
        style={{
          "--primary": "221.2 83.2% 53.3%",
          "--primary-foreground": "210 40% 98%",
        } as React.CSSProperties}
      >
        <div className="w-full max-w-4xl mx-auto pt-8 px-4 mb-8">
          <StepProgressBar steps={onboardingSteps} currentStep={getCurrentStep()} />
          <div className="flex items-center justify-between mt-8 mb-2">
            <h2 className="text-2xl font-bold text-black">copy.ai</h2>
            {selectedTemplates.length > 0 && (
              <Badge className="bg-black text-white text-sm px-3 py-1">
                {selectedTemplates.length} Selected
              </Badge>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 pb-32">
          <div className="w-full max-w-4xl space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-slate-900">What would you like to create today?</h1>
              <p className="text-lg text-slate-500">Select one or more templates to generate your marketing assets.</p>
            </div>
            
            <div className="relative w-full max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Search for a template..."
                className="h-12 pl-12 bg-white border-slate-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {allTemplates.map((template, index) => {
                const isSelected = selectedTemplates.includes(template.id);
                return (
                  <div 
                    key={index} 
                    onClick={() => toggleTemplate(template.id)}
                    className={`bg-white border rounded-xl p-6 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative ${isSelected ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'}`}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4 text-blue-600">
                        <CheckCircle className="w-6 h-6 fill-blue-100" />
                      </div>
                    )}
                    <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-lg mb-4 ${isSelected ? 'bg-blue-50' : 'bg-slate-100'}`}>
                        {template.icon}
                      </div>
                      {template.badge && !isSelected && (
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">{template.badge}</Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{template.title}</h3>
                    <p className="text-slate-500 mb-6">{template.description}</p>
                    <Button 
                      className={`w-full ${isSelected ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600'}`}
                      variant={isSelected ? "default" : "outline"}
                    >
                      {isSelected ? "Selected" : "Select Template"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white border-t p-6 fixed bottom-0 left-0 right-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <Button variant="ghost" size="lg" onClick={() => setStep('team-size')} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                    <ArrowRight className="mr-2 w-5 h-5 rotate-180" /> Previous
                </Button>
                <Button 
                  size="lg" 
                  onClick={() => setStep('input')} 
                  disabled={selectedTemplates.length === 0}
                  className="px-8 h-12 text-lg bg-black hover:bg-slate-800 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue ({selectedTemplates.length}) <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>

        {showScrollTop && (
          <button 
            onClick={scrollToTop}
            className="fixed bottom-24 right-8 bg-black text-white rounded-full p-3 shadow-lg hover:bg-slate-800 transition-colors z-20"
          >
            <ArrowRight className="w-6 h-6 -rotate-90" />
          </button>
        )}
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
        <div className="w-full max-w-2xl mx-auto pt-8 px-4 mb-8">
           <StepProgressBar steps={["Welcome", "Team Size", "Features", "Chat", "Workflows", "Start"]} currentStep={3} />
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
        <div className="w-full max-w-2xl mx-auto pt-8 px-4 mb-8">
           <StepProgressBar steps={["Welcome", "Team Size", "Features", "Chat", "Workflows", "Start"]} currentStep={4} />
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
        <div className="w-full max-w-2xl mx-auto pt-8 px-4 mb-8">
           <StepProgressBar steps={["Welcome", "Team Size", "Features", "Chat", "Workflows", "Start"]} currentStep={5} />
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
        <div className="w-full max-w-2xl mx-auto pt-8 px-4 mb-8">
           <StepProgressBar steps={["Welcome", "Team Size", "Features", "Chat", "Workflows", "Start"]} currentStep={6} />
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

  // 2. Input Screen (Dynamic based on selection)
  if (step === 'input') {
    // Get all required inputs from selected templates
    const requiredInputs = allTemplates
      .filter(t => selectedTemplates.includes(t.id))
      .flatMap(t => t.inputs);

    // Deduplicate inputs based on ID
    const uniqueInputs = Array.from(new Map(requiredInputs.map(item => [item.id, item])).values());

    return (
      <div 
        className="min-h-screen bg-slate-50 flex flex-col p-4"
        style={{
          "--primary": "221.2 83.2% 53.3%",
          "--primary-foreground": "210 40% 98%",
          "--ring": "221.2 83.2% 53.3%",
        } as React.CSSProperties}
      >
        <div className="w-full max-w-2xl mx-auto pt-8 px-4 mb-8">
          <StepProgressBar steps={onboardingSteps} currentStep={getCurrentStep()} />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-lg shadow-xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-2xl">Tell us about your product</CardTitle>
              <CardDescription>
                We need a few details to generate assets for your <strong>{selectedTemplates.length} selected templates</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {uniqueInputs.map((input) => (
                <div key={input.id} className="space-y-2">
                  <Label htmlFor={input.id}>{input.label}</Label>
                  {input.type === 'textarea' ? (
                    <Textarea 
                      id={input.id} 
                      placeholder={input.placeholder} 
                      className="min-h-[100px]"
                      value={formData[input.id] || ''}
                      onChange={(e) => setFormData({...formData, [input.id]: e.target.value})}
                    />
                  ) : (
                    <Input 
                      id={input.id} 
                      placeholder={input.placeholder} 
                      value={formData[input.id] || ''}
                      onChange={(e) => setFormData({...formData, [input.id]: e.target.value})}
                    />
                  )}
                </div>
              ))}
              <div className="space-y-2">
                <Label>Select Brand Voice</Label>
                <div className="flex space-x-2">
                  {['Professional', 'Witty', 'Causal'].map((voice) => (
                    <Button
                      key={voice}
                      variant={brandVoice === voice ? 'default' : 'outline'}
                      onClick={() => setBrandVoice(voice)}
                      className="rounded-lg"
                    >
                      {voice}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep('template-selection')}>Back</Button>
              <Button 
                onClick={() => setStep('generating')} 
                disabled={uniqueInputs.some(input => !formData[input.id])}
              >
                Generate Campaign <Sparkles className="ml-2 w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // 3. Generating State (Building Anticipation)
  if (step === 'generating') {
    return (
      <div 
        className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4"
        style={{
          "--primary": "221.2 83.2% 53.3%",
          "--primary-foreground": "210 40% 98%",
          "--ring": "221.2 83.2% 53.3%",
        } as React.CSSProperties}
      >
        <div className="w-full max-w-2xl mx-auto pt-8 px-4 mb-8 self-start">
          <StepProgressBar steps={onboardingSteps} currentStep={getCurrentStep()} />
        </div>
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              <div className="relative bg-primary/10 p-6 rounded-full border border-primary/50">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold animate-pulse text-slate-800">
                {generationComplete ? "Campaign Generated!" : loadingMessage}
              </h2>
              <p className="text-slate-500">
                {generationComplete ? "Redirecting you to the results..." : "This usually takes about 60 seconds..."}
              </p>
            </div>

            <div className="space-y-2">
              <Progress value={progress} className="h-2 bg-slate-200" />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Start</span>
                <span>{progress}%</span>
                <span>Finish</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={() => setStep('input')}>
                    <ArrowRight className="mr-2 w-4 h-4 rotate-180" /> Back
                </Button>
                {generationComplete && (
                  <Button onClick={() => setStep('results')} size="lg" className="animate-pulse">
                    View Results <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Results Screen (The "Aha!" Moment)
  if (step === 'results' && result) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="w-full max-w-4xl mx-auto pt-8 px-4 mb-8">
          <StepProgressBar steps={onboardingSteps} currentStep={getCurrentStep()} />
        </div>
        <div className="max-w-4xl mx-auto">
          <main>
            <div className="space-y-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Your Campaign Assets</h1>
                  <div className="flex items-center gap-3">
                    <p className="text-slate-500">Generated for <strong>{formData.productName}</strong>. Select assets to publish.</p>
                    {autosaveStatus !== 'idle' && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        {autosaveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                        <span>{autosaveStatus === 'saving' ? 'Saving...' : 'Saved'}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleRestart}>
                    <RotateCcw className="w-4 h-4 mr-2" /> Start Over
                  </Button>
                  <Button 
                    onClick={() => {
                      // persist any edits to the latest saved campaign before publishing
                      if (result) persistResultToLatestCampaign(result);
                      setStep('publish');
                    }}
                    disabled={selectedForPublish.length === 0}
                  >
                    <Zap className="w-4 h-4 mr-2" /> Publish Selected ({selectedForPublish.length})
                  </Button>
                </div>
              </div>

              {/* Generated Assets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedTemplates.map(templateId => {
                  const template = allTemplates.find(t => t.id === templateId);
                  if (!template) return null;
                  const isSelected = selectedForPublish.includes(templateId);

                  return (
                    <Card key={templateId} className={`flex flex-col h-full transition-all ${isSelected ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            {template.icon} {template.title}
                          </CardTitle>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => togglePublishSelection(templateId)}
                            id={`select-${templateId}`}
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 bg-slate-50/50 p-6 border-y">
                        {/* Dynamic Content Rendering based on Template ID */}
                        {templateId === 'social-suite' && (
                          <div>
                            <Label className="text-xs">Social Post</Label>
                            <Textarea value={result.socialPost} onChange={(e) => setResult({ ...result, socialPost: e.target.value })} className="min-h-[120px]" />
                          </div>
                        )}
                        {templateId === 'email-campaign' && (
                          <div className="space-y-4">
                            <div>
                              <Label className="text-xs">Email Subject</Label>
                              <Input value={result.emailSubject} onChange={(e) => setResult({ ...result, emailSubject: e.target.value })} />
                            </div>
                            <div>
                              <Label className="text-xs">Email Body</Label>
                              <Textarea value={result.emailBody} onChange={(e) => setResult({ ...result, emailBody: e.target.value })} className="min-h-[120px]" />
                            </div>
                          </div>
                        )}
                        {templateId === 'ad-copy' && (
                          <div className="space-y-4">
                            <div>
                              <Label className="text-xs">Google Ad Headline</Label>
                              <Input value={result.googleAdHeadline} onChange={(e) => setResult({ ...result, googleAdHeadline: e.target.value })} />
                            </div>
                            <div>
                              <Label className="text-xs">Google Ad Description</Label>
                              <Textarea value={result.googleAdDescription} onChange={(e) => setResult({ ...result, googleAdDescription: e.target.value })} className="min-h-[80px]" />
                            </div>
                            <div>
                              <Label className="text-xs">Meta Primary Text</Label>
                              <Textarea value={result.metaAdPrimaryText} onChange={(e) => setResult({ ...result, metaAdPrimaryText: e.target.value })} className="min-h-[80px]" />
                            </div>
                            <div className="bg-slate-100 h-48 flex items-center justify-center text-slate-400 rounded">[Ad Image]</div>
                            <div className="bg-slate-50 p-2 border rounded">
                              <div>
                                <Label className="text-xs">Meta Ad Headline</Label>
                                <Input value={result.metaAdHeadline} onChange={(e) => setResult({ ...result, metaAdHeadline: e.target.value })} />
                              </div>
                              <div>
                                <Label className="text-xs">Meta Ad Description</Label>
                                <Input value={result.metaAdDescription} onChange={(e) => setResult({ ...result, metaAdDescription: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        )}
                        {templateId === 'product-launch' && (
                          <div className="space-y-2">
                            <div className="font-bold">Product Hunt Tagline</div>
                            <Textarea value={result.productHuntTagline} onChange={(e) => setResult({ ...result, productHuntTagline: e.target.value })} className="min-h-[80px]" />
                          </div>
                        )}
                        {/* Fallback for other templates */}
                        {!['social-suite', 'email-campaign', 'ad-copy', 'product-launch'].includes(templateId) && (
                          <div>
                            <Label className="text-xs">Content</Label>
                            <Textarea value={result.socialPost} onChange={(e) => setResult({ ...result, socialPost: e.target.value })} className="min-h-[120px]" />
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="justify-end pt-4">
                        <Button variant="ghost" size="sm" onClick={() => {
                          let text = '';
                          if (templateId === 'social-suite') text = result.socialPost;
                          else if (templateId === 'email-campaign') text = `${result.emailSubject}\n\n${result.emailBody}`;
                          else if (templateId === 'ad-copy') text = `${result.googleAdHeadline}\n${result.googleAdDescription}\n\n${result.metaAdPrimaryText}`;
                          else if (templateId === 'product-launch') text = result.productHuntTagline;
                          else text = result.socialPost;
                          handleCopy(text);
                        }}>
                          <Copy className="w-4 h-4 mr-2" /> Copy
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleExportAll({ templates: [templateId], result, name: `${formData.productName}-${templateId}` })}>
                          <Download className="w-4 h-4 mr-2" /> Export
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // 5. Workflow Selection Page
  if (step === 'workflow-selection') {
    const workflows = [
      { title: "Content Repurposing", description: "Turn a single blog post or video into a week's worth of social media posts, emails, and short scripts.", icon: <RefreshCw className="w-6 h-6 text-blue-500" /> },
      { title: "SEO Blog Post Builder", description: "Keyword Research → Outline Generation → Full Article Drafting → SEO Optimization.", icon: <FileText className="w-6 h-6 text-green-500" /> },
      { title: "Product Launch Package", description: "Generate Product Hunt tagline, press release, launch email sequence, and social announcement posts.", icon: <Rocket className="w-6 h-6 text-orange-500" /> },
      { title: "Email Drip Campaign", description: "Create a multi-step email sequence (Welcome Series, Nurture Sequence, Abandoned Cart).", icon: <Mail className="w-6 h-6 text-purple-500" /> },
      { title: "Ad Creative Variants", description: "Generate 50+ variations of Facebook/Google ad headlines and primary text for A/B testing.", icon: <Layout className="w-6 h-6 text-pink-500" /> },
      { title: "Webinar Promotion", description: "Create landing page copy, invitation emails, reminder emails, and social promo posts.", icon: <Video className="w-6 h-6 text-red-500" /> },
      { title: "Newsletter Creator", description: "Turn raw notes or curated links into a formatted, engaging weekly newsletter.", icon: <Mail className="w-6 h-6 text-indigo-500" /> },
      { title: "Case Study Generator", description: "Transform customer interview transcripts or bullet points into a structured success story.", icon: <Target className="w-6 h-6 text-teal-500" /> },
      { title: "Competitor Analysis", description: "Research a competitor's website/socials and generate a SWOT analysis or feature comparison table.", icon: <Search className="w-6 h-6 text-slate-500" /> },
      { title: "Social Media Calendar", description: "Generate 30 days of post ideas and captions based on a specific theme or content pillar.", icon: <MessageSquare className="w-6 h-6 text-blue-400" /> },
    ];

    return (
      <div 
        className="min-h-screen bg-slate-50 p-4 md:p-8"
        style={{
          "--primary": "221.2 83.2% 53.3%",
          "--primary-foreground": "210 40% 98%",
          "--ring": "221.2 83.2% 53.3%",
        } as React.CSSProperties}
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="w-full max-w-4xl mx-auto pt-8 px-4 mb-8">
            <StepProgressBar steps={onboardingSteps} currentStep={getCurrentStep()} />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Choose Your Workflow</h1>
              <p className="text-slate-500">Select a workflow to automate your next marketing task.</p>
            </div>
            <Button variant="outline" onClick={() => setStep('results')}>
              Back to Results
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((workflow, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-slate-200 hover:border-primary/50 group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-primary/10 transition-colors">
                      {workflow.icon}
                    </div>
                    {workflow.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {workflow.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full group-hover:bg-primary group-hover:text-white" variant="secondary">
                    Select Workflow <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 6. Publish Screen
  if (step === 'publish') {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="w-full max-w-4xl mx-auto pt-8 px-4 mb-8">
          <StepProgressBar steps={onboardingSteps} currentStep={getCurrentStep()} />
        </div>
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-2xl">Publish {selectedForPublish.length} Assets</CardTitle>
              <CardDescription>
                You are about to publish the selected assets. This action will save them to your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-semibold">Selected assets:</p>
              <ul className="list-disc list-inside bg-slate-100 p-4 rounded-md">
                {selectedForPublish.map(id => {
                  const template = allTemplates.find(t => t.id === id);
                  return <li key={id}>{template?.title || id}</li>;
                })}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep('results')}>Back to Results</Button>
              <Button onClick={() => {
                // Update the latest campaign with the published templates and current (possibly edited) result
                const latestCampaign = savedCampaigns[0];
                if (latestCampaign && result) {
                  const updatedCampaign = { ...latestCampaign, publishedTemplates: selectedForPublish, result };
                  const updatedCampaigns = [updatedCampaign, ...savedCampaigns.slice(1)];
                  setSavedCampaigns(updatedCampaigns);
                  try {
                    localStorage.setItem('savedCampaigns', JSON.stringify(updatedCampaigns));
                  } catch (e) {
                    // ignore
                  }
                }
                setStep('dashboard');
              }}>
                Confirm & Publish <Zap className="ml-2 w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // 7. Dashboard Screen
  if (step === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        {viewingCampaign && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setViewingCampaign(null)}>
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <CardHeader>
                <CardTitle>Viewing: {viewingCampaign.name}</CardTitle>
                <CardDescription>Showing {viewingCampaign.publishedTemplates?.length || 0} published assets.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {(viewingCampaign.publishedTemplates || []).map(templateId => {
                  const template = allTemplates.find(t => t.id === templateId);
                  if (!template) return null;
                  return (
                    <div key={templateId} className="border p-4 rounded-lg bg-slate-50">
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">{template.icon} {template.title}</h3>
                      {templateId === 'social-suite' && <div className="whitespace-pre-wrap font-sans text-slate-700">{viewingCampaign.result.socialPost}</div>}
                      {templateId === 'email-campaign' && <div className="space-y-2"><div><strong>Subject:</strong> {viewingCampaign.result.emailSubject}</div><div className="whitespace-pre-wrap font-sans text-slate-700">{viewingCampaign.result.emailBody}</div></div>}
                      {/* Add other template types here */}
                      {!['social-suite', 'email-campaign'].includes(templateId) && <div className="whitespace-pre-wrap font-sans text-slate-700">{viewingCampaign.result.socialPost}</div>}
                    </div>
                  );
                })}
                {(!viewingCampaign.publishedTemplates || viewingCampaign.publishedTemplates.length === 0) && (
                  <p className="text-slate-500 text-center">No assets have been published for this campaign yet.</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" onClick={() => setViewingCampaign(null)}>Close</Button>
              </CardFooter>
            </Card>
          </div>
        )}

        <div className="w-full max-w-4xl mx-auto pt-8 px-4 mb-8">
          <StepProgressBar steps={onboardingSteps} currentStep={getCurrentStep()} />
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900">Campaign Dashboard</h1>
            <Button onClick={handleRestart}>
              <Plus className="w-4 h-4 mr-2" /> Create New Campaign
            </Button>
          </div>
          <div className="space-y-4">
            {savedCampaigns.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold text-slate-700">No Saved Campaigns Yet</h3>
                <p className="text-slate-500 mt-2">Start by creating a new campaign.</p>
              </div>
            )}
            {savedCampaigns.map(s => (
              <Card key={s.id} className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {s.name}
                    <Badge variant={(s.publishedTemplates?.length || 0) > 1 ? "default" : "secondary"}>
                      {s.publishedTemplates?.length || 0} Published Asset(s)
                    </Badge>
                  </CardTitle>
                  <CardDescription>{new Date(s.date).toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    Based on product: <strong>{s.formData.productName}</strong>. Generated assets for {s.templates.join(', ')}.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => setViewingCampaign(s)}>
                    <Eye className="w-4 h-4 mr-2" /> View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleExportAll(s)}>
                    <Download className="w-4 h-4 mr-2" /> Export
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
