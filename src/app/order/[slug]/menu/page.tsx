'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState, useMemo, useEffect, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
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
  Sparkles,
} from 'lucide-react'
import { FOOD_IMAGE_MAP } from '@/lib/ordering/foodImages'

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
  badgeType?: 'plum' | 'saffron' | 'emerald' | string
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
  stage: number
}

// --- AUTHENTIC PM ZAIKA MENU DATA (Matches Physical Menu & User Images 1-7) ---
const MENU_ITEMS: MenuItem[] = [
  // ==========================================
  // SOUPS (Matches user screenshots 5, 6, 7 1:1)
  // ==========================================
  {
    id: 'veg-sweet-corn',
    name: 'Veg Sweet Corn Soup',
    category: 'Soups',
    menuGroup: 'Soups',
    veg: true,
    price: 110,
    rating: 4.7,
    ratingCount: '320+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Velvety golden sweet corn broth with finely diced garden vegetables and white pepper.',
    image:
      FOOD_IMAGE_MAP['veg sweet corn'] ||
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'sweet-corn-non-veg',
    name: 'Sweet Corn (Non Veg)',
    category: 'Soups',
    menuGroup: 'Soups',
    veg: false,
    price: 140,
    rating: 4.8,
    ratingCount: '410+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Warming golden corn soup enriched with tender shredded chicken and egg ribbons.',
    image:
      FOOD_IMAGE_MAP['sweet corn (non veg)'] ||
      'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'hot-n-sour-veg',
    name: 'Hot N Sour (Veg)',
    category: 'Soups',
    menuGroup: 'Soups',
    veg: true,
    price: 110,
    rating: 4.6,
    ratingCount: '290+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Zesty dark soy and chilli broth loaded with julienned veggies and crisp noodles.',
    image:
      FOOD_IMAGE_MAP['hot n sour (veg)'] ||
      'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'hot-n-sour-non-veg',
    name: 'Hot N Sour (Non Veg)',
    category: 'Soups',
    menuGroup: 'Soups',
    veg: false,
    price: 140,
    rating: 4.8,
    ratingCount: '450+',
    badge: 'POPULAR',
    badgeType: 'saffron',
    popular: true,
    customizable: false,
    description: 'Classic peppery Indo-Chinese soup with poached chicken, wild mushrooms, and egg drop.',
    image:
      FOOD_IMAGE_MAP['hot n sour (non veg)'] ||
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'veg-manchow',
    name: 'Veg Manchow Soup',
    category: 'Soups',
    menuGroup: 'Soups',
    veg: true,
    price: 110,
    rating: 4.7,
    ratingCount: '380+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Garlicky dark broth loaded with minced ginger, scallions, cilantro, and crispy noodles.',
    image:
      FOOD_IMAGE_MAP['veg manchow'] ||
      'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'chicken-manchow',
    name: 'Chicken Manchow Soup',
    category: 'Soups',
    menuGroup: 'Soups',
    veg: false,
    price: 140,
    rating: 4.9,
    ratingCount: '520+',
    badge: 'BESTSELLER',
    badgeType: 'plum',
    popular: true,
    customizable: false,
    description: 'Hearty ginger-garlic chicken soup served piping hot with crunchy fried wonton crisps.',
    image:
      FOOD_IMAGE_MAP['chicken manchow soup'] ||
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'mushroom-soup',
    name: 'Mushroom Soup',
    category: 'Soups',
    menuGroup: 'Soups',
    veg: true,
    price: 110,
    rating: 4.6,
    ratingCount: '210+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Earthy wild button mushroom puree with fresh thyme and cracked black pepper.',
    image:
      FOOD_IMAGE_MAP['mushroom soup'] ||
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'chicken-mushroom-soup',
    name: 'Chicken Mushroom Soup',
    category: 'Soups',
    menuGroup: 'Soups',
    veg: false,
    price: 160,
    rating: 4.8,
    ratingCount: '270+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Rich velvety broth combining tender chicken morsels and sliced button mushrooms.',
    image:
      FOOD_IMAGE_MAP['chicken mushroom soup'] ||
      'https://images.unsplash.com/photo-1588566565463-180a5b2090f2?auto=format&fit=crop&w=400&q=80',
  },

  // ==========================================
  // CHEF SIGNATURES (Awadhi & Mughlai Masterpieces)
  // ==========================================
  {
    id: 'mutton-handi-biryani',
    name: 'Mutton Handi Biryani',
    category: 'Biryani & Rice',
    menuGroup: 'Biryani & Rice',
    veg: false,
    price: 380,
    halfPrice: 220,
    rating: 4.9,
    ratingCount: '1.4K+',
    badge: 'ROYAL SPECIAL',
    badgeType: 'plum',
    popular: true,
    customizable: true,
    description: 'Slow-cooked in a sealed clay handi with long-grain basmati, saffron, and Awadhi spices.',
    image:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'murg-mussallam',
    name: 'Murg Mussallam',
    category: 'Curries & Mains',
    menuGroup: 'Curries & Mains',
    veg: false,
    price: 420,
    halfPrice: 240,
    rating: 4.9,
    ratingCount: '680+',
    badge: 'CHEF SIGNATURE',
    badgeType: 'emerald',
    popular: true,
    customizable: true,
    description: 'Whole roasted chicken braised in a decadent almond, cashew, and saffron Mughlai gravy.',
    image:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'chicken-dum-biryani',
    name: 'Chicken Dum Biryani',
    category: 'Biryani & Rice',
    menuGroup: 'Biryani & Rice',
    veg: false,
    price: 290,
    halfPrice: 170,
    rating: 4.8,
    ratingCount: '1.1K+',
    badge: 'BESTSELLER',
    badgeType: 'saffron',
    popular: true,
    customizable: true,
    description: 'Fragrant long-grain basmati slow-steamed with spiced chicken, mint, and fried onions.',
    image:
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'paneer-tikka-shashlik',
    name: 'Paneer Tikka Shashlik',
    category: 'Tandoori & Kebabs',
    menuGroup: 'Tandoori & Kebabs',
    veg: true,
    price: 260,
    halfPrice: 150,
    rating: 4.8,
    ratingCount: '740+',
    badge: "CHEF'S PICK",
    badgeType: 'emerald',
    popular: true,
    customizable: true,
    description: 'Char-grilled malai paneer skewers with bell peppers, served with pudina chutney.',
    image:
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'chicken-malai-tikka',
    name: 'Chicken Malai Tikka',
    category: 'Tandoori & Kebabs',
    menuGroup: 'Tandoori & Kebabs',
    veg: false,
    price: 310,
    halfPrice: 180,
    rating: 4.8,
    ratingCount: '660+',
    badge: 'POPULAR',
    badgeType: 'saffron',
    popular: true,
    customizable: true,
    description: 'Velvety cashew, cream, and cardamom-marinated chicken charred in clay tandoor.',
    image:
      'https://images.unsplash.com/photo-1610057099443-fde8c8d50f2c?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'mutton-seekh-kebab',
    name: 'Mutton Seekh Kebab',
    category: 'Tandoori & Kebabs',
    menuGroup: 'Tandoori & Kebabs',
    veg: false,
    price: 340,
    halfPrice: 195,
    rating: 4.9,
    ratingCount: '540+',
    badge: "CHEF'S PICK",
    badgeType: 'emerald',
    popular: false,
    customizable: true,
    description: 'Skewered minced mutton blended with royal spices, fresh coriander, and smoky ghee.',
    image:
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=80',
  },

  // ==========================================
  // STARTERS (VEG)
  // ==========================================
  {
    id: 'paneer-chili-dry',
    name: 'Paneer Chili Dry',
    category: 'Starters (Veg)',
    menuGroup: 'Starters',
    veg: true,
    price: 220,
    halfPrice: 130,
    rating: 4.7,
    ratingCount: '430+',
    badge: 'POPULAR',
    badgeType: 'saffron',
    popular: true,
    customizable: false,
    description: 'Wok-tossed cottage cheese cubes with crisp capsicum, onions, and dark green chili glaze.',
    image:
      FOOD_IMAGE_MAP['paneer chili dry'] ||
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'gobi-manchurian',
    name: 'Gobi Manchurian Dry',
    category: 'Starters (Veg)',
    menuGroup: 'Starters',
    veg: true,
    price: 180,
    halfPrice: 110,
    rating: 4.6,
    ratingCount: '350+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Crispy battered cauliflower florets glazed in spicy garlic soy and scallions.',
    image:
      FOOD_IMAGE_MAP['gobi manchurian'] ||
      'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'crispy-chili-potato',
    name: 'Crispy Chili Potatoes',
    category: 'Starters (Veg)',
    menuGroup: 'Starters',
    veg: true,
    price: 170,
    halfPrice: 100,
    rating: 4.6,
    ratingCount: '290+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Golden fried potato batons coated with sweet spicy schezwan sauce and sesame seeds.',
    image:
      FOOD_IMAGE_MAP['crispy chili potatos'] ||
      'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'paneer-65',
    name: 'Paneer 65',
    category: 'Starters (Veg)',
    menuGroup: 'Starters',
    veg: true,
    price: 230,
    halfPrice: 135,
    rating: 4.8,
    ratingCount: '410+',
    badge: 'BESTSELLER',
    badgeType: 'plum',
    popular: true,
    customizable: false,
    description: 'Hyderabadi spiced crispy paneer tossed with curry leaves, mustard seeds, and curd.',
    image:
      FOOD_IMAGE_MAP['paneer 65'] ||
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'paneer-pakora',
    name: 'Paneer Pakora',
    category: 'Starters (Veg)',
    menuGroup: 'Starters',
    veg: true,
    price: 190,
    halfPrice: 110,
    rating: 4.7,
    ratingCount: '310+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Spiced besan batter coated tender paneer fritters dusted with chaat masala.',
    image:
      FOOD_IMAGE_MAP['paneer pakora'] ||
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
  },

  // ==========================================
  // STARTERS (NON-VEG) (Matches user screenshot 1)
  // ==========================================
  {
    id: 'chicken-lollypop',
    name: 'Chicken Lollipop (6 Pcs)',
    category: 'Starters (Non-Veg)',
    menuGroup: 'Starters',
    veg: false,
    price: 260,
    halfPrice: 150,
    rating: 4.9,
    ratingCount: '1.2K+',
    badge: 'BESTSELLER',
    badgeType: 'plum',
    popular: true,
    customizable: false,
    description: 'Frenched chicken winglets marinated in fiery red spices, deep fried and served with hot garlic dip.',
    image:
      FOOD_IMAGE_MAP['chicken lollypop'] ||
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'chicken-chili-boneless-dry',
    name: 'Chicken Chilli Boneless Dry',
    category: 'Starters (Non-Veg)',
    menuGroup: 'Starters',
    veg: false,
    price: 270,
    halfPrice: 160,
    rating: 4.8,
    ratingCount: '820+',
    badge: 'POPULAR',
    badgeType: 'saffron',
    popular: true,
    customizable: false,
    description: 'Juicy boneless chicken chunks tossed with diced capsicum, onions, and spicy dark soya sauce.',
    image:
      FOOD_IMAGE_MAP['chicken chili bonless dry'] ||
      'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'butter-chicken-chilli-dry',
    name: 'Butter Chicken Chilli Dry',
    category: 'Starters (Non-Veg)',
    menuGroup: 'Starters',
    veg: false,
    price: 290,
    halfPrice: 175,
    rating: 4.8,
    ratingCount: '480+',
    badge: 'CHEF SPECIAL',
    badgeType: 'emerald',
    popular: true,
    customizable: false,
    description: 'PM Zaika fusion creation — tandoori chicken tossed in buttery chili glaze with green herbs.',
    image:
      FOOD_IMAGE_MAP['butter chicken chilli dry'] ||
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'egg-chili-dry',
    name: 'Egg Chilli Dry',
    category: 'Starters (Non-Veg)',
    menuGroup: 'Starters',
    veg: false,
    price: 180,
    halfPrice: 110,
    rating: 4.6,
    ratingCount: '340+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Crispy fried boiled egg quarters tossed with sliced bell peppers, chillies, and savory sauce.',
    image:
      FOOD_IMAGE_MAP['egg chili dry'] ||
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'chicken-65',
    name: 'Chicken 65',
    category: 'Starters (Non-Veg)',
    menuGroup: 'Starters',
    veg: false,
    price: 260,
    halfPrice: 155,
    rating: 4.8,
    ratingCount: '670+',
    badge: 'POPULAR',
    badgeType: 'saffron',
    popular: true,
    customizable: false,
    description: 'Bite-sized chicken chunks marinated with crushed peppercorns, curry leaves, and South Indian spices.',
    image:
      FOOD_IMAGE_MAP['chicken 65'] ||
      'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'chicken-pakora',
    name: 'Chicken Pakora',
    category: 'Starters (Non-Veg)',
    menuGroup: 'Starters',
    veg: false,
    price: 240,
    halfPrice: 140,
    rating: 4.7,
    ratingCount: '430+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Traditional gram flour and carom seed battered boneless chicken fritters fried to crisp perfection.',
    image:
      FOOD_IMAGE_MAP['chicken pakora'] ||
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
  },

  // ==========================================
  // TANDOORI & KEBABS
  // ==========================================
  {
    id: 'chicken-tandoori',
    name: 'Chicken Tandoori (Full / Half)',
    category: 'Tandoori & Kebabs',
    menuGroup: 'Tandoori & Kebabs',
    veg: false,
    price: 440,
    halfPrice: 250,
    rating: 4.9,
    ratingCount: '1.3K+',
    badge: 'BESTSELLER',
    badgeType: 'plum',
    popular: true,
    customizable: true,
    description: 'Traditional whole chicken marinated in yogurt, Kashmiri deghi mirch, and roasted in clay tandoor.',
    image:
      FOOD_IMAGE_MAP['chicken tandoori'] ||
      'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'chicken-tikka',
    name: 'Chicken Tikka (8 Pcs)',
    category: 'Tandoori & Kebabs',
    menuGroup: 'Tandoori & Kebabs',
    veg: false,
    price: 300,
    halfPrice: 175,
    rating: 4.8,
    ratingCount: '890+',
    badge: 'POPULAR',
    badgeType: 'saffron',
    popular: true,
    customizable: true,
    description: 'Boneless chicken thighs marinated with mustard oil, hung curd, and crushed spices, flame-roasted.',
    image:
      FOOD_IMAGE_MAP['chicken tikka'] ||
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'chicken-reshmi-kabab',
    name: 'Chicken Reshmi Kabab',
    category: 'Tandoori & Kebabs',
    menuGroup: 'Tandoori & Kebabs',
    veg: false,
    price: 320,
    halfPrice: 185,
    rating: 4.8,
    ratingCount: '580+',
    badge: "CHEF'S PICK",
    badgeType: 'emerald',
    popular: false,
    customizable: true,
    description: 'Silky boneless chicken tenders steeped in egg white, cashew paste, and light mace seasoning.',
    image:
      FOOD_IMAGE_MAP['chicken reshmi kabab'] ||
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'chicken-seekh-kabab',
    name: 'Chicken Seekh Kabab',
    category: 'Tandoori & Kebabs',
    menuGroup: 'Tandoori & Kebabs',
    veg: false,
    price: 290,
    halfPrice: 170,
    rating: 4.7,
    ratingCount: '620+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'Minced chicken seasoned with fresh mint, coriander, and royal garam masala, roasted on iron skewers.',
    image:
      FOOD_IMAGE_MAP['chicken seekh kabab'] ||
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
  },

  // ==========================================
  // BIRYANI & RICE
  // ==========================================
  {
    id: 'zaika-spl-biryani',
    name: 'PM Zaika Special Biryani',
    category: 'Biryani & Rice',
    menuGroup: 'Biryani & Rice',
    veg: false,
    price: 390,
    halfPrice: 230,
    rating: 4.9,
    ratingCount: '1.6K+',
    badge: "CHEF'S ROYAL",
    badgeType: 'plum',
    popular: true,
    customizable: true,
    description: 'Grand combination of tender mutton, chicken tikka, and spiced boiled egg atop saffron basmati.',
    image:
      FOOD_IMAGE_MAP['zaika spl. biryani'] ||
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'veg-dum-biryani',
    name: 'Veg Dum Biryani',
    category: 'Biryani & Rice',
    menuGroup: 'Biryani & Rice',
    veg: true,
    price: 220,
    halfPrice: 130,
    rating: 4.7,
    ratingCount: '540+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'Seasonal garden veggies, baby potatoes, and paneer cubes slow-dum with aromatic rose water and mint.',
    image:
      FOOD_IMAGE_MAP['veg biryani'] ||
      'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'paneer-biryani',
    name: 'Paneer Dum Biryani',
    category: 'Biryani & Rice',
    menuGroup: 'Biryani & Rice',
    veg: true,
    price: 250,
    halfPrice: 145,
    rating: 4.8,
    ratingCount: '610+',
    badge: 'POPULAR',
    badgeType: 'saffron',
    popular: true,
    customizable: true,
    description: 'Layers of tandoori paneer tikka and aromatic basmati rice infused with saffron and desi ghee.',
    image:
      FOOD_IMAGE_MAP['paneer biryani'] ||
      'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'egg-biryani',
    name: 'Egg Dum Biryani',
    category: 'Biryani & Rice',
    menuGroup: 'Biryani & Rice',
    veg: false,
    price: 230,
    halfPrice: 135,
    rating: 4.7,
    ratingCount: '480+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'Golden fried farm eggs slow cooked with caramelized onions, kewra, and aged basmati rice.',
    image:
      FOOD_IMAGE_MAP['egg biryani'] ||
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80',
  },

  // ==========================================
  // CURRIES & MUGHLAI MAINS
  // ==========================================
  {
    id: 'butter-chicken',
    name: 'Butter Chicken (Murgh Makhani)',
    category: 'Curries & Mains',
    menuGroup: 'Curries & Mains',
    veg: false,
    price: 320,
    halfPrice: 185,
    rating: 4.9,
    ratingCount: '1.5K+',
    badge: 'BESTSELLER',
    badgeType: 'plum',
    popular: true,
    customizable: true,
    description: 'Tandoor-pulled chicken tikka simmered in silky tomato, kasuri methi, and churned white butter gravy.',
    image:
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'chicken-tikka-masala',
    name: 'Chicken Tikka Masala',
    category: 'Curries & Mains',
    menuGroup: 'Curries & Mains',
    veg: false,
    price: 330,
    halfPrice: 190,
    rating: 4.8,
    ratingCount: '920+',
    badge: 'POPULAR',
    badgeType: 'saffron',
    popular: true,
    customizable: true,
    description: 'Smoky tandoori chicken tikka cooked in a robust onion-tomato gravy with bell peppers.',
    image:
      FOOD_IMAGE_MAP['chicken tikka masala'] ||
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'chicken-korma',
    name: 'Chicken Korma (Awadhi Shahi)',
    category: 'Curries & Mains',
    menuGroup: 'Curries & Mains',
    veg: false,
    price: 310,
    halfPrice: 180,
    rating: 4.8,
    ratingCount: '740+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'Royal slow-cooked chicken in an aromatic brown onion, cashew, and saffron gravy.',
    image:
      FOOD_IMAGE_MAP['chicken korma'] ||
      'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'mutton-curry',
    name: 'Mutton Rogan Josh',
    category: 'Curries & Mains',
    menuGroup: 'Curries & Mains',
    veg: false,
    price: 390,
    halfPrice: 225,
    rating: 4.9,
    ratingCount: '810+',
    badge: "CHEF'S PICK",
    badgeType: 'emerald',
    popular: true,
    customizable: true,
    description: 'Tender goat meat slow-braised with Kashmiri chillies, ratan jot, and whole royal spices.',
    image:
      FOOD_IMAGE_MAP['mutton curry'] ||
      'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'paneer-butter-masala',
    name: 'Paneer Butter Masala',
    category: 'Curries & Mains',
    menuGroup: 'Curries & Mains',
    veg: true,
    price: 240,
    halfPrice: 140,
    rating: 4.8,
    ratingCount: '990+',
    badge: 'POPULAR',
    badgeType: 'saffron',
    popular: true,
    customizable: true,
    description: 'Fresh malai cottage cheese cubes cooked in rich satin tomato and cashew butter gravy.',
    image:
      FOOD_IMAGE_MAP['paneer butter masala'] ||
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'dal-makhani',
    name: 'Dal Makhani (Overnight Dum)',
    category: 'Curries & Mains',
    menuGroup: 'Curries & Mains',
    veg: true,
    price: 220,
    halfPrice: 130,
    rating: 4.8,
    ratingCount: '860+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'Overnight slow-simmered black urad lentils finished with churned white butter and cream.',
    image:
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80',
  },

  // ==========================================
  // BREADS & NAANS
  // ==========================================
  {
    id: 'butter-naan',
    name: 'Butter Naan',
    category: 'Breads & Naans',
    menuGroup: 'Breads',
    veg: true,
    price: 50,
    rating: 4.9,
    ratingCount: '2.1K+',
    badge: null,
    popular: true,
    customizable: false,
    description: 'Fluffy leavened tandoor bread brushed generously with pure butter.',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'garlic-naan',
    name: 'Garlic Butter Naan',
    category: 'Breads & Naans',
    menuGroup: 'Breads',
    veg: true,
    price: 65,
    rating: 4.9,
    ratingCount: '1.4K+',
    badge: 'POPULAR',
    badgeType: 'saffron',
    popular: true,
    customizable: false,
    description: 'Crispy tandoori naan studded with roasted garlic cloves and fresh coriander.',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'tandoori-roti',
    name: 'Tandoori Roti (Butter)',
    category: 'Breads & Naans',
    menuGroup: 'Breads',
    veg: true,
    price: 20,
    rating: 4.8,
    ratingCount: '1.8K+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Whole wheat bread baked crisp on the clay tandoor wall with butter glaze.',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'rumali-roti',
    name: 'Rumali Roti',
    category: 'Breads & Naans',
    menuGroup: 'Breads',
    veg: true,
    price: 25,
    rating: 4.8,
    ratingCount: '940+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Paper-thin handkerchief bread tossed on an inverted hot iron griddle.',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
  },

  // ==========================================
  // MEHMAN NAWAZI (PARTY PACKS) (Matches user screenshot 3 1:1)
  // ==========================================
  {
    id: 'motter-pulao-1kg',
    name: 'Motter Pulao (1 Kg)',
    category: 'Party Packs (Mehman Nawazi)',
    menuGroup: 'Party Packs',
    veg: true,
    price: 500,
    rating: 4.8,
    ratingCount: '180+',
    badge: 'PARTY PACK',
    badgeType: 'emerald',
    popular: false,
    customizable: false,
    description: 'Mehman Nawazi Party Pack — 1 kg aromatic basmati peas pulao prepared with whole spices.',
    image:
      FOOD_IMAGE_MAP['motter pulao'] ||
      'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'meetha-zarda-1kg',
    name: 'Meetha Zarda (1 Kg)',
    category: 'Party Packs (Mehman Nawazi)',
    menuGroup: 'Party Packs',
    veg: true,
    price: 800,
    rating: 4.9,
    ratingCount: '220+',
    badge: 'ROYAL SWEET',
    badgeType: 'saffron',
    popular: true,
    customizable: false,
    description: 'Mehman Nawazi Party Pack — 1 kg royal sweet saffron rice with rich dry fruits and mawa.',
    image:
      FOOD_IMAGE_MAP['meetha zarda'] ||
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'chicken-korma-1kg',
    name: 'Chicken Korma (1 Kg)',
    category: 'Party Packs (Mehman Nawazi)',
    menuGroup: 'Party Packs',
    veg: false,
    price: 600,
    rating: 4.9,
    ratingCount: '310+',
    badge: 'PARTY PACK',
    badgeType: 'plum',
    popular: true,
    customizable: false,
    description: 'Mehman Nawazi Party Pack — 1 kg rich traditional Mughlai chicken korma feast.',
    image:
      FOOD_IMAGE_MAP['chicken korma'] ||
      'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'mutton-korma-1kg',
    name: 'Mutton Korma (1 Kg)',
    category: 'Party Packs (Mehman Nawazi)',
    menuGroup: 'Party Packs',
    veg: false,
    price: 1200,
    rating: 4.9,
    ratingCount: '280+',
    badge: 'GRAND SPECIAL',
    badgeType: 'plum',
    popular: true,
    customizable: false,
    description: 'Mehman Nawazi Party Pack — 1 kg royal slow-cooked tender mutton in Nawabi brown onion gravy.',
    image:
      FOOD_IMAGE_MAP['mutton korma'] ||
      'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'chicken-stick-kabab-1kg',
    name: 'Chicken Stick Kabab (Boneless 1 Kg)',
    category: 'Party Packs (Mehman Nawazi)',
    menuGroup: 'Party Packs',
    veg: false,
    price: 1200,
    rating: 4.9,
    ratingCount: '190+',
    badge: "CHEF'S PICK",
    badgeType: 'emerald',
    popular: false,
    customizable: false,
    description: 'Mehman Nawazi Party Pack — 1 kg skewered boneless chicken sticks with chutney.',
    image:
      FOOD_IMAGE_MAP['chicken seekh kabab'] ||
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'murg-mussallam-party',
    name: 'Murg Mussallam (Party Pack)',
    category: 'Party Packs (Mehman Nawazi)',
    menuGroup: 'Party Packs',
    veg: false,
    price: 650,
    rating: 4.9,
    ratingCount: '340+',
    badge: 'SIGNATURE',
    badgeType: 'plum',
    popular: true,
    customizable: false,
    description: 'Mehman Nawazi Special — Whole chicken prepared in royal Mughlai rich gravy with boiled eggs.',
    image:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'mutton-rane-e-arabia',
    name: 'Mutton Rane-E-Arabia (Party Pack)',
    category: 'Party Packs (Mehman Nawazi)',
    menuGroup: 'Party Packs',
    veg: false,
    price: 2500,
    rating: 5.0,
    ratingCount: '150+',
    badge: 'ROYAL FEAST',
    badgeType: 'plum',
    popular: true,
    customizable: false,
    description: 'Mehman Nawazi Grand Special — Whole slow-roasted Arabian spiced mutton leg on basmati bed.',
    image:
      FOOD_IMAGE_MAP['mutton rane-e-arabia'] ||
      'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'baby-naan-1kg',
    name: 'Baby Naan (1 Kg)',
    category: 'Party Packs (Mehman Nawazi)',
    menuGroup: 'Party Packs',
    veg: true,
    price: 450,
    rating: 4.8,
    ratingCount: '260+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Mehman Nawazi Party Pack — 1 kg freshly baked tandoori baby naans brushed with butter.',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'chicken-biryani-handi-40-45',
    name: 'Chicken Biryani Handi (40-45 Pax)',
    category: 'Party Packs (Mehman Nawazi)',
    menuGroup: 'Party Packs',
    veg: false,
    price: 7500,
    rating: 5.0,
    ratingCount: '95+',
    badge: 'MEGA HANDI',
    badgeType: 'saffron',
    popular: false,
    customizable: false,
    description: 'Shan-E-Biryani — Grand Chicken Handi serving 40 to 45 guests, sealed with wheat dough.',
    image:
      FOOD_IMAGE_MAP['chicken biryani handi'] ||
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'chicken-biryani-handi-75-80',
    name: 'Chicken Biryani Handi (75-80 Pax)',
    category: 'Party Packs (Mehman Nawazi)',
    menuGroup: 'Party Packs',
    veg: false,
    price: 14000,
    rating: 5.0,
    ratingCount: '60+',
    badge: 'MEGA HANDI',
    badgeType: 'saffron',
    popular: false,
    customizable: false,
    description: 'Shan-E-Biryani — Mega Chicken Handi serving 75 to 80 guests, slow dum cooked.',
    image:
      FOOD_IMAGE_MAP['chicken biryani handi'] ||
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'mutton-biryani-handi-40-45',
    name: 'Mutton Biryani Handi (40-45 Pax)',
    category: 'Party Packs (Mehman Nawazi)',
    menuGroup: 'Party Packs',
    veg: false,
    price: 12500,
    rating: 5.0,
    ratingCount: '85+',
    badge: 'ROYAL HANDI',
    badgeType: 'plum',
    popular: true,
    customizable: false,
    description: 'Shan-E-Biryani — Grand Mutton Handi serving 40 to 45 guests with Awadhi saffron dum.',
    image:
      FOOD_IMAGE_MAP['mutton biryani handi'] ||
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'mutton-biryani-handi-75-80',
    name: 'Mutton Biryani Handi (75-80 Pax)',
    category: 'Party Packs (Mehman Nawazi)',
    menuGroup: 'Party Packs',
    veg: false,
    price: 21500,
    rating: 5.0,
    ratingCount: '45+',
    badge: 'ROYAL HANDI',
    badgeType: 'plum',
    popular: false,
    customizable: false,
    description: 'Shan-E-Biryani — Mega Mutton Handi serving 75 to 80 guests with saffron and Awadhi spices.',
    image:
      FOOD_IMAGE_MAP['mutton biryani handi'] ||
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80',
  },
]

