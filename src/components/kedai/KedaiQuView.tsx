import React, { useState, useRef, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Plus, 
  Menu as MenuIcon, 
  X, 
  Coffee, 
  Utensils, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChefHat, 
  Trash2, 
  Printer, 
  CreditCard, 
  DollarSign, 
  Layers, 
  Search, 
  Send,
  Phone,
  UserPlus,
  RefreshCw,
  QrCode
} from 'lucide-react';

export interface KedaiTable {
  id: string;
  name: string;
  chairs: number;
  status: 'kosong' | 'terisi' | 'billing' | 'reservasi';
  customerName?: string;
  pax?: number;
  orderTotal?: number;
  orderItems?: { name: string; qty: number; price: number; notes?: string }[];
  occupiedSince?: string;
  x: number;
  y: number;
}

export interface KedaiMenuItem {
  id: string;
  name: string;
  category: 'kopi' | 'minuman' | 'makanan' | 'snack';
  price: number;
  imageIcon: string;
  stock: number;
  isPopular?: boolean;
}

export interface KDSTicket {
  id: string;
  tableId: string;
  tableName: string;
  orderTime: string;
  elapsedMinutes: number;
  status: 'antri' | 'memasak' | 'siap' | 'selesai';
  items: { name: string; qty: number; notes?: string; isDone?: boolean }[];
  waiterName?: string;
}

export interface KedaiStaff {
  id: string;
  name: string;
  role: 'Kasir' | 'Barista' | 'Koki / Chef' | 'Waiter / Pelayan' | 'Supervisor';
  phone: string;
  pin: string;
  shift: string;
  status: 'aktif' | 'libur';
}

export interface KedaiIngredient {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  minStock: number;
  costPerUnit: number;
}

const INITIAL_TABLES: KedaiTable[] = [
  { 
    id: 't-1', 
    name: 'Meja 01', 
    chairs: 4, 
    status: 'terisi', 
    customerName: 'Rian & Teman', 
    pax: 3, 
    orderTotal: 86000,
    orderItems: [
      { name: 'Kopi Susu Aren', qty: 2, price: 18000, notes: 'Less sugar, es pisah' },
      { name: 'Nasi Goreng Spesial', qty: 1, price: 28000, notes: 'Pedas sedang' },
      { name: 'French Fries', qty: 1, price: 22000 }
    ],
    occupiedSince: '14:15',
    x: 40, 
    y: 40 
  },
  { 
    id: 't-2', 
    name: 'Meja 02', 
    chairs: 2, 
    status: 'kosong', 
    x: 180, 
    y: 40 
  },
  { 
    id: 't-3', 
    name: 'Meja 03', 
    chairs: 4, 
    status: 'billing', 
    customerName: 'Bu Sarah', 
    pax: 4,
    orderTotal: 124000,
    orderItems: [
      { name: 'Matcha Latte', qty: 2, price: 22000 },
      { name: 'Caramel Macchiato', qty: 1, price: 24000 },
      { name: 'Roti Bakar Coklat Keju', qty: 2, price: 18000 },
      { name: 'Cireng Krispi', qty: 1, price: 20000 }
    ],
    occupiedSince: '13:50',
    x: 40, 
    y: 190 
  },
  { 
    id: 't-4', 
    name: 'Meja 04', 
    chairs: 6, 
    status: 'kosong', 
    x: 180, 
    y: 190 
  },
  { 
    id: 't-5', 
    name: 'VIP 01', 
    chairs: 10, 
    status: 'reservasi', 
    customerName: 'Keluarga Bpk. Hendra (Pukul 16:00)', 
    pax: 8,
    x: 40, 
    y: 340 
  },
  { 
    id: 't-6', 
    name: 'Meja Bar 01', 
    chairs: 2, 
    status: 'kosong', 
    x: 210, 
    y: 340 
  }
];

const KEDAI_MENU: KedaiMenuItem[] = [
  { id: 'm-1', name: 'Kopi Susu Aren Kedai', category: 'kopi', price: 18000, imageIcon: '☕', stock: 45, isPopular: true },
  { id: 'm-2', name: 'Espresso Double Shot', category: 'kopi', price: 15000, imageIcon: '☕', stock: 60 },
  { id: 'm-3', name: 'Americano Ice/Hot', category: 'kopi', price: 16000, imageIcon: '☕', stock: 50 },
  { id: 'm-4', name: 'Caramel Macchiato', category: 'kopi', price: 24000, imageIcon: '☕', stock: 30, isPopular: true },
  { id: 'm-5', name: 'Matcha Latte Cream', category: 'minuman', price: 22000, imageIcon: '🍵', stock: 28, isPopular: true },
  { id: 'm-6', name: 'Lemon Tea Segar', category: 'minuman', price: 14000, imageIcon: '🍹', stock: 55 },
  { id: 'm-7', name: 'Coklat Klasik Ice', category: 'minuman', price: 20000, imageIcon: '🍫', stock: 35 },
  { id: 'm-8', name: 'Nasi Goreng Spesial', category: 'makanan', price: 28000, imageIcon: '🍳', stock: 40, isPopular: true },
  { id: 'm-9', name: 'Mie Dok-Dok Kuah', category: 'makanan', price: 22000, imageIcon: '🍜', stock: 35 },
  { id: 'm-10', name: 'Ayam Geprek Sambal Matah', category: 'makanan', price: 25000, imageIcon: '🍗', stock: 25, isPopular: true },
  { id: 'm-11', name: 'French Fries Bolognese', category: 'snack', price: 22000, imageIcon: '🍟', stock: 40 },
  { id: 'm-12', name: 'Cireng Krispi Bumbu Rujak', category: 'snack', price: 18000, imageIcon: '🥟', stock: 30 },
  { id: 'm-13', name: 'Roti Bakar Coklat Keju', category: 'snack', price: 18000, imageIcon: '🍞', stock: 25 }
];

