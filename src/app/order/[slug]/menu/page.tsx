'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Menu as MenuIcon,
  Bell,
  ShoppingBag,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Heart,
  Star,
  Plus,
  Minus,
  Home,
  LayoutGrid,
  Tag,
  User,
  Phone,
  Copy,
  Check,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  X,
  AlertTriangle,
  MessageSquare,
  ChefHat,
  CheckCircle2,
  Clock,
  Award,
  Flame,
  UtensilsCrossed,
} from 'lucide-react'

// --- TYPES ---
interface MenuItem {
  id: string
  name: string
  category: string
  menuGroup: string
  veg: boolean
  price: number
  halfPrice?: number
  rating: number
  ratingCount: string
  badge?: string | null
  badgeType?: string
  popular: boolean
  customizable: boolean
  description: string
  image: string
}

interface CartEntry {
  key: string
  dish: MenuItem
  portion: string
  spice: string
  addons: string[]
  notes: string
  unitPrice: number
  qty: number
}

interface LiveOrder {
  id: string
  table: string
  total: number
  itemsCount: number
  stage: number // 0: Preparing in Tandoor, 1: Plating, 2: Serving to Table
}

// --- FALLBACK FOOD IMAGE ---
const FALLBACK_FOOD_IMG =
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80'

// --- AUTHENTIC PM ZAIKA MENU DATA ---
const MENU_ITEMS: MenuItem[] = [
  // BIRYANI
  {
    id: 'mutton-handi-biryani',
    name: 'Mutton Handi Biryani',
    category: 'Biryani',
    menuGroup: 'Biryani & Mains',
    veg: false,
    price: 380,
    halfPrice: 220,
    rating: 4.9,
    ratingCount: '1.2K+',
    badge: 'BESTSELLER',
    badgeType: 'plum',
    popular: true,
    customizable: true,
    description: 'Slow-cooked Awadhi mutton layered with saffron basmati in a sealed clay handi.',
    image:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'chicken-dum-biryani',
    name: 'Chicken Dum Biryani',
    category: 'Biryani',
    menuGroup: 'Biryani & Mains',
    veg: false,
    price: 290,
    halfPrice: 170,
    rating: 4.8,
    ratingCount: '980+',
    badge: 'POPULAR',
    badgeType: 'saffron',
    popular: true,
    customizable: true,
    description: 'Fragrant long-grain basmati slow-steamed with spiced chicken, mint, and fried onions.',
    image:
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80',
  },

  // TANDOOR & KEBABS
  {
    id: 'paneer-tikka-shashlik',
    name: 'Paneer Tikka Shashlik',
    category: 'Tandoor',
    menuGroup: 'Tandoor & Kebabs',
    veg: true,
    price: 260,
    halfPrice: 150,
    rating: 4.8,
    ratingCount: '710+',
    badge: 'BESTSELLER',
    badgeType: 'plum',
    popular: true,
    customizable: true,
    description: 'Char-grilled malai paneer skewers with bell peppers, served with pudina chutney.',
    image:
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'chicken-malai-tikka',
    name: 'Chicken Malai Tikka',
    category: 'Tandoor',
    menuGroup: 'Tandoor & Kebabs',
    veg: false,
    price: 310,
    halfPrice: 180,
    rating: 4.8,
    ratingCount: '620+',
    badge: "CHEF'S PICK",
    badgeType: 'emerald',
    popular: true,
    customizable: true,
    description: 'Velvety cashew, cream, and cardamom-marinated boneless chicken charred in clay tandoor.',
    image:
      'https://images.unsplash.com/photo-1610057099443-fde8c8d50f2c?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'mutton-seekh-kebab',
    name: 'Mutton Seekh Kebab',
    category: 'Tandoor',
    menuGroup: 'Tandoor & Kebabs',
    veg: false,
    price: 340,
    halfPrice: 195,
    rating: 4.9,
    ratingCount: '510+',
    badge: "CHEF'S PICK",
    badgeType: 'emerald',
    popular: false,
    customizable: true,
    description: 'Skewered minced mutton blended with royal spices, fresh coriander, and smoky ghee.',
    image:
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=80',
  },

  // MAINS
  {
    id: 'murg-mussallam',
    name: 'Murg Mussallam',
    category: 'Mains',
    menuGroup: 'Biryani & Mains',
    veg: false,
    price: 420,
    halfPrice: 240,
    rating: 4.9,
    ratingCount: '640+',
    badge: "CHEF'S PICK",
    badgeType: 'emerald',
    popular: true,
    customizable: true,
    description: 'Signature roasted chicken braised in rich almond, cashew, and saffron Mughlai gravy.',
    image:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'butter-chicken',
    name: 'Butter Chicken',
    category: 'Mains',
    menuGroup: 'Biryani & Mains',
    veg: false,
    price: 320,
    halfPrice: 185,
    rating: 4.8,
    ratingCount: '1.1K+',
    badge: 'BESTSELLER',
    badgeType: 'plum',
    popular: false,
    customizable: true,
    description: 'Tandoor-pulled chicken tikka simmered in silky tomato, kasuri methi, and butter gravy.',
    image:
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'dal-makhani',
    name: 'Dal Makhani',
    category: 'Mains',
    menuGroup: 'Biryani & Mains',
    veg: true,
    price: 220,
    halfPrice: 130,
    rating: 4.7,
    ratingCount: '740+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'Overnight slow-simmered black urad lentils finished with churned white butter and cream.',
    image:
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80',
  },

  // SOUPS
  {
    id: 'veg-sweet-corn',
    name: 'Veg Sweet Corn Soup',
    category: 'Soups',
    menuGroup: 'Soups',
    veg: true,
    price: 110,
    rating: 4.6,
    ratingCount: '310+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Velvety golden sweet corn broth with finely diced garden vegetables and white pepper.',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'chicken-sweet-corn',
    name: 'Chicken Sweet Corn Soup',
    category: 'Soups',
    menuGroup: 'Soups',
    veg: false,
    price: 140,
    rating: 4.7,
    ratingCount: '390+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Warming golden corn soup enriched with tender shredded chicken and egg ribbons.',
    image:
      'https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'hot-n-sour-veg',
    name: 'Veg Hot & Sour Soup',
    category: 'Soups',
    menuGroup: 'Soups',
    veg: true,
    price: 110,
    rating: 4.6,
    ratingCount: '280+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Zesty dark soy and chilli broth loaded with julienned veggies and crisp noodles.',
    image:
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=500&q=80',
  },

  // CHINESE & ROLLS
  {
    id: 'chicken-hakka-noodles',
    name: 'Chicken Hakka Noodles',
    category: 'Chinese',
    menuGroup: 'Chinese & Rolls',
    veg: false,
    price: 210,
    rating: 4.7,
    ratingCount: '520+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'High-flame wok-tossed noodles with tender chicken strips, crisp peppers, garlic, and soy.',
    image:
      'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'double-egg-chicken-roll',
    name: 'Double Egg Chicken Roll',
    category: 'Rolls',
    menuGroup: 'Chinese & Rolls',
    veg: false,
    price: 150,
    rating: 4.8,
    ratingCount: '890+',
    badge: 'POPULAR',
    badgeType: 'saffron',
    popular: true,
    customizable: true,
    description: 'Smoky tandoor chicken tikka, double egg layer, pickled onions, and mint chutney in paratha.',
    image:
      'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'paneer-kathi-roll',
    name: 'Paneer Kathi Roll',
    category: 'Rolls',
    menuGroup: 'Chinese & Rolls',
    veg: true,
    price: 130,
    rating: 4.7,
    ratingCount: '460+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'Spiced tandoori paneer cubes, crisp onions, and zesty pudina mayo rolled in flaky paratha.',
    image:
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=500&q=80',
  },
]

// --- HERO CAROUSEL SLIDES ---
const HERO_SLIDES = [
  {
    id: 'slide-1',
    headlineTop: 'MUTTON HANDI',
    headlineBottom: 'ROYAL BIRYANI.',
    accent: 'Zaika-e-Shahi',
    subtext: 'Sealed clay-pot Awadhi biryani infused with saffron.',
    cta: 'Order Now',
    targetDishId: 'mutton-handi-biryani',
    image:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'slide-2',
    headlineTop: 'ROYAL TANDOOR',
    headlineBottom: 'SMOKY PLATTER.',
    accent: 'Live Charcoal',
    subtext: 'Malai tikka & paneer shashlik straight from clay ovens.',
    cta: 'Try Tandoor',
    targetDishId: 'paneer-tikka-shashlik',
    image:
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'slide-3',
    headlineTop: "CHEF'S KEBABS",
    headlineBottom: '& FLAKY ROLLS.',
    accent: 'Patna Favorite',
    subtext: 'Juicy seekh kebabs & double-egg rolls served hot.',
    cta: 'Explore Rolls',
    targetDishId: 'double-egg-chicken-roll',
    image:
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=80',
  },
]

// --- 7 CIRCULAR CATEGORIES ---
const CATEGORIES = [
  {
    id: 'All',
    label: 'All',
    image:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'Biryani',
    label: 'Biryani',
    image:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'Tandoor',
    label: 'Tandoor',
    image:
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'Soups',
    label: 'Soups',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'Mains',
    label: 'Mains',
    image:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'Chinese',
    label: 'Chinese',
    image:
      'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'Rolls',
    label: 'Rolls',
    image:
      'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=240&q=80',
  },
]

const MENU_GROUPS = ['Biryani & Mains', 'Tandoor & Kebabs', 'Soups', 'Chinese & Rolls']

const ADDONS = [
  { id: 'raita', name: 'Burhani Raita', price: 40, veg: true },
  { id: 'butter-naan', name: 'Butter Naan', price: 55, veg: true },
  { id: 'mint-chutney', name: 'Mint Chutney', price: 30, veg: true },
]

const COUPONS = [
  {
    code: 'ZAIKA25',
    badge: 'POPULAR',
    title: '25% OFF up to ₹150',
    subtitle: 'Valid on orders above ₹499 • Royal Combos & Biryani',
    type: 'percent',
    value: 25,
    maxDiscount: 150,
    minOrder: 499,
  },
  {
    code: 'TABLE10',
    badge: 'DINE-IN',
    title: 'Flat ₹60 OFF on Table Orders',
    subtitle: 'Valid on dine-in orders above ₹349',
    type: 'flat',
    value: 60,
    maxDiscount: 60,
    minOrder: 349,
  },
  {
    code: 'ROYALRAITA',
    badge: 'COMBO PERK',
    title: 'Flat ₹40 OFF (Free Burhani Raita)',
    subtitle: 'Valid on orders above ₹249',
    type: 'flat',
    value: 40,
    maxDiscount: 40,
    minOrder: 249,
  },
]

const TABLES = [
  'Table 01',
  'Table 02',
  'Table 03',
  'Table 04',
  'Table 05',
  'Table 06',
  'Table 07',
  'Table 08',
  'Table 09',
  'Table 10',
  'Table 11',
  'Table 12',
  'Takeaway',
]

const FEEDBACK_QUESTIONS = [
  { id: 'taste', label: 'Food Taste & Quality' },
  { id: 'service', label: 'Staff & Table Service' },
  { id: 'ambience', label: 'Dining Ambience' },
  { id: 'value', label: 'Value for Money' },
  { id: 'overall', label: 'Overall Experience' },
]

