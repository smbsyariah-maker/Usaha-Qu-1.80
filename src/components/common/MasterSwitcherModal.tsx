import React from 'react';
import { 
  X, 
  Wrench, 
  Coffee, 
  Stethoscope, 
  ShoppingCart, 
  Package, 
  Check, 
  Sparkles,
  ExternalLink,
  Layers,
  Store
} from 'lucide-react';

export type EcosystemId = 'bengkel' | 'kedai' | 'klinik' | 'ritel' | 'titip';

export interface EcosystemModule {
  id: EcosystemId;
  name: string;
  tagline: string;
  category: string;
  layoutType: 'Grid Layout' | 'Sidebar Layout' | 'Navbar Layout';
  primaryColor: string;
  accentBg: string;
  icon: any;
  faIcon?: string;
  description: string;
  badge?: string;
  isReady: boolean;
}

export const ECOSYSTEM_MODULES: EcosystemModule[] = [
  {
    id: 'bengkel',
    name: 'BengkelQu',
    tagline: 'Otomotif & Bengkel Motor/Mobil',
    category: 'Otomotif & Servis',
    layoutType: 'Grid Layout',
    primaryColor: '#008952',
    accentBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    icon: Wrench,
    faIcon: 'fa-wrench',
    description: 'Manajemen antrian servis, kasir POS, mekanik, sparepart, dan faktur cetak nota.',
    badge: 'Aktif Utama',
    isReady: true
  },
  {
    id: 'kedai',
    name: 'KedaiQu',
    tagline: 'Cafe, Resto & F&B Modern',
    category: 'Restoran & Coffee Shop',
    layoutType: 'Sidebar Layout',
    primaryColor: '#047857',
    accentBg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    icon: Coffee,
    faIcon: 'fa-coffee',
    description: 'Denah meja interaktif drag & drop, KDS Dapur langsung, Kasir F&B, dan kelola staff.',
    badge: 'Fitur Baru',
    isReady: true
  },
  {
    id: 'klinik',
    name: 'KlinikQu',
    tagline: 'Klinik, Praktek Dokter & Apotek',
    category: 'Kesehatan & Medis',
    layoutType: 'Sidebar Layout',
    primaryColor: '#047857',
    accentBg: 'bg-teal-50 border-teal-200 text-teal-900',
    icon: Stethoscope,
    faIcon: 'fa-stethoscope',
    description: 'Pendaftaran pasien, nomor antrian rekam medis elektronik, resep & stok obat apotek.',
    badge: 'Tersedia',
    isReady: true
  },
  {
    id: 'ritel',
    name: 'RitelQu',
    tagline: 'Minimarket & Toko Kelontong',
    category: 'Toko & Swalayan',
    layoutType: 'Navbar Layout',
    primaryColor: '#4338ca',
    accentBg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    icon: ShoppingCart,
    faIcon: 'fa-cart-shopping',
    description: 'Kasir barcode cepat, stok grosir/eceran, alert expired date & supplier.',
    badge: 'Tersedia',
    isReady: true
  },
  {
    id: 'titip',
    name: 'TitipQu',
    tagline: 'Jasa Titip & Ekspedisi Paket',
    category: 'Logistik & Jastip',
    layoutType: 'Navbar Layout',
    primaryColor: '#0f766e',
    accentBg: 'bg-cyan-50 border-cyan-200 text-cyan-900',
    icon: Package,
    faIcon: 'fa-boxes-packing',
    description: 'Manajemen resi, barcode tracking penerimaan, manifest kurir & notifikasi WhatsApp.',
    badge: 'Tersedia',
    isReady: true
  }
];

interface MasterSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEcosystem: EcosystemId;
  onSelectEcosystem: (id: EcosystemId) => void;
}

export const MasterSwitcherModal: React.FC<MasterSwitcherModalProps> = ({
  isOpen,
  onClose,
  activeEcosystem,
  onSelectEcosystem
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-emerald-900/40">
                UQ
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold tracking-tight">UsahaQu v1.80</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    MASTER ECOSYSTEM
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Pilih Modul & Layout Operasional Bisnis Anda
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1 custom-scroll bg-slate-50/60">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-1">
            Modul Ekosistem Terpasang
          </div>

          {ECOSYSTEM_MODULES.map((item) => {
            const Icon = item.icon;
            const isCurrent = activeEcosystem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectEcosystem(item.id);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 relative group cursor-pointer ${
                  isCurrent 
                    ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Module Icon */}
                <div 
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white font-bold shadow-xs ${
                    item.id === 'bengkel' ? 'bg-[#008952]' :
                    item.id === 'kedai' ? 'bg-emerald-700' :
                    item.id === 'klinik' ? 'bg-teal-700' :
                    item.id === 'ritel' ? 'bg-indigo-600' : 'bg-cyan-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {item.name}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      item.layoutType === 'Sidebar Layout' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.layoutType === 'Grid Layout'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      {item.layoutType}
                    </span>
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ml-auto ${
                        isCurrent 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isCurrent ? 'Sedang Aktif' : item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {item.tagline}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </div>

                {/* Checked icon indicator */}
                {isCurrent && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 self-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium">Beralih modul cepat tanpa reload halaman</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
