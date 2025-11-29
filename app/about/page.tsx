"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import Link from "next/link";
import { 
  FaFlag, 
  FaUsers, 
  FaGlobe, 
  FaAward,
  FaShieldAlt,
  FaLightbulb,
  FaHandshake,
  FaTwitter,
  FaLinkedin,
  FaArrowRight
} from "react-icons/fa";

/* ────────────────────── Mock Data ────────────────────── */
const timelineEvents = [
  { year: "2015", title: "Euro trails-ийн Эхлэл", text: "Нэгэн мөрөөдлөөс эхэлсэн бидний аялал Монголын аялал жуулчлалын салбарт шинэ өнгө төрх нэмэх зорилготойгоор байгуулагдсан." },
  { year: "2018", title: "Анхны Олон Улсын Аялал", text: "Бид анхны олон улсын багц аяллаа Тайланд улс руу амжилттай зохион байгуулж, үйл ажиллагаагаа өргөжүүлсэн." },
  { year: "2022", title: "10,000 Дахь Аялагч", text: "Бидний үнэнч хэрэглэгчдийн тоо 10,000-д хүрч, Монголын тэргүүлэх агентлагуудын нэг болохоо баталсан." },
  { year: "2025", title: "Шилдэг Агентлаг Шагнал", text: "Аялал Жуулчлалын Холбооноос 'Оны Шилдэг Аялал Зуучлалын Компани' шагналыг хүртсэн нь бидний нөр их хөдөлмөрийн үр дүн байлаа." }
];

