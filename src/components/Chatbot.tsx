import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, ShoppingBag, Eye, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface ChatbotProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, variantId?: string) => void;
  whatsappNumber: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: Product[]; // Inline product recommendations parsed
}

export default function Chatbot({
  products,
  onSelectProduct,
  onAddToCart,
  whatsappNumber,
}: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi 👋 I'm the DNYL Style Assistant. Looking for your next premium pair of sunglasses?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Parse custom format [PRODUCT:handle] inside bot text replies
  const parseProductsInText = (text: string): { cleanText: string; recommended: Product[] } => {
    const regex = /\[PRODUCT:([a-zA-Z0-9-_]+)\]/g;
    const recommended: Product[] = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      const handle = match[1];
      const matchedProd = products.find((p) => p.handle === handle);
      if (matchedProd && !recommended.some((r) => r.id === matchedProd.id)) {
        recommended.push(matchedProd);
      }
    }

    // Strip [PRODUCT:...] tags to keep bot reply pristine
    const cleanText = text.replace(regex, '').trim();
    return { cleanText, recommended };
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsgId = Date.now().toString();
    const newUserMessage: Message = { id: userMsgId, role: 'user', content: textToSend };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = [...messages, newUserMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!res.ok) {
        throw new Error('Chatbot endpoint failed');
      }

      const data = await res.json();
      const botReply = data.reply || "I'm sorry, I encountered a connection issue.";

      const { cleanText, recommended } = parseProductsInText(botReply);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: cleanText,
          products: recommended.length > 0 ? recommended : undefined,
        },
      ]);
    } catch (err) {
      console.error('Chatbot fetch err:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble connecting to my design center right now. For urgent styling or orders, please tap below to chat with me directly on WhatsApp!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Automated flows
  const startPersonalFlow = () => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: 'Help me choose my style.' },
      {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Let's find your perfect style. What type of aesthetic do you identify with the most?`,
      },
    ]);
  };

  const handleAestheticOption = (aesthetic: string) => {
    let recommendations: Product[] = [];
    if (aesthetic === 'Classic') {
      recommendations = products.filter((p) => p.tags.includes('CLASSIC') || p.tags.includes('AVIATOR'));
    } else if (aesthetic === 'Bold') {
      recommendations = products.filter((p) => p.tags.includes('SQUARE') || p.tags.includes('PREMIUM'));
    } else {
      recommendations = products.slice(0, 3);
    }

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: aesthetic },
      {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Based on your preference for a *${aesthetic}* look, I highly recommend exploring these premium models:`,
        products: recommendations,
      },
    ]);
  };

  return (
    <>
      {/* Floating Sparkle Assistant Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          id="chatbot-trigger-btn"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-black hover:bg-zinc-900 text-white p-4 rounded-full shadow-2xl flex items-center justify-center relative focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="Toggle DNYL Style Assistant"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          
          {/* Animated indicator dots */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
        </motion.button>
      </div>

      {/* Slide-out chatbot drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[550px] bg-white rounded-lg shadow-2xl border border-gray-100 flex flex-col justify-between z-40 text-black overflow-hidden"
          >
            {/* Header branding */}
            <div className="bg-black text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-zinc-800 p-2 rounded-full">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold tracking-widest uppercase">DNYL STYLE ASSISTANT</h3>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span className="text-[9px] tracking-wider text-gray-400 font-semibold uppercase">ONLINE STYLIST</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-full focus:outline-none"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Window */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((m) => (
                <div key={m.id} className="space-y-2">
                  <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex items-start max-w-[85%] space-x-2">
                      {m.role === 'assistant' && (
                        <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5">
                          DN
                        </div>
                      )}
                      
                      <div className={`p-3 text-xs leading-relaxed tracking-wide ${
                        m.role === 'user'
                          ? 'bg-black text-white rounded-t-lg rounded-bl-lg'
                          : 'bg-white text-gray-800 rounded-t-lg rounded-br-lg border border-gray-100 shadow-sm'
                      }`}>
                        {m.content}
                      </div>

                      {m.role === 'user' && (
                        <div className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5">
                          ME
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Inline Product Recommendations */}
                  {m.products && m.products.length > 0 && (
                    <div className="pl-8 grid grid-cols-1 gap-2.5">
                      {m.products.map((p) => {
                        const price = parseInt(p.priceRange.minVariantPrice.amount, 10);
                        return (
                          <div
                            key={p.id}
                            className="bg-white border border-gray-100 p-2.5 rounded-md flex space-x-3 items-center justify-between shadow-xs hover:border-black transition-colors"
                          >
                            <div
                              onClick={() => {
                                onSelectProduct(p);
                                setIsOpen(false);
                              }}
                              className="flex items-center space-x-2.5 cursor-pointer flex-1"
                            >
                              <img
                                src={p.images[0]?.url}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 object-cover rounded-sm bg-gray-50"
                              />
                              <div>
                                <h4 className="text-[10px] font-extrabold text-gray-900 uppercase tracking-widest line-clamp-1">{p.title}</h4>
                                <p className="text-[9px] text-gray-500 font-bold mt-0.5">Rs. {price.toLocaleString()}</p>
                              </div>
                            </div>
                            
                            <div className="flex space-x-1">
                              <button
                                onClick={() => {
                                  onSelectProduct(p);
                                  setIsOpen(false);
                                }}
                                className="p-1.5 border border-gray-100 hover:border-black rounded text-[9px] font-semibold"
                                title="View details"
                              >
                                <Eye className="w-3.5 h-3.5 text-gray-600" />
                              </button>
                              <button
                                onClick={() => onAddToCart(p, p.variants[0]?.id)}
                                className="p-1.5 bg-black hover:bg-zinc-800 text-white rounded"
                                title="Add to cart"
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
              ))}

              {/* Bot typing loading placeholder */}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5">
                      DN
                    </div>
                    <div className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                      <div className="flex space-x-1 items-center py-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Helper Choice Chips */}
            <div className="px-3 py-2 border-t border-gray-100 bg-white flex space-x-2 overflow-x-auto select-none scrollbar-none">
              <button
                onClick={startPersonalFlow}
                className="flex-shrink-0 text-[10px] tracking-wider font-semibold border border-gray-200 hover:border-black rounded-full px-3.5 py-1.5 focus:outline-none transition-colors"
              >
                FIND MY STYLE
              </button>
              <button
                onClick={() => handleSend('Show me polarized black sunglasses.')}
                className="flex-shrink-0 text-[10px] tracking-wider font-semibold border border-gray-200 hover:border-black rounded-full px-3.5 py-1.5 focus:outline-none transition-colors"
              >
                POLARIZED BLACK
              </button>
              <button
                onClick={() => handleSend('Do you support Cash on Delivery?')}
                className="flex-shrink-0 text-[10px] tracking-wider font-semibold border border-gray-200 hover:border-black rounded-full px-3.5 py-1.5 focus:outline-none transition-colors"
              >
                COD POLICY
              </button>
              <button
                onClick={() => handleSend('How long does delivery take in Karachi?')}
                className="flex-shrink-0 text-[10px] tracking-wider font-semibold border border-gray-200 hover:border-black rounded-full px-3.5 py-1.5 focus:outline-none transition-colors"
              >
                KARACHI TIMING
              </button>
            </div>

            {/* Personal flow option selection blocks if requested */}
            {messages[messages.length - 1]?.content.includes('aesthetic do you identify') && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 grid grid-cols-3 gap-2">
                {['Classic', 'Bold', 'Minimal'].map((a) => (
                  <button
                    key={a}
                    onClick={() => handleAestheticOption(a)}
                    className="bg-white border border-gray-200 hover:border-black p-2 text-[10px] font-bold text-center uppercase tracking-widest rounded transition-all"
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}

            {/* User message input box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-gray-100 bg-white flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ASK DNYL STYLIST..."
                className="flex-1 py-2 px-3 bg-gray-50 border-none rounded text-xs tracking-wide focus:outline-none placeholder-gray-400 font-light uppercase"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 bg-black hover:bg-zinc-800 text-white rounded transition-colors disabled:opacity-50 focus:outline-none"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
