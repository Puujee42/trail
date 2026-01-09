import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions | Mongol Trail',
    description: 'Find answers to common questions about traveling to Mongolia, visa requirements, best time to visit, and what to pack for your adventure.',
};

export default function FAQPage() {
    const faqs = [
        {
            question: "When is the best time to visit Mongolia?",
            answer: "The best time to visit Mongolia is during the summer months from mid-June to late August. The weather is pleasant, and the countryside is green. For winter adventures, February is great for the Ice Festival."
        },
        {
            question: "Do I need a visa to travel to Mongolia?",
            answer: "Mongolia has introduced a visa-free regime for many countries for tourism purposes (up to 30-90 days). Please check the latest requirements for your specific nationality on the official widespread policies or e-visa portal."
        },
        {
            question: "Is Mongolia safe for tourists?",
            answer: "Yes, Mongolia is widely considered one of the safest destinations for travelers. The crime rate against tourists is low, and the locals are known for their hospitality."
        },
        {
            question: "What should I pack for a hiking trip?",
            answer: "We recommend packing layers. Even in summer, nights can be cool. Essential items include good hiking boots, a waterproof jacket, thermal layers, sun protection, and a good sleeping bag if camping."
        },
        {
            question: "How do I book a tour?",
            answer: "You can book directly through our website by selecting your desired tour package. We accept various payment methods including credit cards and bank transfers."
        }
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };

    return (
        <div className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h1>
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-bold text-slate-800 mb-3">{faq.question}</h2>
                            <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