const teamMembers = [
  { name: "Б. Анударь", role: "Үүсгэн байгуулагч & Гүйцэтгэх захирал", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anu" },
  { name: "Г. Тэмүүлэн", role: "Аяллын хөтөлбөр хариуцсан менежер", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Temu" },
  { name: "М. Сарнай", role: "Маркетингийн менежер", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" },
];

/* ────────────────────── Main Page Component ────────────────────── */
const AboutPage = () => {
  return (
    <div className="bg-white text-slate-800">
      
      {/* ─── 1. Cinematic Hero Section ─── */}
      <HeroSection />
      
      {/* ─── 2. Stats Banner ─── */}
      <StatsSection />

      {/* ─── 3. Story Timeline ─── */}
      <StoryTimeline />

      {/* ─── 4. Core Values ─── */}
      <ValuesSection />
      
      {/* ─── 5. Meet The Team ─── */}
      <TeamSection />

      {/* ─── 6. Call to Action ─── */}
      <CtaSection />

    </div>
  );
};

/* ────────────────────── Sub-Components ────────────────────── */

// 1. Hero Section
const HeroSection = () => (
  <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
    <div className="absolute inset-0 z-0">
      <video autoPlay loop muted playsInline className="w-full h-full object-cover">
        <source src="/hero.mp4" type="video/mp4" />
      </video>
    </div>
    <div className="absolute inset-0 bg-slate-900/60 z-10" />
    <div className="relative z-20 container mx-auto px-4">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-black mb-4 leading-tight"
      >
        Найдвартай ажиллагаа, <span className="text-sky-400">баталгаатай зохион байгуулалт</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto"
      >
      Баталгаатай зохион байгуулалт
      </motion.p>
    </div>
  </section>
);

// 2. Stats Section
const StatsSection = () => (
  <section className="bg-gradient-to-r from-sky-500 to-blue-600 text-white py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-4">
          <h3 className="text-5xl font-black mb-2 flex items-center justify-center gap-2">
            <CountUp end={12000} duration={3} separator="," />+
          </h3>
          <p className="text-sky-100 font-bold uppercase tracking-wider">Аз жаргалтай аялагчид</p>
        </div>
        <div className="p-4">
          <h3 className="text-5xl font-black mb-2 flex items-center justify-center gap-2">
            <CountUp end={150} duration={3} />+
          </h3>
          <p className="text-sky-100 font-bold uppercase tracking-wider">Аяллын чиглэл</p>
        </div>
        <div className="p-4">
          <h3 className="text-5xl font-black mb-2 flex items-center justify-center gap-2">
            <CountUp end={9} duration={3} />+
          </h3>
          <p className="text-sky-100 font-bold uppercase tracking-wider">Жилийн туршлага</p>
        </div>
      </div>
    </div>
  </section>
);

// 3. Story Timeline Section
const StoryTimeline = () => (
  <section className="bg-slate-50 py-24">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-800 mb-4">Бидний Түүх</h2>
        <p className="text-slate-500 text-lg">Нэгэн мөрөөдлөөс эхлэн өнөөдрийг хүртэлх бидний аялал.</p>
      </div>
      <div className="relative">
        {/* The vertical line */}
        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-slate-200 -translate-x-1/2" />

        {timelineEvents.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`relative mb-12 flex items-center ${index % 2 === 0 ? 'justify-start md:justify-end md:pr-12' : 'justify-start md:pl-12'}`}
          >
            {/* The dot on the timeline */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-4 border-sky-500 shadow-lg" />

            <div className={`w-full md:w-1/2 p-6 bg-white rounded-2xl shadow-lg border border-slate-100 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
              <p className="text-sky-500 font-black text-2xl mb-2">{event.year}</p>
              <h3 className="font-bold text-xl text-slate-800 mb-2">{event.title}</h3>
              <p className="text-slate-500 text-sm">{event.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// 4. Core Values Section
const ValuesSection = () => (
   <section className="bg-white py-24">
      <div className="container mx-auto px-4 max-w-5xl">
         <div className="text-center mb-16">
           <h2 className="text-4xl font-black text-slate-800 mb-4">Бидний Үнэт Зүйлс</h2>
           <p className="text-slate-500 text-lg">Бидний үйл ажиллагааны үндэс суурь болсон зарчмууд.</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard icon={FaShieldAlt} title="Ил тод" text="Нэмэлт нууц төлбөргүй. Та төлсөн үнэ бүрийнхээ бодит үнэ цэнийг мэдэрнэ." />
            <ValueCard icon={FaHandshake} title="24/7 харилцагчийн дэмжлэг " text="Аяллын үед ганцаараа үлдэхгүй — бид өдөр, шөнийн турш түргэн шуурхай туслалцаа үзүүлнэ." />
            <ValueCard icon={FaLightbulb} title="Танд зориулагдсан аяллын туршлага" text="Зүгээр нэг аялал биш — таны хүсэл, хэв маягт тохирсон үнэт дурсамж бүтээх нь бидний зорилго." />
         </div>
      </div>
   </section>
);

const ValueCard = ({ icon: Icon, title, text }: any) => (
   <motion.div 
     initial={{ opacity: 0, y: 20 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true }}
     whileHover={{ y: -5 }}
     className="text-center p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-100/50 transition-all"
   >
      <div className="w-16 h-16 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
         <Icon size={28} />
      </div>
      <h3 className="font-bold text-xl text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm">{text}</p>
   </motion.div>
)

// 5. Team Section
const TeamSection = () => (
  <section className="bg-slate-50 py-24">
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-800 mb-4">Манай Багийнхан</h2>
        <p className="text-slate-500 text-lg">Аяллыг тань мартагдашгүй болгохын төлөө ажилладаг мэргэжлийн хамт олон.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {teamMembers.map((member, i) => (
          <TeamMemberCard key={i} member={member} />
        ))}
      </div>
    </div>
  </section>
);

const TeamMemberCard = ({ member }: any) => (
   <motion.div 
     initial={{ opacity: 0, scale: 0.9 }}
     whileInView={{ opacity: 1, scale: 1 }}
     viewport={{ once: true }}
     whileHover="hover"
     className="group relative bg-white rounded-2xl text-center p-8 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-sky-100/50 hover:-translate-y-2"
   >
      <div className="relative inline-block mb-4">
        <img src={member.img} alt={member.name} className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg" />
        <motion.div 
           variants={{ hover: { scale: 1.2, opacity: 1 } }}
           initial={{ scale: 0, opacity: 0 }}
           className="absolute -bottom-2 w-full flex justify-center"
        >
          <div className="bg-white rounded-full p-1 shadow-md flex gap-2">
            <a href="#" className="w-6 h-6 rounded-full bg-slate-100 hover:bg-sky-500 hover:text-white flex items-center justify-center text-slate-500 transition-colors"><FaTwitter size={12} /></a>
            <a href="#" className="w-6 h-6 rounded-full bg-slate-100 hover:bg-sky-500 hover:text-white flex items-center justify-center text-slate-500 transition-colors"><FaLinkedin size={12} /></a>
          </div>
        </motion.div>
      </div>
      <h3 className="font-bold text-xl text-slate-800">{member.name}</h3>
      <p className="text-sky-500 text-sm font-medium">{member.role}</p>
   </motion.div>
);


// 6. Final Call to Action
const CtaSection = () => (
   <section className="bg-white py-24">
      <div className="container mx-auto px-4 text-center max-w-3xl">
         <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-800 mb-6"
         >
           Таны Аялал Эндээс Эхэлнэ
         </motion.h2>
         <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg mb-10"
         >
           Бид таны мөрөөдлийн аяллыг бодит болгоход бэлэн байна. Өнөөдөр багцуудтай танилцаарай.
         </motion.p>
         <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
         >
           <Link href="/packages">
             <button className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg shadow-xl shadow-sky-200 overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-sky-300">
               Багцуудтай танилцах
               <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-colors">
                  <FaArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
               </div>
             </button>
           </Link>
         </motion.div>
      </div>
   </section>
);


export default AboutPage;