const INITIAL_KDS: KDSTicket[] = [
  {
    id: 'KDS-101',
    tableId: 't-1',
    tableName: 'Meja 01',
    orderTime: '14:20',
    elapsedMinutes: 8,
    status: 'memasak',
    waiterName: 'Agus',
    items: [
      { name: 'Kopi Susu Aren', qty: 2, notes: 'Less sugar, es pisah', isDone: true },
      { name: 'Nasi Goreng Spesial', qty: 1, notes: 'Pedas sedang telur mata sapi', isDone: false },
      { name: 'French Fries', qty: 1, notes: 'Saus sambal banyak', isDone: false }
    ]
  },
  {
    id: 'KDS-102',
    tableId: 't-3',
    tableName: 'Meja 03',
    orderTime: '14:25',
    elapsedMinutes: 3,
    status: 'antri',
    waiterName: 'Siti',
    items: [
      { name: 'Matcha Latte', qty: 2, notes: 'Hot & Ice', isDone: false },
      { name: 'Roti Bakar Coklat Keju', qty: 2, notes: 'Keju parut tebal', isDone: false }
    ]
  }
];

const INITIAL_STAFF: KedaiStaff[] = [
  { id: 'st-1', name: 'Budi Santoso', role: 'Supervisor', phone: '081234567890', pin: '1234', shift: 'Pagi (08:00 - 16:00)', status: 'aktif' },
  { id: 'st-2', name: 'Dian Permana', role: 'Barista', phone: '081398765432', pin: '2345', shift: 'Pagi (08:00 - 16:00)', status: 'aktif' },
  { id: 'st-3', name: 'Chef Junaidi', role: 'Koki / Chef', phone: '085712345678', pin: '3456', shift: 'Sore (15:00 - 23:00)', status: 'aktif' },
  { id: 'st-4', name: 'Agus Prasetyo', role: 'Waiter / Pelayan', phone: '082198761234', pin: '4567', shift: 'Pagi (08:00 - 16:00)', status: 'aktif' },
  { id: 'st-5', name: 'Siti Rahmawati', role: 'Kasir', phone: '087812349876', pin: '5678', shift: 'Full Day', status: 'aktif' }
];

const INITIAL_INGREDIENTS: KedaiIngredient[] = [
  { id: 'ing-1', name: 'Biji Kopi Arabika House Blend', category: 'Kopi', stock: 12.5, unit: 'Kg', minStock: 3, costPerUnit: 140000 },
  { id: 'ing-2', name: 'Susu Segar UHT Full Cream', category: 'Dairy', stock: 24, unit: 'Liter', minStock: 8, costPerUnit: 19500 },
  { id: 'ing-3', name: 'Sirup Gula Aren Asli', category: 'Sirup', stock: 8.5, unit: 'Liter', minStock: 2, costPerUnit: 35000 },
  { id: 'ing-4', name: 'Beras Ramos Super', category: 'Dapur', stock: 40, unit: 'Kg', minStock: 15, costPerUnit: 14500 },
  { id: 'ing-5', name: 'Daging Ayam Fillet', category: 'Dapur', stock: 8, unit: 'Kg', minStock: 4, costPerUnit: 48000 },
  { id: 'ing-6', name: 'Cup Sablon 16oz + Tutup', category: 'Kemasan', stock: 350, unit: 'Pcs', minStock: 100, costPerUnit: 850 }
];

interface KedaiQuViewProps {
  onBackToBengkel?: () => void;
  onOpenMasterSwitcher: () => void;
}

