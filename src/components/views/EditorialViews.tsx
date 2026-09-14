import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, ArrowRight, ShieldCheck, Check, Sparkles, ChevronDown, ChevronUp, Calendar, BookOpen, Search, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BlogPost, FAQItem } from '../../types';
import { BLOG_POSTS, FAQS, DNYL_ASSETS } from '../../data';

interface EditorialProps {
  onNavigate: (view: string, params?: any) => void;
  whatsappNumber: string;
  supportEmail?: string;
}

// ==========================================
// 1. ABOUT VIEW
// ==========================================
export function AboutView({ onNavigate }: EditorialProps) {
  return (
    <div id="about-view" className="py-20 bg-white text-black max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <span className="text-[10px] tracking-[0.3em] text-gray-400 font-bold uppercase block mb-1">THE DNYL MANIFESTO</span>
        <h1 className="text-4xl font-extrabold tracking-[0.15em] uppercase font-display">OUR IDENTITY</h1>
        <div className="w-12 h-0.5 bg-black mx-auto mt-4" />
      </div>

      <div className="space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 font-light text-gray-600 leading-relaxed text-sm">
            <h2 className="text-xs tracking-widest font-extrabold text-black uppercase">THE FOUNDATION</h2>
            <p className="text-gray-900 font-semibold text-base">
              DNYL is derived from the founder's name, Daniyal. What began as a personal quest for world-class, premium quality sunglasses in Karachi has evolved into an international modern eyewear movement.
            </p>
            <p>
              We noticed a massive gap in Pakistan’s fashion ecosystem. Premium international luxury eyewear brands were priced out of reach, while accessible alternatives felt like cheap, generic plastic templates.
            </p>
            <p>
              DNYL was created to break this cycle. "SEE DIFFERENT" is more than a tagline; it is our engineering core.
            </p>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded bg-gray-50 border border-gray-100">
            <img src={DNYL_ASSETS.hero} alt="DNYL Campaign" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-gray-100">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xs tracking-widest font-extrabold text-black">AEROSPACE METALS</h3>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Our frames utilize premium surgical titanium wires, medical-grade block stainless steel, and hand-polished bio-acetates that resist Karachi humidity without peeling or tarnishing.
            </p>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xs tracking-widest font-extrabold text-black">POLARIZED HD OPTICS</h3>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Every DNYL lens features absolute 100% UV400 filters paired with advanced high-definition Polarization. No glare, no eye strain—just complete optical clarity.
            </p>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xs tracking-widest font-extrabold text-black">DESIGN HONESTY</h3>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              We eliminate licensing premiums and retail markups. We deal directly with you, shipping curated eyewear in gorgeous, reusable leather protective cases directly from our design center.
            </p>
          </div>
        </div>

        <div className="text-center max-w-xl mx-auto space-y-6 pt-6">
          <h3 className="text-xs tracking-widest font-extrabold text-black uppercase">SEE THE WORLD DIRECTLY</h3>
          <p className="text-sm font-light text-gray-600 leading-relaxed uppercase">
            "Your confidence deserves an optical outline that matches its scale. We build that outline."
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-black text-white px-8 py-3.5 text-xs tracking-widest font-bold uppercase hover:bg-zinc-800 transition-colors"
          >
            EXPLORE DNYL COLLECTION
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. CONTACT VIEW
// ==========================================
export function ContactView({ whatsappNumber, supportEmail = 'support@dnyleyewear.com' }: EditorialProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1200);
  };

  return (
    <div id="contact-view" className="py-20 bg-white text-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      {/* Contact detail side */}
      <div className="lg:col-span-5 space-y-8 pr-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] text-gray-400 font-bold uppercase block mb-1">GET IN TOUCH</span>
          <h1 className="text-3xl font-extrabold tracking-[0.15em] uppercase font-display">CONTACT DNYL</h1>
          <p className="text-xs text-gray-500 font-light mt-2 leading-relaxed">
            Our luxury styling support team is based in Karachi, Pakistan. Whether you need face shape advice, order tracking, or return help, we are at your service.
          </p>
        </div>

        <div className="space-y-5 text-xs text-gray-600 font-light">
          <div className="flex items-center space-x-3.5">
            <div className="bg-gray-50 p-3 rounded border border-gray-100 text-black">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-black uppercase tracking-wider">GENERAL INQUIRIES</p>
              <a href={`mailto:${supportEmail}`} className="hover:text-black">{supportEmail}</a>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="bg-gray-50 p-3 rounded border border-gray-100 text-black">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-black uppercase tracking-wider">WHATSAPP SUPPORT LINE</p>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-black font-semibold">
                +{whatsappNumber}
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="bg-gray-50 p-3 rounded border border-gray-100 text-black">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-black uppercase tracking-wider">SHOWROOM OFFICE</p>
              <p>Plot 12-C, Clifton Boulevard, Phase 5, DHA, Karachi, Pakistan</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="bg-gray-50 p-3 rounded border border-gray-100 text-black">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-black uppercase tracking-wider">WORKING HOURS</p>
              <p>Monday – Saturday: 11:00 AM – 8:00 PM (PKT)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="lg:col-span-7 bg-gray-50/50 p-8 border border-gray-100 rounded">
        <h2 className="text-xs tracking-widest font-extrabold text-black uppercase mb-6">SEND A DIRECT MESSAGE</h2>
        
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center text-gray-500 space-y-4"
          >
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-xs tracking-wider font-extrabold text-black uppercase">MESSAGE SECURELY DELIVERED</p>
            <p className="text-xs font-light max-w-sm mx-auto">
              Our styling team will review your message and reply via email at the earliest, usually within 2-4 hours.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="text-[10px] tracking-widest uppercase font-extrabold text-black underline mt-4 focus:outline-none"
            >
              SEND ANOTHER MESSAGE
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">FULL NAME</label>
                <input
                  type="text"
                  required
                  placeholder="DANIYAL AHMED"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black rounded text-xs focus:outline-none uppercase"
                />
              </div>
              <div>
                <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  placeholder="DANIYAL@EMAIL.COM"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black rounded text-xs focus:outline-none uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">PHONE NUMBER (FOR WHATSAPP)</label>
              <input
                type="tel"
                required
                placeholder="0300 1234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black rounded text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">MESSAGE</label>
              <textarea
                rows={4}
                required
                placeholder="TELL US HOW WE CAN HELP..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black rounded text-xs focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-black text-white py-4 text-xs tracking-widest font-extrabold uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'TRANSMITTING...' : 'SEND MESSAGE'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 3. FAQ VIEW (Accordion Layout)
// ==========================================
export function FAQView() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div id="faq-view" className="py-20 bg-white text-black max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <span className="text-[10px] tracking-[0.3em] text-gray-400 font-bold uppercase block mb-1">ANSWERS TO QUESTIONS</span>
        <h1 className="text-3xl font-extrabold tracking-[0.15em] uppercase font-display">FAQs</h1>
        <div className="w-12 h-0.5 bg-black mx-auto mt-4" />
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="border border-gray-100 rounded bg-white overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none hover:bg-gray-50 transition-colors"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900">{faq.question}</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-5 text-xs leading-relaxed font-light text-gray-600 border-t border-gray-50 pt-3"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 4. SHIPPING POLICY VIEW
// ==========================================
export function ShippingView() {
  return (
    <div id="shipping-policy-view" className="py-20 bg-white text-black max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-light text-gray-600 leading-relaxed text-xs">
      <div className="text-center mb-10 text-black">
        <span className="text-[10px] tracking-[0.3em] text-gray-400 font-bold uppercase block mb-1">FULFILLMENT & DELIVERIES</span>
        <h1 className="text-3xl font-extrabold tracking-[0.15em] uppercase font-display">SHIPPING POLICY</h1>
        <div className="w-12 h-0.5 bg-black mx-auto mt-4" />
      </div>

      <section className="space-y-3">
        <h2 className="text-xs tracking-widest font-extrabold text-black uppercase">1. NATIONWIDE COURIERS</h2>
        <p>
          We partner with Pakistan’s premium courier networks (Leopards Courier and TCS) to fulfill insured nationwide orders safely.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs tracking-widest font-extrabold text-black uppercase">2. DELIVERY TIMELINES</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><span className="font-bold text-black">Karachi Orders:</span> Same day dispatch. Arrives in 1-2 business days.</li>
          <li><span className="font-bold text-black">Islamabad, Lahore, Rawalpindi, Peshawar:</span> 2-3 business days.</li>
          <li><span className="font-bold text-black">Rest of Pakistan:</span> 3-5 business days.</li>
        </ul>
        <p>Please note that Sundays and national holidays are non-delivery days for our shipping courier partners.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs tracking-widest font-extrabold text-black uppercase">3. CASH ON DELIVERY (COD)</h2>
        <p>
          To maintain utmost convenience, Cash on Delivery is fully supported across all cities of Pakistan at no additional handling fee. Simply pay the courier in cash upon receiving your package.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs tracking-widest font-extrabold text-black uppercase">4. PREMIUM PACKAGING SECURITY</h2>
        <p>
          Every DNYL order is packed in a robust outer cardboard mailing box enclosing our custom DNYL luxury leather protective case, microfiber cloth, brand booklet, and certificate of warranty. If the outer courier seal is tampered with, please reject delivery and notify our WhatsApp line immediately.
        </p>
      </section>
    </div>
  );
}

// ==========================================
// 5. RETURNS POLICY VIEW
// ==========================================
export function ReturnsView() {
  return (
    <div id="returns-policy-view" className="py-20 bg-white text-black max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-light text-gray-600 leading-relaxed text-xs">
      <div className="text-center mb-10 text-black">
        <span className="text-[10px] tracking-[0.3em] text-gray-400 font-bold uppercase block mb-1">7-DAY SIZE OR FIT SATISFACTION</span>
        <h1 className="text-3xl font-extrabold tracking-[0.15em] uppercase font-display">RETURNS & EXCHANGES</h1>
        <div className="w-12 h-0.5 bg-black mx-auto mt-4" />
      </div>

      <section className="space-y-3">
        <h2 className="text-xs tracking-widest font-extrabold text-black uppercase">1. RETURN CRITERIA</h2>
        <p>
          At DNYL, we hold our design engineering to absolute precision. If you are not satisfied with the fit or shape on your face, you may request a return or style exchange within <span className="font-bold text-black">7 days of delivery</span>.
        </p>
        <p>For a return to be validated:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Eyewear must be completely unworn, scratch-free, and in its original state.</li>
          <li>All components—the leather case, cleaning cloth, brand box, and warranty card—must be returned intact.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs tracking-widest font-extrabold text-black uppercase">2. REIMBURSEMENT PROCESS</h2>
        <p>
          For orders paid via Cash on Delivery, refunds are issued directly to your local bank account or EasyPaisa/JazzCash wallet upon successful validation of the returned item at our Clifton Karachi showroom warehouse. Processing takes 2-4 business days.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs tracking-widest font-extrabold text-black uppercase">3. LOGISTIC CHARGES</h2>
        <p>
          If you are requesting a return due to personal preference change (e.g. style didn't suit you), we ask that you courier the item back to our Karachi warehouse address. For manufacturer defects, DNYL covers 100% of the return dispatch couriers.
        </p>
      </section>
    </div>
  );
}

// ==========================================
// 6. TRACK ORDER VIEW
// ==========================================
export function TrackOrderView() {
  const [orderId, setOrderId] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<any | null>(null);
  const [error, setError] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTrackingInfo(null);

    // Simulated high-fidelity order tracker
    const cleanId = orderId.toUpperCase().trim();
    if (!cleanId.startsWith('DNYL-') && cleanId.length < 5) {
      setError('Please enter a valid order number (e.g. DNYL-9482 or DNYL-1024).');
      return;
    }

    // Generate simulated milestone details based on ID length
    const idNum = parseInt(cleanId.replace(/\D/g, '') || '1024', 10);
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - 2);

    const step = idNum % 3 === 0 ? 'Placed' : idNum % 3 === 1 ? 'Shipped' : 'Delivered';

    setTrackingInfo({
      id: cleanId,
      date: orderDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      courier: 'Leopards Express Pakistan',
      awb: `LP-${idNum * 3 + 4827}`,
      status: step,
      items: [
        { title: 'DNYL Maverick Aviator', qty: 1, price: 'Rs. 4,999' }
      ]
    });
  };

  return (
    <div id="track-order-view" className="py-20 bg-white text-black max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <span className="text-[10px] tracking-[0.3em] text-gray-400 font-bold uppercase block mb-1">COURIER DISPATCH MONITOR</span>
        <h1 className="text-3xl font-extrabold tracking-[0.15em] uppercase font-display">TRACK ORDER STATUS</h1>
        <div className="w-12 h-0.5 bg-black mx-auto mt-4" />
      </div>

      {/* Tracker search query */}
      <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-10">
        <input
          type="text"
          placeholder="ENTER DNYL ORDER ID (E.G. DNYL-9482)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 focus:border-black text-xs rounded tracking-widest focus:outline-none uppercase font-semibold"
          required
        />
        <button
          type="submit"
          className="bg-black text-white hover:bg-zinc-800 text-xs tracking-widest font-bold uppercase py-3 px-6 rounded-sm focus:outline-none transition-colors"
        >
          TRACK
        </button>
      </form>

      {error && <p className="text-center text-xs text-red-500 font-semibold tracking-wider uppercase">{error}</p>}

      {/* Interactive Milestone Stepper Results */}
      <AnimatePresence>
        {trackingInfo && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="border border-gray-100 p-6 sm:p-8 bg-gray-50/50 rounded-md text-xs space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-200 pb-4 gap-2">
              <div>
                <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px]">ORDER IDENTIFICATION</p>
                <p className="text-sm font-black text-black">{trackingInfo.id}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px]">ORDERED DATE</p>
                <p className="font-semibold text-gray-800">{trackingInfo.date}</p>
              </div>
            </div>

            {/* Stepper milestones */}
            <div>
              <p className="text-[10px] tracking-widest text-gray-400 font-bold uppercase mb-6">SHIPPING PROGRESS STEPPER</p>
              
              <div className="relative flex justify-between items-center max-w-md mx-auto py-4">
                {/* Visual Line */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-black z-0 transition-all duration-700"
                  style={{
                    width:
                      trackingInfo.status === 'Placed'
                        ? '0%'
                        : trackingInfo.status === 'Shipped'
                        ? '50%'
                        : '100%',
                  }}
                />

                {/* Step 1: Placed */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <span className="text-[9px] font-bold tracking-wider uppercase mt-2">PLACED</span>
                </div>

                {/* Step 2: Shipped */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border transition-colors duration-500 ${
                    trackingInfo.status !== 'Placed' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'
                  }`}>
                    2
                  </div>
                  <span className="text-[9px] font-bold tracking-wider uppercase mt-2">SHIPPED</span>
                </div>

                {/* Step 3: Delivered */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border transition-colors duration-500 ${
                    trackingInfo.status === 'Delivered' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'
                  }`}>
                    3
                  </div>
                  <span className="text-[9px] font-bold tracking-wider uppercase mt-2">DELIVERED</span>
                </div>
              </div>
            </div>

            {/* Courier dispatch details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200 pt-6 font-light text-gray-600">
              <div>
                <p className="font-bold text-black uppercase tracking-wider mb-1">SHIPPING CARRIER</p>
                <p>{trackingInfo.courier}</p>
              </div>
              <div>
                <p className="font-bold text-black uppercase tracking-wider mb-1">CONSIGNMENT AWB NUMBER</p>
                <p className="font-mono">{trackingInfo.awb}</p>
              </div>
            </div>

            {/* Simulated map placeholder to enhance aesthetic */}
            <div className="border border-gray-200 rounded overflow-hidden aspect-[3/1] relative bg-gray-100 flex items-center justify-center text-gray-400">
              <Map className="w-6 h-6 mr-2 stroke-[1.5]" />
              <span className="text-[9px] tracking-widest font-extrabold uppercase">MAP INTERACTIVES ACTIVE IN KARACHI LOGS</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 7. BLOG LIST VIEW
// ==========================================
interface BlogViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export function BlogView({ onNavigate }: BlogViewProps) {
  return (
    <div id="blog-view" className="py-20 bg-white text-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center mb-16">
        <span className="text-[10px] tracking-[0.3em] text-gray-400 font-bold uppercase block mb-1">DNYL MAGAZINE</span>
        <h1 className="text-3xl font-extrabold tracking-[0.15em] uppercase font-display">THE EDITORIAL</h1>
        <div className="w-12 h-0.5 bg-black mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            onClick={() => onNavigate('blog-detail', { slug: post.slug })}
            className="group cursor-pointer flex flex-col justify-between overflow-hidden border border-gray-100 bg-white transition-all duration-300 hover:shadow-lg"
          >
            <div className="aspect-[3/2] overflow-hidden bg-gray-50">
              <img
                src={post.image}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                  <span>•</span>
                  <span className="flex items-center"><BookOpen className="w-3 h-3 mr-1" /> 4 MIN READ</span>
                </div>
                
                <h3 className="text-sm font-bold tracking-wide uppercase text-gray-900 group-hover:text-black line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-xs font-light text-gray-500 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-50 mt-4 flex items-center justify-between">
                <span className="text-[9px] tracking-widest font-extrabold text-black uppercase group-hover:underline">READ EDITORIAL</span>
                <ArrowRight className="w-3.5 h-3.5 text-black transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 8. BLOG DETAIL VIEW
// ==========================================
interface BlogDetailProps {
  slug: string;
  onNavigate: (view: string, params?: any) => void;
}

export function BlogDetailView({ slug, onNavigate }: BlogDetailProps) {
  const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];

  return (
    <div id="blog-detail-stage" className="bg-white text-black py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <button
          onClick={() => onNavigate('blog')}
          className="flex items-center text-[10px] tracking-widest font-extrabold text-gray-400 hover:text-black uppercase mb-8"
        >
          <ArrowRight className="w-3.5 h-3.5 mr-2 rotate-180" /> BACK TO MAGAZINE
        </button>

        {/* Article Meta Header */}
        <header className="space-y-4 mb-8">
          <div className="flex items-center space-x-3 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
            <span>{post.date}</span>
            <span>•</span>
            <span>4 MIN READ</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wider uppercase text-black leading-tight font-display">
            {post.title}
          </h1>
        </header>

        {/* Feature Image Frame */}
        <div className="aspect-[2/1] overflow-hidden rounded bg-gray-50 border border-gray-100 mb-10">
          <img src={post.image} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        </div>

        {/* Editorial Body Segment */}
        <div className="text-sm font-light text-gray-700 leading-relaxed space-y-6">
          <p className="text-base font-semibold text-black italic">
            {post.excerpt}
          </p>
          <p>
            Eyewear is more than visual assistance or blocking Sindh sun rays. It acts as the literal grid overlay for how you establish your space. In this detailed editorial guide, the DNYL styling team maps the architectural correlations of frame geometries with face structures.
          </p>
          
          <h3 className="text-xs tracking-widest font-extrabold text-black uppercase pt-4">GEOMETRIC ALIGNMENT</h3>
          <p>
            If you possess a round face shape, we advise contrasting the soft visual boundaries with high-tension sharp corners. Models like the **DNYL Stealth Square** or **Karachi Club Classic** introduce clean structural bezel contours that elongate and anchor your silhouette.
          </p>
          <p>
            Conversely, structured jawlines or square facial forms align beautifully with the curved poetry of the **DNYL Aura Round**. Our beta-titanium wire elements sit like floating halos, reducing weight and producing a highly intellectual, curated gaze.
          </p>

          <h3 className="text-xs tracking-widest font-extrabold text-black uppercase pt-4">LENS LIGHT MODULATION</h3>
          <p>
            All DNYL shades carry 100% UV400 standard layers, but our signature pride lies in our custom Polarized micro-laminates. Standard lenses simply dim the world, which triggers pupil dilation and actually allows more scattered harmful UV rays to enter. DNYL Polarized filters selectively block horizontally reflected light waves, maintaining pristine contrast and color fidelity.
          </p>
        </div>

        <div className="border-t border-gray-100 pt-8 mt-12 flex justify-between items-center text-[10px] tracking-widest text-gray-400 font-bold">
          <span>TAGS: EYEWEAR, FASHION, POLARIZED</span>
          <button onClick={() => onNavigate('shop')} className="text-black hover:underline uppercase">SHOP COLLECTION</button>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 9. USER ACCOUNT PROFILE VIEW
// ==========================================
export function AccountView({ onNavigate }: EditorialProps) {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('dnyl_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Daniyal Ahmed',
      email: 'mdaniyalhayyat@gmail.com',
      phone: '0300 1234567',
      address: 'Plot 12-C, Clifton Boulevard, Phase 5, DHA',
      city: 'Karachi',
    };
  });

  const [editMode, setEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('dnyl_user_profile', JSON.stringify(profile));
    setEditMode(false);
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
  };

  const orders = [
    { id: 'DNYL-9482', date: 'Sep 11, 2026', status: 'Shipped', amount: 'Rs. 4,999', courier: 'Leopards Courier' },
    { id: 'DNYL-1024', date: 'Aug 25, 2026', status: 'Delivered', amount: 'Rs. 9,498', courier: 'TCS Express' }
  ];

  return (
    <div id="account-view-stage" className="py-20 bg-white text-black max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <span className="text-[10px] tracking-[0.3em] text-gray-400 font-bold uppercase block mb-1">CUSTOMER GATEWAY</span>
        <h1 className="text-3xl font-extrabold tracking-[0.15em] uppercase font-display">MY ACCOUNT</h1>
        <div className="w-12 h-0.5 bg-black mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Profile Card Section */}
        <div className="md:col-span-5 space-y-6">
          <div className="border border-gray-100 p-6 rounded bg-gray-50/50 space-y-4 relative">
            <h2 className="text-xs tracking-widest font-extrabold text-black uppercase pb-3 border-b border-gray-200">SHIPPING DETAILS</h2>
            
            {saveStatus && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="absolute top-2 right-4 text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100"
              >
                PROFILE SECURED
              </motion.div>
            )}

            {editMode ? (
              <form onSubmit={handleSave} className="space-y-4 text-xs font-light">
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-black bg-white uppercase font-semibold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-black bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">WHATSAPP PHONE</label>
                  <input
                    type="tel"
                    required
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-black bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">DELIVERY ADDRESS</label>
                  <input
                    type="text"
                    required
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-black bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">CITY</label>
                  <input
                    type="text"
                    required
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-black bg-white uppercase"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-zinc-800"
                  >
                    SAVE
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex-1 border border-gray-200 text-gray-500 py-2 text-[10px] font-semibold tracking-widest uppercase hover:bg-gray-100"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs font-light text-gray-600">
                <div className="grid grid-cols-3 py-1">
                  <span className="font-bold text-black text-[10px] tracking-wide uppercase">CLIENT:</span>
                  <span className="col-span-2 text-gray-800 font-medium uppercase">{profile.name}</span>
                </div>
                <div className="grid grid-cols-3 py-1 border-t border-gray-100">
                  <span className="font-bold text-black text-[10px] tracking-wide uppercase">EMAIL:</span>
                  <span className="col-span-2 text-gray-800">{profile.email}</span>
                </div>
                <div className="grid grid-cols-3 py-1 border-t border-gray-100">
                  <span className="font-bold text-black text-[10px] tracking-wide uppercase">PHONE:</span>
                  <span className="col-span-2 text-gray-800 font-mono">{profile.phone}</span>
                </div>
                <div className="grid grid-cols-3 py-1 border-t border-gray-100">
                  <span className="font-bold text-black text-[10px] tracking-wide uppercase">ADDRESS:</span>
                  <span className="col-span-2 text-gray-800">{profile.address}</span>
                </div>
                <div className="grid grid-cols-3 py-1 border-t border-gray-100">
                  <span className="font-bold text-black text-[10px] tracking-wide uppercase">CITY:</span>
                  <span className="col-span-2 text-gray-800 uppercase">{profile.city}</span>
                </div>

                <button
                  onClick={() => setEditMode(true)}
                  className="w-full mt-4 border border-black hover:bg-black hover:text-white text-black py-2.5 text-[10px] font-bold tracking-widest uppercase transition-colors"
                >
                  EDIT PROFILE ADDRESS
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order History Section */}
        <div className="md:col-span-7 space-y-6">
          <div className="border border-gray-100 p-6 rounded bg-white space-y-4">
            <h2 className="text-xs tracking-widest font-extrabold text-black uppercase pb-3 border-b border-gray-200">RECENT ORDERS HISTORY</h2>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border border-gray-100 rounded bg-gray-50/30 text-xs">
                  <div className="space-y-1.5 mb-3 sm:mb-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-black tracking-wider uppercase">{order.id}</span>
                      <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase tracking-wider ${
                        order.status === 'Shipped' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-green-50 text-green-600 border border-green-100'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">Placed on {order.date} via {order.courier}</p>
                  </div>

                  <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center gap-2">
                    <span className="font-extrabold text-gray-900">{order.amount}</span>
                    <button
                      onClick={() => onNavigate('track-order')}
                      className="text-[9px] font-bold tracking-widest text-black uppercase underline hover:opacity-70 focus:outline-none"
                    >
                      LIVE TRACKING
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

