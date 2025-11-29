"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { 
  FaCalendarAlt, 
  FaUserFriends, 
  FaCheckCircle, 
  FaCreditCard, 
  FaPaypal, 
  FaUniversity,
  FaStar,
  FaArrowRight,
  FaMapMarkerAlt
} from "react-icons/fa";
import { HiOutlineTicket } from "react-icons/hi";

/* ────────────────────── Mock Data ────────────────────── */
const selectedTrip = {
  title: "Altai Tavan Bogd Expedition",
  location: "Bayan-Ulgii, Mongolia",
  price: 2450000,
  image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1000&auto=format&fit=crop", // Placeholder
  rating: 4.9,
  reviews: 128,
  duration: "5 өдөр / 4 шөнө"
};

const BookNowPremium = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) return <SuccessScreen />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden selection:bg-indigo-500 selection:text-white pb-20 pt-24 font-sans">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-wider text-sm uppercase mb-2">
            <span className="w-8 h-[2px] bg-indigo-600"></span>
            Booking Details
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900">
            Аяллаа <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Баталгаажуулах</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* ─── LEFT: Trip Summary (Sticky) ─── */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-28"
            >
              <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 overflow-hidden border border-slate-100 p-4">
                {/* Image Card */}
                <div className="relative h-48 rounded-2xl overflow-hidden mb-6 group">
                  <img 
                    src={selectedTrip.image} 
                    alt="Trip" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs font-medium bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg inline-block mb-2">
                      {selectedTrip.duration}
                    </p>
                    <div className="flex items-center gap-1 text-amber-400 text-sm">
                      <FaStar /> <span className="text-white font-bold">{selectedTrip.rating}</span> <span className="text-white/80">({selectedTrip.reviews} сэтгэгдэл)</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="px-2 pb-2">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{selectedTrip.title}</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                    <FaMapMarkerAlt className="text-indigo-500" />
                    {selectedTrip.location}
                  </div>

                  <div className="space-y-3 mb-6">
                    <SummaryRow label="Үндсэн үнэ" value={`${(selectedTrip.price).toLocaleString()}₮`} />
                    <SummaryRow label="Татвар, хураамж" value="0₮" highlight />
                    <div className="h-[1px] bg-slate-100 my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Нийт дүн</span>
                      <span className="text-2xl font-black text-indigo-600">
                        {(selectedTrip.price).toLocaleString()}₮
                      </span>
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-xl p-4 flex gap-3 items-start">
                    <FaCheckCircle className="text-indigo-600 mt-1 shrink-0" />
                    <p className="text-xs text-indigo-800 leading-relaxed">
                      <strong>Баталгаатай захиалга:</strong> Таны захиалгыг хүлээн авснаас хойш 24 цагийн дотор менежер холбогдож баталгаажуулна.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ─── RIGHT: Booking Form ─── */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-10">
                  
                  {/* Section 1: Contact Info */}
                  <Section title="Хувийн мэдээлэл" description="Таны холбоо барих мэдээлэл">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputGroup label="Овог" placeholder="Боржигон" />
                      <InputGroup label="Нэр" placeholder="Болд" />
                      <InputGroup label="И-мэйл хаяг" type="email" placeholder="example@gmail.com" />
                      <InputGroup label="Утасны дугаар" type="tel" placeholder="+976 9911-xxxx" />
                    </div>
                  </Section>

                  <div className="h-[1px] bg-slate-100" />

                  {/* Section 2: Trip Details */}
                  <Section title="Аяллын нарийн ширийн" description="Хэзээ, хэдүүлээ явах вэ?">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Эхлэх огноо</label>
                        <div className="relative">
                          <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                          <FaCalendarAlt className="absolute right-4 top-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Аялагчдын тоо</label>
                        <div className="relative">
                           <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                              <option>1 хүн (Ганцаарчилсан)</option>
                              <option>2 хүн (Хос)</option>
                              <option>3-5 хүн (Гэр бүл)</option>
                              <option>5+ хүн (Найзууд)</option>
                           </select>
                           <FaUserFriends className="absolute right-4 top-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="text-sm font-bold text-slate-700 mb-2 block">Нэмэлт хүсэлт</label>
                      <textarea 
                        rows={3} 
                        placeholder="Хоолны дэглэм, тусгай хэрэгцээ гэх мэт..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                      />
                    </div>
                  </Section>

                  <div className="h-[1px] bg-slate-100" />

                  {/* Section 3: Payment Method */}
                  <Section title="Төлбөрийн нөхцөл" description="Төлбөр төлөх хэлбэрээ сонгоно уу">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <PaymentOption 
                        icon={FaUniversity} 
                        title="Банкны шилжүүлэг" 
                        subtitle="QPay, SocialPay" 
                        defaultChecked 
                      />
                      <PaymentOption 
                        icon={FaCreditCard} 
                        title="Карт" 
                        subtitle="Visa, Master" 
                      />
                      <PaymentOption 
                        icon={FaPaypal} 
                        title="Бэлнээр" 
                        subtitle="Оффис дээр" 
                      />
                    </div>
                  </Section>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="relative z-10">Захиалга баталгаажуулах</span>
                        <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        {/* Shine Effect */}
                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                      </>
                    )}
                  </motion.button>
                  
                  <p className="text-center text-slate-400 text-sm">
                    "Захиалах" товчийг дарснаар та манай <a href="#" className="text-indigo-600 underline decoration-indigo-200 underline-offset-2">Үйлчилгээний нөхцөл</a>-ийг зөвшөөрсөнд тооцогдоно.
                  </p>

                </form>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ────────────────────── Helper Components ────────────────────── */

