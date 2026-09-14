import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Sparkles,
  Camera,
  Upload,
  RefreshCw,
  Sliders,
  Eye,
  ShoppingBag,
  Send,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Split,
  Layers,
  ArrowRight,
  HelpCircle,
  Maximize2,
  Download,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Product,
  FaceShape,
  FaceAnalysisResult,
  AdvisorRecommendation,
  TryOnAdjustment,
  FacialLandmarks,
} from '../types';
import { getCleanFrameCanvas, renderTryOnComposite } from '../utils/tryOnCompositor';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, variantId?: string) => void;
  whatsappNumber: string;
}

type TabMode = 'advisor' | 'tryon' | 'chat';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendedProducts?: Product[];
}

const DEFAULT_LANDMARKS: FacialLandmarks = {
  leftEye: { x: 42.0, y: 44.0 },
  rightEye: { x: 58.0, y: 44.0 },
  noseBridge: { x: 50.0, y: 44.5 },
  faceWidthPct: 46.0,
  tiltAngleDeg: 0.0,
};

const DEFAULT_ADJUSTMENT: TryOnAdjustment = {
  scale: 1.0,
  xOffset: 0,
  yOffset: 0,
  rotation: 0,
};

export default function AIAssistantModal({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onAddToCart,
  whatsappNumber,
}: AIAssistantModalProps) {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<TabMode>('advisor');
  const [sessionPhoto, setSessionPhoto] = useState<string | null>(null);
  const [analyzingPhoto, setAnalyzingPhoto] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<FaceAnalysisResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Preference Filters
  const [selectedStyle, setSelectedStyle] = useState<string>('Classic');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [recommendations, setRecommendations] = useState<AdvisorRecommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);

  // Virtual Try-On States
  const [activeTryOnProduct, setActiveTryOnProduct] = useState<Product | null>(null);
  const [tryOnAdjustment, setTryOnAdjustment] = useState<TryOnAdjustment>(DEFAULT_ADJUSTMENT);
  const [showAdjustments, setShowAdjustments] = useState<boolean>(false);
  const [comparisonMode, setComparisonMode] = useState<'slider' | 'toggle' | 'split'>('slider');
  const [splitSliderPos, setSplitSliderPos] = useState<number>(50);
  const [showOriginalOnly, setShowOriginalOnly] = useState<boolean>(false);
  const [compareSecondaryProduct, setCompareSecondaryProduct] = useState<Product | null>(null);
  const [isComparingDual, setIsComparingDual] = useState<boolean>(false);

  // Chatbot Assistant States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "“Let’s find the frame that fits your style.”\n\nHi! I am the DNYL AI Style Advisor. Upload a photo for instant facial geometry analysis and virtual try-on, or tell me what style you're looking for.",
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const tryOnCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const secondaryCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const userPhotoImgRef = useRef<HTMLImageElement | null>(null);
  const splitContainerRef = useRef<HTMLDivElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Initialize recommendations when product list or preferences change
  const fetchRecommendations = useCallback(
    async (shape: FaceShape = 'Oval', style: string = selectedStyle, color: string = selectedColor) => {
      setLoadingRecommendations(true);
      try {
        const res = await fetch('/api/advisor/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            faceShape: shape,
            stylePreference: style,
            colorPreference: color,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.recommendations && data.recommendations.length > 0) {
            setRecommendations(data.recommendations);
            if (!activeTryOnProduct) {
              setActiveTryOnProduct(data.recommendations[0].product);
            }
            return;
          }
        }
      } catch (err) {
        console.warn('Fallback local recommendations used:', err);
      }

      // Local fallback recommendations
      const fallbackPicks = products.slice(0, 3).map((p, idx) => ({
        product: p,
        suitability: (idx === 0 ? 'STRONG MATCH' : 'STYLE ALIGNED') as 'STRONG MATCH' | 'STYLE ALIGNED',
        explanation: `Looks like a strong match. Recommended because this frame provides a balanced look with your ${shape.toLowerCase()} facial proportions and complements your ${style.toLowerCase()} aesthetic.`,
      }));
      setRecommendations(fallbackPicks);
      if (!activeTryOnProduct && fallbackPicks.length > 0) {
        setActiveTryOnProduct(fallbackPicks[0].product);
      }
      setLoadingRecommendations(false);
    },
    [products, selectedStyle, selectedColor, activeTryOnProduct]
  );

  useEffect(() => {
    if (isOpen && recommendations.length === 0) {
      fetchRecommendations('Oval', selectedStyle, selectedColor);
    }
  }, [isOpen, fetchRecommendations, recommendations.length, selectedStyle, selectedColor]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCameraActive) {
          stopCamera();
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isCameraActive, onClose]);

  // Stop camera when unmounting or closing
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen]);

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera access unavailable. You can upload a photo from your device.');
      setIsCameraActive(false);
    }
  };

  // Capture Snapshot from Camera
  const captureCameraSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally for natural mirror feel
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Photo = canvas.toDataURL('image/jpeg', 0.92);
    stopCamera();
    processPhoto(base64Photo);
  };

  // Process uploaded or captured photo
  const processPhoto = async (base64Photo: string) => {
    setSessionPhoto(base64Photo);
    setAnalyzingPhoto(true);

    // Load photo into memory image reference for fast canvas compositing
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = base64Photo;
    img.onload = () => {
      userPhotoImgRef.current = img;
    };

    try {
      const res = await fetch('/api/advisor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Photo }),
      });

      if (res.ok) {
        const result: FaceAnalysisResult = await res.json();
        setAnalysisResult(result);
        fetchRecommendations(result.faceShape, selectedStyle, selectedColor);
      } else {
        throw new Error('Analysis endpoint returned non-200');
      }
    } catch (err) {
      console.warn('Photo analysis fallback used:', err);
      const fallback: FaceAnalysisResult = {
        faceShape: 'Oval',
        faceProportions: 'Harmonious length-to-width balance with classic cheekbone symmetry.',
        jawline: 'Gently curved, medium width.',
        cheekForeheadRatio: 'Slightly broader cheekbones tapering smoothly to chin.',
        recommendedFrameShapes: ['Square', 'Wayfarer', 'Aviator'],
        recommendedFrameProportions: 'Medium to wide frame profiles (52mm - 56mm).',
        styleTip: 'Geometric and square silhouettes provide structured architectural balance.',
        landmarks: DEFAULT_LANDMARKS,
        isClearFace: true,
        angleFeedback: 'Clear front-facing alignment.',
        disclaimer:
          'Face shape classification is an approximate styling guide to assist with eyewear selection, not a biometric or identity scan.',
      };
      setAnalysisResult(fallback);
      fetchRecommendations('Oval', selectedStyle, selectedColor);
    } finally {
      setAnalyzingPhoto(false);
    }
  };

  // File Input Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check format
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      alert('Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        processPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Render Virtual Try-On Canvas
  const updateTryOnCanvas = useCallback(async () => {
    if (!tryOnCanvasRef.current || !sessionPhoto || !activeTryOnProduct) return;

    // Ensure user photo image is loaded
    if (!userPhotoImgRef.current) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = sessionPhoto;
      await new Promise((res) => {
        img.onload = () => {
          userPhotoImgRef.current = img;
          res(true);
        };
        img.onerror = () => res(false);
      });
    }

    const userImg = userPhotoImgRef.current;
    if (!userImg) return;

    // Get clean transparent eyewear canvas
    const frameImgUrl = activeTryOnProduct.images[0]?.url || '';
    const cleanFrame = await getCleanFrameCanvas(frameImgUrl);

    const landmarks = analysisResult?.landmarks || DEFAULT_LANDMARKS;

    // Primary Canvas
    await renderTryOnComposite({
      destCanvas: tryOnCanvasRef.current,
      userPhotoImg: userImg,
      frameCanvas: cleanFrame,
      landmarks,
      adjustment: tryOnAdjustment,
    });

    // Secondary Canvas for dual comparison if active
    if (isComparingDual && secondaryCanvasRef.current && compareSecondaryProduct) {
      const secFrameImgUrl = compareSecondaryProduct.images[0]?.url || '';
      const secCleanFrame = await getCleanFrameCanvas(secFrameImgUrl);
      await renderTryOnComposite({
        destCanvas: secondaryCanvasRef.current,
        userPhotoImg: userImg,
        frameCanvas: secCleanFrame,
        landmarks,
        adjustment: tryOnAdjustment,
      });
    }
  }, [
    sessionPhoto,
    activeTryOnProduct,
    analysisResult,
    tryOnAdjustment,
    isComparingDual,
    compareSecondaryProduct,
  ]);

  useEffect(() => {
    if (activeTab === 'tryon') {
      updateTryOnCanvas();
    }
  }, [activeTab, updateTryOnCanvas, activeTryOnProduct, tryOnAdjustment, isComparingDual, compareSecondaryProduct]);

  // Handle Dragging Split Slider
  const handleSplitMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!splitContainerRef.current) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offsetX = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (offsetX / rect.width) * 100));
    setSplitSliderPos(percentage);
  };

  // Chat message submission
  const handleSendChatMessage = async (text: string) => {
    if (!text.trim() || chatLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const history = [...chatMessages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Append session context
      if (analysisResult) {
        history[0].content += `\n[Context: User face shape is ${analysisResult.faceShape}. Style preference: ${selectedStyle}]`;
      }

      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error('Chatbot request failed');
      const data = await res.json();
      const botReply = data.reply || "I'm here to help you select the ideal DNYL frame.";

      // Parse product handles
      const regex = /\[PRODUCT:([a-zA-Z0-9-_]+)\]/g;
      const matchedProds: Product[] = [];
      let match;
      while ((match = regex.exec(botReply)) !== null) {
        const found = products.find((p) => p.handle === match[1]);
        if (found && !matchedProds.some((p) => p.id === found.id)) {
          matchedProds.push(found);
        }
      }

      const cleanText = botReply.replace(regex, '').trim();

      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: cleanText,
          recommendedProducts: matchedProds.length > 0 ? matchedProds : undefined,
        },
      ]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            "I'm momentarily disconnected from the styling database. You can try our live virtual try-on or connect with our Karachi studio team on WhatsApp for immediate assistance.",
        },
      ]);
    } finally {
      setChatLoading(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Trigger Try-On of specific product
  const startTryOn = (product: Product) => {
    setActiveTryOnProduct(product);
    setActiveTab('tryon');
  };

  // Download high-res try-on composite
  const downloadTryOnPhoto = () => {
    if (!tryOnCanvasRef.current || !activeTryOnProduct) return;
    const link = document.createElement('a');
    link.download = `DNYL-TryOn-${activeTryOnProduct.handle}.png`;
    link.href = tryOnCanvasRef.current.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="ai-advisor-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden select-none"
      >
        <motion.div
          id="ai-advisor-modal"
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full h-full sm:h-[90vh] sm:max-h-[820px] sm:max-w-4xl bg-zinc-950 text-white sm:rounded-2xl border border-zinc-800 shadow-[0_24px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
        >
          {/* Top Header Bar */}
          <div className="bg-black/90 border-b border-zinc-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between z-20 shrink-0">
            <div className="flex items-center space-x-3.5">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs sm:text-sm font-black tracking-[0.2em] uppercase text-white font-sans">
                    DNYL AI Style Advisor
                  </h2>
                  <span className="hidden xs:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs bg-emerald-950/60 border border-emerald-800/50 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[10px] tracking-wider text-zinc-400 font-sans font-medium">
                  Your personal eyewear recommendation assistant
                </p>
              </div>
            </div>

            {/* Header Tabs & Close */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
                <button
                  onClick={() => setActiveTab('advisor')}
                  className={`px-3 py-1 rounded-md transition-all font-semibold tracking-wider text-[10px] uppercase ${
                    activeTab === 'advisor'
                      ? 'bg-white text-black shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Style Advisor
                </button>
                <button
                  onClick={() => setActiveTab('tryon')}
                  className={`px-3 py-1 rounded-md transition-all font-semibold tracking-wider text-[10px] uppercase flex items-center gap-1.5 ${
                    activeTab === 'tryon'
                      ? 'bg-white text-black shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Virtual Try-On
                  {sessionPhoto && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-3 py-1 rounded-md transition-all font-semibold tracking-wider text-[10px] uppercase ${
                    activeTab === 'chat'
                      ? 'bg-white text-black shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Chat Stylist
                </button>
              </div>

              <button
                id="close-ai-advisor-btn"
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition-colors focus:outline-none"
                aria-label="Close DNYL AI Advisor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Bottom Navigation Strip */}
          <div className="sm:hidden flex bg-zinc-900 border-b border-zinc-800 px-3 py-1.5 text-xs justify-around shrink-0">
            <button
              onClick={() => setActiveTab('advisor')}
              className={`py-1 px-2.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                activeTab === 'advisor' ? 'bg-white text-black' : 'text-zinc-400'
              }`}
            >
              Style Advisor
            </button>
            <button
              onClick={() => setActiveTab('tryon')}
              className={`py-1 px-2.5 rounded text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 ${
                activeTab === 'tryon' ? 'bg-white text-black' : 'text-zinc-400'
              }`}
            >
              Virtual Try-On
              {sessionPhoto && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-1 px-2.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                activeTab === 'chat' ? 'bg-white text-black' : 'text-zinc-400'
              }`}
            >
              Chat Stylist
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Main Modal Body */}
          <div className="flex-1 overflow-y-auto bg-zinc-950 p-4 sm:p-6 text-zinc-200">
            {/* 1. ADVISOR VIEW */}
            {activeTab === 'advisor' && (
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Greeting Hero Card */}
                <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-linear-to-b from-zinc-900/90 to-zinc-950 p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold tracking-[0.25em] text-emerald-400 uppercase font-sans">
                        FIND YOUR FRAME
                      </span>
                      <h3 className="text-lg sm:text-xl font-black tracking-tight text-white mt-1 font-sans">
                        “Let’s find the frame that fits your style.”
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">
                        Hi! I can help you find DNYL frames that complement your facial features, proportions, and personal style.
                      </p>
                    </div>

                    {/* Quick Photo Actions */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-lg text-xs font-bold tracking-wider uppercase transition-all shadow-md"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Photo
                      </button>
                      <button
                        onClick={startCamera}
                        className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold tracking-wider uppercase border border-zinc-700 transition-all"
                      >
                        <Camera className="w-4 h-4 text-emerald-400" />
                        Take Photo
                      </button>
                    </div>
                  </div>

                  {/* Privacy Disclosure Notice */}
                  <div className="mt-4 pt-4 border-t border-zinc-800/60 flex items-start gap-2.5 text-[10px] text-zinc-400 leading-relaxed">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Privacy Assurance:</strong> Your photo is analyzed in real time solely to calculate facial geometry and render your DNYL virtual try-on. We never store your photo permanently or share it.
                    </span>
                  </div>
                </div>

                {/* Camera Viewfinder Overlay if camera is active */}
                {isCameraActive && (
                  <div className="relative rounded-xl border border-zinc-700 bg-black overflow-hidden p-4">
                    <div className="relative aspect-4/3 max-w-md mx-auto bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center">
                      <video
                        ref={videoRef}
                        playsInline
                        muted
                        className="w-full h-full object-cover scale-x-[-1]"
                      />

                      {/* Optical Face Alignment Oval Guide */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-48 h-64 border-2 border-dashed border-emerald-400/70 rounded-[50%] flex items-center justify-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-black/60 px-2 py-0.5 rounded">
                            Center Face
                          </span>
                        </div>
                      </div>
                    </div>

                    {cameraError && (
                      <p className="text-xs text-rose-400 text-center mt-2">{cameraError}</p>
                    )}

                    <div className="flex items-center justify-center gap-3 mt-4">
                      <button
                        onClick={captureCameraSnapshot}
                        className="px-6 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-lg"
                      >
                        <Camera className="w-4 h-4" />
                        Capture Frame
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Photo Scanning Loading State */}
                {analyzingPhoto && (
                  <div className="p-8 text-center rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3">
                    <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                      Analyzing Facial Geometry...
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                      Measuring temple width, eye horizon, and cheek contours to calibrate accurate DNYL frame matches.
                    </p>
                  </div>
                )}

                {/* Analysis Breakdown (Visible once photo is analyzed) */}
                {analysisResult && !analyzingPhoto && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">
                          Detected Face Shape:
                        </span>
                        <span className="px-2.5 py-1 rounded bg-white text-black font-black text-xs uppercase tracking-widest">
                          {analysisResult.faceShape}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                        <span>Frontal View:</span>
                        <span className="text-emerald-400 font-semibold">{analysisResult.angleFeedback}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-1">
                          Proportion Insight
                        </span>
                        <p className="text-zinc-300 leading-relaxed">{analysisResult.faceProportions}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-1">
                          Stylist Optical Tip
                        </span>
                        <p className="text-zinc-300 leading-relaxed">{analysisResult.styleTip}</p>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mr-1">
                        Flattering Shapes:
                      </span>
                      {analysisResult.recommendedFrameShapes.map((shape) => (
                        <span
                          key={shape}
                          className="px-2 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-200 text-[10px] font-semibold uppercase tracking-wider"
                        >
                          {shape}
                        </span>
                      ))}
                    </div>

                    <p className="text-[9px] text-zinc-500 italic pt-1 border-t border-zinc-800/60">
                      {analysisResult.disclaimer}
                    </p>
                  </div>
                )}

                {/* Interactive Style & Color Preferences Customizer */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-2">
                      What style are you looking for?
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['Minimal', 'Classic', 'Bold', 'Streetwear', 'Luxury', 'Everyday', 'Sporty'].map((style) => (
                        <button
                          key={style}
                          onClick={() => {
                            setSelectedStyle(style);
                            fetchRecommendations(analysisResult?.faceShape || 'Oval', style, selectedColor);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
                            selectedStyle === style
                              ? 'bg-white text-black font-bold'
                              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-2">
                      Preferred Colorway
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'All Colors', val: '' },
                        { label: 'Obsidian Black', val: 'Black' },
                        { label: 'Titanium Gold', val: 'Gold' },
                        { label: 'Matte Silver / Blue', val: 'Silver' },
                        { label: 'Havana Tortoise', val: 'Tortoise' },
                        { label: 'Smoky Crystal', val: 'Crystal' },
                      ].map((col) => (
                        <button
                          key={col.label}
                          onClick={() => {
                            setSelectedColor(col.val);
                            fetchRecommendations(analysisResult?.faceShape || 'Oval', selectedStyle, col.val);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
                            selectedColor === col.val
                              ? 'bg-emerald-400 text-black font-bold'
                              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white'
                          }`}
                        >
                          {col.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations List: "Your DNYL Picks" */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-white">
                        Your DNYL Picks (3 Top Matches)
                      </h3>
                      <p className="text-[11px] text-zinc-400">
                        Tailored directly to your facial proportions and preferred aesthetic.
                      </p>
                    </div>
                    {loadingRecommendations && (
                      <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendations.map((rec, idx) => {
                      const prod = rec.product;
                      const price = parseInt(prod.priceRange.minVariantPrice.amount, 10);
                      const isTopMatch = idx === 0;

                      return (
                        <div
                          key={prod.id}
                          className={`relative rounded-xl overflow-hidden border p-4 flex flex-col justify-between transition-all duration-300 ${
                            isTopMatch
                              ? 'bg-zinc-900/90 border-emerald-500/50 shadow-[0_4px_24px_rgba(16,185,129,0.1)]'
                              : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          {/* Suitability Badge */}
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[8.5px] font-extrabold uppercase tracking-widest ${
                                isTopMatch
                                  ? 'bg-emerald-400 text-black'
                                  : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                              }`}
                            >
                              {rec.suitability}
                            </span>
                            <span className="text-[10px] font-bold text-zinc-400">
                              Rs. {price.toLocaleString()}
                            </span>
                          </div>

                          {/* Product Image */}
                          <div
                            onClick={() => {
                              onSelectProduct(prod);
                              onClose();
                            }}
                            className="aspect-4/3 bg-zinc-950 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center group mb-3 relative"
                          >
                            <img
                              src={prod.images[0]?.url}
                              alt={prod.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>

                          {/* Title & Justification */}
                          <div className="flex-1 mb-4">
                            <h4
                              onClick={() => {
                                onSelectProduct(prod);
                                onClose();
                              }}
                              className="text-xs font-black uppercase tracking-wider text-white hover:text-zinc-300 cursor-pointer line-clamp-1"
                            >
                              {prod.title}
                            </h4>
                            <p className="text-[10.5px] text-zinc-400 mt-1.5 leading-relaxed line-clamp-3">
                              {rec.explanation}
                            </p>
                          </div>

                          {/* CTAs: Try It On / View Details */}
                          <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800/80">
                            <button
                              onClick={() => startTryOn(prod)}
                              className="w-full py-2 px-3 bg-white text-black hover:bg-zinc-200 rounded-lg text-[11px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-black" />
                              Try It On
                            </button>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  onSelectProduct(prod);
                                  onClose();
                                }}
                                className="flex-1 py-1.5 border border-zinc-800 hover:border-zinc-600 rounded text-[10px] font-bold uppercase tracking-wider text-zinc-300"
                              >
                                View Specs
                              </button>
                              <button
                                onClick={() => onAddToCart(prod, prod.variants[0]?.id)}
                                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded border border-zinc-700"
                                title="Add to Cart"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 2. VIRTUAL TRY-ON STUDIO VIEW */}
            {activeTab === 'tryon' && (
              <div className="max-w-4xl mx-auto space-y-6">
                {!sessionPhoto ? (
                  /* No Photo Prompt in Try-On Tab */
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 text-center max-w-lg mx-auto space-y-4 my-8">
                    <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto text-emerald-400">
                      <Camera className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-black uppercase tracking-wider text-white font-sans">
                      Upload Your Photo for Virtual Try-On
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Experience DNYL frames directly on your own face with realistic optical scale, polarized reflections, and accurate nose bridge alignment.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Photo
                      </button>
                      <button
                        onClick={startCamera}
                        className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider border border-zinc-700 flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4 text-emerald-400" />
                        Take Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Active Virtual Try-On Canvas Stage */
                  <div className="space-y-4">
                    {/* Stage Header Banner */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/80 px-4 py-2.5 rounded-lg border border-zinc-800">
                      <div>
                        <span className="text-[9.5px] uppercase tracking-widest text-emerald-400 font-bold">
                          DNYL VIRTUAL TRY-ON STUDIO
                        </span>
                        <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-white">
                          “Here’s how this DNYL frame could look on you.”
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Adjust Fit Toggle */}
                        <button
                          onClick={() => setShowAdjustments(!showAdjustments)}
                          className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                            showAdjustments
                              ? 'bg-emerald-400 text-black'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          }`}
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          Fine-Tune Fit
                        </button>

                        {/* Compare Dual Frames Toggle */}
                        <button
                          onClick={() => {
                            setIsComparingDual(!isComparingDual);
                            if (!compareSecondaryProduct && products.length > 1) {
                              const other = products.find((p) => p.id !== activeTryOnProduct?.id) || products[1];
                              setCompareSecondaryProduct(other);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                            isComparingDual
                              ? 'bg-white text-black'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5" />
                          Compare 2 Frames
                        </button>

                        {/* Retake Photo Button */}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                          title="Change Photo"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Calibration Adjustment Sliders Drawer */}
                    {showAdjustments && (
                      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3 text-xs">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                          <span className="font-bold uppercase tracking-wider text-zinc-300 text-[11px]">
                            Micro-Calibrate Optical Fit
                          </span>
                          <button
                            onClick={() => setTryOnAdjustment(DEFAULT_ADJUSTMENT)}
                            className="text-[10px] text-zinc-400 hover:text-white uppercase font-bold flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Reset Default
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                              Width / Scale ({Math.round(tryOnAdjustment.scale * 100)}%)
                            </label>
                            <input
                              type="range"
                              min="0.75"
                              max="1.35"
                              step="0.01"
                              value={tryOnAdjustment.scale}
                              onChange={(e) =>
                                setTryOnAdjustment((prev) => ({
                                  ...prev,
                                  scale: parseFloat(e.target.value),
                                }))
                              }
                              className="w-full accent-emerald-400"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                              Bridge Height ({tryOnAdjustment.yOffset}px)
                            </label>
                            <input
                              type="range"
                              min="-10"
                              max="10"
                              step="0.5"
                              value={tryOnAdjustment.yOffset}
                              onChange={(e) =>
                                setTryOnAdjustment((prev) => ({
                                  ...prev,
                                  yOffset: parseFloat(e.target.value),
                                }))
                              }
                              className="w-full accent-emerald-400"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                              Center Alignment ({tryOnAdjustment.xOffset}px)
                            </label>
                            <input
                              type="range"
                              min="-8"
                              max="8"
                              step="0.5"
                              value={tryOnAdjustment.xOffset}
                              onChange={(e) =>
                                setTryOnAdjustment((prev) => ({
                                  ...prev,
                                  xOffset: parseFloat(e.target.value),
                                }))
                              }
                              className="w-full accent-emerald-400"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                              Tilt Angle ({tryOnAdjustment.rotation}°)
                            </label>
                            <input
                              type="range"
                              min="-12"
                              max="12"
                              step="0.5"
                              value={tryOnAdjustment.rotation}
                              onChange={(e) =>
                                setTryOnAdjustment((prev) => ({
                                  ...prev,
                                  rotation: parseFloat(e.target.value),
                                }))
                              }
                              className="w-full accent-emerald-400"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dual Comparison or Single Stage */}
                    {isComparingDual ? (
                      /* Side-by-Side Dual Frame Comparison */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Frame 1 */}
                        <div className="relative rounded-xl border border-zinc-800 bg-black overflow-hidden flex flex-col">
                          <div className="p-2.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-xs">
                            <span className="font-extrabold uppercase text-white truncate max-w-[200px]">
                              1. {activeTryOnProduct?.title}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400">
                              Rs. {parseInt(activeTryOnProduct?.priceRange.minVariantPrice.amount || '0', 10).toLocaleString()}
                            </span>
                          </div>
                          <div className="relative aspect-4/3 flex items-center justify-center bg-zinc-950">
                            <canvas
                              ref={tryOnCanvasRef}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </div>

                        {/* Frame 2 */}
                        <div className="relative rounded-xl border border-zinc-800 bg-black overflow-hidden flex flex-col">
                          <div className="p-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-xs">
                            <select
                              value={compareSecondaryProduct?.id || ''}
                              onChange={(e) => {
                                const found = products.find((p) => p.id === e.target.value);
                                if (found) setCompareSecondaryProduct(found);
                              }}
                              className="bg-zinc-800 text-white font-extrabold text-[11px] uppercase tracking-wider rounded px-2 py-1 border border-zinc-700 focus:outline-none"
                            >
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  2. {p.title}
                                </option>
                              ))}
                            </select>
                            <span className="text-[10px] font-bold text-emerald-400">
                              Rs. {parseInt(compareSecondaryProduct?.priceRange.minVariantPrice.amount || '0', 10).toLocaleString()}
                            </span>
                          </div>
                          <div className="relative aspect-4/3 flex items-center justify-center bg-zinc-950">
                            <canvas
                              ref={secondaryCanvasRef}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Single Stage with Split-Screen Before/After Slider */
                      <div className="relative rounded-xl border border-zinc-800 bg-black overflow-hidden shadow-2xl">
                        <div
                          ref={splitContainerRef}
                          onMouseMove={handleSplitMouseMove}
                          onTouchMove={handleSplitMouseMove}
                          className="relative aspect-4/3 sm:aspect-16/10 max-h-[460px] w-full mx-auto flex items-center justify-center bg-zinc-950 cursor-ew-resize overflow-hidden"
                        >
                          {/* Layer 1: Try-On Composite Canvas */}
                          <canvas
                            ref={tryOnCanvasRef}
                            className="max-w-full max-h-full object-contain"
                          />

                          {/* Layer 2: Original User Photo (Clipped for Before/After Slider) */}
                          <div
                            style={{
                              clipPath: showOriginalOnly
                                ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                                : `polygon(0 0, ${splitSliderPos}% 0, ${splitSliderPos}% 100%, 0 100%)`,
                            }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-[clip-path] duration-75"
                          >
                            <img
                              src={sessionPhoto}
                              alt="Original User Photo"
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>

                          {/* Vertical Divider Handle */}
                          {!showOriginalOnly && (
                            <div
                              style={{ left: `${splitSliderPos}%` }}
                              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] pointer-events-none flex items-center justify-center"
                            >
                              <div className="w-7 h-7 rounded-full bg-white text-black shadow-lg flex items-center justify-center text-[9px] font-black uppercase tracking-tighter">
                                ↔
                              </div>
                            </div>
                          )}

                          {/* Labels */}
                          <span className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm border border-zinc-700 text-white rounded text-[9px] font-extrabold uppercase tracking-widest pointer-events-none">
                            Original Photo
                          </span>
                          <span className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm border border-emerald-500/60 text-emerald-400 rounded text-[9px] font-extrabold uppercase tracking-widest pointer-events-none">
                            DNYL Try-On
                          </span>

                          {/* Quick Hold to View Original Button */}
                          <button
                            onMouseDown={() => setShowOriginalOnly(true)}
                            onMouseUp={() => setShowOriginalOnly(false)}
                            onTouchStart={() => setShowOriginalOnly(true)}
                            onTouchEnd={() => setShowOriginalOnly(false)}
                            className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-lg border border-zinc-700 backdrop-blur-md transition-colors"
                          >
                            Hold For Original
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Active Selected Product Information Strip & Actions */}
                    {activeTryOnProduct && (
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black uppercase tracking-wider text-white">
                              {activeTryOnProduct.title}
                            </h4>
                            <span className="text-xs font-bold text-emerald-400">
                              Rs. {parseInt(activeTryOnProduct.priceRange.minVariantPrice.amount, 10).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                            {activeTryOnProduct.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={downloadTryOnPhoto}
                            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-bold uppercase tracking-wider border border-zinc-700 flex items-center gap-1.5"
                            title="Save Look"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Save Look
                          </button>
                          <button
                            onClick={() => {
                              onSelectProduct(activeTryOnProduct);
                              onClose();
                            }}
                            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-bold uppercase tracking-wider border border-zinc-700"
                          >
                            View Specs
                          </button>
                          <button
                            onClick={() => onAddToCart(activeTryOnProduct, activeTryOnProduct.variants[0]?.id)}
                            className="px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 1-Click Frame Switcher Carousel */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
                          Try Another Frame (1-Click Switch)
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          No need to re-upload photo
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                        {products.map((prod) => {
                          const isSelected = activeTryOnProduct?.id === prod.id;
                          const price = parseInt(prod.priceRange.minVariantPrice.amount, 10);

                          return (
                            <button
                              key={prod.id}
                              onClick={() => {
                                setActiveTryOnProduct(prod);
                              }}
                              className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                                isSelected
                                  ? 'bg-zinc-800/90 border-emerald-400 ring-1 ring-emerald-400 shadow-md'
                                  : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                              }`}
                            >
                              <div className="aspect-4/3 w-full bg-zinc-950 rounded-md overflow-hidden flex items-center justify-center mb-1.5">
                                <img
                                  src={prod.images[0]?.url}
                                  alt={prod.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-contain p-1"
                                />
                              </div>
                              <div>
                                <h5 className="text-[10px] font-black uppercase tracking-wider text-white truncate">
                                  {prod.title.replace('DNYL ', '')}
                                </h5>
                                <span className="text-[9px] font-bold text-zinc-400">
                                  Rs. {price.toLocaleString()}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. CONVERSATIONAL CHATBOT VIEW */}
            {activeTab === 'chat' && (
              <div className="max-w-2xl mx-auto flex flex-col h-[520px] bg-zinc-900/70 border border-zinc-800 rounded-xl overflow-hidden">
                {/* Chat Message Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex items-start max-w-[85%] space-x-2.5">
                        {m.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-full bg-black border border-zinc-700 text-white flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                            DN
                          </div>
                        )}

                        <div className="space-y-2">
                          <div
                            className={`p-3.5 text-xs leading-relaxed tracking-wide rounded-2xl ${
                              m.role === 'user'
                                ? 'bg-white text-black font-medium'
                                : 'bg-zinc-950 text-zinc-200 border border-zinc-800'
                            }`}
                          >
                            <p className="whitespace-pre-line">{m.content}</p>
                          </div>

                          {/* Render Inline Product Recommendation Cards if present */}
                          {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                            <div className="space-y-2 pt-1">
                              {m.recommendedProducts.map((p) => {
                                const price = parseInt(p.priceRange.minVariantPrice.amount, 10);
                                return (
                                  <div
                                    key={p.id}
                                    className="bg-black border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between gap-3 shadow-md"
                                  >
                                    <div
                                      onClick={() => {
                                        onSelectProduct(p);
                                        onClose();
                                      }}
                                      className="flex items-center gap-2.5 cursor-pointer flex-1"
                                    >
                                      <img
                                        src={p.images[0]?.url}
                                        alt={p.title}
                                        referrerPolicy="no-referrer"
                                        className="w-12 h-12 object-contain bg-zinc-900 rounded p-1"
                                      />
                                      <div>
                                        <h5 className="text-[11px] font-extrabold uppercase text-white tracking-wider line-clamp-1">
                                          {p.title}
                                        </h5>
                                        <p className="text-[10px] font-bold text-zinc-400">
                                          Rs. {price.toLocaleString()}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => startTryOn(p)}
                                        className="px-2.5 py-1.5 bg-white text-black hover:bg-zinc-200 rounded text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1"
                                      >
                                        <Sparkles className="w-3 h-3" />
                                        Try On
                                      </button>
                                      <button
                                        onClick={() => onAddToCart(p, p.variants[0]?.id)}
                                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded border border-zinc-700"
                                      >
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {m.role === 'user' && (
                          <div className="w-7 h-7 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                            YOU
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {chatLoading && (
                    <div className="flex items-center space-x-2 text-zinc-400 text-xs py-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-200" />
                      <span className="text-[10px] uppercase tracking-wider font-semibold ml-1">
                        DNYL Stylist is thinking...
                      </span>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Quick Interactive Prompt Chips */}
                <div className="px-3 py-2 border-t border-zinc-800/80 bg-zinc-950 flex items-center gap-2 overflow-x-auto select-none">
                  {[
                    'Which one looks best for me?',
                    'Show me something more minimal.',
                    'I want a polarized black frame.',
                    'Do you offer Cash on Delivery?',
                    'Karachi delivery timing?',
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSendChatMessage(chip)}
                      className="shrink-0 text-[10px] font-semibold tracking-wider uppercase px-3 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-full text-zinc-300 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Chat Input Field */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChatMessage(chatInput);
                  }}
                  className="p-3 bg-black border-t border-zinc-800 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask DNYL Style Advisor..."
                    className="flex-1 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600 uppercase tracking-wide font-sans"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || chatLoading}
                    className="p-2.5 bg-white text-black hover:bg-zinc-200 rounded-lg disabled:opacity-40 transition-colors"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
