import { ReactNode } from 'react';

interface FactItem {
    label: string;
    value: string | ReactNode;
}

interface AiFactSheetProps {
    title: string;
    data: FactItem[];
    className?: string;
}

export default function AiFactSheet({ title, data, className = '' }: AiFactSheetProps) {
    return (
        <section className={`bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden ${className}`}>
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                    {title}
                </h3>
            </div>
            <div className="p-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                    {data.map((item, index) => (
                        <div key={index} className="flex flex-col border-b border-slate-50 sm:border-0 pb-2 sm:pb-0 last:border-0">
                            <dt className="text-xs font-medium text-slate-500 mb-0.5">
                                {item.label}
                            </dt>
                            <dd className="text-sm font-medium text-slate-900">
                                {item.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