export const KedaiQuView: React.FC<KedaiQuViewProps> = ({
  onBackToBengkel,
  onOpenMasterSwitcher
}) => {
  // Navigation & Layout states
  const [activeTab, setActiveTab] = useState<'meja' | 'kasir' | 'dapur' | 'stok' | 'staff' | 'pelanggan' | 'laporan' | 'pengaturan'>('meja');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLayoutLocked, setIsLayoutLocked] = useState(true);
  const [chairSelection, setChairSelection] = useState<number>(4);

  // Data states
  const [tables, setTables] = useState<KedaiTable[]>(() => {
    const saved = localStorage.getItem('kq_tables');
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });

  const [kdsTickets, setKdsTickets] = useState<KDSTicket[]>(() => {
    const saved = localStorage.getItem('kq_kds');
    return saved ? JSON.parse(saved) : INITIAL_KDS;
  });

  const [staffList, setStaffList] = useState<KedaiStaff[]>(() => {
    const saved = localStorage.getItem('kq_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [ingredients, setIngredients] = useState<KedaiIngredient[]>(INITIAL_INGREDIENTS);

  // Selected table modal / detail
  const [selectedTable, setSelectedTable] = useState<KedaiTable | null>(null);

  // POS State
  const [posCategory, setPosCategory] = useState<'semua' | 'kopi' | 'minuman' | 'makanan' | 'snack'>('semua');
  const [posSelectedTableId, setPosSelectedTableId] = useState<string>('t-1');
  const [posCart, setPosCart] = useState<{ item: KedaiMenuItem; qty: number; notes?: string }[]>([]);
  const [posCustomerName, setPosCustomerName] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'tunai' | 'qris' | 'debit'>('tunai');
  const [cashAmount, setCashAmount] = useState<number>(100000);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [lastPaymentSummary, setLastPaymentSummary] = useState<any>(null);

  // Staff Modal State
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: 'Barista' as KedaiStaff['role'],
    phone: '',
    pin: '',
    shift: 'Pagi (08:00 - 16:00)'
  });

  // Table dragging state
  const [draggingTableId, setDraggingTableId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const floorPlanRef = useRef<HTMLDivElement>(null);

  // Save tables
  useEffect(() => {
    localStorage.setItem('kq_tables', JSON.stringify(tables));
  }, [tables]);

  // Save KDS
  useEffect(() => {
    localStorage.setItem('kq_kds', JSON.stringify(kdsTickets));
  }, [kdsTickets]);

  // Save staff
  useEffect(() => {
    localStorage.setItem('kq_staff', JSON.stringify(staffList));
  }, [staffList]);

  // Table management
  const handleAddNewTable = () => {
    const nextNumber = tables.length + 1;
    const padded = nextNumber < 10 ? `0${nextNumber}` : `${nextNumber}`;
    const newTbl: KedaiTable = {
      id: `t-${Date.now()}`,
      name: chairSelection === 10 ? `VIP ${padded}` : `Meja ${padded}`,
      chairs: chairSelection,
      status: 'kosong',
      x: 30 + ((tables.length * 40) % 200),
      y: 40 + ((tables.length * 60) % 360)
    };
    setTables([...tables, newTbl]);
  };

  const handleDeleteTable = (id: string) => {
    setTables(tables.filter((t) => t.id !== id));
    if (selectedTable?.id === id) setSelectedTable(null);
  };

  // Dragging handlers for floor plan
  const handleMouseDownTable = (e: React.MouseEvent, table: KedaiTable) => {
    if (isLayoutLocked) return;
    e.stopPropagation();
    setDraggingTableId(table.id);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMoveFloor = (e: React.MouseEvent) => {
    if (isLayoutLocked || !draggingTableId || !floorPlanRef.current) return;
    const containerRect = floorPlanRef.current.getBoundingClientRect();
    const newX = Math.max(10, Math.min(containerRect.width - 110, e.clientX - containerRect.left - dragOffset.x));
    const newY = Math.max(10, Math.min(containerRect.height - 110, e.clientY - containerRect.top - dragOffset.y));

    setTables((prev) =>
      prev.map((t) => (t.id === draggingTableId ? { ...t, x: Math.round(newX), y: Math.round(newY) } : t))
    );
  };

  const handleMouseUpFloor = () => {
    setDraggingTableId(null);
  };

  // Touch support for dragging tables
  const handleTouchStartTable = (e: React.TouchEvent, table: KedaiTable) => {
    if (isLayoutLocked) return;
    e.stopPropagation();
    setDraggingTableId(table.id);
    const touch = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  const handleTouchMoveFloor = (e: React.TouchEvent) => {
    if (isLayoutLocked || !draggingTableId || !floorPlanRef.current) return;
    const touch = e.touches[0];
    const containerRect = floorPlanRef.current.getBoundingClientRect();
    const newX = Math.max(10, Math.min(containerRect.width - 110, touch.clientX - containerRect.left - dragOffset.x));
    const newY = Math.max(10, Math.min(containerRect.height - 110, touch.clientY - containerRect.top - dragOffset.y));

    setTables((prev) =>
      prev.map((t) => (t.id === draggingTableId ? { ...t, x: Math.round(newX), y: Math.round(newY) } : t))
    );
  };

  // POS Handlers
  const handleAddToCart = (item: KedaiMenuItem) => {
    setPosCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) => (i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const handleUpdateCartQty = (itemId: string, delta: number) => {
    setPosCart((prev) =>
      prev
        .map((i) => {
          if (i.item.id === itemId) {
            const newQty = i.qty + delta;
            return newQty > 0 ? { ...i, qty: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as { item: KedaiMenuItem; qty: number; notes?: string }[]
    );
  };

  const handleUpdateCartNotes = (itemId: string, notes: string) => {
    setPosCart((prev) =>
      prev.map((i) => (i.item.id === itemId ? { ...i, notes } : i))
    );
  };

  const cartSubtotal = posCart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const cartTax = Math.round(cartSubtotal * 0.1); // PB1 10%
  const cartTotal = cartSubtotal + cartTax;

  // Send Order to Kitchen (KDS) & assign to table
  const handleSendOrderToKitchen = () => {
    if (posCart.length === 0) return;
    const targetTbl = tables.find((t) => t.id === posSelectedTableId);
    const tableName = targetTbl ? targetTbl.name : 'Pesanan Takeaway';

    const newTicket: KDSTicket = {
      id: `KDS-${Date.now().toString().slice(-3)}`,
      tableId: posSelectedTableId,
      tableName: tableName,
      orderTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      elapsedMinutes: 0,
      status: 'antri',
      waiterName: 'Staff Kedai',
      items: posCart.map((c) => ({
        name: c.item.name,
        qty: c.qty,
        notes: c.notes,
        isDone: false
      }))
    };

    setKdsTickets([newTicket, ...kdsTickets]);

    // Update table status if assigned
    if (targetTbl) {
      setTables((prev) =>
        prev.map((t) => {
          if (t.id === targetTbl.id) {
            const existingItems = t.orderItems || [];
            const newOrderItems = [
              ...existingItems,
              ...posCart.map((c) => ({ name: c.item.name, qty: c.qty, price: c.item.price, notes: c.notes }))
            ];
            const newTotal = (t.orderTotal || 0) + cartTotal;
            return {
              ...t,
              status: 'terisi',
              customerName: posCustomerName || t.customerName || 'Tamu Kedai',
              orderTotal: newTotal,
              orderItems: newOrderItems,
              occupiedSince: t.occupiedSince || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            };
          }
          return t;
        })
      );
    }

    // Reset POS
    setPosCart([]);
    setPosCustomerName('');
    setActiveTab('dapur');
  };

  // Process Payment
  const handleCompletePayment = () => {
    const summary = {
      orderId: `KD-${Date.now().toString().slice(-5)}`,
      tableName: tables.find((t) => t.id === posSelectedTableId)?.name || 'Takeaway',
      customerName: posCustomerName || 'Pelanggan Kedai',
      items: posCart,
      subtotal: cartSubtotal,
      tax: cartTax,
      total: cartTotal,
      paymentMethod,
      cashAmount,
      change: Math.max(0, cashAmount - cartTotal),
      date: new Date().toLocaleString('id-ID')
    };

    setLastPaymentSummary(summary);
    setIsPaymentModalOpen(false);
    setIsReceiptModalOpen(true);

    // If table was paid, free the table
    setTables((prev) =>
      prev.map((t) => (t.id === posSelectedTableId ? { ...t, status: 'kosong', orderItems: [], orderTotal: 0, customerName: undefined } : t))
    );

    setPosCart([]);
    setPosCustomerName('');
  };

  // Staff creation
  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name) return;
    const newStaff: KedaiStaff = {
      id: `st-${Date.now()}`,
      name: staffForm.name,
      role: staffForm.role,
      phone: staffForm.phone || '08xxxxxxxx',
      pin: staffForm.pin || '1234',
      shift: staffForm.shift,
      status: 'aktif'
    };
    setStaffList([...staffList, newStaff]);
    setIsStaffModalOpen(false);
    setStaffForm({
      name: '',
      role: 'Barista',
      phone: '',
      pin: '',
      shift: 'Pagi (08:00 - 16:00)'
    });
  };

  // Table summary counts
  const filledTablesCount = tables.filter((t) => t.status === 'terisi' || t.status === 'billing').length;
  const emptyTablesCount = tables.filter((t) => t.status === 'kosong').length;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden relative font-sans antialiased">
      {/* 1. MASTER HEADER KEDAIQU */}
      <header className="bg-slate-900 text-white px-4 py-2.5 flex justify-between items-center z-30 shadow-md shrink-0">
        <div className="flex items-center space-x-3">
          {/* Hamburger button to open sidebar */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer"
            title="Buka Navigasi KedaiQu"
          >
            <MenuIcon className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Logo with Master Switcher trigger */}
          <button
            onClick={onOpenMasterSwitcher}
            className="flex items-center gap-2 group cursor-pointer text-left"
            title="Klik untuk membuka UsahaQu Master Ecosystem Switcher"
          >
            <div className="bg-emerald-600 hover:bg-emerald-500 p-1.5 rounded-lg text-white font-black text-xs flex items-center justify-center w-8 h-8 shadow-sm group-hover:ring-2 group-hover:ring-emerald-400 transition-all">
              UQ
            </div>
            <div>
              <h1 className="font-bold text-xs leading-tight flex items-center gap-1.5 text-white">
                <span>KedaiQu</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase bg-emerald-500/30 text-emerald-300 border border-emerald-500/20">
                  SIDEBAR
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <span>UsahaQu v1.80 (Paket Pro)</span>
                <span className="text-[9px] text-emerald-400 font-semibold underline group-hover:text-emerald-300">Ganti Modul ▾</span>
              </p>
            </div>
          </button>
        </div>

        {/* Quick status & Switch back to BengkelQu button */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-[11px] bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {emptyTablesCount} Meja Kosong
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400">{filledTablesCount} Terisi</span>
          </div>

          <button
            onClick={onOpenMasterSwitcher}
            className="bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ekosistem</span>
          </button>
        </div>
      </header>

      {/* 2. SIDEBAR DRAWER OVERLAY & ASIDE */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-emerald-900/20 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-emerald-300" />
            <span className="font-bold text-xs">Navigasi KedaiQu</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PENGATURAN MEJA DI SIDEBAR */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs space-y-2">
          <p className="font-bold text-slate-700 text-[11px] flex items-center justify-between">
            <span>Pengaturan Denah Meja</span>
            <span className="text-[10px] text-slate-400 font-normal">{tables.length} Total</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsLayoutLocked(!isLayoutLocked)}
              className={`flex-1 text-[11px] font-bold py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                isLayoutLocked
                  ? 'bg-slate-800 hover:bg-slate-900 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-400/40'
              }`}
            >
              {isLayoutLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Locked</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-white" />
                  <span>Mode Edit</span>
                </>
              )}
            </button>
            <button
              onClick={handleAddNewTable}
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-[11px] font-bold py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Meja</span>
            </button>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-500 text-[10px]">Pilih Kursi:</span>
            <select
              value={chairSelection}
              onChange={(e) => setChairSelection(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="2">2 Kursi</option>
              <option value="4">4 Kursi</option>
              <option value="6">6 Kursi</option>
              <option value="10">VIP (10 Kursi)</option>
            </select>
          </div>
        </div>

        {/* DAFTAR MENU VERTIKAL */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1 text-xs font-medium custom-scroll">
          <button
            onClick={() => {
              setActiveTab('meja');
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
              activeTab === 'meja'
                ? 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="w-5 text-center text-emerald-600 font-bold">🪑</div>
            <span>Denah Meja</span>
            <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
              {tables.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('kasir');
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
              activeTab === 'kasir'
                ? 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="w-5 text-center text-emerald-600 font-bold">💵</div>
            <span>Kasir / Pesanan</span>
            {posCart.length > 0 && (
              <span className="ml-auto text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                {posCart.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('dapur');
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
              activeTab === 'dapur'
                ? 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="w-5 text-center text-emerald-600 font-bold">🍳</div>
            <span>Dapur (KDS)</span>
            {kdsTickets.filter((k) => k.status !== 'selesai').length > 0 && (
              <span className="ml-auto text-[10px] bg-red-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                {kdsTickets.filter((k) => k.status !== 'selesai').length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('stok');
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
              activeTab === 'stok'
                ? 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="w-5 text-center text-emerald-600 font-bold">📦</div>
            <span>Stok & Bahan</span>
          </button>

          <button
            onClick={() => {
              setIsStaffModalOpen(true);
              setIsSidebarOpen(false);
            }}
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-emerald-600" />
            <span>Kelola Staff / Karyawan</span>
            <span className="ml-auto text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold">
              {staffList.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('pelanggan');
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
              activeTab === 'pelanggan'
                ? 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="w-5 text-center text-emerald-600 font-bold">👥</div>
            <span>Pelanggan</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('laporan');
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
              activeTab === 'laporan'
                ? 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="w-5 text-center text-emerald-600 font-bold">📊</div>
            <span>Laporan</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('pengaturan');
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
              activeTab === 'pengaturan'
                ? 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="w-5 text-center text-emerald-600 font-bold">⚙️</div>
            <span>Pengaturan</span>
          </button>
        </nav>

        {/* Sidebar Footer: Back to BengkelQu */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              onOpenMasterSwitcher();
            }}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>UsahaQu Switcher</span>
          </button>
        </div>
      </aside>

      {/* 3. DYNAMIC MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* TAB 1: DENAH MEJA (INTERACTIVE DRAGGABLE FLOOR PLAN) */}
        {activeTab === 'meja' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Top Toolbar */}
            <div className="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 shadow-xs shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Denah Lantai Cafe
                </span>
                <span className="text-[11px] text-slate-500">
                  {isLayoutLocked ? (
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      🔒 Meja Terkunci (Klik meja untuk info)
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold animate-pulse">
                      🔓 Mode Edit (Geser / Atur Meja Aktif)
                    </span>
                  )}
                </span>
              </div>

              {/* Status legends */}
              <div className="flex items-center gap-2 text-[10px] font-semibold">
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Kosong
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Terisi
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Billing
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Reservasi
                </span>
              </div>
            </div>

            {/* Canvas Floor Plan Area */}
            <div
              ref={floorPlanRef}
              onMouseMove={handleMouseMoveFloor}
              onMouseUp={handleMouseUpFloor}
              onTouchMove={handleTouchMoveFloor}
              onTouchEnd={handleMouseUpFloor}
              className="flex-1 relative overflow-auto bg-slate-100 p-4 select-none"
              style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
                backgroundSize: '24px 24px',
                minHeight: '480px'
              }}
            >
              {tables.map((table) => {
                const isSelected = selectedTable?.id === table.id;
                const isEditable = !isLayoutLocked;

                const statusColor = 
                  table.status === 'terisi' ? 'border-amber-400 bg-amber-50/90 text-amber-900 shadow-amber-200/50' :
                  table.status === 'billing' ? 'border-purple-400 bg-purple-50/90 text-purple-900 shadow-purple-200/50' :
                  table.status === 'reservasi' ? 'border-blue-400 bg-blue-50/90 text-blue-900 shadow-blue-200/50' :
                  'border-emerald-400 bg-white/95 text-slate-800 shadow-slate-200';

                return (
                  <div
                    key={table.id}
                    onMouseDown={(e) => handleMouseDownTable(e, table)}
                    onTouchStart={(e) => handleTouchStartTable(e, table)}
                    onClick={() => {
                      if (isLayoutLocked) setSelectedTable(table);
                    }}
                    style={{
                      left: `${table.x}px`,
                      top: `${table.y}px`,
                      width: table.chairs >= 10 ? '160px' : table.chairs >= 6 ? '135px' : '105px',
                      height: table.chairs >= 10 ? '110px' : '95px'
                    }}
                    className={`absolute rounded-2xl border-2 shadow-md p-2 flex flex-col justify-between transition-shadow z-10 ${statusColor} ${
                      isEditable ? 'cursor-grab active:cursor-grabbing border-dashed border-amber-500 scale-102' : 'cursor-pointer hover:shadow-lg'
                    } ${isSelected ? 'ring-3 ring-emerald-500 ring-offset-1' : ''}`}
                  >
                    {/* Table Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs tracking-tight">{table.name}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        table.status === 'terisi' ? 'bg-amber-200 text-amber-800' :
                        table.status === 'billing' ? 'bg-purple-200 text-purple-800' :
                        table.status === 'reservasi' ? 'bg-blue-200 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {table.chairs} Kursi
                      </span>
                    </div>

                    {/* Table Center Info */}
                    <div className="my-auto text-center">
                      {table.status === 'terisi' && (
                        <div>
                          <p className="text-[10px] font-bold truncate">{table.customerName || 'Tamu'}</p>
                          <p className="text-[11px] font-black text-amber-700">Rp {table.orderTotal?.toLocaleString('id-ID')}</p>
                        </div>
                      )}
                      {table.status === 'billing' && (
                        <div>
                          <p className="text-[10px] font-bold text-purple-700">Minta Bill</p>
                          <p className="text-[11px] font-black text-purple-900">Rp {table.orderTotal?.toLocaleString('id-ID')}</p>
                        </div>
                      )}
                      {table.status === 'reservasi' && (
                        <p className="text-[10px] font-semibold text-blue-700 truncate">{table.customerName}</p>
                      )}
                      {table.status === 'kosong' && (
                        <p className="text-[11px] font-semibold text-emerald-600">Tersedia</p>
                      )}
                    </div>

                    {/* Table Footer */}
                    <div className="flex items-center justify-between text-[9px] text-slate-500">
                      {table.occupiedSince ? (
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {table.occupiedSince}
                        </span>
                      ) : (
                        <span>Siap pakai</span>
                      )}
                      {isEditable && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTable(table.id);
                          }}
                          className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                          title="Hapus Meja"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom floating quick table drawer/details when a table is clicked in Locked mode */}
            {selectedTable && (
              <div className="bg-white border-t border-slate-200 p-4 shadow-xl z-20 animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-base flex items-center justify-center shadow-xs">
                      {selectedTable.name.slice(0, 3)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{selectedTable.name} ({selectedTable.chairs} Kursi)</h4>
                      <p className="text-xs text-slate-500">
                        Status: <strong className="uppercase text-emerald-700">{selectedTable.status}</strong>
                        {selectedTable.customerName && ` • Tamu: ${selectedTable.customerName}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTable(null)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    {selectedTable.orderTotal ? (
                      <div className="text-xs">
                        <span className="text-slate-500">Total Tagihan Sementara: </span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          Rp {selectedTable.orderTotal.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-2">({selectedTable.orderItems?.length || 0} item)</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Belum ada pesanan aktif di meja ini.</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setPosSelectedTableId(selectedTable.id);
                        setActiveTab('kasir');
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Input Pesanan (Kasir)</span>
                    </button>

                    {selectedTable.status !== 'kosong' && (
                      <button
                        onClick={() => {
                          setTables((prev) =>
                            prev.map((t) => (t.id === selectedTable.id ? { ...t, status: 'kosong', orderItems: [], orderTotal: 0, customerName: undefined } : t))
                          );
                          setSelectedTable(null);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        Kosongkan Meja
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: KASIR / PESANAN (F&B POS) */}
        {activeTab === 'kasir' && (
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-slate-100">
            {/* Left Column: Menu Items */}
            <div className="flex-1 flex flex-col overflow-hidden p-3 border-r border-slate-200 bg-white">
              {/* Top Filter Bar */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-1 overflow-x-auto custom-scroll py-1">
                  {(['semua', 'kopi', 'minuman', 'makanan', 'snack'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPosCategory(cat)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl capitalize transition-all cursor-pointer shrink-0 ${
                        posCategory === cat
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-500 font-semibold shrink-0">
                  Meja:{' '}
                  <select
                    value={posSelectedTableId}
                    onChange={(e) => setPosSelectedTableId(e.target.value)}
                    className="bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-xs rounded-lg px-2 py-1 outline-none cursor-pointer"
                  >
                    <option value="takeaway">🥡 Bungkus / Takeaway</option>
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Menu Grid */}
              <div className="flex-1 overflow-y-auto p-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5 custom-scroll">
                {KEDAI_MENU.filter((m) => posCategory === 'semua' || m.category === posCategory).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAddToCart(item)}
                    className="p-2.5 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/40 text-left transition-all shadow-xs flex flex-col justify-between group cursor-pointer active:scale-98"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl p-1.5 bg-slate-100 rounded-xl group-hover:scale-110 transition-transform">
                        {item.imageIcon}
                      </span>
                      {item.isPopular && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                          Favorit
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className="font-bold text-xs text-slate-800 line-clamp-1 group-hover:text-emerald-700">
                        {item.name}
                      </p>
                      <p className="font-extrabold text-xs text-emerald-700 mt-0.5">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Order Cart */}
            <div className="w-full md:w-80 bg-slate-50 flex flex-col h-full border-t md:border-t-0 shrink-0">
              {/* Cart Header */}
              <div className="p-3 bg-white border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    <span>Pesanan: {posSelectedTableId === 'takeaway' ? 'Takeaway' : tables.find((t) => t.id === posSelectedTableId)?.name}</span>
                  </h3>
                  {posCart.length > 0 && (
                    <button
                      onClick={() => setPosCart([])}
                      className="text-[11px] text-red-600 hover:underline font-semibold cursor-pointer"
                    >
                      Kosongkan
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={posCustomerName}
                  onChange={(e) => setPosCustomerName(e.target.value)}
                  placeholder="Nama Tamu (opsional)..."
                  className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scroll">
                {posCart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs py-8">
                    <ShoppingBag className="w-8 h-8 mb-2 opacity-40 text-emerald-600" />
                    <span>Keranjang masih kosong</span>
                    <span className="text-[10px]">Pilih menu di samping untuk memesan</span>
                  </div>
                ) : (
                  posCart.map(({ item, qty, notes }) => (
                    <div key={item.id} className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-xs text-slate-800">{item.name}</p>
                          <p className="text-[11px] text-emerald-700 font-semibold">
                            Rp {(item.price * qty).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5">
                          <button
                            onClick={() => handleUpdateCartQty(item.id, -1)}
                            className="w-5 h-5 rounded bg-white text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-200 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold px-1.5">{qty}</span>
                          <button
                            onClick={() => handleUpdateCartQty(item.id, 1)}
                            className="w-5 h-5 rounded bg-white text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-200 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={notes || ''}
                        onChange={(e) => handleUpdateCartNotes(item.id, e.target.value)}
                        placeholder="Catatan (e.g. less ice, pedas)..."
                        className="w-full mt-1.5 text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 outline-none"
                      />
                    </div>
                  ))
                )}
              </div>

              {/* Cart Totals & Actions */}
              <div className="p-3 bg-white border-t border-slate-200 space-y-2">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>Rp {cartSubtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Pajak PB1 (10%)</span>
                    <span>Rp {cartTax.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1 border-t border-slate-100">
                    <span>Total Tagihan</span>
                    <span className="text-emerald-700">Rp {cartTotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    disabled={posCart.length === 0}
                    onClick={handleSendOrderToKitchen}
                    className="bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Kirim Dapur</span>
                  </button>

                  <button
                    disabled={posCart.length === 0}
                    onClick={() => {
                      setCashAmount(Math.ceil(cartTotal / 10000) * 10000);
                      setIsPaymentModalOpen(true);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Bayar Kasir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DAPUR (KDS - KITCHEN DISPLAY SYSTEM) */}
        {activeTab === 'dapur' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden p-4 bg-slate-900 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-extrabold tracking-tight">KDS (Kitchen Display System) - Tiket Pesanan Masuk</h2>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                {kdsTickets.filter((k) => k.status !== 'selesai').length} Tiket Aktif
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 custom-scroll">
              {kdsTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`rounded-2xl border p-3 flex flex-col justify-between shadow-lg ${
                    ticket.status === 'siap'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100'
                      : ticket.status === 'memasak'
                      ? 'bg-amber-950/60 border-amber-500 text-amber-100'
                      : 'bg-slate-800/90 border-slate-700 text-slate-100'
                  }`}
                >
                  {/* Ticket Header */}
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div>
                        <span className="font-extrabold text-sm">{ticket.tableName}</span>
                        <span className="text-[10px] text-slate-400 ml-2">#{ticket.id}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ticket.status === 'siap' ? 'bg-emerald-500 text-white' :
                        ticket.status === 'memasak' ? 'bg-amber-500 text-white' :
                        'bg-red-500 text-white animate-pulse'
                      }`}>
                        {ticket.status === 'siap' ? 'Siap Saji' : ticket.status === 'memasak' ? 'Memasak' : 'Antri'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 my-1.5">
                      <Clock className="w-3 h-3" />
                      <span>Masuk: {ticket.orderTime}</span>
                      <span>• Pelayan: {ticket.waiterName || 'Staff'}</span>
                    </div>

                    {/* Ticket Items */}
                    <div className="space-y-1.5 my-2">
                      {ticket.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between text-xs py-1 border-b border-white/5"
                        >
                          <div>
                            <span className="font-bold mr-1.5 text-white">{it.qty}x</span>
                            <span className={it.isDone ? 'line-through text-slate-400' : 'text-slate-100'}>
                              {it.name}
                            </span>
                            {it.notes && (
                              <p className="text-[10px] text-amber-300 font-semibold pl-4">
                                ↳ {it.notes}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setKdsTickets((prev) =>
                                prev.map((t) =>
                                  t.id === ticket.id
                                    ? {
                                        ...t,
                                        items: t.items.map((item, i) =>
                                          i === idx ? { ...item, isDone: !item.isDone } : item
                                        )
                                      }
                                    : t
                                )
                              );
                            }}
                            className="text-[10px] text-slate-400 hover:text-emerald-400 px-1 cursor-pointer"
                          >
                            {it.isDone ? '✓ Siap' : 'Belum'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ticket Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    {ticket.status === 'antri' && (
                      <button
                        onClick={() => {
                          setKdsTickets((prev) =>
                            prev.map((t) => (t.id === ticket.id ? { ...t, status: 'memasak' } : t))
                          );
                        }}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        Mulai Masak
                      </button>
                    )}
                    {ticket.status === 'memasak' && (
                      <button
                        onClick={() => {
                          setKdsTickets((prev) =>
                            prev.map((t) => (t.id === ticket.id ? { ...t, status: 'siap' } : t))
                          );
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        Siap Disajikan
                      </button>
                    )}
                    {ticket.status === 'siap' && (
                      <button
                        onClick={() => {
                          setKdsTickets((prev) =>
                            prev.map((t) => (t.id === ticket.id ? { ...t, status: 'selesai' } : t))
                          );
                        }}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        Tandai Selesai Diantar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STOK & BAHAN BAKU */}
        {activeTab === 'stok' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Stok Bahan Baku & Logistik Kedai</h3>
                <p className="text-xs text-slate-500">Monitor biji kopi, susu, sirup, dan kemasan kedai</p>
              </div>
              <button
                onClick={() => alert('Fitur Tambah Stok Bahan Baku siap digunakan.')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Stok Bahan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ingredients.map((ing) => {
                const isLow = ing.stock <= ing.minStock;
                return (
                  <div key={ing.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800">{ing.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                          {ing.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Biaya Pokok: Rp {ing.costPerUnit.toLocaleString('id-ID')} / {ing.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-base font-black ${isLow ? 'text-red-600' : 'text-slate-900'}`}>
                        {ing.stock} {ing.unit}
                      </div>
                      {isLow ? (
                        <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                          Menipis! Min: {ing.minStock} {ing.unit}
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-medium">Stok Aman</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: STAFF & KARYAWAN */}
        {activeTab === 'staff' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Kelola Staff & Karyawan KedaiQu</h3>
                <p className="text-xs text-slate-500">Daftar barista, kasir, koki, pelayan, dan supervisor</p>
              </div>
              <button
                onClick={() => setIsStaffModalOpen(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Tambah Staff</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {staffList.map((st) => (
                <div key={st.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                      {st.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{st.name}</h4>
                      <p className="text-[11px] text-emerald-700 font-semibold">{st.role}</p>
                      <p className="text-[10px] text-slate-400">Shift: {st.shift}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      PIN: {st.pin}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">{st.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: LAPORAN & RINGKASAN */}
        {(activeTab === 'laporan' || activeTab === 'pelanggan' || activeTab === 'pengaturan') && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-800 mb-2">Ringkasan Operasional KedaiQu</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-bold">Total Meja</span>
                  <div className="text-lg font-black text-slate-800">{tables.length} Unit</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <span className="text-[10px] text-emerald-700 font-bold">Meja Terisi</span>
                  <div className="text-lg font-black text-emerald-800">{filledTablesCount} Unit</div>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl">
                  <span className="text-[10px] text-amber-700 font-bold">Pesanan KDS</span>
                  <div className="text-lg font-black text-amber-800">{kdsTickets.length} Tiket</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <span className="text-[10px] text-blue-700 font-bold">Staff Aktif</span>
                  <div className="text-lg font-black text-blue-800">{staffList.length} Orang</div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-800 text-white rounded-2xl p-4 shadow-sm">
              <h4 className="font-bold text-xs mb-1">Informasi Sinkronisasi Ekosistem UsahaQu</h4>
              <p className="text-xs text-emerald-100">
                Semua data kedai, denah meja, menu, dan karyawan tersimpan secara lokal dan dapat dialihkan ke BengkelQu sewaktu-waktu melalui tombol logo atau switcher.
              </p>
              <button
                onClick={onOpenMasterSwitcher}
                className="mt-3 bg-white text-emerald-900 font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs hover:bg-emerald-50 cursor-pointer"
              >
                Buka UsahaQu Master Switcher
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 4. MODAL TAMBAH STAFF (Sesuai dengan HTML spesifikasi user) */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-700" />
                <span>Tambah Staff / Karyawan</span>
              </h3>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap Staff</label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  required
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Jabatan / Role</label>
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value="Kasir">Kasir</option>
                  <option value="Barista">Barista</option>
                  <option value="Koki / Chef">Koki / Chef</option>
                  <option value="Waiter / Pelayan">Waiter / Pelayan</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nomor WhatsApp / HP</label>
                <input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">PIN Akses (4 Digit)</label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="1234"
                    value={staffForm.pin}
                    onChange={(e) => setStaffForm({ ...staffForm, pin: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 text-center tracking-widest font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Shift Kerja</label>
                  <select
                    value={staffForm.shift}
                    onChange={(e) => setStaffForm({ ...staffForm, shift: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer text-[11px]"
                  >
                    <option value="Pagi (08:00 - 16:00)">Pagi (08:00 - 16:00)</option>
                    <option value="Sore (15:00 - 23:00)">Sore (15:00 - 23:00)</option>
                    <option value="Full Day">Full Day</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition shadow-xs cursor-pointer"
                >
                  Simpan Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL PEMBAYARAN KASIR */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-800">Pembayaran Kasir KedaiQu</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-3">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex justify-between items-center">
                <span className="text-xs text-emerald-800 font-semibold">Total Tagihan:</span>
                <span className="text-lg font-black text-emerald-900">Rp {cartTotal.toLocaleString('id-ID')}</span>
              </div>

              {/* Payment methods */}
              <div className="grid grid-cols-3 gap-2">
                {(['tunai', 'qris', 'debit'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 text-xs font-bold rounded-xl uppercase border transition-all cursor-pointer ${
                      paymentMethod === m
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {paymentMethod === 'tunai' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Uang Diterima (Rp)</label>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl text-base font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mt-2">
                    <span>Kembalian:</span>
                    <span className="text-emerald-700 font-bold">
                      Rp {Math.max(0, cashAmount - cartTotal).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              )}

              {paymentMethod === 'qris' && (
                <div className="text-center p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <QrCode className="w-24 h-24 mx-auto text-slate-800" />
                  <p className="text-[11px] font-semibold text-slate-600 mt-2">Scan QRIS Dinamis KedaiQu</p>
                </div>
              )}
            </div>

            <button
              onClick={handleCompletePayment}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              Konfirmasi & Selesaikan Transaksi
            </button>
          </div>
        </div>
      )}

      {/* 6. MODAL STRUK BUKTI PEMBAYARAN */}
      {isReceiptModalOpen && lastPaymentSummary && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-4 shadow-2xl font-mono text-xs text-slate-800">
            <div className="text-center pb-2 border-b border-dashed border-slate-300">
              <h4 className="font-extrabold text-sm">KEDAIQU RESTO & CAFE</h4>
              <p className="text-[10px] text-slate-500">UsahaQu Ecosystem v1.80</p>
              <p className="text-[9px] text-slate-400 mt-0.5">{lastPaymentSummary.date}</p>
            </div>

            <div className="py-2 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>No: {lastPaymentSummary.orderId}</span>
                <span>{lastPaymentSummary.tableName}</span>
              </div>
              <div className="flex justify-between">
                <span>Tamu:</span>
                <span>{lastPaymentSummary.customerName}</span>
              </div>
            </div>

            <div className="py-2 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              {lastPaymentSummary.items?.map((it: any, i: number) => (
                <div key={i} className="flex justify-between">
                  <span>{it.qty}x {it.item.name}</span>
                  <span>Rp {(it.item.price * it.qty).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>

            <div className="py-2 border-b border-dashed border-slate-300 space-y-0.5 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {lastPaymentSummary.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>PB1 (10%)</span>
                <span>Rp {lastPaymentSummary.tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold text-xs pt-1">
                <span>TOTAL</span>
                <span>Rp {lastPaymentSummary.total.toLocaleString('id-ID')}</span>
              </div>
              {lastPaymentSummary.paymentMethod === 'tunai' && (
                <>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Tunai</span>
                    <span>Rp {lastPaymentSummary.cashAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Kembali</span>
                    <span>Rp {lastPaymentSummary.change.toLocaleString('id-ID')}</span>
                  </div>
                </>
              )}
            </div>

            <div className="text-center pt-2 text-[10px] text-slate-400">
              Terima Kasih atas Kunjungan Anda!
            </div>

            <button
              onClick={() => setIsReceiptModalOpen(false)}
              className="w-full mt-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-sans text-xs font-bold rounded-xl cursor-pointer"
            >
              Tutup Struk
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