const Section = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
  <div>
    <div className="mb-6">
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <p className="text-slate-500 text-sm">{description}</p>
    </div>
    {children}
  </div>
);

const InputGroup = ({ label, type = "text", placeholder }: { label: string, type?: string, placeholder: string }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
    <input 
      type={type} 
      placeholder={placeholder} 
      required
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
    />
  </div>
);

const SummaryRow = ({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) => (
  <div className={`flex justify-between items-center text-sm ${highlight ? 'text-green-600' : 'text-slate-600'}`}>
    <span>{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

const PaymentOption = ({ icon: Icon, title, subtitle, defaultChecked = false }: any) => (
  <label className="relative cursor-pointer group">
    <input type="radio" name="payment" defaultChecked={defaultChecked} className="peer sr-only" />
    <div className="p-4 rounded-xl border-2 border-slate-100 bg-slate-50 peer-checked:border-indigo-500 peer-checked:bg-indigo-50/50 transition-all hover:bg-white hover:shadow-md">
      <div className="flex flex-col items-center text-center gap-2">
        <Icon className="text-2xl text-slate-400 peer-checked:text-indigo-600 group-hover:text-indigo-500 transition-colors" />
        <div>
          <div className="font-bold text-slate-700 text-sm peer-checked:text-indigo-900">{title}</div>
          <div className="text-xs text-slate-400">{subtitle}</div>
        </div>
      </div>
    </div>
    <div className="absolute top-3 right-3 opacity-0 peer-checked:opacity-100 transition-opacity text-indigo-600">
      <FaCheckCircle />
    </div>
  </label>
);

/* ────────────────────── Success Screen ────────────────────── */
const SuccessScreen = () => (
  <div className="min-h-screen bg-white flex items-center justify-center p-4">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center max-w-lg"
    >
      <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <FaCheckCircle className="text-5xl" />
      </div>
      <h2 className="text-3xl font-black text-slate-800 mb-4">Захиалга Амжилттай!</h2>
      <p className="text-slate-500 text-lg mb-8">
        Таны захиалгыг хүлээн авлаа. Бид таны и-мэйл хаяг руу баталгаажуулах хуудас илгээсэн болно.
      </p>
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 text-left">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
            <HiOutlineTicket className="text-2xl" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold">Захиалгын дугаар</div>
            <div className="text-lg font-mono font-bold text-slate-800">#TRIP-8829</div>
          </div>
        </div>
        <p className="text-sm text-slate-500">
          Манай менежер тантай 24 цагийн дотор холбогдох болно.
        </p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
      >
        Нүүр хуудас руу буцах
      </button>
    </motion.div>
  </div>
);

export default BookNowPremium;