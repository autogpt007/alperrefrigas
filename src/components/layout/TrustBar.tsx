import React from 'react';
import { Warehouse, Globe, ShieldCheck, CreditCard } from 'lucide-react';

const items = [
  {
    icon: Warehouse,
    title: 'US Warehouse Dispatch',
    detail: 'Miami, FL hub',
  },
  {
    icon: Globe,
    title: 'Worldwide HazMat Freight',
    detail: 'Air & ocean, 48+ countries',
  },
  {
    icon: ShieldCheck,
    title: 'EPA 608 & F-Gas Ready',
    detail: 'Certified professional buyers',
  },
  {
    icon: CreditCard,
    title: 'Card or Bank Wire',
    detail: '15% off on bank wire',
  },
];

const TrustBar = () => {
  return (
    <div className="bg-slate-900 text-white border-t border-white/10">
      <div className="container mx-auto px-4">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 py-2">
          {items.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex items-start gap-2 min-w-0">
              <Icon className="h-4 w-4 shrink-0 mt-0.5 text-cyan-400" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-semibold leading-tight truncate">{title}</p>
                <p className="text-[10px] sm:text-[11px] text-white/70 leading-tight truncate">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrustBar;