// --- EXACT GEOMETRIC MANDALA WIREFRAME (FOREGROUND ARCHITECTURAL MOTIF) ---
// Concentric hollow pearl-ring tracks, 16-fold overlapping pointed lotus petals,
// intersecting diamond lattice chords, and circular jewel nodes.
const ArchitecturalMandalaSvg = ({
  className = '',
  strokeColor = '#D9B9E8',
  accentColor = '#F3C669',
  strokeWidth = 0.85,
}: {
  className?: string
  strokeColor?: string
  accentColor?: string
  strokeWidth?: number
}) => {
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5)
  const pearls = Array.from({ length: 24 }, (_, i) => i * 15)
  const latticeAngles = Array.from({ length: 8 }, (_, i) => i * 45)

  return (
    <svg
      viewBox="0 0 360 360"
      className={`pointer-events-none select-none ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <g transform="translate(180 180)">
        {/* Inner & Mid Concentric Ring Tracks */}
        <circle r="36" stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle r="54" stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle r="76" stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle r="118" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeOpacity="0.65" />
        <circle r="164" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} strokeOpacity="0.5" />

        {/* Hollow Pearl-Ring Track (between r=54 and r=76) */}
        {pearls.map((deg) => (
          <circle
            key={`p-in-${deg}`}
            cx="0"
            cy="-65"
            r="2.4"
            transform={`rotate(${deg})`}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.9}
          />
        ))}

        {/* 16-Fold Overlapping Pointed Lotus Petals + Hollow Petal Pearls */}
        {petals.map((deg) => (
          <g key={`petal-${deg}`} transform={`rotate(${deg})`}>
            {/* Primary pointed lotus petal */}
            <path
              d="M -14 -76 L 0 -114 L 14 -76"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="miter"
            />
            {/* Inner nested double-line petal */}
            <path
              d="M -9.5 -76 L 0 -104 L 9.5 -76"
              stroke={strokeColor}
              strokeWidth={strokeWidth * 0.75}
              strokeOpacity="0.7"
            />
            {/* Hollow pearl inside lotus arch */}
            <circle
              cx="0"
              cy="-89"
              r="2.6"
              stroke={strokeColor}
              strokeWidth={strokeWidth * 0.85}
            />
            {/* Outer pointed crown petal */}
            <path
              d="M -22 -114 L 0 -160 L 22 -114"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="miter"
            />
            {/* Outer jewel node */}
            <circle
              cx="0"
              cy="-160"
              r="2.1"
              fill={accentColor}
              fillOpacity="0.85"
            />
          </g>
        ))}

        {/* Intersecting Diamond Lattice Chords */}
        {latticeAngles.map((deg) => (
          <polygon
            key={`lat-${deg}`}
            points="0,-164 116,-116 164,0 116,116 0,164 -116,116 -164,0 -116,-116"
            transform={`rotate(${deg})`}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.6}
            strokeOpacity="0.45"
          />
        ))}
      </g>
    </svg>
  )
}

// --- HORIZONTAL BRUSHED-GOLD HAIRLINE ---
const GoldHairline = ({ className = '' }: { className?: string }) => (
  <div
    className={`w-full h-[1px] ${className}`}
    style={{
      background:
        'linear-gradient(90deg, rgba(232,146,35,0) 0%, rgba(212,155,62,0.55) 18%, rgba(246,204,116,0.95) 50%, rgba(212,155,62,0.55) 82%, rgba(232,146,35,0) 100%)',
    }}
  />
)

// --- PLACEMENT 3: ARCHITECTURAL MANDALA HAIRLINE DIVIDER ---
const ArchitecturalMandalaDivider = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-2.5 py-1 ${className}`} aria-hidden="true">
    <div
      className="h-[1px] flex-1"
      style={{
        background:
          'linear-gradient(90deg, rgba(212,155,62,0) 0%, rgba(212,155,62,0.55) 65%, rgba(232,146,35,0.9) 100%)',
      }}
    />
    <svg viewBox="0 0 64 24" className="w-[54px] h-[20px] shrink-0" fill="none">
      {/* Miniature Half-Mandala Crown / Lotus Wireframe Ornament */}
      <path d="M 8 20 A 24 24 0 0 1 56 20" stroke="#C88B2B" strokeWidth="1" strokeOpacity="0.65" />
      <path d="M 16 20 A 16 16 0 0 1 48 20" stroke="#C88B2B" strokeWidth="0.9" strokeOpacity="0.8" />
      <path d="M 24 20 L 32 4 L 40 20" stroke="#2D1148" strokeWidth="1" strokeOpacity="0.55" />
      <path d="M 15 20 L 21 9 L 28 20" stroke="#C88B2B" strokeWidth="0.9" />
      <path d="M 36 20 L 43 9 L 49 20" stroke="#C88B2B" strokeWidth="0.9" />
      <circle cx="32" cy="14" r="2" stroke="#C88B2B" strokeWidth="1" />
      <circle cx="32" cy="4" r="1.6" fill="#E89223" />
      <circle cx="21" cy="9" r="1.2" fill="#E89223" />
      <circle cx="43" cy="9" r="1.2" fill="#E89223" />
      <line x1="2" y1="20" x2="62" y2="20" stroke="#D8A042" strokeWidth="0.9" strokeOpacity="0.7" />
    </svg>
    <div
      className="h-[1px] flex-1"
      style={{
        background:
          'linear-gradient(90deg, rgba(232,146,35,0.9) 0%, rgba(212,155,62,0.55) 35%, rgba(212,155,62,0) 100%)',
      }}
    />
  </div>
)