// --- AVAILABLE TABLES ---
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
  'Family Lounge 1',
  'Family Lounge 2',
  'VIP Cabin',
  'Takeaway / Packing',
]

// --- CATEGORIES ORDER ---
const CATEGORIES = [
  'All',
  'Soups',
  'Starters (Veg)',
  'Starters (Non-Veg)',
  'Tandoori & Kebabs',
  'Biryani & Rice',
  'Curries & Mains',
  'Breads & Naans',
  'Party Packs (Mehman Nawazi)',
]

// --- EXACT GEOMETRIC ARCHITECTURAL MANDALA WATERMARK SVG (Matches user screenshot 2 1:1) ---
const ArchitecturalMandalaSvg = ({
  className = '',
  strokeColor = '#F3C669',
  accentColor = '#E89223',
  strokeWidth = 0.9,
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
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.95">
        {/* Core Concentric Circles */}
        <circle cx="180" cy="180" r="14" strokeWidth={strokeWidth * 1.3} />
        <circle cx="180" cy="180" r="26" strokeDasharray="2 3" />
        <circle cx="180" cy="180" r="42" strokeWidth={strokeWidth * 1.1} />
        <circle cx="180" cy="180" r="62" />
        <circle cx="180" cy="180" r="84" strokeWidth={strokeWidth * 1.25} />
        <circle cx="180" cy="180" r="118" strokeDasharray="3 3" />
        <circle cx="180" cy="180" r="148" strokeWidth={strokeWidth * 1.4} />

        {/* 8-Axis Star Poly-Lattice */}
        {latticeAngles.map((deg) => (
          <g key={`lat-${deg}`} transform={`rotate(${deg} 180 180)`}>
            <line x1="180" y1="36" x2="180" y2="324" strokeOpacity="0.45" />
            <polygon
              points="180,68 188,96 172,96"
              fill={accentColor}
              fillOpacity="0.18"
              stroke={strokeColor}
              strokeWidth={strokeWidth * 0.9}
            />
          </g>
        ))}

        {/* Inner 16 Scalloped Lotus Petals */}
        {petals.map((deg) => (
          <g key={`petal-${deg}`} transform={`rotate(${deg} 180 180)`}>
            <path
              d="M 172 138 C 174 122, 186 122, 188 138"
              strokeWidth={strokeWidth * 1.1}
            />
            <circle cx="180" cy="128" r="2.2" fill={accentColor} stroke="none" />
          </g>
        ))}

        {/* 24 Pearl Beads Ring */}
        {pearls.map((deg) => (
          <circle
            key={`pearl-${deg}`}
            cx={180 + 73 * Math.cos((deg * Math.PI) / 180)}
            cy={180 + 73 * Math.sin((deg * Math.PI) / 180)}
            r="2.6"
            strokeWidth={strokeWidth * 0.8}
            fill={strokeColor}
            fillOpacity="0.25"
          />
        ))}

        {/* Intermediate Pointed Arch Petals */}
        {petals.map((deg) => (
          <g key={`arch-${deg}`} transform={`rotate(${deg} 180 180)`}>
            <path
              d="M 166 96 C 172 74, 180 62, 180 62 C 180 62, 188 74, 194 96"
              strokeWidth={strokeWidth * 1.15}
            />
            <line
              x1="180"
              y1="96"
              x2="180"
              y2="66"
              strokeWidth={strokeWidth * 0.7}
              strokeDasharray="2 2"
            />
          </g>
        ))}

        {/* Outermost Awadhi Flourish Crowns */}
        {petals.map((deg) => (
          <g key={`crown-${deg + 11.25}`} transform={`rotate(${deg + 11.25} 180 180)`}>
            <path
              d="M 154 36 C 166 14, 180 4, 180 4 C 180 4, 194 14, 206 36"
              strokeWidth={strokeWidth * 1.25}
            />
            <circle cx="180" cy="14" r="3" fill={accentColor} stroke="none" />
          </g>
        ))}
      </g>
    </svg>
  )
}

