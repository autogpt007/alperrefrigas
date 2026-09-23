import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Wind, Snowflake, Factory, Car, RefreshCw, ArrowRight, Quote } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { createProductSlug } from '@/lib/slugs';

type Option = {
  id: string;
  label: string;
  hint: string;
  icon: React.ElementType;
  /** Refrigerant designations commonly specified for this equipment class */
  gases: { code: string; note: string; safety: string; fallbackHref?: string }[];
};

const OPTIONS: Option[] = [
  {
    id: 'residential',
    label: 'Residential AC & Heat Pumps',
    hint: 'Split systems, mini-splits, packaged units',
    icon: Wind,
    gases: [
      { code: 'R-410A', note: 'Long-standing charge for existing split systems', safety: 'A1' },
      {
        code: 'R-454B',
        note: 'Lower-GWP charge used in new equipment',
        safety: 'A2L',
        fallbackHref: '/products/r-454b',
      },
      { code: 'R-407C', note: 'Used in split systems and light commercial units', safety: 'A1' },
    ],
  },
  {
    id: 'commercial',
    label: 'Commercial Chillers & Rooftops',
    hint: 'Centrifugal, screw and scroll chillers',
    icon: Factory,
    gases: [
      { code: 'R-134A', note: 'Widely specified for centrifugal and screw chillers', safety: 'A1' },
      { code: 'R-513A', note: 'Lower-GWP alternative used in R-134a chillers', safety: 'A1' },
      { code: 'R-407C', note: 'Used in medium-temperature commercial systems', safety: 'A1' },
    ],
  },
  {
    id: 'coldstorage',
    label: 'Walk-Ins & Cold Storage',
    hint: 'Freezers, coolers, refrigerated warehouses',
    icon: Snowflake,
    gases: [
      { code: 'R-404A', note: 'Established low- and medium-temperature charge', safety: 'A1' },
      { code: 'R-448A', note: 'Lower-GWP alternative for commercial refrigeration', safety: 'A1' },
      { code: 'R-449A', note: 'Lower-GWP alternative for commercial refrigeration', safety: 'A1' },
    ],
  },
  {
    id: 'automotive',
    label: 'Automotive & Transport',
    hint: 'Vehicle AC, reefer trailers',
    icon: Car,
    gases: [
      { code: 'R-134A', note: 'Service charge for vehicle AC systems', safety: 'A1' },
      { code: 'R-452A', note: 'Used in transport refrigeration units', safety: 'A1' },
      { code: 'R-507A', note: 'Used in low-temperature transport and cold rooms', safety: 'A1' },
    ],
  },
  {
    id: 'retrofit',
    label: 'R-22 Retrofit & Phase-Out',
    hint: 'Replacing phased-out R-22 equipment',
    icon: RefreshCw,
    gases: [
      { code: 'R-407C', note: 'Common retrofit route for R-22 systems', safety: 'A1' },
      { code: 'R-438A', note: 'Service blend used to retrofit R-22 systems', safety: 'A1' },
      { code: 'R-422D', note: 'Service blend used to retrofit R-22 systems', safety: 'A1' },
    ],
  },
];

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const EquipmentGasFinder = () => {
  const { products } = useProducts();
  const [selected, setSelected] = useState<string>(OPTIONS[0].id);

  const active = OPTIONS.find((o) => o.id === selected) || OPTIONS[0];

  const matches = useMemo(() => {
    return active.gases.map((gas) => {
      const needle = normalise(gas.code);
      const match = (products || []).find(
        (p: any) => p.product_type === 'refrigerant' && normalise(p.name || '').includes(needle)
      );
      return { ...gas, product: match };
    });
  }, [active, products]);

  return (
    <section className="py-10 sm:py-14 bg-slate-800/60 border-y border-white/10">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 mb-3">
              <Search className="h-3.5 w-3.5 mr-1.5" />
              Find the right gas
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              What equipment are you charging?
            </h2>
            <p className="text-white/70 mt-2 text-sm sm:text-base max-w-2xl mx-auto">
              Pick your system type to see the refrigerants normally specified for it, then buy cylinders
              or request a bulk pallet quote.
            </p>
          </div>

          {/* Equipment selector */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 mb-6">
            {OPTIONS.map((option) => {
              const Icon = option.icon;
              const isActive = option.id === active.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelected(option.id)}
                  aria-pressed={isActive}
                  className={`text-left rounded-xl border p-3 transition-all duration-200 ${
                    isActive
                      ? 'border-cyan-400/60 bg-cyan-500/15 shadow-lg shadow-cyan-500/10'
                      : 'border-white/15 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Icon className={`h-5 w-5 mb-2 ${isActive ? 'text-cyan-300' : 'text-white/70'}`} />
                  <span className="block text-xs sm:text-sm font-semibold text-white leading-tight">
                    {option.label}
                  </span>
                  <span className="block text-[11px] text-white/60 mt-1 leading-tight">{option.hint}</span>
                </button>
              );
            })}
          </div>

          {/* Results */}
          <div className="grid gap-3 sm:grid-cols-3">
            {matches.map((gas) => (
              <Card key={gas.code} className="bg-white/95 border-0 shadow-xl">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-lg font-bold text-slate-900">{gas.code}</span>
                    <Badge variant="outline" className="text-[10px]">
                      ASHRAE {gas.safety}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed flex-1">{gas.note}</p>
                  <div className="mt-3">
                    {gas.product ? (
                      <Link to={`/products/${createProductSlug(gas.product.name)}`}>
                        <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          View {gas.product.name}
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    ) : (
                      <Link to={gas.fallbackHref || '/rfq'}>
                        <Button size="sm" variant="outline" className="w-full">
                          <Quote className="mr-1.5 h-3.5 w-3.5" />
                          {gas.fallbackHref ? `About ${gas.code}` : 'Request availability'}
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link to="/products/refrigerants">
              <Button variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20">
                Browse all refrigerants
              </Button>
            </Link>
            <Link to="/rfq">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                Request a bulk pallet quote
              </Button>
            </Link>
          </div>

          <p className="text-[11px] text-white/50 text-center mt-4 max-w-3xl mx-auto">
            Guidance only. Always confirm the charge specified on your equipment nameplate or by the
            manufacturer before ordering. Sales to certified professionals only.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EquipmentGasFinder;