// --- PLACEMENT 1: PM ZAIKA METALLIC ROYAL PASS CARD ---
const RoyalPassCard = ({
  royalPoints,
  selectedTable,
  onRedeem,
  compact = false,
}: {
  royalPoints: number
  selectedTable: string
  onRedeem: () => void
  compact?: boolean
}) => (
  <section
    className={`rounded-[24px] bg-gradient-to-br from-[#1B0A2B] via-[#281040] to-[#2D1148] text-white relative overflow-hidden border border-[#F3C669]/30 shadow-[0_16px_34px_rgba(27,10,43,0.28)] ${
      compact ? 'p-4' : 'p-5'
    }`}
  >
    {/* Crisp Metallic Foil Mandala Etched Across the Right Side */}
    <ArchitecturalMandalaSvg
      className={`absolute -right-14 top-1/2 -translate-y-1/2 opacity-[0.26] ${
        compact ? 'w-[190px] h-[190px]' : 'w-[240px] h-[240px]'
      }`}
      strokeColor="#E8D2F5"
      accentColor="#F3C669"
      strokeWidth={1.05}
    />

    {/* Top Header Row */}
    <div className="relative z-10 flex items-center justify-between gap-2 pb-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#E89223]/20 border border-[#F3C669]/50 flex items-center justify-center">
          <Award className="w-3.5 h-3.5 text-[#F3C669]" />
        </div>
        <span className="text-[10.5px] font-extrabold tracking-[0.16em] uppercase text-[#F7DC9C]">
          ROYAL CLUB PASS • TIER I
        </span>
      </div>
      <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold text-[#FDEBD3] tnum">
        {selectedTable}
      </span>
    </div>

    {/* Signature Horizontal Brushed-Gold Hairline Bisecting the Card */}
    <div className="relative z-10 -mx-5 my-0.5">
      <GoldHairline />
    </div>

    {/* Bottom Balance & Redeem Row */}
    <div className="relative z-10 pt-3.5 flex items-end justify-between gap-3">
      <div>
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-white/60">
          Available Balance
        </span>
        <div className="mt-1 flex items-baseline gap-1.5 tnum">
          <span className={`${compact ? 'text-[26px]' : 'text-[32px]'} font-extrabold leading-none text-white`}>
            {royalPoints}
          </span>
          <span className="text-xs font-extrabold text-[#F3C669] tracking-wider">PTS</span>
        </div>
        {!compact && (
          <p className="text-[11px] text-white/75 mt-1.5">
            Redeem 50 pts for instant ₹50 off your dine-in bill.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onRedeem}
        className="h-9 px-4 rounded-full bg-gradient-to-r from-[#E89223] to-[#F3B046] hover:from-[#D48016] hover:to-[#E89223] text-[#1B0A2B] text-xs font-extrabold shadow-[0_6px_16px_rgba(232,146,35,0.35)] cursor-pointer transition-all shrink-0"
      >
        Redeem ₹50
      </button>
    </div>
  </section>
)

// --- AUTHENTIC INDIAN FSSAI VEG / NON-VEG SQUARE INDICATOR ---
const FssaiDot = ({ veg, size = 'sm' }: { veg: boolean; size?: 'sm' | 'md' }) => {
  const box = size === 'sm' ? 'w-[14px] h-[14px]' : 'w-[16px] h-[16px]'
  const dot = size === 'sm' ? 'w-[6px] h-[6px]' : 'w-[7px] h-[7px]'
  return (
    <span
      className={`inline-flex items-center justify-center ${box} rounded-[3px] border bg-white shrink-0 ${
        veg ? 'border-[#15803D]' : 'border-[#DC2626]'
      }`}
      title={veg ? 'Vegetarian' : 'Non-Vegetarian'}
      aria-label={veg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
      {veg ? (
        <span className={`${dot} rounded-full bg-[#15803D]`} />
      ) : (
        <svg viewBox="0 0 10 10" className="w-[7px] h-[7px] fill-[#DC2626]">
          <polygon points="5,1.5 9,8.5 1,8.5" />
        </svg>
      )}
    </span>
  )
}

// --- PLACEMENT 5B: PM ZAIKA ROYAL CREST FRAMED BY FINE-LINE LOTUS PETAL RING ---
const PmZaikaCrest = () => (
  <div className="relative w-[72px] h-[72px] flex items-center justify-center shrink-0">
    {/* Outer Fine-Line Lotus Petal Ring Frame */}
    <ArchitecturalMandalaSvg
      className="absolute inset-0 w-full h-full opacity-90"
      strokeColor="#C88B2B"
      accentColor="#E89223"
      strokeWidth={1.6}
    />
    {/* Inner Deep Plum Monogram Medallion */}
    <div className="w-[46px] h-[46px] rounded-full bg-gradient-to-br from-[#2D1148] to-[#461B6E] border border-[#F3C669]/70 flex flex-col items-center justify-center leading-none relative z-10 shadow-[0_6px_16px_rgba(45,17,72,0.28)]">
      <svg viewBox="0 0 24 14" className="w-3.5 h-2 fill-[#F3C669] mb-0.5">
        <path d="M2 12L4 3L9 8L12 1L15 8L20 3L22 12H2Z" />
      </svg>
      <span className="text-[13px] font-extrabold tracking-wider text-white">PM</span>
      <span className="text-[5.5px] font-bold tracking-[0.24em] text-[#FDEBD3] mt-0.5">
        ZAIKA
      </span>
    </div>
  </div>
)

export default function App() {
  const searchParams = useSearchParams()
  const tableParam = searchParams.get('table')

  // Navigation Tab: 'home' | 'menu' | 'offers' | 'hub'
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'offers' | 'hub'>('home')

  // Toast Notification
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr))
    }, 2600)
  }

  // Table & Steward State
  const [selectedTable, setSelectedTable] = useState<string>(tableParam || 'Table 04')
  const [tableModalOpen, setTableModalOpen] = useState(false)
  const [stewardAlerted, setStewardAlerted] = useState(false)

  // Hero Carousel State
  const [heroIndex, setHeroIndex] = useState(0)

  // Search, Category & Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [vegOnly, setVegOnly] = useState(false)
  const [nonVegOnly, setNonVegOnly] = useState(false)
  const [under250, setUnder250] = useState(false)
  const [bestsellersOnly, setBestsellersOnly] = useState(false)

  // Favorites Set
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'mutton-handi-biryani': true,
    'paneer-tikka-shashlik': true,
  })

  // Cart State: { [key]: { key, dish, portion, spice, addons, notes, unitPrice, qty } }
  const [cart, setCart] = useState<Record<string, CartEntry>>({
    'mutton-handi-biryani__Full__Medium__': {
      key: 'mutton-handi-biryani__Full__Medium__',
      dish: MENU_ITEMS[0],
      portion: 'Full',
      spice: 'Medium',
      addons: [],
      notes: '',
      unitPrice: 380,
      qty: 1,
    },
  })

  // Rewards & Coupons
  const [royalPoints, setRoyalPoints] = useState(120)
  const [redeemPoints, setRedeemPoints] = useState(false)
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null)
  const [couponInput, setCouponInput] = useState('')

  // Customization Sheet
  const [customDish, setCustomDish] = useState<MenuItem | null>(null)
  const [customPortion, setCustomPortion] = useState('Full')
  const [customSpice, setCustomSpice] = useState('Medium')
  const [customAddons, setCustomAddons] = useState<string[]>([])
  const [customNotes, setCustomNotes] = useState('')

  // Cart & Order Tracker Drawer
  const [cartOpen, setCartOpen] = useState(false)
  const [cookingNotes, setCookingNotes] = useState('')
  const [liveOrder, setLiveOrder] = useState<LiveOrder | null>(null) // { id, table, total, itemsCount, stage: 0|1|2 }

  // Guest Feedback Sheet
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackRatings, setFeedbackRatings] = useState<Record<string, number>>({
    taste: 5,
    service: 5,
    ambience: 5,
    value: 5,
    overall: 5,
  })
  const [feedbackComment, setFeedbackComment] = useState('')
  const [feedbackDone, setFeedbackDone] = useState(false)

  // Admin Direct Complaint Modal
  const [complaintOpen, setComplaintOpen] = useState(false)
  const [complaintCategory, setComplaintCategory] = useState('Food Quality')
  const [complaintNote, setComplaintNote] = useState('')

  // Copy Phone Feedback
  const [phoneCopied, setPhoneCopied] = useState(false)

  // Auto-advance hero carousel gently every 5.5s when on Home
  useEffect(() => {
    if (activeTab !== 'home') return
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [activeTab])

  // --- HELPER: FILTERING ---
  const activeFilterCount =
    (vegOnly ? 1 : 0) +
    (nonVegOnly ? 1 : 0) +
    (under250 ? 1 : 0) +
    (bestsellersOnly ? 1 : 0)

  const matchesFilters = (dish: MenuItem, applyCategory: boolean = true) => {
    const q = searchQuery.trim().toLowerCase()
    if (
      q &&
      !dish.name.toLowerCase().includes(q) &&
      !dish.description.toLowerCase().includes(q) &&
      !dish.category.toLowerCase().includes(q) &&
      !dish.menuGroup.toLowerCase().includes(q)
    ) {
      return false
    }
    if (applyCategory && selectedCategory !== 'All' && dish.category !== selectedCategory) {
      return false
    }
    if (vegOnly && !dish.veg) return false
    if (nonVegOnly && dish.veg) return false
    if (under250 && dish.price > 250) return false
    if (bestsellersOnly && !dish.badge) return false
    return true
  }

  const homeDishes = useMemo(() => {
    const filtered = MENU_ITEMS.filter((d) => matchesFilters(d, true))
    if (selectedCategory === 'All' && !searchQuery.trim() && activeFilterCount === 0) {
      return filtered.filter((d) => d.popular)
    }
    return filtered
  }, [searchQuery, selectedCategory, vegOnly, nonVegOnly, under250, bestsellersOnly])

  const menuGroupedDishes = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {}
    MENU_GROUPS.forEach((grp) => {
      groups[grp] = MENU_ITEMS.filter(
        (d) => d.menuGroup === grp && matchesFilters(d, false)
      )
    })
    return groups
  }, [searchQuery, vegOnly, nonVegOnly, under250, bestsellersOnly])

  const totalMenuResults = useMemo(
    () => Object.values(menuGroupedDishes).reduce((acc, arr) => acc + arr.length, 0),
    [menuGroupedDishes]
  )

  // --- HELPER: CART OPERATIONS ---
  const getDishQty = (dishId: string) =>
    Object.values(cart)
      .filter((entry) => entry.dish.id === dishId)
      .reduce((sum, entry) => sum + entry.qty, 0)

  const quickAddDish = (dish: MenuItem) => {
    const key = `${dish.id}__Full__Medium__`
    setCart((prev) => {
      const existing = prev[key]
      return {
        ...prev,
        [key]: {
          key,
          dish,
          portion: 'Full',
          spice: 'Medium',
          addons: [],
          notes: '',
          unitPrice: dish.price,
          qty: (existing?.qty || 0) + 1,
        },
      }
    })
    showToast(`Added ${dish.name} to your bag`)
  }

  const quickDecrementDish = (dishId: string) => {
    setCart((prev) => {
      const matchingKeys = Object.keys(prev).filter((k) => prev[k].dish.id === dishId)
      if (matchingKeys.length === 0) return prev
      const target = matchingKeys[matchingKeys.length - 1]
      const next = { ...prev }
      if (next[target].qty <= 1) {
        delete next[target]
      } else {
        next[target] = { ...next[target], qty: next[target].qty - 1 }
      }
      return next
    })
  }

  const updateCartQty = (key: string, delta: number) => {
    setCart((prev) => {
      const entry = prev[key]
      if (!entry) return prev
      const nextQty = entry.qty + delta
      const next = { ...prev }
      if (nextQty <= 0) {
        delete next[key]
      } else {
        next[key] = { ...entry, qty: nextQty }
      }
      return next
    })
  }

  // --- CUSTOMIZATION SHEET ---
  const openCustomization = (dish: MenuItem) => {
    setCustomDish(dish)
    setCustomPortion('Full')
    setCustomSpice('Medium')
    setCustomAddons([])
    setCustomNotes('')
  }

  const customTotalUnit = useMemo(() => {
    if (!customDish) return 0
    const base =
      customPortion === 'Half' && customDish.halfPrice
        ? customDish.halfPrice
        : customDish.price
    const addonSum = customAddons.reduce((sum, id) => {
      const found = ADDONS.find((a) => a.id === id)
      return sum + (found ? found.price : 0)
    }, 0)
    return base + addonSum
  }, [customDish, customPortion, customAddons])

  const confirmCustomizationAdd = () => {
    if (!customDish) return
    const addonLabels = customAddons
      .map((id) => ADDONS.find((a) => a.id === id)?.name)
      .filter((name): name is string => Boolean(name))
    const trimmedNote = customNotes.trim()
    const key = `${customDish.id}__${customPortion}__${customSpice}__${addonLabels.join(',')}__${trimmedNote}`
    setCart((prev) => {
      const existing = prev[key]
      return {
        ...prev,
        [key]: {
          key,
          dish: customDish,
          portion: customPortion,
          spice: customSpice,
          addons: addonLabels,
          notes: trimmedNote,
          unitPrice: customTotalUnit,
          qty: (existing?.qty || 0) + 1,
        },
      }
    })
    showToast(`Added ${customDish.name} (${customPortion})`)
    setCustomDish(null)
  }

  // --- BILLING & COUPON CALCULATION ---
  const cartSummary = useMemo(() => {
    const entries = Object.values(cart)
    const itemCount = entries.reduce((sum, e) => sum + e.qty, 0)
    const subtotal = entries.reduce((sum, e) => sum + e.unitPrice * e.qty, 0)

    let couponDiscount = 0
    let activeCouponObj: (typeof COUPONS)[0] | null = null
    if (appliedCouponCode) {
      const c = COUPONS.find((cp) => cp.code === appliedCouponCode)
      if (c && subtotal >= c.minOrder) {
        activeCouponObj = c
        if (c.type === 'percent') {
          couponDiscount = Math.min(Math.round((subtotal * c.value) / 100), c.maxDiscount)
        } else {
          couponDiscount = c.value
        }
      }
    }

    const pointsDiscount = redeemPoints && royalPoints >= 50 && subtotal > 0 ? 50 : 0
    const totalDiscount = Math.min(subtotal, couponDiscount + pointsDiscount)
    const taxable = Math.max(0, subtotal - totalDiscount)
    const gst = Math.round(taxable * 0.05)
    const grandTotal = taxable + gst

    return {
      entries,
      itemCount,
      subtotal,
      couponDiscount,
      pointsDiscount,
      activeCouponObj,
      gst,
      grandTotal,
    }
  }, [cart, appliedCouponCode, redeemPoints, royalPoints])

  const handleApplyCouponCode = (codeRaw: string) => {
    const code = codeRaw.trim().toUpperCase()
    const found = COUPONS.find((c) => c.code === code)
    if (!found) {
      showToast('Invalid coupon code. Try ZAIKA25 or TABLE10.')
      return
    }
    setAppliedCouponCode(found.code)
    setCouponInput(found.code)
    if (cartSummary.subtotal >= found.minOrder) {
      showToast(`${found.code} applied to your order!`)
    } else {
      const diff = found.minOrder - cartSummary.subtotal
      showToast(`${found.code} saved! Add ₹${diff} more to unlock.`)
    }
  }

  const handlePlaceOrder = () => {
    const orderId = `PMZ-${Math.floor(400 + Math.random() * 580)}`
    const usedPoints = cartSummary.pointsDiscount > 0
    if (usedPoints) {
      setRoyalPoints((p) => Math.max(0, p - 50))
      setRedeemPoints(false)
    }
    setLiveOrder({
      id: orderId,
      table: selectedTable,
      total: cartSummary.grandTotal,
      itemsCount: cartSummary.itemCount,
      stage: 0, // 0: Preparing in Tandoor, 1: Plating, 2: Serving to Table
    })
    setCart({})
    setCookingNotes('')
    showToast(`Order #${orderId} placed for ${selectedTable}!`)
  }

  const handleRedeemRoyalPoints = () => {
    if (royalPoints >= 50) {
      setRedeemPoints(true)
      setCartOpen(true)
      showToast('₹50 Royal Pass credit activated in cart!')
    } else {
      showToast('Earn 50 pts to redeem ₹50 off')
    }
  }

  const handleRingSteward = () => {
    setStewardAlerted(true)
    showToast(`Steward notified for ${selectedTable}`)
    setTimeout(() => setStewardAlerted(false), 9000)
  }

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText('+917488260572')
    setPhoneCopied(true)
    showToast('Copied +91 74882 60572')
    setTimeout(() => setPhoneCopied(false), 2200)
  }

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) => {
      const next = !prev[id]
      showToast(next ? 'Saved to favorites' : 'Removed from favorites')
      return { ...prev, [id]: next }
    })
  }

  const badgeStyle = (type?: string | null) => {
    if (type === 'saffron') return 'bg-[#E89223] text-white'
    if (type === 'emerald') return 'bg-[#1A7F5A] text-white'
    return 'bg-[#3B155E] text-white'
  }

  const activeSlide = HERO_SLIDES[heroIndex]

  return (
    <div className="min-h-screen w-full bg-[#EFE8DF] text-[#1B1026] flex justify-center sm:py-5 font-jakarta antialiased selection:bg-[#E89223]/20 selection:text-[#2D1148]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600;1,700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
        .font-editorial { font-family: 'Playfair Display', Georgia, serif; }
        .tnum { font-variant-numeric: tabular-nums; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Mobile Viewport Container (430px centered on desktop, full-bleed on mobile) */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[852px] sm:h-[852px] bg-[#FAF5F0] relative sm:rounded-[34px] shadow-[0_0_60px_rgba(45,17,72,0.12)] overflow-hidden flex flex-col">
        {/* Floating Toast */}
        {toast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[88%] max-w-[340px] pointer-events-none">
            <div className="px-4 py-2.5 rounded-2xl bg-[#2D1148] text-white text-xs font-semibold shadow-[0_12px_28px_rgba(45,17,72,0.28)] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#E89223] shrink-0" />
              <span className="truncate">{toast}</span>
            </div>
          </div>
        )}

        {/* =================================================================
            MAIN SCROLLABLE CONTENT AREA
           ================================================================= */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-28">
          {/* ---------------------------------------------------------------
              TAB 1: HOME (TACO BELL CLEAN D2C RHYTHM — PM ZAIKA IDENTITY)
             --------------------------------------------------------------- */}
          {activeTab === 'home' && (
            <div className="px-4 pt-4 space-y-5">
              {/* 1. Top App Header */}
              <header className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setTableModalOpen(true)}
                    className="w-11 h-11 rounded-2xl bg-white shadow-[0_4px_14px_rgba(45,17,72,0.07)] flex items-center justify-center text-[#2D1148] hover:bg-[#F7F1FA] transition-colors cursor-pointer shrink-0"
                    aria-label="Switch dining table"
                    title="Select Table"
                  >
                    <MenuIcon className="w-5 h-5" />
                  </button>

                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => setTableModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6E6578] hover:text-[#2D1148] cursor-pointer tnum"
                    >
                      <span>
                        {selectedTable} •{' '}
                        {selectedTable === 'Takeaway' ? 'Pickup' : 'Dine-In'}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#E89223]" />
                    </button>
                    <h1 className="text-[21px] font-extrabold tracking-tight text-[#2D1148] leading-none mt-0.5">
                      PM ZAIKA
                    </h1>
                    <p className="text-[11px] font-medium text-[#6E6578] mt-0.5 truncate">
                      Indian • Chinese • Tandoor • Rolls
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Steward Bell */}
                  <button
                    type="button"
                    onClick={handleRingSteward}
                    className={`relative w-11 h-11 rounded-2xl shadow-[0_4px_14px_rgba(45,17,72,0.07)] flex items-center justify-center transition-colors cursor-pointer ${
                      stewardAlerted
                        ? 'bg-[#2D1148] text-[#E89223]'
                        : 'bg-white text-[#2D1148] hover:bg-[#F7F1FA]'
                    }`}
                    aria-label="Notify Steward"
                    title="Call Steward to Table"
                  >
                    <Bell className="w-[19px] h-[19px]" />
                    <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-[#3B155E] text-white text-[9px] font-bold flex items-center justify-center border-2 border-[#FAF5F0] tnum">
                      {stewardAlerted ? '✓' : '1'}
                    </span>
                  </button>

                  {/* Bag Button */}
                  <button
                    type="button"
                    onClick={() => setCartOpen(true)}
                    className="relative w-11 h-11 rounded-2xl bg-white shadow-[0_4px_14px_rgba(45,17,72,0.07)] flex items-center justify-center text-[#2D1148] hover:bg-[#F7F1FA] transition-colors cursor-pointer"
                    aria-label="Open Order Bag"
                  >
                    <ShoppingBag className="w-[19px] h-[19px]" />
                    {cartSummary.itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#3B155E] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#FAF5F0] tnum">
                        {cartSummary.itemCount}
                      </span>
                    )}
                  </button>
                </div>
              </header>

              {/* Live Order Mini Banner (if an order is active) */}
              {liveOrder && (
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="w-full p-3 rounded-[20px] bg-[#2D1148] text-white flex items-center justify-between shadow-[0_10px_24px_rgba(45,17,72,0.2)] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#E89223]/20 flex items-center justify-center shrink-0">
                      <ChefHat className="w-5 h-5 text-[#E89223]" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold truncate tnum">
                        Order #{liveOrder.id} • {liveOrder.table}
                      </p>
                      <p className="text-[11px] text-[#FDEBD3]">
                        {liveOrder.stage === 0
                          ? 'Preparing in Tandoor'
                          : liveOrder.stage === 1
                          ? 'Plating'
                          : 'Serving to Table'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#E89223] inline-flex items-center gap-0.5 shrink-0">
                    Track <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              )}

              {/* 2. Search Bar + Filter Squircle */}
              <div className="flex items-center gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-[18px] h-[18px] text-[#7D7388] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search biryani, tandoor, rolls..."
                    className="w-full h-12 rounded-full bg-white shadow-[0_4px_16px_rgba(45,17,72,0.05)] pl-11 pr-9 text-[13.5px] font-medium text-[#1B1026] placeholder-[#948B9E] focus:outline-none focus:ring-2 focus:ring-[#E89223]/40"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C8396] hover:text-[#1B1026] cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setFilterSheetOpen(true)}
                  className={`relative w-12 h-12 rounded-2xl shadow-[0_4px_16px_rgba(45,17,72,0.05)] flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    activeFilterCount > 0
                      ? 'bg-[#2D1148] text-white'
                      : 'bg-white text-[#2D1148] hover:bg-[#F7F1FA]'
                  }`}
                  aria-label="Open Dish Filters"
                >
                  <SlidersHorizontal className="w-[18px] h-[18px]" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-[#E89223] text-white text-[10px] font-bold flex items-center justify-center tnum">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* 3. PLACEMENT 2: Hero Promo Banner Carousel (Dish Mandala Halo + Gold Hairline) */}
              <section className="rounded-[26px] bg-gradient-to-br from-[#220B38] via-[#341254] to-[#1B082D] overflow-hidden relative min-h-[206px] shadow-[0_14px_30px_rgba(45,17,72,0.22)]">
                <div className="relative z-10 flex items-center min-h-[206px]">
                  {/* Left Column (56%) */}
                  <div className="w-[56%] pl-5 pr-2 pt-5 pb-9 flex flex-col justify-between z-10">
                    <div>
                      <h2 className="text-[18px] font-extrabold text-white leading-[1.1] tracking-tight uppercase">
                        {activeSlide.headlineTop}
                        <br />
                        {activeSlide.headlineBottom}
                      </h2>
                      <p className="font-editorial italic font-bold text-[21px] text-[#F3B046] leading-tight mt-1">
                        {activeSlide.accent}
                      </p>
                      {/* Brushed-Gold Hairline directly beneath italic Playfair subhead */}
                      <GoldHairline className="my-2 max-w-[136px]" />
                      <p className="text-[11px] font-medium text-white/80 leading-snug">
                        {activeSlide.subtext}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const target = MENU_ITEMS.find(
                          (d) => d.id === activeSlide.targetDishId
                        )
                        if (target) openCustomization(target)
                      }}
                      className="mt-3.5 w-fit h-9 pl-4 pr-1.5 rounded-full bg-[#E89223] hover:bg-[#D48016] text-white text-[12px] font-bold inline-flex items-center gap-2 shadow-[0_6px_16px_rgba(232,146,35,0.35)] transition-colors cursor-pointer"
                    >
                      <span>{activeSlide.cta}</span>
                      <span className="w-6 h-6 rounded-full bg-white text-[#2D1148] flex items-center justify-center">
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.6]" />
                      </span>
                    </button>
                  </div>

                  {/* Right Column (44%) — Crisp Geometric Mandala Halo Framing Featured Dish */}
                  <div className="w-[44%] pr-3.5 py-4 flex items-center justify-center relative">
                    <div className="relative w-[144px] h-[144px] flex items-center justify-center">
                      {/* Etched Mandala Halo */}
                      <ArchitecturalMandalaSvg
                        className="absolute inset-0 w-full h-full opacity-55"
                        strokeColor="#E8D2F5"
                        accentColor="#F3C669"
                        strokeWidth={1.25}
                      />
                      {/* Circular Dish Framing inside the Halo */}
                      <div className="w-[100px] h-[100px] rounded-full p-[3px] bg-gradient-to-tr from-[#E89223] via-[#F7D794] to-[#6E3B9E] shadow-[0_10px_24px_rgba(12,4,22,0.55)] relative z-10">
                        <img
                          src={activeSlide.image}
                          alt={activeSlide.accent}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_FOOD_IMG
                          }}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clickable Slide Dot Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                  {HERO_SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setHeroIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === heroIndex
                          ? 'w-5 bg-[#E89223]'
                          : 'w-1.5 bg-white/40 hover:bg-white/65'
                      }`}
                    />
                  ))}
                </div>
              </section>

              {/* 4. Circular Category Strip (7 Items) */}
              <section>
                <div className="flex items-start gap-3.5 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
                  {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.id
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                      >
                        <div
                          className={`w-[64px] h-[64px] rounded-full p-1 transition-all ${
                            isActive
                              ? 'bg-[#FDEBD3] ring-2 ring-[#E89223]'
                              : 'bg-white shadow-[0_4px_14px_rgba(45,17,72,0.06)] group-hover:ring-1 group-hover:ring-[#2D1148]/20'
                          }`}
                        >
                          <img
                            src={cat.image}
                            alt={cat.label}
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_FOOD_IMG
                            }}
                            className="w-full h-full rounded-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <span
                          className={`text-[11.5px] leading-none ${
                            isActive
                              ? 'font-bold text-[#D48016]'
                              : 'font-semibold text-[#5B5266]'
                          }`}
                        >
                          {cat.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* PLACEMENT 3A: Architectural Mandala Hairline Divider */}
              <ArchitecturalMandalaDivider className="-my-1" />

              {/* 5. Popular Picks Horizontal Scrollable Card Row */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[18px] font-extrabold text-[#1B1026] tracking-tight">
                    {selectedCategory === 'All' && !searchQuery.trim()
                      ? 'Popular Picks'
                      : selectedCategory !== 'All'
                      ? `${selectedCategory} Specials`
                      : 'Search Results'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('menu')}
                    className="text-[13px] font-bold text-[#461B6E] hover:text-[#2D1148] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {homeDishes.length === 0 ? (
                  <div className="p-6 rounded-[22px] bg-white shadow-[0_6px_24px_rgba(45,17,72,0.06)] text-center">
                    <p className="text-sm font-bold text-[#1B1026]">
                      No matching dishes found
                    </p>
                    <p className="text-xs text-[#6E6578] mt-1">
                      Try clearing your search or category filter.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory('All')
                        setVegOnly(false)
                        setNonVegOnly(false)
                        setUnder250(false)
                        setBestsellersOnly(false)
                      }}
                      className="mt-3 h-8 px-4 rounded-full bg-[#2D1148] text-white text-xs font-bold cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
                    {homeDishes.map((dish) => {
                      const qty = getDishQty(dish.id)
                      const isFav = !!favorites[dish.id]
                      return (
                        <article
                          key={dish.id}
                          onClick={() => openCustomization(dish)}
                          className="w-[168px] shrink-0 bg-white rounded-[22px] p-3 shadow-[0_6px_22px_rgba(45,17,72,0.06)] flex flex-col justify-between cursor-pointer hover:shadow-[0_10px_28px_rgba(45,17,72,0.1)] transition-shadow"
                        >
                          <div>
                            {/* Top Badge + Favorite Heart */}
                            <div className="flex items-center justify-between gap-1 mb-2">
                              {dish.badge ? (
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase ${badgeStyle(
                                    dish.badgeType
                                  )}`}
                                >
                                  {dish.badge}
                                </span>
                              ) : (
                                <FssaiDot veg={dish.veg} />
                              )}
                              <button
                                type="button"
                                onClick={(e) => toggleFavorite(dish.id, e)}
                                className="w-7 h-7 rounded-full hover:bg-[#FAF5F0] flex items-center justify-center cursor-pointer"
                                aria-label="Favorite dish"
                              >
                                <Heart
                                  className={`w-4 h-4 transition-colors ${
                                    isFav
                                      ? 'fill-[#E84C6F] text-[#E84C6F]'
                                      : 'text-[#B2A9BC]'
                                  }`}
                                />
                              </button>
                            </div>

                            {/* Food Image */}
                            <div className="relative mb-2.5">
                              <img
                                src={dish.image}
                                alt={dish.name}
                                onError={(e) => {
                                  e.currentTarget.src = FALLBACK_FOOD_IMG
                                }}
                                className="h-[96px] w-full rounded-[14px] object-cover"
                                loading="lazy"
                              />
                            </div>

                            {/* Dish Title & 1-line Description */}
                            <h3 className="text-[14px] font-bold text-[#1B1026] truncate leading-snug">
                              {dish.name}
                            </h3>
                            <p className="text-[11px] text-[#7A7184] line-clamp-1 mt-0.5">
                              {dish.description}
                            </p>

                            {/* Rating + FSSAI Row */}
                            <div className="flex items-center justify-between mt-1.5">
                              <div className="flex items-center gap-1 text-[11px] font-bold text-[#1B1026] tnum">
                                <Star className="w-3.5 h-3.5 fill-[#E89223] text-[#E89223]" />
                                <span>{dish.rating}</span>
                                <span className="text-[#8C8396] font-medium">
                                  ({dish.ratingCount})
                                </span>
                              </div>
                              <FssaiDot veg={dish.veg} />
                            </div>
                          </div>

                          {/* Price + Saffron Add / Morphing Stepper */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-3 pt-1 flex items-center justify-between"
                          >
                            <span className="text-[15px] font-extrabold text-[#1B1026] tnum">
                              ₹{dish.price}
                            </span>

                            {qty === 0 ? (
                              <button
                                type="button"
                                onClick={() =>
                                  dish.customizable
                                    ? openCustomization(dish)
                                    : quickAddDish(dish)
                                }
                                className="w-8 h-8 rounded-full bg-[#E89223] hover:bg-[#D48016] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(232,146,35,0.35)] cursor-pointer transition-colors"
                                aria-label={`Add ${dish.name}`}
                              >
                                <Plus className="w-4 h-4 stroke-[2.8]" />
                              </button>
                            ) : (
                              <div className="h-8 px-1.5 rounded-full bg-[#E89223] text-white inline-flex items-center gap-2 text-xs font-extrabold tnum shadow-[0_4px_12px_rgba(232,146,35,0.3)]">
                                <button
                                  type="button"
                                  onClick={() => quickDecrementDish(dish.id)}
                                  className="p-0.5 cursor-pointer"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5 stroke-[2.8]" />
                                </button>
                                <span>{qty}</span>
                                <button
                                  type="button"
                                  onClick={() => quickAddDish(dish)}
                                  className="p-0.5 cursor-pointer"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
                                </button>
                              </div>
                            )}
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
              </section>

              {/* 6. Exclusive Offer Banner (Soft Lavender Tint) */}
              <section className="rounded-[22px] bg-gradient-to-r from-[#F2E9FA] to-[#EAE0F6] p-4 flex items-center justify-between gap-2 relative overflow-hidden">
                <div className="z-10 max-w-[60%]">
                  <span className="block text-[10px] font-bold tracking-wider text-[#5B2A86] uppercase">
                    EXCLUSIVE OFFER
                  </span>
                  <h3 className="text-[20px] font-extrabold text-[#2D1148] leading-tight mt-0.5">
                    UP TO 25% OFF
                  </h3>
                  <p className="text-[11px] font-medium text-[#5F546B] mb-3 mt-0.5">
                    On Royal Combos &amp; Biryani
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      handleApplyCouponCode('ZAIKA25')
                      setActiveTab('offers')
                    }}
                    className="h-8 pl-3.5 pr-1.5 rounded-full bg-[#2D1148] hover:bg-[#461B6E] text-white text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Claim ZAIKA25</span>
                    <span className="w-5 h-5 rounded-full bg-white text-[#2D1148] flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.6]" />
                    </span>
                  </button>
                </div>

                <div className="relative z-10 flex items-center justify-center shrink-0">
                  <div className="w-[82px] h-[82px] rounded-full bg-[#2D1148] text-white flex flex-col items-center justify-center shadow-[0_8px_20px_rgba(45,17,72,0.25)] border-4 border-white/70">
                    <span className="text-[20px] font-extrabold leading-none tnum">25%</span>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#F3B046] mt-0.5">
                      OFF
                    </span>
                  </div>
                </div>
              </section>

              {/* 7. Quick Guest Feedback Nudge */}
              <section className="rounded-[22px] bg-white p-3.5 shadow-[0_6px_22px_rgba(45,17,72,0.06)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#FDEBD3] flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 fill-[#E89223] text-[#E89223]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-bold text-[#1B1026] leading-snug">
                      Dining at PM Zaika?
                    </p>
                    <p className="text-[11px] text-[#6E6578] truncate">
                      Share 30-sec feedback &amp; earn 50 pts
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackDone(false)
                    setFeedbackOpen(true)
                  }}
                  className="shrink-0 h-8 px-3.5 rounded-full bg-[#E89223] hover:bg-[#D48016] text-white text-[11.5px] font-bold cursor-pointer transition-colors"
                >
                  Rate Now
                </button>
              </section>
            </div>
          )}

          {/* ---------------------------------------------------------------
              TAB 2: FULL CATEGORIZED MENU
             --------------------------------------------------------------- */}
          {activeTab === 'menu' && (
            <div className="pb-4">
              {/* Sticky Menu Search & Filter Header */}
              <div className="sticky top-0 z-20 bg-[#FAF5F0]/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-[#2D1148]/[0.06]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h1 className="text-[20px] font-extrabold text-[#1B1026] leading-tight">
                      Full Menu
                    </h1>
                    <p className="text-[11.5px] font-medium text-[#6E6578] tnum">
                      {selectedTable} • {totalMenuResults} dishes available
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTableModalOpen(true)}
                    className="h-8 px-3 rounded-full bg-white shadow-sm border border-[#2D1148]/10 text-[11.5px] font-bold text-[#2D1148] inline-flex items-center gap-1 cursor-pointer tnum"
                  >
                    <span>{selectedTable}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#E89223]" />
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[#8C8396] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search soups, biryani, kebabs, naan..."
                    className="w-full h-11 rounded-full bg-white shadow-[0_4px_14px_rgba(45,17,72,0.05)] pl-10 pr-9 text-[13px] font-medium text-[#1B1026] placeholder-[#948B9E] focus:outline-none focus:ring-2 focus:ring-[#E89223]/40"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C8396] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Dietary & Bestseller Filter Pills */}
                <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => {
                      setVegOnly((v) => !v)
                      if (!vegOnly) setNonVegOnly(false)
                    }}
                    className={`h-8 px-3 rounded-full text-[11.5px] font-bold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                      vegOnly
                        ? 'bg-[#15803D] text-white'
                        : 'bg-white text-[#1B1026] shadow-sm'
                    }`}
                  >
                    <FssaiDot veg={true} />
                    <span>Pure Veg</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNonVegOnly((v) => !v)
                      if (!nonVegOnly) setVegOnly(false)
                    }}
                    className={`h-8 px-3 rounded-full text-[11.5px] font-bold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                      nonVegOnly
                        ? 'bg-[#DC2626] text-white'
                        : 'bg-white text-[#1B1026] shadow-sm'
                    }`}
                  >
                    <FssaiDot veg={false} />
                    <span>Non-Veg</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBestsellersOnly((v) => !v)}
                    className={`h-8 px-3 rounded-full text-[11.5px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
                      bestsellersOnly
                        ? 'bg-[#2D1148] text-white'
                        : 'bg-white text-[#1B1026] shadow-sm'
                    }`}
                  >
                    Bestsellers
                  </button>

                  <button
                    type="button"
                    onClick={() => setUnder250((v) => !v)}
                    className={`h-8 px-3 rounded-full text-[11.5px] font-bold whitespace-nowrap cursor-pointer transition-colors tnum ${
                      under250
                        ? 'bg-[#E89223] text-white'
                        : 'bg-white text-[#1B1026] shadow-sm'
                    }`}
                  >
                    Under ₹250
                  </button>
                </div>
              </div>

              {/* Categorized Horizontal Dish Cards */}
              <div className="px-4 pt-4 space-y-5">
                {MENU_GROUPS.map((group, groupIdx) => {
                  const dishes = menuGroupedDishes[group] || []
                  if (dishes.length === 0) return null

                  return (
                    <React.Fragment key={group}>
                      {/* PLACEMENT 3B: Architectural Mandala Hairline Divider between Menu categories */}
                      {groupIdx > 0 && <ArchitecturalMandalaDivider />}
                      <section>
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-[16px] font-extrabold text-[#1B1026]">
                            {group}
                          </h2>
                          <span className="text-[11px] font-bold text-[#6E6578] tnum">
                            {dishes.length} items
                          </span>
                        </div>

                        <div className="space-y-3">
                          {dishes.map((dish) => {
                            const qty = getDishQty(dish.id)
                            return (
                              <article
                                key={dish.id}
                                onClick={() => openCustomization(dish)}
                                className="bg-white rounded-[22px] p-3.5 shadow-[0_6px_24px_rgba(45,17,72,0.06)] flex items-center justify-between gap-3 cursor-pointer"
                              >
                                {/* Left Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <FssaiDot veg={dish.veg} />
                                    {dish.badge && (
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${badgeStyle(
                                          dish.badgeType
                                        )}`}
                                      >
                                        {dish.badge}
                                      </span>
                                    )}
                                  </div>

                                  <h3 className="text-[15px] font-bold text-[#1B1026] leading-snug">
                                    {dish.name}
                                  </h3>

                                  <div className="flex items-center gap-2 mt-1 tnum">
                                    <span className="text-[14.5px] font-extrabold text-[#2D1148]">
                                      ₹{dish.price}
                                    </span>
                                    <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#6E6578]">
                                      <Star className="w-3 h-3 fill-[#E89223] text-[#E89223]" />
                                      {dish.rating} ({dish.ratingCount})
                                    </span>
                                  </div>

                                  <p className="text-[11.5px] text-[#6E6578] line-clamp-2 mt-1 leading-relaxed">
                                    {dish.description}
                                  </p>
                                </div>

                                {/* Right Image + Add Control */}
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex flex-col items-center shrink-0"
                                >
                                  <div className="relative w-[96px] h-[96px]">
                                    <img
                                      src={dish.image}
                                      alt={dish.name}
                                      onClick={() => openCustomization(dish)}
                                      onError={(e) => {
                                        e.currentTarget.src = FALLBACK_FOOD_IMG
                                      }}
                                      className="w-full h-full rounded-[16px] object-cover cursor-pointer"
                                      loading="lazy"
                                    />
                                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2">
                                      {qty === 0 ? (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            dish.customizable
                                              ? openCustomization(dish)
                                              : quickAddDish(dish)
                                          }
                                          className="h-7 px-4 rounded-full bg-[#E89223] hover:bg-[#D48016] text-white text-[11px] font-extrabold shadow-md cursor-pointer transition-colors whitespace-nowrap"
                                        >
                                          + Add
                                        </button>
                                      ) : (
                                        <div className="h-7 px-2 rounded-full bg-[#2D1148] text-white inline-flex items-center gap-2 text-[11.5px] font-extrabold shadow-md tnum">
                                          <button
                                            type="button"
                                            onClick={() => quickDecrementDish(dish.id)}
                                            className="cursor-pointer"
                                            aria-label="Decrease"
                                          >
                                            <Minus className="w-3 h-3 stroke-[2.8]" />
                                          </button>
                                          <span>{qty}</span>
                                          <button
                                            type="button"
                                            onClick={() => quickAddDish(dish)}
                                            className="cursor-pointer"
                                            aria-label="Increase"
                                          >
                                            <Plus className="w-3 h-3 stroke-[2.8]" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {dish.customizable && (
                                    <span className="text-[9.5px] font-semibold text-[#8C8396] mt-3.5">
                                      Customisable
                                    </span>
                                  )}
                                </div>
                              </article>
                            )
                          })}
                        </div>
                      </section>
                    </React.Fragment>
                  )
                })}

                {totalMenuResults === 0 && (
                  <div className="p-8 rounded-[22px] bg-white text-center shadow-[0_6px_24px_rgba(45,17,72,0.06)]">
                    <p className="text-sm font-bold text-[#1B1026]">
                      No dishes match your filters
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('')
                        setVegOnly(false)
                        setNonVegOnly(false)
                        setBestsellersOnly(false)
                        setUnder250(false)
                      }}
                      className="mt-3 h-9 px-5 rounded-full bg-[#2D1148] text-white text-xs font-bold cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------
              TAB 3: OFFERS & ROYAL REWARDS
             --------------------------------------------------------------- */}
          {activeTab === 'offers' && (
            <div className="px-4 pt-5 space-y-5">
              <div>
                <h1 className="text-[21px] font-extrabold text-[#1B1026]">
                  Offers &amp; Rewards
                </h1>
                <p className="text-xs font-medium text-[#6E6578] mt-0.5">
                  Exclusive PM Zaika dine-in privileges &amp; combos
                </p>
              </div>

              {/* PLACEMENT 1A: Centerpiece Metallic PM Zaika Royal Pass Card */}
              <RoyalPassCard
                royalPoints={royalPoints}
                selectedTable={selectedTable}
                onRedeem={handleRedeemRoyalPoints}
              />

              {/* Click-to-Apply Coupon Cards */}
              <section className="space-y-3">
                <h2 className="text-[15px] font-extrabold text-[#1B1026]">
                  Available Coupons
                </h2>
                {COUPONS.map((c) => {
                  const isApplied = appliedCouponCode === c.code
                  return (
                    <div
                      key={c.code}
                      className="rounded-[22px] bg-white p-4 shadow-[0_6px_22px_rgba(45,17,72,0.06)] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#F2EAF8] text-[#2D1148] text-[11px] font-extrabold tracking-wider tnum">
                            {c.code}
                          </span>
                          <span className="text-[9.5px] font-bold uppercase text-[#E89223]">
                            {c.badge}
                          </span>
                        </div>
                        <h3 className="text-[14.5px] font-bold text-[#1B1026] mt-1.5">
                          {c.title}
                        </h3>
                        <p className="text-[11.5px] text-[#6E6578] mt-0.5">
                          {c.subtitle}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          isApplied
                            ? (setAppliedCouponCode(null), showToast(`Removed ${c.code}`))
                            : handleApplyCouponCode(c.code)
                        }
                        className={`shrink-0 h-9 px-4 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                          isApplied
                            ? 'bg-[#1A7F5A] text-white'
                            : 'bg-[#2D1148] hover:bg-[#461B6E] text-white'
                        }`}
                      >
                        {isApplied ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                  )
                })}
              </section>
            </div>
          )}

          {/* ---------------------------------------------------------------
              TAB 4: INFO / CONCIERGE HUB (ALL ORIGINAL PM ZAIKA FEATURES)
             --------------------------------------------------------------- */}
          {activeTab === 'hub' && (
            <div className="px-4 pt-5 space-y-4">
              {/* Brand Card with Lotus-Ring Framed Royal Crest */}
              <section className="rounded-[24px] bg-white p-4 shadow-[0_6px_24px_rgba(45,17,72,0.06)] flex items-center gap-3.5">
                <PmZaikaCrest />
                <div className="min-w-0">
                  <h1 className="text-[18px] font-extrabold text-[#2D1148] leading-tight">
                    PM ZAIKA RESTAURANT
                  </h1>
                  <p className="text-[11.5px] font-medium text-[#6E6578] mt-0.5">
                    Indian • Chinese • Tandoor • Rolls
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[#1B1026] tnum">
                    <span className="inline-flex items-center gap-0.5 text-[#D48016]">
                      4.8 <Star className="w-3.5 h-3.5 fill-[#E89223] text-[#E89223]" />
                    </span>
                    <span className="text-[#C7BFD0]">•</span>
                    <span className="text-[#461B6E]">1.2K+ ratings</span>
                  </div>
                </div>
              </section>

              {/* PLACEMENT 1B: Compact Metallic Royal Pass Preview */}
              <RoyalPassCard
                royalPoints={royalPoints}
                selectedTable={selectedTable}
                onRedeem={handleRedeemRoyalPoints}
                compact
              />

              {/* Contact & Orders Card */}
              <section className="rounded-[22px] bg-white p-4 shadow-[0_6px_24px_rgba(45,17,72,0.06)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#6E6578]">
                    Restaurant Contact &amp; Orders
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FDEBD3] text-[#D48016] text-[10px] font-bold">
                    Main Helpline
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div>
                    <a
                      href="tel:+917488260572"
                      className="text-[17px] font-extrabold text-[#1B1026] hover:text-[#2D1148] tnum"
                    >
                      +91 74882 60572
                    </a>
                    <p className="text-[11.5px] text-[#6E6578] mt-0.5 tnum">
                      Secondary Helpline: 95257 48843
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="h-9 px-3 rounded-xl bg-[#FAF5F0] hover:bg-[#F2EAF8] text-[#2D1148] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      {phoneCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#15803D]" />
                          <span className="text-[#15803D]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <a
                      href="tel:+917488260572"
                      className="h-9 px-3.5 rounded-xl bg-[#2D1148] hover:bg-[#461B6E] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              </section>

              {/* Location Card */}
              <section className="rounded-[22px] bg-white p-4 shadow-[0_6px_24px_rgba(45,17,72,0.06)] flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#F2EAF8] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#2D1148]" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-[13px] font-bold text-[#1B1026]">
                      Phulwari Sharif, Patna
                    </h2>
                    <p className="text-[11.5px] text-[#6E6578] leading-relaxed mt-0.5">
                      Phulwari Rd, Near Shaheed Bhagat Singh Chowk, Birla Colony, Phulwari Sharif, Patna, Bihar 801505
                    </p>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Phulwari+Rd+Near+Shaheed+Bhagat+Singh+Chowk+Birla+Colony+Phulwari+Sharif+Patna+Bihar+801505"
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 h-8 px-3 rounded-full bg-[#F2EAF8] hover:bg-[#2D1148] text-[#2D1148] hover:text-white text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </section>

              {/* Guest Feedback CTA Card */}
              <button
                type="button"
                onClick={() => {
                  setFeedbackDone(false)
                  setFeedbackOpen(true)
                }}
                className="w-full rounded-[22px] bg-gradient-to-r from-[#2D1148] to-[#461B6E] p-4 text-left text-white shadow-[0_12px_26px_rgba(45,17,72,0.2)] flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#E89223] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[14px] font-extrabold leading-tight">
                      Review &amp; Share Feedback
                    </span>
                    <span className="block text-[11px] text-[#FDEBD3] mt-0.5">
                      5 quick questions • Takes ~30 sec • +50 Royal Pts
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#E89223] shrink-0" />
              </button>

              {/* Admin Direct Escalation Card (Dignified Soft-Rose) */}
              <button
                type="button"
                onClick={() => setComplaintOpen(true)}
                className="w-full rounded-[22px] bg-[#FFF2F3] border border-[#F5D0D4] hover:bg-[#FFE8EA] p-4 text-left flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#FDE2E4] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-[#C81E3A]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13px] font-bold text-[#7F1D2C]">
                        Have a Complaint or Issue?
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#C81E3A] text-white text-[9px] font-extrabold uppercase tracking-wider">
                        Admin Direct
                      </span>
                    </div>
                    <span className="block text-[11px] text-[#9F3A49] mt-0.5">
                      Call manager directly or register a table complaint
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#C81E3A] shrink-0" />
              </button>
            </div>
          )}
        </main>

        {/* =================================================================
            DOCKED 5-SLOT BOTTOM NAVIGATION BAR + FLOATING CENTER ORDER FAB
           ================================================================= */}
        <nav
          aria-label="Primary Navigation"
          className="absolute bottom-0 left-0 right-0 z-30 h-[74px] bg-white rounded-t-[26px] shadow-[0_-8px_30px_rgba(45,17,72,0.08)] px-3 grid grid-cols-5 items-center"
        >
          {/* Slot 1: Home */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <Home
              className={`w-[21px] h-[21px] transition-colors ${
                activeTab === 'home' ? 'text-[#2D1148] stroke-[2.4]' : 'text-[#9B92A6]'
              }`}
            />
            <span
              className={`text-[10.5px] ${
                activeTab === 'home'
                  ? 'font-extrabold text-[#2D1148]'
                  : 'font-semibold text-[#9B92A6]'
              }`}
            >
              Home
            </span>
          </button>

          {/* Slot 2: Menu */}
          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <LayoutGrid
              className={`w-[21px] h-[21px] transition-colors ${
                activeTab === 'menu' ? 'text-[#2D1148] stroke-[2.4]' : 'text-[#9B92A6]'
              }`}
            />
            <span
              className={`text-[10.5px] ${
                activeTab === 'menu'
                  ? 'font-extrabold text-[#2D1148]'
                  : 'font-semibold text-[#9B92A6]'
              }`}
            >
              Menu
            </span>
          </button>

          {/* Slot 3: PLACEMENT 5A — Center Floating Elevated Order Button with Etched Mandala Bezel */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="relative -mt-7 w-[74px] h-[74px] flex items-center justify-center">
              {/* Delicate Etched Concentric Mandala Ring Collar */}
              <ArchitecturalMandalaSvg
                className="absolute inset-0 w-full h-full opacity-80"
                strokeColor="#C88B2B"
                accentColor="#E89223"
                strokeWidth={1.7}
              />
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="w-[62px] h-[62px] rounded-full bg-[#3B155E] hover:bg-[#2D1148] text-white shadow-[0_10px_24px_rgba(59,21,94,0.38)] border-[3px] border-[#FAF5F0] flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95 relative z-10"
                aria-label="Open Cart & Order"
              >
                <ShoppingBag className="w-[20px] h-[20px]" />
                <span className="text-[9.5px] font-bold mt-0.5 leading-none">Order</span>
                {cartSummary.itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] px-1 rounded-full bg-[#E89223] text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white tnum">
                    {cartSummary.itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Slot 4: Offers */}
          <button
            type="button"
            onClick={() => setActiveTab('offers')}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <Tag
              className={`w-[21px] h-[21px] transition-colors ${
                activeTab === 'offers' ? 'text-[#2D1148] stroke-[2.4]' : 'text-[#9B92A6]'
              }`}
            />
            <span
              className={`text-[10.5px] ${
                activeTab === 'offers'
                  ? 'font-extrabold text-[#2D1148]'
                  : 'font-semibold text-[#9B92A6]'
              }`}
            >
              Offers
            </span>
          </button>

          {/* Slot 5: Info / Hub */}
          <button
            type="button"
            onClick={() => setActiveTab('hub')}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <User
              className={`w-[21px] h-[21px] transition-colors ${
                activeTab === 'hub' ? 'text-[#2D1148] stroke-[2.4]' : 'text-[#9B92A6]'
              }`}
            />
            <span
              className={`text-[10.5px] ${
                activeTab === 'hub'
                  ? 'font-extrabold text-[#2D1148]'
                  : 'font-semibold text-[#9B92A6]'
              }`}
            >
              Hub
            </span>
          </button>
        </nav>

        {/* =================================================================
            MODAL 1: TABLE SELECTOR (TABLE 01–12 & TAKEAWAY)
           ================================================================= */}
        {tableModalOpen && (
          <div
            onClick={() => setTableModalOpen(false)}
            className="absolute inset-0 z-50 bg-[#1B1026]/50 backdrop-blur-[2px] flex items-end"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[28px] bg-white p-5 shadow-2xl animate-in slide-in-from-bottom duration-250"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DF]">
                <div>
                  <h3 className="text-[16px] font-extrabold text-[#1B1026]">
                    Select Dining Table
                  </h3>
                  <p className="text-xs text-[#6E6578]">
                    Choose your table number or takeaway pickup
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTableModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF5F0] flex items-center justify-center text-[#6E6578] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5 mt-4 max-h-[270px] overflow-y-auto no-scrollbar">
                {TABLES.map((tbl) => (
                  <button
                    key={tbl}
                    type="button"
                    onClick={() => {
                      setSelectedTable(tbl)
                      setTableModalOpen(false)
                      showToast(`Switched to ${tbl}`)
                    }}
                    className={`py-2.5 rounded-2xl text-xs font-bold tnum cursor-pointer transition-colors ${
                      selectedTable === tbl
                        ? 'bg-[#2D1148] text-white shadow-md'
                        : 'bg-[#FAF5F0] text-[#1B1026] hover:bg-[#F2EAF8]'
                    }`}
                  >
                    {tbl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            MODAL 2: FILTER BOTTOM SHEET
           ================================================================= */}
        {filterSheetOpen && (
          <div
            onClick={() => setFilterSheetOpen(false)}
            className="absolute inset-0 z-50 bg-[#1B1026]/50 backdrop-blur-[2px] flex items-end"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[28px] bg-white p-5 shadow-2xl animate-in slide-in-from-bottom duration-250"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DF]">
                <h3 className="text-[16px] font-extrabold text-[#1B1026]">
                  Filter Menu
                </h3>
                <button
                  type="button"
                  onClick={() => setFilterSheetOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF5F0] flex items-center justify-center text-[#6E6578] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-2.5">
                {[
                  {
                    label: 'Pure Veg Only',
                    active: vegOnly,
                    toggle: () => {
                      setVegOnly((v) => !v)
                      if (!vegOnly) setNonVegOnly(false)
                    },
                  },
                  {
                    label: 'Non-Veg Only',
                    active: nonVegOnly,
                    toggle: () => {
                      setNonVegOnly((v) => !v)
                      if (!nonVegOnly) setVegOnly(false)
                    },
                  },
                  {
                    label: 'Under ₹250',
                    active: under250,
                    toggle: () => setUnder250((v) => !v),
                  },
                  {
                    label: 'Bestsellers & Chef Picks',
                    active: bestsellersOnly,
                    toggle: () => setBestsellersOnly((v) => !v),
                  },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={opt.toggle}
                    className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between text-[13px] font-bold cursor-pointer transition-colors ${
                      opt.active
                        ? 'bg-[#F2EAF8] text-[#2D1148] ring-1 ring-[#2D1148]/30'
                        : 'bg-[#FAF5F0] text-[#1B1026]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        opt.active ? 'bg-[#2D1148] text-white' : 'bg-white border border-[#D4CCD9]'
                      }`}
                    >
                      {opt.active && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setVegOnly(false)
                    setNonVegOnly(false)
                    setUnder250(false)
                    setBestsellersOnly(false)
                  }}
                  className="h-11 rounded-full bg-[#FAF5F0] text-[#2D1148] text-xs font-extrabold cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSheetOpen(false)}
                  className="h-11 rounded-full bg-[#E89223] hover:bg-[#D48016] text-white text-xs font-extrabold cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            MODAL 3: DISH DETAIL & CUSTOMIZATION SHEET
           ================================================================= */}
        {customDish && (
          <div
            onClick={() => setCustomDish(null)}
            className="absolute inset-0 z-50 bg-[#1B1026]/55 backdrop-blur-[2px] flex items-end"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[28px] bg-white max-h-[88%] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-250"
            >
              {/* Dish Hero Photo */}
              <div className="relative h-[168px] shrink-0">
                <img
                  src={customDish.image}
                  alt={customDish.name}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_FOOD_IMG
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1026]/70 via-transparent to-transparent" />
                <button
                  type="button"
                  onClick={() => setCustomDish(null)}
                  className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/95 text-[#1B1026] flex items-center justify-center shadow-md cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-2">
                    <FssaiDot veg={customDish.veg} />
                    <span className="text-xs font-bold inline-flex items-center gap-1 tnum">
                      <Star className="w-3.5 h-3.5 fill-[#E89223] text-[#E89223]" />
                      {customDish.rating} ({customDish.ratingCount})
                    </span>
                  </div>
                  <h3 className="text-[19px] font-extrabold mt-0.5 leading-tight">
                    {customDish.name}
                  </h3>
                </div>
              </div>

              {/* Scrollable Options */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                <p className="text-xs text-[#6E6578] leading-relaxed">
                  {customDish.description}
                </p>

                {/* Portion Size */}
                {customDish.halfPrice && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-extrabold text-[#1B1026]">
                        Choose Portion
                      </span>
                      <span className="text-[10.5px] font-bold text-[#E89223]">
                        Required
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: 'Half', price: customDish.halfPrice },
                        { label: 'Full', price: customDish.price },
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => setCustomPortion(opt.label)}
                          className={`p-3 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-colors ${
                            customPortion === opt.label
                              ? 'bg-[#FDEBD3]/60 border-[#E89223] text-[#1B1026]'
                              : 'bg-[#FAF5F0] border-transparent text-[#5B5266]'
                          }`}
                        >
                          <span className="text-xs font-bold">{opt.label}</span>
                          <span className="text-xs font-extrabold tnum">₹{opt.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spice Level */}
                <div>
                  <span className="block text-[13px] font-extrabold text-[#1B1026] mb-2">
                    Spice Preference
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Mild', 'Medium', 'Royal Spicy'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setCustomSpice(level)}
                        className={`py-2.5 px-2 rounded-2xl border text-[11.5px] font-bold inline-flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                          customSpice === level
                            ? 'bg-[#F2EAF8] border-[#3B155E] text-[#2D1148]'
                            : 'bg-[#FAF5F0] border-transparent text-[#6E6578]'
                        }`}
                      >
                        {level === 'Royal Spicy' && (
                          <Flame className="w-3 h-3 text-[#E89223]" />
                        )}
                        <span>{level}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add-ons */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-extrabold text-[#1B1026]">
                      Recommended Add-ons
                    </span>
                    <span className="text-[10.5px] font-medium text-[#8C8396]">
                      Optional
                    </span>
                  </div>
                  <div className="space-y-2">
                    {ADDONS.map((addon) => {
                      const selected = customAddons.includes(addon.id)
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() =>
                            setCustomAddons((prev) =>
                              prev.includes(addon.id)
                                ? prev.filter((i) => i !== addon.id)
                                : [...prev, addon.id]
                            )
                          }
                          className={`w-full px-3.5 py-2.5 rounded-2xl border flex items-center justify-between text-xs font-bold cursor-pointer transition-colors ${
                            selected
                              ? 'bg-[#FDEBD3]/55 border-[#E89223] text-[#1B1026]'
                              : 'bg-[#FAF5F0] border-transparent text-[#5B5266]'
                          }`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <FssaiDot veg={addon.veg} />
                            <span>{addon.name}</span>
                          </span>
                          <span className="tnum text-[#2D1148]">+₹{addon.price}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Dish-specific Cooking Notes */}
                <div>
                  <span className="block text-[13px] font-extrabold text-[#1B1026] mb-1.5">
                    Cooking Notes
                  </span>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="e.g. Less oil, extra mint chutney, no onions..."
                    className="w-full h-10 px-3.5 rounded-2xl bg-[#FAF5F0] text-xs font-medium text-[#1B1026] placeholder-[#948B9E] focus:outline-none focus:ring-2 focus:ring-[#E89223]/40"
                  />
                </div>
              </div>

              {/* Sticky Add Button */}
              <div className="p-4 border-t border-[#EFE8DF] bg-white">
                <button
                  type="button"
                  onClick={confirmCustomizationAdd}
                  className="w-full h-12 rounded-full bg-[#E89223] hover:bg-[#D48016] text-white text-[14px] font-extrabold shadow-[0_8px_20px_rgba(232,146,35,0.32)] cursor-pointer transition-colors tnum"
                >
                  Add to Order — ₹{customTotalUnit}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            MODAL 4: CART, CHECKOUT & LIVE KITCHEN ORDER TRACKER
           ================================================================= */}
        {cartOpen && (
          <div
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 z-50 bg-[#1B1026]/55 backdrop-blur-[2px] flex items-end"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[28px] bg-[#FAF5F0] max-h-[90%] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-250"
            >
              {/* Header */}
              <div className="px-5 py-4 bg-white border-b border-[#EFE8DF] flex items-center justify-between">
                <div>
                  <h3 className="text-[17px] font-extrabold text-[#1B1026]">
                    {liveOrder && cartSummary.itemCount === 0
                      ? 'Live Order Tracker'
                      : 'Your Order Bag'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setTableModalOpen(true)}
                    className="text-[11.5px] font-bold text-[#461B6E] inline-flex items-center gap-1 mt-0.5 cursor-pointer tnum"
                  >
                    <span>
                      {selectedTable} •{' '}
                      {selectedTable === 'Takeaway' ? 'Pickup' : 'Dine-In'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#E89223]" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF5F0] flex items-center justify-center text-[#6E6578] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Live Kitchen Order Tracker State */}
              {liveOrder && cartSummary.itemCount === 0 ? (
                <div className="p-5 space-y-5 overflow-y-auto no-scrollbar">
                  {/* PLACEMENT 4: Rotating Mandala Royal Kitchen Seal */}
                  <div className="rounded-[24px] bg-gradient-to-br from-[#1B0A2B] via-[#2D1148] to-[#3B155E] p-5 text-white text-center relative overflow-hidden border border-[#F3C669]/25 shadow-2xl">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10.5px] font-bold text-[#FDEBD3] tnum">
                      Order #{liveOrder.id} • {liveOrder.table}
                    </span>

                    {/* Rotating Royal Kitchen Seal */}
                    <div className="relative w-[134px] h-[134px] mx-auto my-4 flex items-center justify-center">
                      <ArchitecturalMandalaSvg
                        className="absolute inset-0 w-full h-full opacity-75 animate-[spin_28s_linear_infinite]"
                        strokeColor="#E8D2F5"
                        accentColor="#F3C669"
                        strokeWidth={1.35}
                      />
                      <div className="w-[62px] h-[62px] rounded-full bg-gradient-to-br from-[#E89223] to-[#D48016] text-white flex items-center justify-center shadow-[0_0_24px_rgba(232,146,35,0.45)] relative z-10 border-2 border-[#FDEBD3]/70">
                        {liveOrder.stage === 0 ? (
                          <ChefHat className="w-7 h-7" />
                        ) : liveOrder.stage === 1 ? (
                          <UtensilsCrossed className="w-7 h-7" />
                        ) : (
                          <CheckCircle2 className="w-7 h-7" />
                        )}
                      </div>
                    </div>

                    <span className="block text-[9.5px] font-extrabold uppercase tracking-[0.2em] text-[#F3C669]">
                      ROYAL KITCHEN SEAL
                    </span>
                    <h4 className="text-[20px] font-extrabold mt-1">
                      {liveOrder.stage === 0
                        ? 'Preparing in Tandoor'
                        : liveOrder.stage === 1
                        ? 'Plating'
                        : 'Serving to Table'}
                    </h4>
                    <GoldHairline className="my-3 max-w-[180px] mx-auto" />
                    <p className="text-xs text-white/80 tnum">
                      {liveOrder.itemsCount}{' '}
                      {liveOrder.itemsCount === 1 ? 'item' : 'items'} • Grand Total ₹
                      {liveOrder.total}
                    </p>
                  </div>

                  {/* 3-Step Visual Progress Tracker */}
                  <div className="rounded-[22px] bg-white p-4 shadow-[0_6px_20px_rgba(45,17,72,0.05)] space-y-4">
                    {[
                      {
                        step: 0,
                        title: 'Preparing in Tandoor',
                        desc: 'Chef is freshly preparing your royal dishes',
                      },
                      {
                        step: 1,
                        title: 'Plating',
                        desc: 'Garnishing with saffron, herbs & hot chutneys',
                      },
                      {
                        step: 2,
                        title: 'Serving to Table',
                        desc: `On its way hot to ${liveOrder.table}`,
                      },
                    ].map((st) => {
                      const done = liveOrder.stage >= st.step
                      const current = liveOrder.stage === st.step
                      return (
                        <div key={st.step} className="flex items-start gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              done
                                ? 'bg-[#E89223] text-white'
                                : 'bg-[#FAF5F0] text-[#B2A9BC]'
                            }`}
                          >
                            {done ? (
                              <Check className="w-4 h-4 stroke-[2.8]" />
                            ) : (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <p
                              className={`text-[13.5px] font-bold ${
                                current
                                  ? 'text-[#2D1148]'
                                  : done
                                  ? 'text-[#1B1026]'
                                  : 'text-[#9B92A6]'
                              }`}
                            >
                              {st.title}
                            </p>
                            <p className="text-[11.5px] text-[#6E6578]">{st.desc}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setLiveOrder((prev) =>
                          prev ? { ...prev, stage: (prev.stage + 1) % 3 } : prev
                        )
                      }
                      className="h-11 rounded-full bg-white border border-[#2D1148]/15 text-[#2D1148] text-xs font-extrabold cursor-pointer"
                    >
                      Simulate Status
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCartOpen(false)
                        setActiveTab('menu')
                      }}
                      className="h-11 rounded-full bg-[#2D1148] text-white text-xs font-extrabold cursor-pointer"
                    >
                      Order More
                    </button>
                  </div>
                </div>
              ) : cartSummary.itemCount === 0 ? (
                /* Empty Bag State */
                <div className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#F2EAF8] flex items-center justify-center mx-auto">
                    <UtensilsCrossed className="w-6 h-6 text-[#2D1148]" />
                  </div>
                  <h4 className="text-[16px] font-extrabold text-[#1B1026]">
                    Your order bag is empty
                  </h4>
                  <p className="text-xs text-[#6E6578] max-w-[240px] mx-auto">
                    Explore our royal biryanis, smoky tandoor kebabs, and fresh rolls.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCartOpen(false)
                      setActiveTab('menu')
                    }}
                    className="mt-2 h-10 px-6 rounded-full bg-[#E89223] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                /* Active Cart Checkout */
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
                    {/* Cart Items */}
                    <div className="rounded-[22px] bg-white shadow-[0_4px_16px_rgba(45,17,72,0.05)] divide-y divide-[#F4EFE9]">
                      {cartSummary.entries.map((entry) => (
                        <div
                          key={entry.key}
                          className="p-3.5 flex items-start justify-between gap-3"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="mt-0.5">
                              <FssaiDot veg={entry.dish.veg} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13.5px] font-bold text-[#1B1026] leading-snug">
                                {entry.dish.name}
                              </p>
                              <p className="text-[11px] text-[#6E6578] mt-0.5">
                                {entry.portion} • {entry.spice}
                                {entry.addons.length > 0
                                  ? ` • + ${entry.addons.join(', ')}`
                                  : ''}
                                {entry.notes ? ` • "${entry.notes}"` : ''}
                              </p>
                              <p className="text-[13px] font-extrabold text-[#2D1148] mt-1 tnum">
                                ₹{entry.unitPrice * entry.qty}
                              </p>
                            </div>
                          </div>

                          <div className="h-8 px-2 rounded-full bg-[#FDEBD3] text-[#2D1148] inline-flex items-center gap-2 text-xs font-extrabold tnum shrink-0">
                            <button
                              type="button"
                              onClick={() => updateCartQty(entry.key, -1)}
                              className="cursor-pointer"
                              aria-label="Decrease"
                            >
                              <Minus className="w-3.5 h-3.5 stroke-[2.6]" />
                            </button>
                            <span>{entry.qty}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(entry.key, 1)}
                              className="cursor-pointer"
                              aria-label="Increase"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.6]" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cooking Instructions */}
                    <input
                      type="text"
                      value={cookingNotes}
                      onChange={(e) => setCookingNotes(e.target.value)}
                      placeholder="Add cooking instructions (less spicy, extra chutney)..."
                      className="w-full h-11 px-4 rounded-2xl bg-white shadow-sm text-xs font-medium text-[#1B1026] placeholder-[#948B9E] focus:outline-none focus:ring-2 focus:ring-[#E89223]/40"
                    />

                    {/* Coupon Input / Quick Toggle */}
                    <div className="rounded-[20px] bg-white p-3.5 shadow-sm space-y-2.5">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#461B6E] shrink-0" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Enter code (e.g. ZAIKA25)"
                          className="flex-1 text-xs font-bold text-[#1B1026] placeholder-[#9B92A6] uppercase focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleApplyCouponCode(couponInput || 'ZAIKA25')
                          }
                          className="h-8 px-3.5 rounded-full bg-[#2D1148] text-white text-[11px] font-bold cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {appliedCouponCode && (
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#F4EFE9]">
                          <span className="font-bold text-[#15803D]">
                            {cartSummary.couponDiscount > 0
                              ? `${appliedCouponCode} applied — Saving ₹${cartSummary.couponDiscount}`
                              : `${appliedCouponCode} saved (add more to meet min order)`}
                          </span>
                          <button
                            type="button"
                            onClick={() => setAppliedCouponCode(null)}
                            className="text-[#DC2626] font-bold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Royal Rewards Points Toggle (50 Pts for ₹50 OFF) */}
                    {royalPoints >= 50 && (
                      <button
                        type="button"
                        onClick={() => setRedeemPoints((r) => !r)}
                        className={`w-full p-3.5 rounded-[20px] flex items-center justify-between text-left cursor-pointer transition-colors ${
                          redeemPoints
                            ? 'bg-[#F2EAF8] ring-1 ring-[#3B155E]'
                            : 'bg-white shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Award className="w-4 h-4 text-[#E89223]" />
                          <div>
                            <p className="text-xs font-bold text-[#1B1026]">
                              Redeem 50 Royal Points (₹50 OFF)
                            </p>
                            <p className="text-[10.5px] text-[#6E6578] tnum">
                              Available balance: {royalPoints} PTS
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[11px] font-extrabold ${
                            redeemPoints ? 'text-[#2D1148]' : 'text-[#E89223]'
                          }`}
                        >
                          {redeemPoints ? 'Applied ✓' : 'Use'}
                        </span>
                      </button>
                    )}

                    {/* Bill Summary */}
                    <div className="rounded-[22px] bg-white p-4 shadow-sm space-y-2 text-xs tnum">
                      <div className="flex justify-between text-[#6E6578]">
                        <span>Subtotal</span>
                        <span className="font-semibold text-[#1B1026]">
                          ₹{cartSummary.subtotal}
                        </span>
                      </div>
                      {cartSummary.couponDiscount > 0 && (
                        <div className="flex justify-between text-[#15803D] font-bold">
                          <span>Coupon ({appliedCouponCode})</span>
                          <span>-₹{cartSummary.couponDiscount}</span>
                        </div>
                      )}
                      {cartSummary.pointsDiscount > 0 && (
                        <div className="flex justify-between text-[#15803D] font-bold">
                          <span>Royal Rewards Credit</span>
                          <span>-₹{cartSummary.pointsDiscount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[#6E6578]">
                        <span>GST (5%)</span>
                        <span className="font-semibold text-[#1B1026]">
                          ₹{cartSummary.gst}
                        </span>
                      </div>
                      <div className="flex justify-between text-[15px] font-extrabold text-[#1B1026] pt-2.5 border-t border-[#EFE8DF]">
                        <span>Grand Total</span>
                        <span className="text-[#2D1148]">₹{cartSummary.grandTotal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Place Table Order CTA */}
                  <div className="p-4 bg-white border-t border-[#EFE8DF]">
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      className="w-full h-12 rounded-full bg-[#2D1148] hover:bg-[#461B6E] text-white text-[14px] font-extrabold shadow-[0_10px_24px_rgba(45,17,72,0.28)] cursor-pointer transition-colors tnum"
                    >
                      Place Table Order • ₹{cartSummary.grandTotal}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* =================================================================
            MODAL 5: 5-QUESTION GUEST FEEDBACK SHEET (+50 ROYAL PTS)
           ================================================================= */}
        {feedbackOpen && (
          <div
            onClick={() => setFeedbackOpen(false)}
            className="absolute inset-0 z-50 bg-[#1B1026]/55 backdrop-blur-[2px] flex items-end"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[28px] bg-white p-5 max-h-[88%] overflow-y-auto no-scrollbar shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DF]">
                <div>
                  <h3 className="text-[17px] font-extrabold text-[#1B1026]">
                    Guest Feedback
                  </h3>
                  <p className="text-xs text-[#6E6578]">
                    5 quick questions • Earn +50 Royal Points
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFeedbackOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF5F0] flex items-center justify-center text-[#6E6578] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {feedbackDone ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F7EE] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-[#15803D]" />
                  </div>
                  <h4 className="text-[18px] font-extrabold text-[#1B1026]">
                    Thank You for Dining With Us!
                  </h4>
                  <p className="text-xs text-[#6E6578] max-w-[260px] mx-auto">
                    +50 Royal Points have been credited to your balance.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFeedbackOpen(false)}
                    className="h-10 px-7 rounded-full bg-[#2D1148] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {FEEDBACK_QUESTIONS.map((q) => (
                    <div
                      key={q.id}
                      className="px-3.5 py-2.5 rounded-2xl bg-[#FAF5F0] flex items-center justify-between gap-2"
                    >
                      <span className="text-xs font-bold text-[#1B1026]">
                        {q.label}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setFeedbackRatings((prev) => ({
                                ...prev,
                                [q.id]: star,
                              }))
                            }
                            className="p-0.5 cursor-pointer"
                            aria-label={`Rate ${q.label} ${star}`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= feedbackRatings[q.id]
                                  ? 'fill-[#E89223] text-[#E89223]'
                                  : 'text-[#D6CEDE]'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <textarea
                    rows={2}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Any suggestions or dish shout-outs (optional)..."
                    className="w-full p-3.5 rounded-2xl bg-[#FAF5F0] text-xs font-medium text-[#1B1026] placeholder-[#948B9E] focus:outline-none focus:ring-2 focus:ring-[#E89223]/40"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setFeedbackDone(true)
                      setRoyalPoints((p) => p + 50)
                      setFeedbackComment('')
                      showToast('Feedback submitted! +50 Royal Points earned')
                    }}
                    className="w-full h-12 rounded-full bg-[#E89223] hover:bg-[#D48016] text-white text-[13.5px] font-extrabold cursor-pointer transition-colors"
                  >
                    Submit Feedback (+50 Pts)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================
            MODAL 6: ADMIN DIRECT COMPLAINT ESCALATION
           ================================================================= */}
        {complaintOpen && (
          <div
            onClick={() => setComplaintOpen(false)}
            className="absolute inset-0 z-50 bg-[#1B1026]/55 backdrop-blur-[2px] flex items-end"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[28px] bg-white p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DF]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#C81E3A]" />
                  <div>
                    <h3 className="text-[16px] font-extrabold text-[#1B1026]">
                      Admin Direct Escalation
                    </h3>
                    <p className="text-[11px] text-[#6E6578]">
                      Priority assistance for {selectedTable}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setComplaintOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF5F0] flex items-center justify-center text-[#6E6578] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {['Food Quality', 'Order Delay', 'Billing Issue', 'Service'].map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setComplaintCategory(item)}
                        className={`h-8 px-3 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                          complaintCategory === item
                            ? 'bg-[#C81E3A] text-white'
                            : 'bg-[#FFF2F3] text-[#7F1D2C]'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>

                <textarea
                  rows={3}
                  value={complaintNote}
                  onChange={(e) => setComplaintNote(e.target.value)}
                  placeholder="Tell us what went wrong so our floor manager can resolve it immediately..."
                  className="w-full p-3.5 rounded-2xl bg-[#FAF5F0] text-xs font-medium text-[#1B1026] placeholder-[#948B9E] focus:outline-none focus:ring-2 focus:ring-[#C81E3A]/30"
                />

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <a
                    href="tel:+917488260572"
                    className="h-11 rounded-full bg-[#FAF5F0] text-[#1B1026] text-xs font-extrabold inline-flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#2D1148]" />
                    <span>Call Manager</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setComplaintOpen(false)
                      setComplaintNote('')
                      showToast(`Manager alerted for ${selectedTable}.`)
                    }}
                    className="h-11 rounded-full bg-[#C81E3A] hover:bg-[#A61730] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Register Complaint
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