// --- GOLD FOIL RIBBON CATEGORY HEADER (Matches user screenshot 5, 6, 7 1:1) ---
const ZaikaCategoryRibbon = ({ name }: { name: string }) => (
  <div
    className="flex items-center gap-2.5 pt-4 pb-2 mb-2 select-none"
    id={`cat-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
  >
    <div
      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-r-full rounded-l-md shadow-md relative overflow-hidden border border-[#F3C669]/40"
      style={{
        background:
          'linear-gradient(90deg, #996D19 0%, #F6D47B 32%, #FBE6A2 55%, #DFB448 82%, #8C6014 100%)',
        boxShadow:
          '0 3px 14px rgba(212, 175, 55, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      }}
    >
      <span className="text-[9px] text-[#2C1A00] font-bold">◈</span>
      <h2
        className="text-[11px] sm:text-[12px] font-extrabold tracking-[0.16em] uppercase text-[#190D00] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]"
        style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
      >
        {name}
      </h2>
    </div>
    <div className="flex-1 h-[1px] bg-gradient-to-r from-[#F3C669]/60 via-[#F3C669]/20 to-transparent" />
  </div>
)

// --- VEG / NON-VEG FSSAI INDICATOR ---
const VegNonVegDot = ({
  veg,
  size = 'md',
}: {
  veg: boolean
  size?: 'sm' | 'md'
}) => {
  const box = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'
  const dot = size === 'sm' ? 'w-1.5 h-1.5' : 'w-1.5 h-1.5'
  return (
    <span
      className={`inline-flex items-center justify-center ${box} rounded-[3px] border bg-[#140A20]/90 shrink-0 ${
        veg ? 'border-[#22C55E]/90' : 'border-[#EF4444]/90'
      }`}
    >
      <span
        className={`${dot} rounded-full ${veg ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`}
      />
    </span>
  )
}

// --- MAIN ORDER MENU CONTENT ---
function OrderMenuContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = (params?.slug as string) || 'pm-zaika'
  const tableQuery = searchParams.get('table')

  // State
  const initialTable = useMemo(() => {
    if (tableQuery) {
      const clean = tableQuery.trim()
      const match = TABLES.find((t) => t.toLowerCase() === clean.toLowerCase())
      if (match) return match
    }
    return 'Table 04'
  }, [tableQuery])

  const [selectedTable, setSelectedTable] = useState<string>(initialTable)
  const [tableModalOpen, setTableModalOpen] = useState(false)
  const [stewardAlerted, setStewardAlerted] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg' | 'specials'>('all')
  const [activeCategory, setActiveCategory] = useState('All')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  // Favorites
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'mutton-handi-biryani': true,
    'chicken-lollypop': true,
  })

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) => {
      const next = !prev[id]
      showToast(next ? 'Added to your favorites ❤️' : 'Removed from favorites')
      return { ...prev, [id]: next }
    })
  }

  // Cart
  const [cart, setCart] = useState<Record<string, CartEntry>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [cookingNotes, setCookingNotes] = useState('')
  const [couponCode, setCouponCode] = useState<string | null>('ZAIKA25')
  const [liveOrder, setLiveOrder] = useState<LiveOrder | null>(null)

  // Modals
  const [serviceModalOpen, setServiceModalOpen] = useState(false)
  const [serviceRequestType, setServiceRequestType] = useState<string>('Water')
  const [serviceSending, setServiceSending] = useState(false)
  const [customDish, setCustomDish] = useState<MenuItem | null>(null)
  const [customPortion, setCustomPortion] = useState('Full')
  const [customSpice, setCustomSpice] = useState('Medium')
  const [customAddons, setCustomAddons] = useState<string[]>([])
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackRatings, setFeedbackRatings] = useState<Record<string, number>>({
    taste: 5,
    service: 5,
    ambience: 5,
    hygiene: 5,
    value: 5,
  })
  const [feedbackComment, setFeedbackComment] = useState('')

  // Quick Cart Helpers
  const addToCartDirect = (dish: MenuItem, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const key = `${dish.id}_Full`
    setCart((prev) => {
      const existing = prev[key]
      if (existing) {
        return { ...prev, [key]: { ...existing, qty: existing.qty + 1 } }
      }
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
          qty: 1,
        },
      }
    })
    showToast(`Added ${dish.name} to order`)
  }

  const updateCartQty = (key: string, delta: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCart((prev) => {
      const item = prev[key]
      if (!item) return prev
      const newQty = item.qty + delta
      if (newQty <= 0) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: { ...item, qty: newQty } }
    })
  }

  const getDishCartQty = (dishId: string) => {
    let total = 0
    Object.values(cart).forEach((entry) => {
      if (entry.dish.id === dishId) total += entry.qty
    })
    return total
  }

  // Cart Calculations
  const cartSummary = useMemo(() => {
    const entries = Object.values(cart)
    const itemCount = entries.reduce((acc, it) => acc + it.qty, 0)
    const subtotal = entries.reduce((acc, it) => acc + it.unitPrice * it.qty, 0)

    let discount = 0
    if (couponCode === 'ZAIKA25') {
      discount = Math.round(subtotal * 0.25)
    } else if (couponCode === 'TABLE10') {
      discount = Math.round(subtotal * 0.1)
    }

    const discountedSubtotal = Math.max(0, subtotal - discount)
    const gst = Math.round(discountedSubtotal * 0.05)
    const finalTotal = discountedSubtotal + gst

    return { entries, itemCount, subtotal, discount, gst, finalTotal }
  }, [cart, couponCode])

  // Filtered Menu Items
  const filteredDishes = useMemo(() => {
    return MENU_ITEMS.filter((dish) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = dish.name.toLowerCase().includes(q)
        const matchesDesc = dish.description.toLowerCase().includes(q)
        const matchesCat = dish.category.toLowerCase().includes(q)
        if (!matchesName && !matchesDesc && !matchesCat) return false
      }

      // Dietary
      if (dietFilter === 'veg' && !dish.veg) return false
      if (dietFilter === 'non-veg' && dish.veg) return false
      if (dietFilter === 'specials' && !dish.popular && !dish.badge) return false

      // Category
      if (activeCategory !== 'All' && dish.category !== activeCategory) {
        return false
      }

      return true
    })
  }, [searchQuery, dietFilter, activeCategory])

  // Grouped by Category for display
  const categorizedSections = useMemo(() => {
    const map = new Map<string, MenuItem[]>()
    filteredDishes.forEach((dish) => {
      const list = map.get(dish.category) || []
      list.push(dish)
      map.set(dish.category, list)
    })
    return Array.from(map.entries())
  }, [filteredDishes])

  // Chef Royal Signatures (For Top Carousel)
  const chefSignatures = useMemo(() => {
    return MENU_ITEMS.filter(
      (d) =>
        d.popular ||
        d.badge?.includes('SPECIAL') ||
        d.badge?.includes('SIGNATURE') ||
        d.badge?.includes('PICK')
    ).slice(0, 5)
  }, [])

  // Call Steward Submit
  const submitServiceRequest = () => {
    setServiceSending(true)
    setTimeout(() => {
      setServiceSending(false)
      setServiceModalOpen(false)
      setStewardAlerted(true)
      showToast(`Steward alerted for ${serviceRequestType} at ${selectedTable}`)
    }, 700)
  }

  // Live Order Simulator
  const handlePlaceOrder = () => {
    if (cartSummary.itemCount === 0) return
    const orderId = `PM-${Math.floor(1000 + Math.random() * 9000)}`
    setLiveOrder({
      id: orderId,
      table: selectedTable,
      total: cartSummary.finalTotal,
      itemsCount: cartSummary.itemCount,
      stage: 0,
    })
    setCart({})
    showToast(`Order ${orderId} dispatched to Kitchen!`)
  }

  // Advance simulation stage
  useEffect(() => {
    if (!liveOrder) return
    if (liveOrder.stage < 3) {
      const timer = setTimeout(() => {
        setLiveOrder((prev) => (prev ? { ...prev, stage: prev.stage + 1 } : null))
      }, 7000)
      return () => clearTimeout(timer)
    }
  }, [liveOrder])

  return (
    <div className="min-h-screen w-full bg-[#0E0617] text-[#FFF8F0] flex justify-center font-jakarta antialiased selection:bg-[#E89223]/30 selection:text-[#F3C669] relative overflow-x-hidden">
      {/* -------------------------------------------------------------
          BACKGROUND: EXACT ARCHITECTURAL MANDALA CANVAS (Image 2)
         ------------------------------------------------------------- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, #2A123D 0%, #170A24 45%, #0E0517 100%)',
          }}
        />
        {/* Prominent upper-left Architectural Mandala */}
        <div className="absolute -left-[140px] sm:-left-[180px] top-[20px] w-[620px] h-[620px] opacity-[0.14] pointer-events-none">
          <ArchitecturalMandalaSvg
            strokeColor="#F3C669"
            accentColor="#E89223"
            strokeWidth={0.85}
          />
        </div>
        {/* Subtle lower-right repeating Mandala */}
        <div className="absolute -right-[160px] top-[50%] w-[680px] h-[680px] opacity-[0.09] pointer-events-none">
          <ArchitecturalMandalaSvg
            strokeColor="#F3C669"
            accentColor="#E89223"
            strokeWidth={0.75}
          />
        </div>
      </div>

      {/* Main Viewport Container (Centered mobile frame on desktop, full bleed on mobile) */}
      <div className="w-full max-w-[440px] min-h-screen bg-[#140A20]/95 relative sm:rounded-[36px] shadow-[0_0_80px_rgba(0,0,0,0.85)] border-x sm:border sm:border-[#F3C669]/20 overflow-hidden flex flex-col z-10">
        {/* TOAST POPUP */}
        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[380px] pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2.5 rounded-2xl bg-[#26103A] text-white text-xs font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.7)] border border-[#F3C669]/50 flex items-center gap-2.5 backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4 text-[#F3C669] shrink-0" />
              <span className="truncate text-[#FFF8F0]">{toast}</span>
            </div>
          </div>
        )}

        {/* =============================================================
            TOP APP HEADER (Matches user screenshot 5, 7 1:1)
           ============================================================= */}
        <header className="px-4 pt-4 pb-3 sticky top-0 z-30 bg-[#140A20]/90 backdrop-blur-md border-b border-[#F3C669]/15">
          <div className="flex items-center justify-between gap-2">
            {/* Left: PM Crest + Title + Table Selector */}
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Crest Badge */}
              <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                <ArchitecturalMandalaSvg className="absolute inset-0 w-full h-full opacity-70" />
                <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#2D1148] to-[#140A20] border border-[#F3C669]/80 flex flex-col items-center justify-center leading-none relative z-10 shadow-[0_4px_14px_rgba(0,0,0,0.6)]">
                  <span className="text-[10px] font-extrabold text-[#F3C669]">PM</span>
                  <span className="text-[6px] tracking-widest text-[#E89223] font-bold">
                    ZAIKA
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="min-w-0">
                <h1
                  className="text-[13px] font-extrabold tracking-wider uppercase text-[#FFF8F0] leading-tight truncate"
                  style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                >
                  PM Zaika Restaurant
                </h1>
                <p
                  className="text-[11px] text-[#E89223] font-medium leading-none mt-0.5 truncate"
                  style={{ fontFamily: 'var(--font-script), cursive' }}
                >
                  Indian • Chinese • Tandoor • Rolls
                </p>

                {/* Table Selector Pill */}
                <button
                  type="button"
                  onClick={() => setTableModalOpen(true)}
                  className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#231238] border border-[#F3C669]/35 text-[#F3C669] text-[10px] font-bold hover:bg-[#32174F] transition-colors cursor-pointer shadow-sm"
                >
                  <MapPin className="w-2.5 h-2.5 text-[#E89223]" />
                  <span>{selectedTable}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-[#F3C669]/70" />
                </button>
              </div>
            </div>

            {/* Right: Phone Call + 240 PTS Royal Pass + Bell Steward */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Phone Quick Call */}
              <a
                href="tel:+917488260572"
                className="w-8 h-8 rounded-full bg-[#231238] border border-[#F3C669]/30 flex items-center justify-center text-[#F3C669] hover:bg-[#32174F] transition-colors shadow-sm"
                title="Call Restaurant Directly"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>

              {/* 240 PTS Royal Pass Badge */}
              <button
                type="button"
                onClick={() =>
                  showToast('Royal Dining Pass: 240 Pts Available! ₹50 Discount Unlocked.')
                }
                className="h-8 px-2.5 rounded-full bg-[#231238] border border-[#F3C669]/35 text-[#F3C669] text-[10px] font-extrabold flex items-center gap-1 shadow-sm hover:bg-[#32174F] cursor-pointer"
              >
                <Award className="w-3 h-3 text-[#E89223]" />
                <span className="tnum">240 PTS</span>
              </button>

              {/* Bell Steward Call */}
              <button
                type="button"
                onClick={() => setServiceModalOpen(true)}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer shadow-sm ${
                  stewardAlerted
                    ? 'bg-[#E89223] border-[#F3C669] text-[#140A20]'
                    : 'bg-[#231238] border-[#F3C669]/30 text-[#F3C669] hover:bg-[#32174F]'
                }`}
                title="Summon Table Steward"
              >
                <Bell className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Search Input Bar (Matches Image 5 & 7) */}
          <div className="mt-3 relative">
            <Search className="w-4 h-4 text-[#F3C669]/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search soup, paneer, chicken, biryani, tandoor..."
              className="w-full h-10 pl-10 pr-9 rounded-2xl bg-[#1D0E2D] border border-[#F3C669]/25 text-xs text-[#FFF8F0] placeholder-[#8E7E98] focus:outline-none focus:ring-2 focus:ring-[#F3C669]/40 focus:border-[#F3C669]/60 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E7E98] hover:text-[#FFF8F0] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Pills (Matches Image 5 & 7 1:1) */}
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setDietFilter('all')}
              className={`h-7 px-3.5 rounded-full text-[11px] font-bold cursor-pointer whitespace-nowrap transition-all shadow-sm ${
                dietFilter === 'all'
                  ? 'bg-gradient-to-r from-[#F3C669] to-[#E89223] text-[#140822] shadow-[0_2px_8px_rgba(243,198,105,0.3)] font-black'
                  : 'bg-[#1E0F30] border border-[#F3C669]/20 text-[#D2C3DD] hover:border-[#F3C669]/40'
              }`}
            >
              All Dishes
            </button>

            <button
              type="button"
              onClick={() => setDietFilter(dietFilter === 'veg' ? 'all' : 'veg')}
              className={`h-7 px-3 rounded-full text-[11px] font-bold cursor-pointer whitespace-nowrap transition-all flex items-center gap-1.5 border shadow-sm ${
                dietFilter === 'veg'
                  ? 'bg-[#163620] border-[#22C55E] text-[#22C55E] font-black'
                  : 'bg-[#1E0F30] border-[#22C55E]/40 text-[#22C55E] hover:bg-[#163620]/50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              <span>Pure Veg</span>
            </button>

            <button
              type="button"
              onClick={() => setDietFilter(dietFilter === 'non-veg' ? 'all' : 'non-veg')}
              className={`h-7 px-3 rounded-full text-[11px] font-bold cursor-pointer whitespace-nowrap transition-all flex items-center gap-1.5 border shadow-sm ${
                dietFilter === 'non-veg'
                  ? 'bg-[#3A141A] border-[#EF4444] text-[#EF4444] font-black'
                  : 'bg-[#1E0F30] border-[#EF4444]/40 text-[#EF4444] hover:bg-[#3A141A]/50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              <span>Non-Veg</span>
            </button>

            <button
              type="button"
              onClick={() => setDietFilter(dietFilter === 'specials' ? 'all' : 'specials')}
              className={`h-7 px-3 rounded-full text-[11px] font-bold cursor-pointer whitespace-nowrap transition-all flex items-center gap-1.5 border shadow-sm ${
                dietFilter === 'specials'
                  ? 'bg-[#352010] border-[#F3C669] text-[#F3C669] font-black'
                  : 'bg-[#1E0F30] border-[#F3C669]/30 text-[#F3C669] hover:bg-[#352010]/50'
              }`}
            >
              <Star className="w-2.5 h-2.5 fill-[#F3C669] text-[#F3C669]" />
              <span>Specials</span>
            </button>
          </div>
        </header>

        {/* =============================================================
            MAIN SCROLLABLE CONTENT
           ============================================================= */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-3.5 pt-3 pb-32 space-y-4">
          {/* -----------------------------------------------------------
              CHEF'S ROYAL SIGNATURES CAROUSEL (Image 7)
             ----------------------------------------------------------- */}
          {!searchQuery && dietFilter === 'all' && activeCategory === 'All' && (
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#E89223]/20 border border-[#F3C669]/50 flex items-center justify-center text-[#F3C669]">
                    <Sparkles className="w-3 h-3 text-[#F3C669]" />
                  </div>
                  <div>
                    <h3
                      className="text-[12px] font-extrabold tracking-wider uppercase text-[#FFF8F0]"
                      style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                    >
                      Chef&apos;s Royal Signatures
                    </h3>
                    <p className="text-[10px] text-[#A89CB2]">
                      Handcrafted Awadhi & Tandoori masterpieces
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#E89223]/20 border border-[#F3C669]/40 text-[#F3C669] text-[9px] font-black tracking-wider uppercase">
                  MUST TRY
                </span>
              </div>

              {/* Horizontal Scroll Cards */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 pt-0.5">
                {chefSignatures.map((dish) => {
                  const inCartQty = getDishCartQty(dish.id)
                  return (
                    <div
                      key={dish.id}
                      className="w-[200px] sm:w-[210px] shrink-0 rounded-2xl bg-[#1A0C28] border border-[#F3C669]/25 overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.5)] flex flex-col justify-between"
                    >
                      {/* Top Image + Badges */}
                      <div className="relative h-28 w-full overflow-hidden bg-[#241038]">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0C28] via-transparent to-transparent" />

                        {/* Badge Tag */}
                        {dish.badge && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#140A20]/90 backdrop-blur-sm border border-[#F3C669]/50 text-[9px] font-black text-[#F3C669] tracking-wider uppercase shadow-sm">
                            {dish.badge}
                          </div>
                        )}

                        {/* Veg / Non-Veg Indicator */}
                        <div className="absolute top-2 right-2">
                          <VegNonVegDot veg={dish.veg} size="sm" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-2.5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-[#FFF8F0] line-clamp-1">
                            {dish.name}
                          </h4>
                          <p className="text-[10px] text-[#A89CB2] line-clamp-2 mt-1 leading-snug">
                            {dish.description}
                          </p>
                        </div>

                        {/* Price & Add */}
                        <div className="mt-2.5 pt-2 border-t border-[#F3C669]/15 flex items-center justify-between">
                          <div className="leading-tight">
                            <span className="text-[13px] font-extrabold text-[#F3C669] tnum">
                              ₹{dish.price}
                            </span>
                            {dish.halfPrice && (
                              <span className="text-[9px] text-[#8E7E98] block">
                                Half: ₹{dish.halfPrice}
                              </span>
                            )}
                          </div>

                          {/* Stepper or Add button */}
                          {inCartQty > 0 ? (
                            <div className="h-7 px-2 rounded-full bg-[#2A123D] border border-[#F3C669]/60 flex items-center gap-2 shadow-sm">
                              <button
                                type="button"
                                onClick={(e) => updateCartQty(`${dish.id}_Full`, -1, e)}
                                className="text-[#F3C669] hover:text-white cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-extrabold text-[#FFF8F0] tnum">
                                {inCartQty}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => addToCartDirect(dish, e)}
                                className="text-[#F3C669] hover:text-white cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => addToCartDirect(dish, e)}
                              className="h-7 px-3 rounded-full bg-gradient-to-r from-[#F3C669] to-[#E89223] text-[#140822] text-[10px] font-black cursor-pointer shadow-md hover:brightness-110 flex items-center gap-1 active:scale-95 transition-all"
                            >
                              <Plus className="w-3 h-3 stroke-[3]" />
                              <span>ADD</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* -----------------------------------------------------------
              CATEGORIZED MENU LISTING (Images 5, 6, 7 & 3)
             ----------------------------------------------------------- */}
          {categorizedSections.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#231238] border border-[#F3C669]/30 flex items-center justify-center mx-auto text-[#F3C669]">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-[#FFF8F0]">No dishes match your search.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setDietFilter('all')
                  setActiveCategory('All')
                }}
                className="text-xs text-[#F3C669] underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            categorizedSections.map(([categoryName, dishes]) => (
              <section key={categoryName} className="space-y-2">
                {/* Gold Category Ribbon + Hairline Divider (Images 5 & 6) */}
                <ZaikaCategoryRibbon name={categoryName} />

                {/* Dish Rows in Category */}
                <div className="space-y-2.5">
                  {dishes.map((dish) => {
                    const inCartQty = getDishCartQty(dish.id)
                    const isFav = !!favorites[dish.id]

                    return (
                      <div
                        key={dish.id}
                        className="p-3 rounded-2xl bg-[#180C26]/90 backdrop-blur-sm border border-[#F3C669]/20 hover:border-[#F3C669]/40 transition-all flex items-center justify-between gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)] relative group"
                      >
                        {/* Left Column: Details */}
                        <div className="flex-1 min-w-0 pr-1">
                          {/* Top Row: Veg Indicator + Name */}
                          <div className="flex items-center gap-2">
                            <VegNonVegDot veg={dish.veg} size="sm" />
                            <h4 className="text-[13px] font-bold text-[#FFF8F0] tracking-tight leading-snug truncate">
                              {dish.name}
                            </h4>
                          </div>

                          {/* Description */}
                          <p className="text-[11px] text-[#A89CB2] line-clamp-2 mt-1 leading-relaxed">
                            {dish.description}
                          </p>

                          {/* Price + Add Action Row */}
                          <div className="mt-2.5 flex items-center gap-3">
                            <div>
                              <span className="text-[14px] font-extrabold text-[#F3C669] tnum">
                                ₹{dish.price}
                              </span>
                              {dish.halfPrice && (
                                <span className="text-[10px] text-[#8E7E98] ml-1.5">
                                  Half: ₹{dish.halfPrice}
                                </span>
                              )}
                            </div>

                            {/* Stepper or Add button */}
                            {inCartQty > 0 ? (
                              <div className="h-7 px-2.5 rounded-full bg-[#2A123D] border border-[#F3C669]/60 flex items-center gap-2 shadow-sm">
                                <button
                                  type="button"
                                  onClick={(e) => updateCartQty(`${dish.id}_Full`, -1, e)}
                                  className="text-[#F3C669] hover:text-white cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-extrabold text-[#FFF8F0] tnum">
                                  {inCartQty}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => addToCartDirect(dish, e)}
                                  className="text-[#F3C669] hover:text-white cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => addToCartDirect(dish, e)}
                                className="h-7 px-3.5 rounded-full bg-[#241038] hover:bg-gradient-to-r hover:from-[#F3C669] hover:to-[#E89223] border border-[#F3C669]/50 text-[#F3C669] hover:text-[#140822] text-[10px] font-black cursor-pointer shadow-sm flex items-center gap-1 active:scale-95 transition-all"
                              >
                                <Plus className="w-3 h-3 stroke-[3]" />
                                <span>ADD</span>
                              </button>
                            )}

                            {/* Customization link */}
                            {dish.customizable && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomDish(dish)
                                  setCustomPortion('Full')
                                  setCustomSpice('Medium')
                                  setCustomAddons([])
                                }}
                                className="text-[10px] text-[#A89CB2] hover:text-[#F3C669] underline cursor-pointer"
                              >
                                Customize
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Right Column: Dish Photo */}
                        <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden shrink-0 border border-[#F3C669]/25 shadow-md bg-[#241038]">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />

                          {/* Heart favorite button */}
                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(dish.id, e)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-[#140A20]/80 backdrop-blur-sm border border-[#F3C669]/30 flex items-center justify-center text-[#F3C669] hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Heart
                              className={`w-3 h-3 ${
                                isFav ? 'fill-[#EF4444] text-[#EF4444]' : 'text-[#FFF8F0]'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))
          )}

          {/* Quick Info & Feedback CTA footer */}
          <div className="pt-6 pb-2 text-center space-y-2 border-t border-[#F3C669]/15">
            <p
              className="text-xs text-[#E89223] font-medium"
              style={{ fontFamily: 'var(--font-script), cursive' }}
            >
              PM Zaika • Royal Dining in Awadhi & Mughlai Tradition
            </p>
            <p className="text-[10px] text-[#8E7E98]">
              Phulwari Sharif, Patna • +91 74882 60572 / 77639 49496
            </p>
            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="h-8 px-4 rounded-full bg-[#231238] border border-[#F3C669]/35 text-[#F3C669] text-[10px] font-bold cursor-pointer hover:bg-[#32174F] shadow-sm inline-flex items-center gap-1.5"
            >
              <Star className="w-3 h-3 fill-[#F3C669]" />
              <span>Share Guest Feedback</span>
            </button>
          </div>
        </main>

        {/* =============================================================
            FLOATING CATEGORY JUMP FAB (Bottom-Right Yellow Button from Image 5 & 7)
           ============================================================= */}
        <button
          type="button"
          onClick={() => setCategoryModalOpen(true)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-auto sm:left-[calc(50%+160px)] z-40 w-12 h-12 rounded-full bg-gradient-to-br from-[#F6D47B] via-[#E89223] to-[#B37214] text-[#140822] shadow-[0_6px_22px_rgba(232,146,35,0.45)] border border-[#FFF8F0]/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          title="Jump to Category"
        >
          <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* =============================================================
            FLOATING CART BAR (Slides Up when Items in Cart)
           ============================================================= */}
        {cartSummary.itemCount > 0 && (
          <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[420px] animate-in slide-in-from-bottom-3 duration-250">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#2B1147] via-[#1D0C30] to-[#2B1147] border border-[#F3C669]/50 shadow-[0_12px_36px_rgba(0,0,0,0.85)] flex items-center justify-between gap-3 backdrop-blur-md">
              <div className="leading-tight">
                <span className="text-[10px] uppercase tracking-wider text-[#A89CB2] font-bold block">
                  {selectedTable} • {cartSummary.itemCount}{' '}
                  {cartSummary.itemCount === 1 ? 'item' : 'items'}
                </span>
                <span className="text-[16px] font-extrabold text-[#F3C669] tnum">
                  ₹{cartSummary.finalTotal}
                </span>
                {cartSummary.discount > 0 && (
                  <span className="text-[10px] text-[#22C55E] ml-1.5 font-bold">
                    (₹{cartSummary.discount} Saved)
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="h-10 px-5 rounded-full bg-gradient-to-r from-[#E89223] via-[#F3C669] to-[#D48016] text-[#140A20] text-xs font-black shadow-[0_4px_16px_rgba(243,198,105,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Order</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* =============================================================
            MODAL 1: CATEGORY JUMP SHEET
           ============================================================= */}
        {categoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-[420px] bg-[#1A0C28] border-t sm:border border-[#F3C669]/30 rounded-t-[32px] sm:rounded-[28px] p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F3C669]/20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#E89223]/20 border border-[#F3C669]/50 flex items-center justify-center text-[#F3C669]">
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                  </div>
                  <h3
                    className="text-[14px] font-extrabold uppercase text-[#FFF8F0]"
                    style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                  >
                    Menu Categories
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-[#241038] border border-[#F3C669]/30 flex items-center justify-center text-[#A89CB2] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
                {CATEGORIES.map((cat) => {
                  const count =
                    cat === 'All'
                      ? MENU_ITEMS.length
                      : MENU_ITEMS.filter((d) => d.category === cat).length
                  const isActive = activeCategory === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat)
                        setCategoryModalOpen(false)
                        if (cat !== 'All') {
                          const el = document.getElementById(
                            `cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
                          )
                          el?.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-[#E89223]/25 to-[#F3C669]/15 border-[#F3C669] text-[#F3C669] font-bold'
                          : 'bg-[#231238] border-[#F3C669]/15 text-[#FFF8F0] hover:border-[#F3C669]/40'
                      }`}
                    >
                      <span className="text-xs font-semibold">{cat}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#F3C669] tnum font-bold">
                        {count} items
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* =============================================================
            MODAL 2: TABLE SELECTOR MODAL
           ============================================================= */}
        {tableModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-[420px] bg-[#1A0C28] border-t sm:border border-[#F3C669]/30 rounded-t-[32px] sm:rounded-[28px] p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F3C669]/20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#E89223]/20 border border-[#F3C669]/50 flex items-center justify-center text-[#F3C669]">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3
                      className="text-[14px] font-extrabold uppercase text-[#FFF8F0]"
                      style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                    >
                      Select Your Table
                    </h3>
                    <p className="text-[10px] text-[#A89CB2]">Phulwari Sharif Dine-In & Takeaway</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTableModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-[#241038] border border-[#F3C669]/30 flex items-center justify-center text-[#A89CB2] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Table Buttons Grid */}
              <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto no-scrollbar">
                {TABLES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setSelectedTable(t)
                      setTableModalOpen(false)
                      showToast(`Switched to ${t}`)
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                      selectedTable === t
                        ? 'bg-gradient-to-r from-[#E89223] to-[#F3C669] text-[#140822] border-[#F3C669] shadow-md font-black'
                        : 'bg-[#231238] border-[#F3C669]/20 text-[#FFF8F0] hover:border-[#F3C669]/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =============================================================
            MODAL 3: DISH CUSTOMIZATION MODAL
           ============================================================= */}
        {customDish && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-[420px] bg-[#1A0C28] border-t sm:border border-[#F3C669]/30 rounded-t-[32px] sm:rounded-[28px] p-5 shadow-2xl space-y-4">
              <div className="flex items-start justify-between pb-2 border-b border-[#F3C669]/20">
                <div className="flex items-start gap-2.5">
                  <VegNonVegDot veg={customDish.veg} size="md" />
                  <div>
                    <h3
                      className="text-[14px] font-extrabold text-[#FFF8F0]"
                      style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                    >
                      {customDish.name}
                    </h3>
                    <p className="text-[10px] text-[#A89CB2]">{customDish.category}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomDish(null)}
                  className="w-7 h-7 rounded-full bg-[#241038] border border-[#F3C669]/30 flex items-center justify-center text-[#A89CB2] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Portion Selector */}
              {customDish.halfPrice && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#F3C669] uppercase tracking-wider block">
                    Choose Portion Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomPortion('Full')}
                      className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-between ${
                        customPortion === 'Full'
                          ? 'bg-[#2E1446] border-[#F3C669] text-[#F3C669]'
                          : 'bg-[#231238] border-[#F3C669]/20 text-[#A89CB2]'
                      }`}
                    >
                      <span>Full Plate</span>
                      <span className="tnum font-extrabold">₹{customDish.price}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomPortion('Half')}
                      className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-between ${
                        customPortion === 'Half'
                          ? 'bg-[#2E1446] border-[#F3C669] text-[#F3C669]'
                          : 'bg-[#231238] border-[#F3C669]/20 text-[#A89CB2]'
                      }`}
                    >
                      <span>Half Portion</span>
                      <span className="tnum font-extrabold">₹{customDish.halfPrice}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Spice Level */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#F3C669] uppercase tracking-wider block">
                  Spice Profile
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Mild Awadhi', 'Medium Zaika', 'Royal Spicy'].map((spice) => (
                    <button
                      key={spice}
                      type="button"
                      onClick={() => setCustomSpice(spice)}
                      className={`p-2.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all text-center ${
                        customSpice === spice
                          ? 'bg-[#2E1446] border-[#F3C669] text-[#F3C669]'
                          : 'bg-[#231238] border-[#F3C669]/20 text-[#A89CB2]'
                      }`}
                    >
                      {spice}
                    </button>
                  ))}
                </div>
              </div>

              {/* Addons */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#F3C669] uppercase tracking-wider block">
                  Royal Accompaniments
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Extra Pudina Chutney', price: 20 },
                    { name: 'Royal Shahi Raita', price: 40 },
                    { name: 'Awadhi Salan Gravy', price: 50 },
                    { name: 'Fresh Butter Cube', price: 15 },
                  ].map((addon) => {
                    const isSelected = customAddons.includes(addon.name)
                    return (
                      <button
                        key={addon.name}
                        type="button"
                        onClick={() => {
                          setCustomAddons((prev) =>
                            isSelected
                              ? prev.filter((a) => a !== addon.name)
                              : [...prev, addon.name]
                          )
                        }}
                        className={`p-2.5 rounded-xl border text-[11px] font-semibold cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#2E1446] border-[#F3C669] text-[#F3C669]'
                            : 'bg-[#231238] border-[#F3C669]/20 text-[#A89CB2]'
                        }`}
                      >
                        <span className="truncate pr-1">{addon.name}</span>
                        <span className="tnum font-bold text-[10px] shrink-0">+₹{addon.price}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Confirm Button */}
              <button
                type="button"
                onClick={() => {
                  const unitPrice =
                    customPortion === 'Half' && customDish.halfPrice
                      ? customDish.halfPrice
                      : customDish.price
                  const key = `${customDish.id}_${customPortion}_${customSpice}`
                  setCart((prev) => {
                    const existing = prev[key]
                    if (existing) {
                      return { ...prev, [key]: { ...existing, qty: existing.qty + 1 } }
                    }
                    return {
                      ...prev,
                      [key]: {
                        key,
                        dish: customDish,
                        portion: customPortion,
                        spice: customSpice,
                        addons: customAddons,
                        notes: '',
                        unitPrice,
                        qty: 1,
                      },
                    }
                  })
                  setCustomDish(null)
                  showToast(`Added custom ${customDish.name} (${customPortion})`)
                }}
                className="w-full h-11 rounded-full bg-gradient-to-r from-[#E89223] via-[#F3C669] to-[#D48016] text-[#140A20] text-xs font-black shadow-lg cursor-pointer hover:brightness-110"
              >
                Add Customized Dish to Order
              </button>
            </div>
          </div>
        )}

        {/* =============================================================
            MODAL 4: CALL STEWARD / SERVICE MODAL
           ============================================================= */}
        {serviceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-[420px] bg-[#1A0C28] border-t sm:border border-[#F3C669]/30 rounded-t-[32px] sm:rounded-[28px] p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F3C669]/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E89223]/20 border border-[#F3C669]/50 flex items-center justify-center text-[#F3C669]">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3
                      className="text-[14px] font-extrabold uppercase text-[#FFF8F0]"
                      style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                    >
                      Call Table Steward
                    </h3>
                    <p className="text-[10px] text-[#A89CB2]">Direct request for {selectedTable}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-[#241038] border border-[#F3C669]/30 flex items-center justify-center text-[#A89CB2] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Service Quick Options */}
              <div className="space-y-2">
                {[
                  { label: '💧 Extra Water (Normal / Cold)', val: 'Water' },
                  { label: '🍴 Extra Plates & Cutlery', val: 'Cutlery' },
                  { label: '🧼 Clean Table / Tissues', val: 'Clean Table' },
                  { label: '🧾 Bring Printed Bill', val: 'Bill' },
                  { label: '👨‍🍳 Speak with Captain / Chef', val: 'Captain' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setServiceRequestType(opt.val)}
                    className={`w-full p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      serviceRequestType === opt.val
                        ? 'bg-[#2E1446] border-[#F3C669] text-[#F3C669]'
                        : 'bg-[#231238] border-[#F3C669]/20 text-[#FFF8F0] hover:border-[#F3C669]/40'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {serviceRequestType === opt.val && <Check className="w-4 h-4 text-[#F3C669]" />}
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <a
                  href="tel:+917488260572"
                  className="h-11 rounded-full bg-[#241038] border border-[#F3C669]/35 text-[#FFF8F0] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#32174F]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F3C669]" />
                  <span>Call Captain</span>
                </a>
                <button
                  type="button"
                  disabled={serviceSending}
                  onClick={submitServiceRequest}
                  className="h-11 rounded-full bg-gradient-to-r from-[#E89223] via-[#F3C669] to-[#D48016] text-[#140A20] text-xs font-black shadow-lg cursor-pointer hover:brightness-110 disabled:opacity-50"
                >
                  {serviceSending ? 'Alerting...' : 'Send Request'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================
            MODAL 5: CART & ORDER DRAWER
           ============================================================= */}
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-[430px] bg-[#1A0C28] border-t sm:border border-[#F3C669]/35 rounded-t-[32px] sm:rounded-[28px] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-[#F3C669]/20 flex items-center justify-between">
                <div>
                  <h3
                    className="text-[14px] font-extrabold uppercase text-[#FFF8F0]"
                    style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                  >
                    Your Table Order
                  </h3>
                  <p className="text-[10px] text-[#F3C669] font-bold">
                    {selectedTable} • {cartSummary.itemCount} Items
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="w-7 h-7 rounded-full bg-[#241038] border border-[#F3C669]/30 flex items-center justify-center text-[#A89CB2] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
                {cartSummary.entries.map((entry) => (
                  <div
                    key={entry.key}
                    className="p-3 rounded-2xl bg-[#231238] border border-[#F3C669]/20 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <VegNonVegDot veg={entry.dish.veg} size="sm" />
                        <h4 className="text-xs font-bold text-[#FFF8F0] truncate">
                          {entry.dish.name}
                        </h4>
                      </div>
                      <p className="text-[10px] text-[#A89CB2] mt-0.5">
                        {entry.portion} {entry.spice ? `• ${entry.spice}` : ''}
                      </p>
                      <span className="text-xs font-extrabold text-[#F3C669] tnum block mt-1">
                        ₹{entry.unitPrice * entry.qty}
                      </span>
                    </div>

                    {/* Stepper */}
                    <div className="h-7 px-2.5 rounded-full bg-[#180C26] border border-[#F3C669]/50 flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateCartQty(entry.key, -1)}
                        className="text-[#F3C669] hover:text-white cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-extrabold text-[#FFF8F0] tnum">
                        {entry.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(entry.key, 1)}
                        className="text-[#F3C669] hover:text-white cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Cooking Instructions Note */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#A89CB2] uppercase tracking-wider block">
                    Special Cooking Instructions
                  </label>
                  <input
                    type="text"
                    value={cookingNotes}
                    onChange={(e) => setCookingNotes(e.target.value)}
                    placeholder="e.g. Less oil, extra spicy, serve starters first..."
                    className="w-full h-9 px-3 rounded-xl bg-[#231238] border border-[#F3C669]/25 text-xs text-[#FFF8F0] placeholder-[#8E7E98] focus:outline-none focus:ring-1 focus:ring-[#F3C669]"
                  />
                </div>

                {/* Promo Coupon Card */}
                <div className="p-3 rounded-xl bg-[#231238] border border-[#F3C669]/25 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Tag className="w-4 h-4 text-[#F3C669] shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-[#FFF8F0] block">
                        {couponCode ? `Code: ${couponCode}` : 'Have a coupon?'}
                      </span>
                      <span className="text-[10px] text-[#22C55E]">
                        {couponCode === 'ZAIKA25'
                          ? '25% Royal Discount Applied!'
                          : 'Use ZAIKA25 for 25% Off'}
                      </span>
                    </div>
                  </div>
                  {couponCode ? (
                    <button
                      type="button"
                      onClick={() => setCouponCode(null)}
                      className="text-[10px] text-[#EF4444] font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCouponCode('ZAIKA25')}
                      className="text-[10px] text-[#F3C669] font-bold cursor-pointer underline"
                    >
                      Apply ZAIKA25
                    </button>
                  )}
                </div>

                {/* Bill Breakdown */}
                <div className="p-3.5 rounded-2xl bg-[#140A20] border border-[#F3C669]/20 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#A89CB2]">
                    <span>Item Total</span>
                    <span className="tnum">₹{cartSummary.subtotal}</span>
                  </div>
                  {cartSummary.discount > 0 && (
                    <div className="flex justify-between text-[#22C55E]">
                      <span>Royal Privilege Discount (25%)</span>
                      <span className="tnum">-₹{cartSummary.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#A89CB2]">
                    <span>GST & Service Charge (5%)</span>
                    <span className="tnum">₹{cartSummary.gst}</span>
                  </div>
                  <div className="pt-2 border-t border-[#F3C669]/20 flex justify-between font-extrabold text-[#F3C669] text-sm">
                    <span>Grand Total</span>
                    <span className="tnum">₹{cartSummary.finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-4 border-t border-[#F3C669]/20 bg-[#1A0C28]">
                <button
                  type="button"
                  onClick={() => {
                    setCartOpen(false)
                    handlePlaceOrder()
                  }}
                  className="w-full h-12 rounded-full bg-gradient-to-r from-[#E89223] via-[#F3C669] to-[#D48016] text-[#140A20] text-sm font-black shadow-[0_6px_22px_rgba(243,198,105,0.4)] cursor-pointer hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <ChefHat className="w-4 h-4 stroke-[2.5]" />
                  <span>Send Order to Kitchen • ₹{cartSummary.finalTotal}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================
            MODAL 6: LIVE KITCHEN STATUS TRACKER
           ============================================================= */}
        {liveOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-[390px] bg-[#1A0C28] border border-[#F3C669]/40 rounded-[28px] p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
              {/* Rotating Mandala Halo */}
              <div className="w-16 h-16 mx-auto relative flex items-center justify-center">
                <ArchitecturalMandalaSvg
                  className="w-full h-full text-[#F3C669] animate-spin"
                  strokeWidth={1}
                />
                <div className="w-9 h-9 rounded-full bg-[#E89223] text-[#140822] flex items-center justify-center font-black relative z-10">
                  <Flame className="w-5 h-5 fill-[#140822]" />
                </div>
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E89223]/20 border border-[#F3C669]/40 text-[#F3C669] text-[10px] font-bold">
                  Order {liveOrder.id} • {liveOrder.table}
                </span>
                <h3
                  className="text-lg font-extrabold text-[#FFF8F0] mt-2"
                  style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                >
                  Cooking In Awadhi Kitchen
                </h3>
                <p className="text-xs text-[#A89CB2] mt-0.5">
                  Our Bawarchis are slow-steaming your feast.
                </p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-2.5 text-left py-2 border-y border-[#F3C669]/15">
                {[
                  {
                    step: 0,
                    title: 'Order Accepted by Captain',
                    desc: 'Tickets printed at Tandoor & Biryani handi',
                  },
                  {
                    step: 1,
                    title: 'Simmering & Tandoori Charcoal Dum',
                    desc: 'Freshly roasted and spiced',
                  },
                  {
                    step: 2,
                    title: 'Garnish & Royal Plating',
                    desc: 'Finished with saffron, silver vark & pudina',
                  },
                  {
                    step: 3,
                    title: 'Served Hot to Table',
                    desc: 'Enjoy your royal PM Zaika experience!',
                  },
                ].map((st) => {
                  const isDone = liveOrder.stage >= st.step
                  return (
                    <div key={st.step} className="flex items-start gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                          isDone
                            ? 'bg-[#F3C669] text-[#140822]'
                            : 'bg-[#231238] text-[#8E7E98] border border-[#8E7E98]/30'
                        }`}
                      >
                        {isDone ? '✓' : st.step + 1}
                      </div>
                      <div>
                        <p
                          className={`text-xs font-bold ${isDone ? 'text-[#FFF8F0]' : 'text-[#8E7E98]'}`}
                        >
                          {st.title}
                        </p>
                        <p className="text-[10px] text-[#A89CB2]">{st.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(true)}
                  className="h-10 rounded-full bg-[#241038] border border-[#F3C669]/30 text-[#F3C669] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Call Steward</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLiveOrder(null)}
                  className="h-10 rounded-full bg-gradient-to-r from-[#E89223] to-[#F3C669] text-[#140822] text-xs font-black cursor-pointer shadow-md"
                >
                  Order More
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================
            MODAL 7: GUEST FEEDBACK SHEET (Matches user screenshot 4 1:1)
           ============================================================= */}
        {feedbackOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-[420px] bg-[#1A0C28] border-t sm:border border-[#F3C669]/35 rounded-t-[32px] sm:rounded-[28px] max-h-[88vh] overflow-y-auto no-scrollbar p-5 shadow-2xl space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#F3C669]/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E89223]/20 border border-[#F3C669]/50 flex items-center justify-center text-[#F3C669]">
                    <Star className="w-4 h-4 fill-[#F3C669]" />
                  </div>
                  <div>
                    <h3
                      className="text-[14px] font-extrabold uppercase text-[#FFF8F0]"
                      style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                    >
                      Guest Feedback & Review
                    </h3>
                    <p className="text-[10px] text-[#A89CB2]">Phulwari Sharif, Patna</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFeedbackOpen(false)}
                  className="w-7 h-7 rounded-full bg-[#241038] border border-[#F3C669]/30 flex items-center justify-center text-[#A89CB2] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Restaurant Contact Banner (Image 4) */}
              <div className="p-3.5 rounded-2xl bg-[#231238] border border-[#F3C669]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#E89223]">
                    Restaurant Contact & Orders
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 font-bold">
                    Main Helpline
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E89223] text-[#140822] flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-[#FFF8F0] block tnum">
                        +91 77639 49496
                      </span>
                      <span className="text-[10px] text-[#A89CB2]">
                        Tap to call restaurant directly
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText('+917763949496')
                      showToast('Copied phone number!')
                    }}
                    className="h-7 px-2.5 rounded-lg bg-[#180C26] border border-[#F3C669]/30 text-[10px] text-[#F3C669] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Address Card (Image 4) */}
              <div className="p-3 rounded-xl bg-[#231238]/60 border border-[#F3C669]/15 text-xs text-[#A89CB2] flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F3C669] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Phulwari Rd, Near Shaheed Bhagat Singh Chowk, Birla Colony, Phulwari Sharif, Patna,
                  Bihar 801505
                </p>
              </div>

              {/* 5 Quick Questions */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-[#F3C669]">
                  Takes ~30 sec • 5 Quick Questions • Optional
                </p>

                {[
                  { key: 'taste', label: '1. Food Quality & Authenticity' },
                  { key: 'service', label: '2. Promptness & Table Service' },
                  { key: 'ambience', label: '3. Dining Ambience & Comfort' },
                  { key: 'hygiene', label: '4. Cleanliness & Hygiene' },
                  { key: 'value', label: '5. Overall Royal Value' },
                ].map((q) => (
                  <div key={q.key} className="flex items-center justify-between py-1">
                    <span className="text-xs text-[#FFF8F0] font-medium">{q.label}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRatings((prev) => ({ ...prev, [q.key]: star }))}
                          className="cursor-pointer hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= feedbackRatings[q.key]
                                ? 'fill-[#F3C669] text-[#F3C669]'
                                : 'text-[#8E7E98]/40'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Comment Textarea */}
                <textarea
                  rows={2}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Any special shoutout to our chef or suggestions for your next visit?..."
                  className="w-full p-3 rounded-xl bg-[#231238] border border-[#F3C669]/25 text-xs text-[#FFF8F0] placeholder-[#8E7E98] focus:outline-none focus:ring-1 focus:ring-[#F3C669]"
                />

                {/* Submit Feedback */}
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackOpen(false)
                    showToast('Thank you for dining with PM Zaika! 50 Bonus Points Added.')
                  }}
                  className="w-full h-11 rounded-full bg-gradient-to-r from-[#E89223] via-[#F3C669] to-[#D48016] text-[#140A20] text-xs font-black shadow-lg cursor-pointer hover:brightness-110"
                >
                  Submit Review & Claim Points
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Wrap with Suspense boundary to avoid Next.js useSearchParams bailout
export default function OrderMenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#0E0617] flex items-center justify-center text-[#F3C669]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-[#F3C669] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold tracking-widest uppercase">Loading PM Zaika...</p>
          </div>
        </div>
      }
    >
      <OrderMenuContent />
    </Suspense>
  )
}
