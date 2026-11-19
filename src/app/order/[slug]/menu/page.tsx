'use client'

import React, { useState, useMemo, useEffect } from 'react'
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
import { FOOD_IMAGE_MAP, getFoodImage } from '@/lib/ordering/foodImages'

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

// --- FALLBACK FOOD IMAGE ---
const FALLBACK_FOOD_IMG =
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80'

// --- COMPREHENSIVE PM ZAIKA AUTHENTIC MENU DATA (Matches Physical Menu & Images) ---
const MENU_ITEMS: MenuItem[] = [
  // ==========================================
  // SOUPS
  // ==========================================
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
    image: FOOD_IMAGE_MAP['veg sweet corn'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'sweet-corn-non-veg',
    name: 'Sweet Corn (Non Veg)',
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
    image: FOOD_IMAGE_MAP['sweet corn (non veg)'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'hot-n-sour-veg',
    name: 'Hot N Sour (Veg)',
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
    image: FOOD_IMAGE_MAP['hot n sour (veg)'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'hot-n-sour-non-veg',
    name: 'Hot N Sour (Non Veg)',
    category: 'Soups',
    menuGroup: 'Soups',
    veg: false,
    price: 140,
    rating: 4.8,
    ratingCount: '410+',
    badge: 'POPULAR',
    badgeType: 'saffron',
    popular: true,
    customizable: false,
    description: 'Classic peppery Indo-Chinese soup with poached chicken, wild mushrooms, and egg drop.',
    image: FOOD_IMAGE_MAP['hot n sour (non veg)'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'veg-manchow',
    name: 'Veg Manchow Soup',
    category: 'Soups',
    menuGroup: 'Soups',
    veg: true,
    price: 110,
    rating: 4.7,
    ratingCount: '340+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Garlicky dark broth loaded with minced ginger, scallions, cilantro, and topped with fried noodles.',
    image: FOOD_IMAGE_MAP['veg manchow'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'chicken-manchow',
    name: 'Chicken Manchow Soup',
    category: 'Soups',
    menuGroup: 'Soups',
    veg: false,
    price: 140,
    rating: 4.8,
    ratingCount: '490+',
    badge: 'BESTSELLER',
    badgeType: 'plum',
    popular: true,
    customizable: false,
    description: 'Hearty ginger-garlic chicken soup served piping hot with crunchy fried wonton crisps.',
    image: FOOD_IMAGE_MAP['chicken manchow soup'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'mushroom-soup',
    name: 'Mushroom Soup',
    category: 'Soups',
    menuGroup: 'Soups',
    veg: true,
    price: 110,
    rating: 4.5,
    ratingCount: '210+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Earthy button mushrooms braised with cracked peppercorns and fresh garden herbs.',
    image: FOOD_IMAGE_MAP['mushroom soup'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'chicken-mushroom-soup',
    name: 'Chicken Mushroom Soup',
    category: 'Soups',
    menuGroup: 'Soups',
    veg: false,
    price: 160,
    rating: 4.7,
    ratingCount: '260+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Rich poultry reduction with tender diced chicken breast and sautéed button mushrooms.',
    image: FOOD_IMAGE_MAP['chicken mushroom soup'] || FALLBACK_FOOD_IMG,
  },

  // ==========================================
  // STARTERS VEG
  // ==========================================
  {
    id: 'mix-veg-manchurian-dry',
    name: 'Mix Veg. Manchurian Dry',
    category: 'Starters Veg',
    menuGroup: 'Starters',
    veg: true,
    price: 250,
    rating: 4.7,
    ratingCount: '380+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'Crisp vegetable dumplings wok-tossed in dark soy, green chillies, garlic, and spring onions.',
    image: FOOD_IMAGE_MAP['mix veg manchurian dry'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'french-fry',
    name: 'French Fries',
    category: 'Starters Veg',
    menuGroup: 'Starters',
    veg: true,
    price: 90,
    rating: 4.5,
    ratingCount: '290+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Golden salted potato batons fried crisp and served with spiced house dip.',
    image: FOOD_IMAGE_MAP['french fry'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'penuts-masala',
    name: 'Peanuts Masala',
    category: 'Starters Veg',
    menuGroup: 'Starters',
    veg: true,
    price: 100,
    rating: 4.6,
    ratingCount: '210+',
    badge: null,
    popular: false,
    customizable: false,
    description: 'Crunchy roasted peanuts tossed with diced red onions, fresh coriander, lime, and chaat masala.',
    image: FOOD_IMAGE_MAP['penuts masala'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'paneer-chili-dry',
    name: 'Paneer Chilli Dry',
    category: 'Starters Veg',
    menuGroup: 'Starters',
    veg: true,
    price: 220,
    halfPrice: 130,
    rating: 4.8,
    ratingCount: '780+',
    badge: 'BESTSELLER',
    badgeType: 'plum',
    popular: true,
    customizable: true,
    description: 'Fresh cottage cheese cubes tossed with capsicum, slit chillies, and savory dark soy glaze.',
    image: FOOD_IMAGE_MAP['paneer chili dry'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'paneer-pakora',
    name: 'Paneer Pakora',
    category: 'Starters Veg',
    menuGroup: 'Starters',
    veg: true,
    price: 200,
    rating: 4.7,
    ratingCount: '340+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'Soft malai paneer stuffed with mint chutney and deep-fried in spiced gram flour batter.',
    image: FOOD_IMAGE_MAP['paneer pakora'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'gobi-manchurian',
    name: 'Gobi Manchurian',
    category: 'Starters Veg',
    menuGroup: 'Starters',
    veg: true,
    price: 200,
    rating: 4.6,
    ratingCount: '410+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'Crispy cauliflower florets tossed in tangy ginger, garlic, and chilli Manchurian glaze.',
    image: FOOD_IMAGE_MAP['gobi manchurian'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'paneer-65',
    name: 'Paneer 65',
    category: 'Starters Veg',
    menuGroup: 'Starters',
    veg: true,
    price: 220,
    rating: 4.8,
    ratingCount: '520+',
    badge: "CHEF'S PICK",
    badgeType: 'emerald',
    popular: true,
    customizable: true,
    description: 'Crisp paneer bites tempered with curry leaves, mustard seeds, and zesty yoghurt marinade.',
    image: FOOD_IMAGE_MAP['paneer 65'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'crispy-baby-corn-chilli',
    name: 'Crispy Baby Corn Chilli',
    category: 'Starters Veg',
    menuGroup: 'Starters',
    veg: true,
    price: 240,
    rating: 4.7,
    ratingCount: '310+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'Golden fried tender baby corn stir-fried with bell peppers, garlic, and spicy scallions.',
    image: FOOD_IMAGE_MAP['crispy baby corn chilli'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'mushroom-chilli-dry',
    name: 'Mushroom Chilli Dry',
    category: 'Starters Veg',
    menuGroup: 'Starters',
    veg: true,
    price: 220,
    rating: 4.6,
    ratingCount: '270+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'Plump button mushrooms flash-fried with onions, bell peppers, and savoury black pepper sauce.',
    image: FOOD_IMAGE_MAP['mashroom chili dry'] || FALLBACK_FOOD_IMG,
  },

  // ==========================================
  // STARTERS NON VEG
  // ==========================================
  {
    id: 'chicken-lollypop',
    name: 'Chicken Lollipop',
    category: 'Starters Non Veg',
    menuGroup: 'Starters',
    veg: false,
    price: 230,
    halfPrice: 140,
    rating: 4.9,
    ratingCount: '1.1K+',
    badge: 'BESTSELLER',
    badgeType: 'plum',
    popular: true,
    customizable: true,
    description: 'Crisp Indo-Chinese chicken wings frenched, marinated in royal spices, and served with hot garlic sauce.',
    image: FOOD_IMAGE_MAP['chicken lollypop'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'chicken-pakora',
    name: 'Chicken Pakora',
    category: 'Starters Non Veg',
    menuGroup: 'Starters',
    veg: false,
    price: 220,
    halfPrice: 130,
    rating: 4.7,
    ratingCount: '460+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'Boneless chicken cubes coated in spiced ajwain and gram flour batter, fried until golden and crisp.',
    image: FOOD_IMAGE_MAP['chicken pakora'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'chicken-fried-leg',
    name: 'Chicken Fried (2 pc - Leg)',
    category: 'Starters Non Veg',
    menuGroup: 'Starters',
    veg: false,
    price: 220,
    rating: 4.8,
    ratingCount: '630+',
    badge: 'POPULAR',
    badgeType: 'saffron',
    popular: true,
    customizable: true,
    description: 'Crispy spiced chicken drumsticks double-marinated with roasted garam masala and lime juice.',
    image: FOOD_IMAGE_MAP['chicken fried (2 pic leg)'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'chicken-crunchy',
    name: 'Chicken Crunchy',
    category: 'Starters Non Veg',
    menuGroup: 'Starters',
    veg: false,
    price: 220,
    rating: 4.7,
    ratingCount: '390+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'Crispy shredded boneless chicken bites tossed with crushed black pepper and fragrant curry leaves.',
    image: FOOD_IMAGE_MAP['chicken crunchy'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'honey-chicken-chilli-dry',
    name: 'Honey Chicken Chilli Dry',
    category: 'Starters Non Veg',
    menuGroup: 'Starters',
    veg: false,
    price: 260,
    rating: 4.8,
    ratingCount: '450+',
    badge: "CHEF'S PICK",
    badgeType: 'emerald',
    popular: true,
    customizable: true,
    description: 'Crisp chicken strips glazed in natural honey, red chillies, garlic, and toasted white sesame seeds.',
    image: FOOD_IMAGE_MAP['honey chicken chilli dry'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'chicken-chilli-boneless-dry',
    name: 'Chicken Chilli Boneless Dry',
    category: 'Starters Non Veg',
    menuGroup: 'Starters',
    veg: false,
    price: 220,
    halfPrice: 130,
    rating: 4.8,
    ratingCount: '890+',
    badge: 'BESTSELLER',
    badgeType: 'plum',
    popular: true,
    customizable: true,
    description: 'Tender diced chicken wok-charred with crunchy capsicums, onions, green chillies, and light soy.',
    image: FOOD_IMAGE_MAP['chicken chili bonless dry'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'chicken-65',
    name: 'Chicken 65',
    category: 'Starters Non Veg',
    menuGroup: 'Starters',
    veg: false,
    price: 250,
    halfPrice: 150,
    rating: 4.8,
    ratingCount: '710+',
    badge: 'POPULAR',
    badgeType: 'saffron',
    popular: true,
    customizable: true,
    description: 'Fiery chicken chunks tempered with fresh curry leaves, whole red chillies, and zesty mustard.',
    image: FOOD_IMAGE_MAP['chicken 65'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'butter-chicken-chilli-dry',
    name: 'Butter Chicken Chilli Dry',
    category: 'Starters Non Veg',
    menuGroup: 'Starters',
    veg: false,
    price: 260,
    rating: 4.9,
    ratingCount: '520+',
    badge: "CHEF'S PICK",
    badgeType: 'emerald',
    popular: true,
    customizable: true,
    description: 'Signature fusion of buttery tandoori chicken tikka tossed high-flame with dry oriental herbs.',
    image: FOOD_IMAGE_MAP['butter chicken chilli dry'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'egg-chilli-dry',
    name: 'Egg Chilli Dry',
    category: 'Starters Non Veg',
    menuGroup: 'Starters',
    veg: false,
    price: 150,
    rating: 4.6,
    ratingCount: '280+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'Boiled egg quarters flash-fried and tossed with dark soy, garlic, and fresh green bell peppers.',
    image: FOOD_IMAGE_MAP['egg chili dry'] || FALLBACK_FOOD_IMG,
  },

  // ==========================================
  // BIRYANI & RICE
  // ==========================================
  {
    id: 'mutton-handi-biryani',
    name: 'Mutton Handi Biryani',
    category: 'Biryani',
    menuGroup: 'Biryani & Rice',
    veg: false,
    price: 380,
    halfPrice: 220,
    rating: 4.9,
    ratingCount: '1.2K+',
    badge: 'BESTSELLER',
    badgeType: 'plum',
    popular: true,
    customizable: true,
    description: 'Slow-cooked Awadhi mutton layered with saffron basmati in a sealed clay handi with kewra and desi ghee.',
    image: FOOD_IMAGE_MAP['mutton biryani handi'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'chicken-dum-biryani',
    name: 'Chicken Dum Biryani',
    category: 'Biryani',
    menuGroup: 'Biryani & Rice',
    veg: false,
    price: 290,
    halfPrice: 170,
    rating: 4.8,
    ratingCount: '980+',
    badge: 'POPULAR',
    badgeType: 'saffron',
    popular: true,
    customizable: true,
    description: 'Fragrant long-grain basmati slow-steamed with spiced chicken, fresh mint, caramelized onions, and saffron.',
    image: FOOD_IMAGE_MAP['chicken biryani'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'motter-pulao-kg',
    name: 'Motter Pulao (1 Kg)',
    category: 'Biryani',
    menuGroup: 'Biryani & Rice',
    veg: true,
    price: 500,
    rating: 4.7,
    ratingCount: '310+',
    badge: 'PARTY PACK',
    badgeType: 'emerald',
    popular: false,
    customizable: true,
    description: 'Mehman Nawazi Party Pack — 1 kg aromatic basmati peas pulao cooked in whole royal spices and ghee.',
    image: FOOD_IMAGE_MAP['motter pulao'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'meetha-zarda-kg',
    name: 'Meetha Zarda (1 Kg)',
    category: 'Biryani',
    menuGroup: 'Biryani & Rice',
    veg: true,
    price: 800,
    rating: 4.9,
    ratingCount: '240+',
    badge: 'ROYAL SWEET',
    badgeType: 'plum',
    popular: true,
    customizable: true,
    description: 'Mehman Nawazi Party Pack — 1 kg royal sweet saffron rice with rich dry fruits, candied fruits, and khoya.',
    image: FOOD_IMAGE_MAP['meetha zarda'] || FALLBACK_FOOD_IMG,
  },

  // ==========================================
  // TANDOOR & KEBABS
  // ==========================================
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
    description: 'Char-grilled malai paneer skewers with bell peppers and roasted tomatoes, served with fresh pudina chutney.',
    image: FOOD_IMAGE_MAP['paneer tikka'] || FALLBACK_FOOD_IMG,
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
    description: 'Velvety cashew, clotted cream, and cardamom-marinated boneless chicken charred in clay tandoor.',
    image: FOOD_IMAGE_MAP['chicken malai kabab'] || FALLBACK_FOOD_IMG,
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
    description: 'Skewered minced mutton blended with royal spices, fresh coriander, ginger, and smoky desi ghee.',
    image: FOOD_IMAGE_MAP['chicken seekh kabab'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'baby-naan-kg',
    name: 'Baby Naan (1 Kg)',
    category: 'Tandoor',
    menuGroup: 'Tandoor & Kebabs',
    veg: true,
    price: 450,
    rating: 4.7,
    ratingCount: '480+',
    badge: 'PARTY PACK',
    badgeType: 'saffron',
    popular: false,
    customizable: false,
    description: 'Mehman Nawazi Party Pack — 1 kg freshly baked tandoori baby naans glazed with melted butter.',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=400&q=80',
  },

  // ==========================================
  // MAINS & CURRIES
  // ==========================================
  {
    id: 'murg-mussallam',
    name: 'Murg Mussallam',
    category: 'Mains',
    menuGroup: 'Mains & Curries',
    veg: false,
    price: 420,
    halfPrice: 240,
    rating: 4.9,
    ratingCount: '640+',
    badge: "CHEF'S SIGNATURE",
    badgeType: 'emerald',
    popular: true,
    customizable: true,
    description: 'Whole roasted Mughlai chicken braised in a luxurious almond, cashew, saffron, and cream gravy.',
    image: FOOD_IMAGE_MAP['murg mussallam'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'butter-chicken',
    name: 'Butter Chicken',
    category: 'Mains',
    menuGroup: 'Mains & Curries',
    veg: false,
    price: 320,
    halfPrice: 185,
    rating: 4.8,
    ratingCount: '1.1K+',
    badge: 'BESTSELLER',
    badgeType: 'plum',
    popular: true,
    customizable: true,
    description: 'Tandoor-pulled succulent chicken tikka simmered in silky tomato, kasuri methi, and churned butter gravy.',
    image: FOOD_IMAGE_MAP['chicken butter masala'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'dal-makhani',
    name: 'Dal Makhani',
    category: 'Mains',
    menuGroup: 'Mains & Curries',
    veg: true,
    price: 220,
    halfPrice: 130,
    rating: 4.7,
    ratingCount: '740+',
    badge: null,
    popular: false,
    customizable: true,
    description: 'Overnight slow-simmered black urad lentils finished with fresh churned white butter and clotted cream.',
    image: FOOD_IMAGE_MAP['yellow daal'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'chicken-korma-kg',
    name: 'Chicken Korma (1 Kg)',
    category: 'Mains',
    menuGroup: 'Mains & Curries',
    veg: false,
    price: 600,
    rating: 4.8,
    ratingCount: '350+',
    badge: 'PARTY PACK',
    badgeType: 'saffron',
    popular: false,
    customizable: true,
    description: 'Mehman Nawazi Party Pack — 1 kg rich traditional Mughlai chicken braised with fried onions and yogurt.',
    image: FOOD_IMAGE_MAP['chicken korma'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'mutton-korma-kg',
    name: 'Mutton Korma (1 Kg)',
    category: 'Mains',
    menuGroup: 'Mains & Curries',
    veg: false,
    price: 1200,
    rating: 4.9,
    ratingCount: '410+',
    badge: 'PARTY PACK',
    badgeType: 'plum',
    popular: true,
    customizable: true,
    description: 'Mehman Nawazi Party Pack — 1 kg royal slow-cooked tender mutton in aromatic Awadhi brown onion gravy.',
    image: FOOD_IMAGE_MAP['mutton korma'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'mutton-rane-e-arabia',
    name: 'Mutton Rane-E-Arabia',
    category: 'Mains',
    menuGroup: 'Mains & Curries',
    veg: false,
    price: 2500,
    rating: 4.9,
    ratingCount: '190+',
    badge: 'ROYAL FEAST',
    badgeType: 'plum',
    popular: true,
    customizable: true,
    description: 'Mehman Nawazi Grand Special — Whole slow-roasted Arabian spiced leg of mutton with saffron rice garnish.',
    image: FOOD_IMAGE_MAP['mutton rane-e-arabia'] || FALLBACK_FOOD_IMG,
  },

  // ==========================================
  // CHINESE & ROLLS
  // ==========================================
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
    description: 'High-flame wok-tossed noodles with tender chicken strips, crisp peppers, scallions, and roasted garlic.',
    image: FOOD_IMAGE_MAP['mix veg manchurian dry'] || FALLBACK_FOOD_IMG,
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
    description: 'Smoky tandoori chicken tikka, double farm-egg layer, pickled onions, and mint chutney rolled in flaky paratha.',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80',
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
    description: 'Spiced tandoori paneer cubes, crisp capsicum, and zesty pudina mayo rolled in a crisp golden paratha.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80',
  },
]

// --- HERO CAROUSEL SLIDES (Dark Velvet & Gold Halo) ---
const HERO_SLIDES = [
  {
    id: 'slide-1',
    headlineTop: 'MUTTON HANDI',
    headlineBottom: 'ROYAL BIRYANI.',
    accent: 'Zaika-e-Shahi',
    subtext: 'Slow-cooked Awadhi mutton infused with saffron & pure ghee.',
    cta: 'Order Now',
    targetDishId: 'mutton-handi-biryani',
    image: FOOD_IMAGE_MAP['mutton biryani handi'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'slide-2',
    headlineTop: 'ROYAL TANDOOR',
    headlineBottom: 'SMOKY PLATTER.',
    accent: 'Live Charcoal',
    subtext: 'Malai tikka & paneer shashlik straight from clay ovens.',
    cta: 'Try Tandoor',
    targetDishId: 'paneer-tikka-shashlik',
    image: FOOD_IMAGE_MAP['paneer tikka'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'slide-3',
    headlineTop: "CHEF'S KEBABS",
    headlineBottom: '& FLAKY ROLLS.',
    accent: 'Patna Favorite',
    subtext: 'Juicy seekh kebabs & double-egg chicken rolls served hot.',
    cta: 'Explore Rolls',
    targetDishId: 'double-egg-chicken-roll',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80',
  },
]

// --- 7 CIRCULAR CATEGORIES ---
const CATEGORIES = [
  {
    id: 'All',
    label: 'All',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'Soups',
    label: 'Soups',
    image: FOOD_IMAGE_MAP['veg sweet corn'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'Starters Veg',
    label: 'Veg Starters',
    image: FOOD_IMAGE_MAP['paneer chili dry'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'Starters Non Veg',
    label: 'Non-Veg Starters',
    image: FOOD_IMAGE_MAP['chicken lollypop'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'Biryani',
    label: 'Biryani & Rice',
    image: FOOD_IMAGE_MAP['mutton biryani handi'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'Tandoor',
    label: 'Tandoor',
    image: FOOD_IMAGE_MAP['paneer tikka'] || FALLBACK_FOOD_IMG,
  },
  {
    id: 'Mains',
    label: 'Curries',
    image: FOOD_IMAGE_MAP['murg mussallam'] || FALLBACK_FOOD_IMG,
  },
]

const MENU_GROUPS = [
  'Soups',
  'Starters',
  'Biryani & Rice',
  'Tandoor & Kebabs',
  'Mains & Curries',
  'Chinese & Rolls',
]

const ADDONS = [
  { id: 'raita', name: 'Burhani Raita', price: 40, veg: true },
  { id: 'butter-naan', name: 'Butter Naan', price: 55, veg: true },
  { id: 'mint-chutney', name: 'Pudina Chutney', price: 30, veg: true },
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
  { id: 'taste', label: 'Food Taste & Presentation' },
  { id: 'service', label: 'Staff & Table Service' },
  { id: 'ambience', label: 'Awadhi Dining Ambience' },
  { id: 'value', label: 'Value for Money' },
  { id: 'overall', label: 'Overall Royal Experience' },
]

// --- EXACT GEOMETRIC ARCHITECTURAL MANDALA WATERMARK SVG ---
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

        {/* Intermediate Pointed Gothic Arch Petals */}
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

        {/* Outermost Radiating Awadhi Flourish Crowns */}
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

// --- GOLD FOIL RIBBON CATEGORY HEADER (Matches Menu Image 1 & 8 1:1) ---
const ZaikaCategoryRibbon = ({ name }: { name: string }) => (
  <div className="flex items-center gap-3 pt-4 pb-2 mb-2 select-none">
    <div
      className="inline-flex items-center gap-2 px-5 py-1.5 rounded-r-full rounded-l-md shadow-md relative overflow-hidden group border border-[#F3C669]/40"
      style={{
        background: 'linear-gradient(90deg, #996D19 0%, #F6D47B 32%, #FBE6A2 55%, #DFB448 82%, #8C6014 100%)',
        boxShadow: '0 4px 18px rgba(212, 175, 55, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      }}
    >
      <span className="text-[10px] text-[#2C1A00] font-bold">◈</span>
      <h2
        className="text-[12px] sm:text-[13px] font-extrabold tracking-[0.2em] uppercase text-[#190D00] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]"
        style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
      >
        {name}
      </h2>
    </div>
    <div className="flex-1 h-[1px] bg-gradient-to-r from-[#F3C669]/60 via-[#F3C669]/20 to-transparent" />
  </div>
)

// --- GOLD HAIRLINE DIVIDER ---
const GoldHairline = ({ className = '' }: { className?: string }) => (
  <div
    className={`h-[1px] w-full bg-gradient-to-r from-transparent via-[#F3C669]/40 to-transparent ${className}`}
  />
)

// --- ARCHITECTURAL MANDALA DIVIDER ---
const ArchitecturalMandalaDivider = ({ className = '' }: { className?: string }) => (
  <div className={`relative py-3 flex items-center justify-center ${className}`}>
    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F3C669]/30 to-[#F3C669]/50" />
    <div className="mx-3.5 relative w-7 h-7 flex items-center justify-center">
      <ArchitecturalMandalaSvg
        className="w-full h-full opacity-65"
        strokeColor="#F3C669"
        accentColor="#E89223"
        strokeWidth={1.2}
      />
      <div className="w-1.5 h-1.5 rounded-full bg-[#F3C669] shadow-[0_0_8px_rgba(243,198,105,0.8)]" />
    </div>
    <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F3C669]/30 to-[#F3C669]/50" />
  </div>
)

// --- ROYAL PASS CARD (Black & Gold Metal Membership Card) ---
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
}) => {
  return (
    <div
      className={`rounded-[24px] bg-gradient-to-br from-[#160A24] via-[#240F38] to-[#12071C] text-white relative overflow-hidden border border-[#F3C669]/35 shadow-[0_16px_36px_rgba(0,0,0,0.55)] ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      {/* Background Architectural Mandala Watermark */}
      <div className="absolute -right-10 -bottom-10 w-[200px] h-[200px] pointer-events-none opacity-20">
        <ArchitecturalMandalaSvg strokeColor="#F3C669" accentColor="#E89223" strokeWidth={1} />
      </div>

      {/* Top Card Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#E89223]/25 border border-[#F3C669]/60 flex items-center justify-center">
            <Award className="w-4 h-4 text-[#F3C669]" />
          </div>
          <div>
            <span
              className="text-[11.5px] font-extrabold uppercase tracking-[0.2em] text-[#F3C669]"
              style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
            >
              PM ZAIKA ROYAL PASS
            </span>
            <p className="text-[10px] text-[#C8BCCF]">Shahi Mehman Privilege</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-[#F3C669]/30 text-[10px] font-bold text-[#FDEBD3] tnum">
          {selectedTable}
        </span>
      </div>

      {/* Center Balance */}
      <div className="relative z-10 my-3 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#A496AC]">
            Available Rewards Balance
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-[28px] font-extrabold tracking-tight text-[#FFF8F0] tnum">
              {royalPoints}
            </span>
            <span className="text-xs font-bold text-[#F3C669]">ROYAL POINTS</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onRedeem}
          className="h-9 px-4 rounded-full bg-gradient-to-r from-[#E89223] via-[#F3C669] to-[#D48016] hover:brightness-110 text-[#140A20] text-xs font-extrabold shadow-[0_6px_18px_rgba(232,146,35,0.4)] cursor-pointer transition-all shrink-0"
        >
          Redeem ₹50
        </button>
      </div>

      {/* Perks Footer */}
      {!compact && (
        <div className="relative z-10 pt-2.5 border-t border-[#F3C669]/15 flex items-center justify-between text-[11px] text-[#D8CFDC]">
          <span className="inline-flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-[#F3C669]" /> Flat 25% Off with ZAIKA25
          </span>
          <span className="inline-flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-[#F3C669]" /> Priority Steward Call
          </span>
        </div>
      )}
    </div>
  )
}

// --- FSSAI VEG / NON-VEG DIETARY INDICATOR ---
const FssaiDot = ({ veg, size = 'sm' }: { veg: boolean; size?: 'sm' | 'md' }) => {
  const box = size === 'sm' ? 'w-[14px] h-[14px]' : 'w-[16px] h-[16px]'
  const dot = size === 'sm' ? 'w-[6px] h-[6px]' : 'w-[7px] h-[7px]'
  return (
    <span
      className={`inline-flex items-center justify-center ${box} rounded-[3px] border bg-[#140A20]/90 shrink-0 ${
        veg ? 'border-[#22C55E]/80' : 'border-[#EF4444]/80'
      }`}
      title={veg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
      <span className={`${dot} rounded-full ${veg ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`} />
    </span>
  )
}

// --- PM ZAIKA ROYAL CREST ---
const PmZaikaCrest = () => (
  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
    <ArchitecturalMandalaSvg
      className="absolute inset-0 w-full h-full opacity-70"
      strokeColor="#F3C669"
      accentColor="#E89223"
      strokeWidth={1.2}
    />
    <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#2D1148] to-[#140A20] border border-[#F3C669]/80 flex flex-col items-center justify-center leading-none relative z-10 shadow-[0_4px_14px_rgba(0,0,0,0.5)]">
      <span className="text-[10px] font-extrabold text-[#F3C669]">PM</span>
      <span className="text-[7.5px] font-semibold text-[#FDEBD3] tracking-widest uppercase">
        ZAIKA
      </span>
    </div>
  </div>
)

// =========================================================================
// MAIN ORDER MENU PAGE
// =========================================================================
export default function OrderMenuPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = (params?.slug as string) || 'pm-zaika'
  const tableQuery = searchParams.get('table')

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'offers' | 'hub'>('home')
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

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

  // Hero carousel
  const [heroIndex, setHeroIndex] = useState(0)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [vegOnly, setVegOnly] = useState(false)
  const [nonVegOnly, setNonVegOnly] = useState(false)
  const [under250, setUnder250] = useState(false)
  const [bestsellersOnly, setBestsellersOnly] = useState(false)

  // Favorites
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'mutton-handi-biryani': true,
    'chicken-lollypop': true,
  })

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) => {
      const next = !prev[id]
      showToast(next ? 'Added to favorites' : 'Removed from favorites')
      return { ...prev, [id]: next }
    })
  }

  // Cart
  const [cart, setCart] = useState<Record<string, CartEntry>>({})
  const [royalPoints, setRoyalPoints] = useState(240)
  const [redeemPoints, setRedeemPoints] = useState(false)
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>('ZAIKA25')
  const [couponInput, setCouponInput] = useState('')

  // Customization Sheet
  const [customDish, setCustomDish] = useState<MenuItem | null>(null)
  const [customPortion, setCustomPortion] = useState('Full')
  const [customSpice, setCustomSpice] = useState('Medium')
  const [customAddons, setCustomAddons] = useState<string[]>([])
  const [customNotes, setCustomNotes] = useState('')

  // Cart / Checkout Modal
  const [cartOpen, setCartOpen] = useState(false)
  const [cookingNotes, setCookingNotes] = useState('')
  const [liveOrder, setLiveOrder] = useState<LiveOrder | null>(null)

  // Feedback Modal
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

  // Complaint Modal
  const [complaintOpen, setComplaintOpen] = useState(false)
  const [complaintCategory, setComplaintCategory] = useState('Food Quality')
  const [complaintNote, setComplaintNote] = useState('')

  // Phone Copy Feedback
  const [phoneCopied, setPhoneCopied] = useState(false)

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText('+917488260572')
    setPhoneCopied(true)
    showToast('Restaurant helpline copied!')
    setTimeout(() => setPhoneCopied(false), 2000)
  }

  const handleRingSteward = () => {
    setStewardAlerted(true)
    showToast(`Steward summoned to ${selectedTable}`)
    setTimeout(() => setStewardAlerted(false), 8000)
  }

  const handleRedeemRoyalPoints = () => {
    if (royalPoints < 50) {
      showToast('Need at least 50 Royal Points to redeem.')
      return
    }
    setRedeemPoints((r) => {
      const next = !r
      showToast(next ? '50 Royal Points applied: Flat ₹50 OFF' : 'Points credit removed')
      return next
    })
  }

  // --- FILTERED DISHES ---
  const activeFilterCount =
    (vegOnly ? 1 : 0) + (nonVegOnly ? 1 : 0) + (under250 ? 1 : 0) + (bestsellersOnly ? 1 : 0)

  const filteredDishes = useMemo(() => {
    return MENU_ITEMS.filter((dish) => {
      if (vegOnly && !dish.veg) return false
      if (nonVegOnly && dish.veg) return false
      if (under250 && dish.price >= 250) return false
      if (bestsellersOnly && !dish.popular && !dish.badge) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = dish.name.toLowerCase().includes(q)
        const matchCat = dish.category.toLowerCase().includes(q)
        const matchDesc = dish.description.toLowerCase().includes(q)
        if (!matchName && !matchCat && !matchDesc) return false
      }

      if (selectedCategory !== 'All' && selectedCategory !== dish.category) {
        return false
      }

      return true
    })
  }, [vegOnly, nonVegOnly, under250, bestsellersOnly, searchQuery, selectedCategory])

  const menuGroupedDishes = useMemo(() => {
    const map: Record<string, MenuItem[]> = {}
    for (const group of MENU_GROUPS) {
      map[group] = []
    }
    for (const dish of filteredDishes) {
      if (!map[dish.menuGroup]) {
        map[dish.menuGroup] = []
      }
      map[dish.menuGroup].push(dish)
    }
    return map
  }, [filteredDishes])

  const totalMenuResults = filteredDishes.length

  const homeDishes = useMemo(() => {
    return filteredDishes.slice(0, 10)
  }, [filteredDishes])

  // --- CART OPERATIONS ---
  const getDishQty = (dishId: string) => {
    let count = 0
    for (const key in cart) {
      if (cart[key].dish.id === dishId) {
        count += cart[key].qty
      }
    }
    return count
  }

  const quickAddDish = (dish: MenuItem) => {
    const key = `${dish.id}__Full__Standard____`
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
    showToast(`Added ${dish.name}`)
  }

  const quickDecrementDish = (dishId: string) => {
    setCart((prev) => {
      const target = Object.keys(prev).find((k) => prev[k].dish.id === dishId)
      if (!target) return prev
      const current = prev[target]
      const next = { ...prev }
      if (current.qty <= 1) {
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

  const handlePlaceOrder = async () => {
    const orderId = `PZ-${Math.floor(400 + Math.random() * 580)}`
    const usedPoints = cartSummary.pointsDiscount > 0
    if (usedPoints) {
      setRoyalPoints((p) => Math.max(0, p - 50))
      setRedeemPoints(false)
    }

    const newOrder: LiveOrder = {
      id: orderId,
      table: selectedTable,
      total: cartSummary.grandTotal,
      itemsCount: cartSummary.itemCount,
      stage: 0,
    }

    setLiveOrder(newOrder)
    try {
      localStorage.setItem('pmzaika_live_order', JSON.stringify(newOrder))
    } catch {}

    setCart({})
    setCookingNotes('')
    showToast(`Order #${orderId} placed for ${selectedTable}!`)
  }

  const badgeStyle = (type?: string) => {
    if (type === 'saffron') return 'bg-[#E89223] text-[#140A20] font-extrabold'
    if (type === 'emerald') return 'bg-[#15803D] text-white'
    return 'bg-[#4A1D72] text-[#F3C669] border border-[#F3C669]/40'
  }

  const activeSlide = HERO_SLIDES[heroIndex]

  return (
    <div className="min-h-screen w-full bg-[#0E0617] text-[#FFF8F0] flex justify-center sm:py-5 font-jakarta antialiased selection:bg-[#E89223]/30 selection:text-[#F3C669] relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Playfair+Display:ital,wght@1,600;1,700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        .font-cinzel { font-family: var(--font-cinzel), 'Cinzel', Georgia, serif; }
        .font-editorial { font-family: 'Playfair Display', Georgia, serif; }
        .font-jakarta { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
        .tnum { font-variant-numeric: tabular-nums; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Global Architectural Mandala Watermark Canvas (Faint Cultural Layering) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, #2A123D 0%, #160A24 45%, #0E0517 100%)',
          }}
        />
        {/* Prominent Architectural Mandala placed on upper left */}
        <div className="absolute -left-[160px] top-[40px] w-[620px] h-[620px] opacity-[0.09] pointer-events-none">
          <ArchitecturalMandalaSvg strokeColor="#F3C669" accentColor="#E89223" strokeWidth={0.8} />
        </div>
        {/* Faint repeating mandala on lower right */}
        <div className="absolute -right-[180px] top-[55%] w-[680px] h-[680px] opacity-[0.06] pointer-events-none">
          <ArchitecturalMandalaSvg strokeColor="#F3C669" accentColor="#E89223" strokeWidth={0.7} />
        </div>
      </div>

      {/* Mobile Viewport Container (430px centered on desktop, full-bleed on mobile) */}
      <div className="w-full max-w-[440px] min-h-screen sm:min-h-[860px] sm:h-[860px] bg-[#140A20]/95 relative sm:rounded-[36px] shadow-[0_0_80px_rgba(0,0,0,0.85)] border sm:border-[#F3C669]/20 overflow-hidden flex flex-col z-10">
        
        {/* Floating Toast Notification */}
        {toast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[360px] pointer-events-none animate-in fade-in slide-in-from-top-2 duration-250">
            <div className="px-4 py-2.5 rounded-2xl bg-[#26103A] text-white text-xs font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.6)] border border-[#F3C669]/40 flex items-center gap-2.5 backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4 text-[#F3C669] shrink-0" />
              <span className="truncate text-[#FFF8F0]">{toast}</span>
            </div>
          </div>
        )}

        {/* =================================================================
            MAIN SCROLLABLE CONTENT AREA
           ================================================================= */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-28">
          
          {/* ---------------------------------------------------------------
              TAB 1: HOME (CURATED AWADHI SHOWCASE)
             --------------------------------------------------------------- */}
          {activeTab === 'home' && (
            <div className="px-4 pt-4 space-y-5">
              
              {/* 1. Royal Top Header */}
              <header className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => setTableModalOpen(true)}
                    className="w-10 h-10 rounded-2xl bg-[#221034] border border-[#F3C669]/30 shadow-[0_4px_14px_rgba(0,0,0,0.3)] flex items-center justify-center text-[#F3C669] hover:bg-[#2F1548] transition-colors cursor-pointer shrink-0"
                    aria-label="Switch dining table"
                    title="Select Table"
                  >
                    <MenuIcon className="w-5 h-5" />
                  </button>

                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => setTableModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F3C669] hover:text-[#FFF8F0] cursor-pointer tnum"
                    >
                      <MapPin className="w-3 h-3 text-[#E89223]" />
                      <span>{selectedTable} • {selectedTable === 'Takeaway' ? 'Pickup' : 'Dine-In'}</span>
                      <ChevronDown className="w-3 h-3 text-[#F3C669]" />
                    </button>
                    <h1
                      className="text-[20px] font-extrabold tracking-tight text-[#FFF8F0] leading-none mt-0.5"
                      style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                    >
                      PM ZAIKA
                    </h1>
                    <p className="text-[10.5px] font-medium text-[#C8BCCF] mt-0.5 truncate tracking-wide">
                      Awadhi • Mughlai • Tandoor • Rolls
                    </p>
                  </div>
                </div>

                {/* Right Header Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Call Helpline */}
                  <a
                    href="tel:+917488260572"
                    className="w-10 h-10 rounded-2xl bg-[#221034] border border-[#F3C669]/30 shadow-[0_4px_14px_rgba(0,0,0,0.3)] flex items-center justify-center text-[#F3C669] hover:bg-[#2F1548] transition-colors"
                    aria-label="Call Restaurant"
                    title="Call Helpline"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  {/* Steward Alert Bell */}
                  <button
                    type="button"
                    onClick={handleRingSteward}
                    className={`relative w-10 h-10 rounded-2xl border shadow-[0_4px_14px_rgba(0,0,0,0.3)] flex items-center justify-center transition-colors cursor-pointer ${
                      stewardAlerted
                        ? 'bg-[#E89223] text-[#140A20] border-[#F3C669]'
                        : 'bg-[#221034] text-[#F3C669] border-[#F3C669]/30 hover:bg-[#2F1548]'
                    }`}
                    aria-label="Call Steward"
                    title="Summon Steward to Table"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-[17px] h-[17px] rounded-full bg-[#E89223] text-[#140A20] text-[9px] font-extrabold flex items-center justify-center border-2 border-[#140A20] tnum">
                      {stewardAlerted ? '✓' : '1'}
                    </span>
                  </button>

                  {/* Cart Bag */}
                  <button
                    type="button"
                    onClick={() => setCartOpen(true)}
                    className="relative w-10 h-10 rounded-2xl bg-[#221034] border border-[#F3C669]/30 shadow-[0_4px_14px_rgba(0,0,0,0.3)] flex items-center justify-center text-[#F3C669] hover:bg-[#2F1548] transition-colors cursor-pointer"
                    aria-label="Open Order Bag"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {cartSummary.itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-[#E89223] to-[#F3C669] text-[#140A20] text-[9.5px] font-extrabold flex items-center justify-center border-2 border-[#140A20] tnum">
                        {cartSummary.itemCount}
                      </span>
                    )}
                  </button>
                </div>
              </header>

              {/* Live Order Banner */}
              {liveOrder && (
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="w-full p-3 rounded-[22px] bg-gradient-to-r from-[#2A103D] to-[#1C092C] text-white flex items-center justify-between border border-[#F3C669]/40 shadow-[0_8px_24px_rgba(0,0,0,0.4)] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#E89223]/25 border border-[#F3C669]/40 flex items-center justify-center shrink-0">
                      <ChefHat className="w-5 h-5 text-[#F3C669]" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold truncate tnum text-[#FFF8F0]">
                        Order #{liveOrder.id} • {liveOrder.table}
                      </p>
                      <p className="text-[11px] text-[#F3C669]">
                        {liveOrder.stage === 0
                          ? 'Marinating & Tandoor...'
                          : liveOrder.stage === 1
                          ? 'Plating & Saffron Garnish...'
                          : 'Ready to Serve to Table!'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#F3C669] inline-flex items-center gap-0.5 shrink-0">
                    Track <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              )}

              {/* 2. Sleek Search Bar & Filter Button */}
              <div className="flex items-center gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#F3C669] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search biryani, tandoor, soups, rolls..."
                    className="w-full h-11 rounded-full bg-[#1F0E31] border border-[#F3C669]/25 shadow-[0_4px_16px_rgba(0,0,0,0.3)] pl-11 pr-9 text-[13px] font-medium text-[#FFF8F0] placeholder-[#8E7E98] focus:outline-none focus:ring-2 focus:ring-[#F3C669]/50"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A496AC] hover:text-[#FFF8F0] cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setFilterSheetOpen(true)}
                  className={`relative w-11 h-11 rounded-2xl border shadow-[0_4px_16px_rgba(0,0,0,0.3)] flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    activeFilterCount > 0
                      ? 'bg-[#E89223] text-[#140A20] border-[#F3C669]'
                      : 'bg-[#1F0E31] text-[#F3C669] border-[#F3C669]/30 hover:bg-[#2B1444]'
                  }`}
                  aria-label="Open Dish Filters"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-[#F3C669] text-[#140A20] text-[10px] font-extrabold flex items-center justify-center border border-[#140A20] tnum">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* 3. Hero Promo Banner Carousel (Dish Mandala Halo + Gold Hairline) */}
              <section className="rounded-[26px] bg-gradient-to-br from-[#260E3A] via-[#381456] to-[#1A082B] overflow-hidden relative min-h-[210px] border border-[#F3C669]/30 shadow-[0_16px_36px_rgba(0,0,0,0.5)]">
                <div className="relative z-10 flex items-center min-h-[210px]">
                  {/* Left Column (56%) */}
                  <div className="w-[56%] pl-5 pr-2 pt-5 pb-9 flex flex-col justify-between z-10">
                    <div>
                      <h2
                        className="text-[17px] font-extrabold text-[#FFF8F0] leading-[1.15] tracking-wide uppercase"
                        style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                      >
                        {activeSlide.headlineTop}
                        <br />
                        {activeSlide.headlineBottom}
                      </h2>
                      <p className="font-editorial italic font-bold text-[20px] text-[#F3C669] leading-tight mt-1">
                        {activeSlide.accent}
                      </p>
                      {/* Brushed-Gold Hairline */}
                      <GoldHairline className="my-2 max-w-[130px]" />
                      <p className="text-[10.5px] font-medium text-[#C8BCCF] leading-snug">
                        {activeSlide.subtext}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const target = MENU_ITEMS.find((d) => d.id === activeSlide.targetDishId)
                        if (target) openCustomization(target)
                      }}
                      className="mt-3.5 w-fit h-8 pl-3.5 pr-1.5 rounded-full bg-gradient-to-r from-[#E89223] via-[#F3C669] to-[#D48016] text-[#140A20] text-[11.5px] font-extrabold inline-flex items-center gap-1.5 shadow-[0_6px_16px_rgba(232,146,35,0.4)] transition-all cursor-pointer hover:brightness-110"
                    >
                      <span>{activeSlide.cta}</span>
                      <span className="w-5 h-5 rounded-full bg-[#140A20] text-[#F3C669] flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 stroke-[3]" />
                      </span>
                    </button>
                  </div>

                  {/* Right Column (44%) — Geometric Mandala Halo Framing Dish */}
                  <div className="w-[44%] pr-3.5 py-4 flex items-center justify-center relative">
                    <div className="relative w-[140px] h-[140px] flex items-center justify-center">
                      <ArchitecturalMandalaSvg
                        className="absolute inset-0 w-full h-full opacity-65"
                        strokeColor="#F3C669"
                        accentColor="#E89223"
                        strokeWidth={1.2}
                      />
                      <div className="w-[96px] h-[96px] rounded-full p-[2.5px] bg-gradient-to-tr from-[#E89223] via-[#F3C669] to-[#6E3B9E] shadow-[0_10px_24px_rgba(0,0,0,0.7)] relative z-10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
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

                {/* Clickable Slide Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                  {HERO_SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setHeroIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === heroIndex
                          ? 'w-5 bg-[#F3C669]'
                          : 'w-1.5 bg-white/30 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </section>

              {/* 4. Circular Category Quick Rail (7 Items with Gold Active Ring) */}
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
                          className={`w-[60px] h-[60px] rounded-full p-[2px] transition-all ${
                            isActive
                              ? 'bg-gradient-to-tr from-[#E89223] to-[#F3C669] ring-2 ring-[#F3C669] shadow-[0_0_16px_rgba(243,198,105,0.4)]'
                              : 'bg-[#221034] border border-[#F3C669]/30 shadow-md group-hover:border-[#F3C669]/60'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
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
                          className={`text-[11px] leading-none ${
                            isActive
                              ? 'font-extrabold text-[#F3C669]'
                              : 'font-semibold text-[#A89CB2]'
                          }`}
                        >
                          {cat.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Center Mandala Divider */}
              <ArchitecturalMandalaDivider className="-my-1" />

              {/* 5. Chef's Royal Signatures / Popular Picks */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#F3C669]" />
                    <h2
                      className="text-[17px] font-extrabold text-[#FFF8F0] tracking-wide uppercase"
                      style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                    >
                      {selectedCategory === 'All' && !searchQuery.trim()
                        ? "Chef's Royal Signatures"
                        : selectedCategory !== 'All'
                        ? `${selectedCategory} Specials`
                        : 'Search Results'}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('menu')}
                    className="text-[12px] font-bold text-[#F3C669] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Menu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {homeDishes.length === 0 ? (
                  <div className="p-6 rounded-[22px] bg-[#1C0D2C] border border-[#F3C669]/20 text-center">
                    <p className="text-sm font-bold text-[#FFF8F0]">No matching dishes found</p>
                    <p className="text-xs text-[#A89CB2] mt-1">
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
                      className="mt-3 h-8 px-4 rounded-full bg-[#E89223] text-[#140A20] text-xs font-bold cursor-pointer"
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
                          className="w-[172px] shrink-0 bg-[#1B0D2A]/90 backdrop-blur-md rounded-[22px] p-3 border border-[#F3C669]/20 flex flex-col justify-between cursor-pointer hover:border-[#F3C669]/50 shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-all"
                        >
                          <div>
                            {/* Top Badge + Heart */}
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
                                className="w-7 h-7 rounded-full bg-[#241038] border border-[#F3C669]/20 flex items-center justify-center cursor-pointer"
                                aria-label="Favorite dish"
                              >
                                <Heart
                                  className={`w-3.5 h-3.5 transition-colors ${
                                    isFav ? 'fill-[#EF4444] text-[#EF4444]' : 'text-[#8E7E98]'
                                  }`}
                                />
                              </button>
                            </div>

                            {/* Food Image */}
                            <div className="relative mb-2.5 rounded-[16px] overflow-hidden border border-[#F3C669]/25">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={dish.image}
                                alt={dish.name}
                                onError={(e) => {
                                  e.currentTarget.src = FALLBACK_FOOD_IMG
                                }}
                                className="h-[104px] w-full object-cover"
                                loading="lazy"
                              />
                            </div>

                            {/* Dish Title & Description */}
                            <h3 className="text-[13.5px] font-bold text-[#FFF8F0] truncate leading-snug">
                              {dish.name}
                            </h3>
                            <p className="text-[10.5px] text-[#A89CB2] line-clamp-1 mt-0.5">
                              {dish.description}
                            </p>

                            {/* Rating + FSSAI */}
                            <div className="flex items-center justify-between mt-1.5">
                              <div className="flex items-center gap-1 text-[11px] font-bold text-[#F3C669] tnum">
                                <Star className="w-3.5 h-3.5 fill-[#E89223] text-[#E89223]" />
                                <span>{dish.rating}</span>
                                <span className="text-[#8E7E98] font-medium">({dish.ratingCount})</span>
                              </div>
                              <FssaiDot veg={dish.veg} />
                            </div>
                          </div>

                          {/* Price + Stepper Button */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-3 pt-1.5 border-t border-[#F3C669]/15 flex items-center justify-between"
                          >
                            <span className="text-[15px] font-extrabold text-[#F3C669] tnum">
                              ₹{dish.price}
                            </span>

                            {qty === 0 ? (
                              <button
                                type="button"
                                onClick={() =>
                                  dish.customizable ? openCustomization(dish) : quickAddDish(dish)
                                }
                                className="h-7 px-3 rounded-full bg-gradient-to-r from-[#E89223] to-[#F3C669] text-[#140A20] text-[11px] font-extrabold inline-flex items-center gap-1 shadow-[0_4px_12px_rgba(232,146,35,0.35)] cursor-pointer hover:brightness-110"
                                aria-label={`Add ${dish.name}`}
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                <span>ADD</span>
                              </button>
                            ) : (
                              <div className="h-7 px-2 rounded-full bg-gradient-to-r from-[#E89223] to-[#F3C669] text-[#140A20] inline-flex items-center gap-2 text-xs font-extrabold tnum shadow-[0_4px_12px_rgba(232,146,35,0.3)]">
                                <button
                                  type="button"
                                  onClick={() => quickDecrementDish(dish.id)}
                                  className="cursor-pointer"
                                  aria-label="Decrease"
                                >
                                  <Minus className="w-3 h-3 stroke-[3]" />
                                </button>
                                <span>{qty}</span>
                                <button
                                  type="button"
                                  onClick={() => quickAddDish(dish)}
                                  className="cursor-pointer"
                                  aria-label="Increase"
                                >
                                  <Plus className="w-3 h-3 stroke-[3]" />
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

              {/* 6. PM Zaika Royal Pass Card Feature */}
              <RoyalPassCard
                royalPoints={royalPoints}
                selectedTable={selectedTable}
                onRedeem={handleRedeemRoyalPoints}
              />
            </div>
          )}

          {/* ---------------------------------------------------------------
              TAB 2: FULL CATEGORIZED MENU (MATCHES MENU IMAGES 1 & 8)
             --------------------------------------------------------------- */}
          {activeTab === 'menu' && (
            <div className="pb-4">
              {/* Sticky Menu Search & Filter Header */}
              <div className="sticky top-0 z-20 bg-[#140A20]/95 backdrop-blur-xl px-4 pt-4 pb-3 border-b border-[#F3C669]/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h1
                      className="text-[20px] font-extrabold text-[#FFF8F0] leading-tight uppercase"
                      style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                    >
                      Dastarkhwan Menu
                    </h1>
                    <p className="text-[11px] font-medium text-[#C8BCCF] tnum">
                      {selectedTable} • {totalMenuResults} authentic dishes
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTableModalOpen(true)}
                    className="h-8 px-3 rounded-full bg-[#241038] border border-[#F3C669]/35 text-[11.5px] font-bold text-[#F3C669] inline-flex items-center gap-1 cursor-pointer tnum"
                  >
                    <span>{selectedTable}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#F3C669]" />
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[#F3C669] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search soups, biryani, tandoor, rolls..."
                    className="w-full h-11 rounded-full bg-[#1F0E31] border border-[#F3C669]/25 shadow-[0_4px_14px_rgba(0,0,0,0.3)] pl-10 pr-9 text-[13px] font-medium text-[#FFF8F0] placeholder-[#8E7E98] focus:outline-none focus:ring-2 focus:ring-[#F3C669]/40"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E7E98] hover:text-[#FFF8F0] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Dietary Filter Pills (All Dishes, Pure Veg, Non-Veg, Specials) */}
                <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => {
                      setVegOnly(false)
                      setNonVegOnly(false)
                      setBestsellersOnly(false)
                      setUnder250(false)
                    }}
                    className={`h-8 px-3.5 rounded-full text-[11.5px] font-extrabold whitespace-nowrap cursor-pointer transition-colors ${
                      !vegOnly && !nonVegOnly && !bestsellersOnly
                        ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3C669] to-[#D48016] text-[#140A20] shadow-[0_4px_14px_rgba(243,198,105,0.3)]'
                        : 'bg-[#221034] text-[#C8BCCF] border border-[#F3C669]/20'
                    }`}
                  >
                    All Dishes
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVegOnly((v) => !v)
                      if (!vegOnly) setNonVegOnly(false)
                    }}
                    className={`h-8 px-3 rounded-full text-[11.5px] font-bold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                      vegOnly
                        ? 'bg-[#15803D] text-white border border-[#22C55E]'
                        : 'bg-[#221034] text-[#C8BCCF] border border-[#22C55E]/40'
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
                        ? 'bg-[#DC2626] text-white border border-[#EF4444]'
                        : 'bg-[#221034] text-[#C8BCCF] border border-[#EF4444]/40'
                    }`}
                  >
                    <FssaiDot veg={false} />
                    <span>Non-Veg</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBestsellersOnly((v) => !v)}
                    className={`h-8 px-3.5 rounded-full text-[11.5px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
                      bestsellersOnly
                        ? 'bg-[#E89223] text-[#140A20] font-extrabold'
                        : 'bg-[#221034] text-[#F3C669] border border-[#F3C669]/30'
                    }`}
                  >
                    ★ Specials
                  </button>

                  <button
                    type="button"
                    onClick={() => setUnder250((v) => !v)}
                    className={`h-8 px-3 rounded-full text-[11.5px] font-bold whitespace-nowrap cursor-pointer transition-colors tnum ${
                      under250
                        ? 'bg-[#F3C669] text-[#140A20] font-extrabold'
                        : 'bg-[#221034] text-[#C8BCCF] border border-[#F3C669]/20'
                    }`}
                  >
                    Under ₹250
                  </button>
                </div>
              </div>

              {/* Categorized Menu Sections with Authentic Gold Foil Ribbons */}
              <div className="px-4 pt-2 space-y-4">
                {MENU_GROUPS.map((group) => {
                  const dishes = menuGroupedDishes[group] || []
                  if (dishes.length === 0) return null

                  return (
                    <section key={group} className="pt-2">
                      {/* PM Zaika Iconic Gold Ribbon Header */}
                      <ZaikaCategoryRibbon name={group} />

                      {/* Dishes List (Matches Image 8 Layout) */}
                      <div className="space-y-3">
                        {dishes.map((dish) => {
                          const qty = getDishQty(dish.id)
                          return (
                            <article
                              key={dish.id}
                              onClick={() => openCustomization(dish)}
                              className="bg-[#1C0D2C]/90 backdrop-blur-md rounded-[22px] p-3.5 border border-[#F3C669]/20 hover:border-[#F3C669]/50 shadow-[0_8px_24px_rgba(0,0,0,0.4)] flex items-center justify-between gap-3 cursor-pointer transition-all"
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

                                <h3 className="text-[14.5px] font-bold text-[#FFF8F0] leading-snug">
                                  {dish.name}
                                </h3>

                                <div className="flex items-center gap-2 mt-1 tnum">
                                  <span className="text-[15px] font-extrabold text-[#F3C669]">
                                    ₹{dish.price}
                                  </span>
                                  {dish.halfPrice && (
                                    <span className="text-[11px] text-[#A89CB2]">
                                      (Half ₹{dish.halfPrice})
                                    </span>
                                  )}
                                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#F3C669]">
                                    <Star className="w-3 h-3 fill-[#E89223] text-[#E89223]" />
                                    {dish.rating}
                                  </span>
                                </div>

                                <p className="text-[11px] text-[#C8BCCF] line-clamp-2 mt-1 leading-relaxed">
                                  {dish.description}
                                </p>
                              </div>

                              {/* Right Image + Add Stepper */}
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="flex flex-col items-center shrink-0"
                              >
                                <div className="relative w-[88px] h-[88px]">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={dish.image}
                                    alt={dish.name}
                                    onClick={() => openCustomization(dish)}
                                    onError={(e) => {
                                      e.currentTarget.src = FALLBACK_FOOD_IMG
                                    }}
                                    className="w-full h-full rounded-[16px] object-cover cursor-pointer border border-[#F3C669]/25 shadow-md"
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
                                        className="h-7 px-3.5 rounded-full bg-gradient-to-r from-[#E89223] to-[#F3C669] text-[#140A20] text-[11px] font-extrabold shadow-md cursor-pointer hover:brightness-110 whitespace-nowrap"
                                      >
                                        + ADD
                                      </button>
                                    ) : (
                                      <div className="h-7 px-2 rounded-full bg-gradient-to-r from-[#E89223] to-[#F3C669] text-[#140A20] inline-flex items-center gap-2 text-[11.5px] font-extrabold shadow-md tnum">
                                        <button
                                          type="button"
                                          onClick={() => quickDecrementDish(dish.id)}
                                          className="cursor-pointer"
                                          aria-label="Decrease"
                                        >
                                          <Minus className="w-3 h-3 stroke-[3]" />
                                        </button>
                                        <span>{qty}</span>
                                        <button
                                          type="button"
                                          onClick={() => quickAddDish(dish)}
                                          className="cursor-pointer"
                                          aria-label="Increase"
                                        >
                                          <Plus className="w-3 h-3 stroke-[3]" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {dish.customizable && (
                                  <span className="text-[9.5px] font-semibold text-[#F3C669] mt-3.5">
                                    Customizable
                                  </span>
                                )}
                              </div>
                            </article>
                          )
                        })}
                      </div>
                    </section>
                  )
                })}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------
              TAB 3: OFFERS & ROYAL PRIVILEGES
             --------------------------------------------------------------- */}
          {activeTab === 'offers' && (
            <div className="px-4 pt-5 space-y-5">
              <div>
                <h1
                  className="text-[21px] font-extrabold text-[#FFF8F0] uppercase tracking-wide"
                  style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                >
                  Royal Offers &amp; Privileges
                </h1>
                <p className="text-xs font-medium text-[#C8BCCF] mt-0.5">
                  Exclusive PM Zaika dine-in privileges &amp; celebratory coupons
                </p>
              </div>

              {/* Centerpiece Metallic PM Zaika Royal Pass Card */}
              <RoyalPassCard
                royalPoints={royalPoints}
                selectedTable={selectedTable}
                onRedeem={handleRedeemRoyalPoints}
              />

              {/* Coupons List */}
              <section className="space-y-3">
                <h2
                  className="text-[15px] font-extrabold text-[#F3C669] uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                >
                  Available Coupons
                </h2>
                {COUPONS.map((c) => {
                  const isApplied = appliedCouponCode === c.code
                  return (
                    <div
                      key={c.code}
                      className="rounded-[22px] bg-[#1C0D2C]/90 border border-[#F3C669]/25 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.4)] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#F3C669]/15 border border-[#F3C669]/40 text-[#F3C669] text-[11px] font-extrabold tracking-wider tnum">
                            {c.code}
                          </span>
                          <span className="text-[9.5px] font-extrabold uppercase text-[#E89223]">
                            {c.badge}
                          </span>
                        </div>
                        <h3 className="text-[14.5px] font-bold text-[#FFF8F0] mt-1.5">
                          {c.title}
                        </h3>
                        <p className="text-[11.5px] text-[#C8BCCF] mt-0.5">
                          {c.subtitle}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (isApplied) {
                            setAppliedCouponCode(null)
                            showToast(`Removed ${c.code}`)
                          } else {
                            handleApplyCouponCode(c.code)
                          }
                        }}
                        className={`shrink-0 h-9 px-4 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                          isApplied
                            ? 'bg-[#15803D] text-white border border-[#22C55E]'
                            : 'bg-gradient-to-r from-[#E89223] to-[#F3C669] text-[#140A20] font-extrabold'
                        }`}
                      >
                        {isApplied ? 'Applied ✓' : 'Apply'}
                      </button>
                    </div>
                  )
                })}
              </section>
            </div>
          )}

          {/* ---------------------------------------------------------------
              TAB 4: INFO / CONCIERGE HUB (RESTAURANT DETAILS & ASSISTANCE)
             --------------------------------------------------------------- */}
          {activeTab === 'hub' && (
            <div className="px-4 pt-5 space-y-4">
              {/* Brand Card with Lotus-Ring Framed Royal Crest */}
              <section className="rounded-[24px] bg-[#1C0D2C]/90 border border-[#F3C669]/25 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.4)] flex items-center gap-3.5">
                <PmZaikaCrest />
                <div className="min-w-0">
                  <h1
                    className="text-[17px] font-extrabold text-[#FFF8F0] leading-tight"
                    style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                  >
                    PM ZAIKA RESTAURANT
                  </h1>
                  <p className="text-[11px] font-medium text-[#C8BCCF] mt-0.5">
                    Indian • Chinese • Tandoor • Rolls
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#FFF8F0] tnum">
                    <span className="inline-flex items-center gap-0.5 text-[#F3C669]">
                      4.8 <Star className="w-3.5 h-3.5 fill-[#E89223] text-[#E89223]" />
                    </span>
                    <span className="text-[#F3C669]/40">•</span>
                    <span className="text-[#C8BCCF]">1.2K+ verified ratings</span>
                  </div>
                </div>
              </section>

              {/* Compact Metallic Royal Pass Preview */}
              <RoyalPassCard
                royalPoints={royalPoints}
                selectedTable={selectedTable}
                onRedeem={handleRedeemRoyalPoints}
                compact
              />

              {/* Contact & Orders Card */}
              <section className="rounded-[22px] bg-[#1C0D2C]/90 border border-[#F3C669]/25 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.4)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F3C669]">
                    Restaurant Helplines &amp; Inquiries
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E89223]/20 border border-[#F3C669]/40 text-[#F3C669] text-[9.5px] font-bold">
                    Official Support
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div>
                    <a
                      href="tel:+917488260572"
                      className="text-[16px] font-extrabold text-[#FFF8F0] hover:text-[#F3C669] tnum"
                    >
                      +91 74882 60572
                    </a>
                    <p className="text-[11px] text-[#A89CB2] mt-0.5 tnum">
                      Secondary Helpline: 95257 48843
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="h-9 px-3 rounded-xl bg-[#241038] border border-[#F3C669]/30 hover:bg-[#341750] text-[#F3C669] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      {phoneCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                          <span className="text-[#22C55E]">Copied!</span>
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
                      className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-[#E89223] to-[#F3C669] text-[#140A20] text-xs font-extrabold inline-flex items-center gap-1.5 hover:brightness-110 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              </section>

              {/* Location Card */}
              <section className="rounded-[22px] bg-[#1C0D2C]/90 border border-[#F3C669]/25 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.4)] flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#241038] border border-[#F3C669]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#F3C669]" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-[13px] font-bold text-[#FFF8F0]">
                      Phulwari Sharif, Patna
                    </h2>
                    <p className="text-[11px] text-[#C8BCCF] leading-relaxed mt-0.5">
                      Phulwari Rd, Near Shaheed Bhagat Singh Chowk, Birla Colony, Phulwari Sharif, Patna, Bihar 801505
                    </p>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Phulwari+Rd+Near+Shaheed+Bhagat+Singh+Chowk+Birla+Colony+Phulwari+Sharif+Patna+Bihar+801505"
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 h-8 px-3 rounded-full bg-[#241038] hover:bg-[#F3C669] text-[#F3C669] hover:text-[#140A20] border border-[#F3C669]/40 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
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
                className="w-full rounded-[22px] bg-gradient-to-r from-[#2A103D] to-[#1F0A2E] border border-[#F3C669]/30 p-4 text-left text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)] flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E89223] to-[#F3C669] text-[#140A20] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[14px] font-extrabold leading-tight text-[#FFF8F0]">
                      Review &amp; Share Feedback
                    </span>
                    <span className="block text-[11px] text-[#F3C669] mt-0.5">
                      5 quick questions • Takes ~30 sec • +50 Royal Pts
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#F3C669] shrink-0" />
              </button>

              {/* Admin Direct Complaint Card */}
              <button
                type="button"
                onClick={() => setComplaintOpen(true)}
                className="w-full rounded-[22px] bg-[#2A0E18] border border-[#EF4444]/35 hover:bg-[#34121F] p-4 text-left flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#4A1824] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13px] font-bold text-[#FCA5A5]">
                        Have an Issue or Complaint?
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#DC2626] text-white text-[9px] font-extrabold uppercase tracking-wider">
                        Admin Direct
                      </span>
                    </div>
                    <span className="block text-[11px] text-[#F87171] mt-0.5">
                      Contact manager directly or register a table service ticket
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#EF4444] shrink-0" />
              </button>
            </div>
          )}
        </main>

        {/* =================================================================
            5-SLOT DOCKED BOTTOM NAVIGATION DOCK WITH FLOATING CENTER ORDER FAB
           ================================================================= */}
        <nav
          aria-label="Primary Navigation"
          className="absolute bottom-0 left-0 right-0 z-30 h-[74px] bg-[#140A20]/95 backdrop-blur-2xl rounded-t-[28px] border-t border-[#F3C669]/30 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] px-3 grid grid-cols-5 items-center"
        >
          {/* Slot 1: Home */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <Home
              className={`w-[20px] h-[20px] transition-colors ${
                activeTab === 'home' ? 'text-[#F3C669] stroke-[2.6]' : 'text-[#8E7E98]'
              }`}
            />
            <span
              className={`text-[10px] ${
                activeTab === 'home'
                  ? 'font-extrabold text-[#F3C669]'
                  : 'font-semibold text-[#8E7E98]'
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
              className={`w-[20px] h-[20px] transition-colors ${
                activeTab === 'menu' ? 'text-[#F3C669] stroke-[2.6]' : 'text-[#8E7E98]'
              }`}
            />
            <span
              className={`text-[10px] ${
                activeTab === 'menu'
                  ? 'font-extrabold text-[#F3C669]'
                  : 'font-semibold text-[#8E7E98]'
              }`}
            >
              Menu
            </span>
          </button>

          {/* Slot 3: Center Floating Elevated Order Button with Etched Mandala Bezel */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="relative -mt-7 w-[72px] h-[72px] flex items-center justify-center">
              <ArchitecturalMandalaSvg
                className="absolute inset-0 w-full h-full opacity-80"
                strokeColor="#F3C669"
                accentColor="#E89223"
                strokeWidth={1.5}
              />
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="w-[60px] h-[60px] rounded-full bg-gradient-to-tr from-[#E89223] via-[#F3C669] to-[#D48016] text-[#140A20] shadow-[0_10px_24px_rgba(232,146,35,0.45)] border-[3px] border-[#140A20] flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95 relative z-10 hover:brightness-110"
                aria-label="Open Cart & Order"
              >
                <ShoppingBag className="w-[19px] h-[19px] stroke-[2.5]" />
                <span className="text-[9px] font-black mt-0.5 leading-none tracking-tight">ORDER</span>
                {cartSummary.itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] px-1 rounded-full bg-[#140A20] text-[#F3C669] text-[9.5px] font-extrabold flex items-center justify-center border-2 border-[#F3C669] tnum">
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
              className={`w-[20px] h-[20px] transition-colors ${
                activeTab === 'offers' ? 'text-[#F3C669] stroke-[2.6]' : 'text-[#8E7E98]'
              }`}
            />
            <span
              className={`text-[10px] ${
                activeTab === 'offers'
                  ? 'font-extrabold text-[#F3C669]'
                  : 'font-semibold text-[#8E7E98]'
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
              className={`w-[20px] h-[20px] transition-colors ${
                activeTab === 'hub' ? 'text-[#F3C669] stroke-[2.6]' : 'text-[#8E7E98]'
              }`}
            />
            <span
              className={`text-[10px] ${
                activeTab === 'hub'
                  ? 'font-extrabold text-[#F3C669]'
                  : 'font-semibold text-[#8E7E98]'
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
            className="absolute inset-0 z-50 bg-black/75 backdrop-blur-[4px] flex items-end"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[32px] bg-[#180C26] border-t border-[#F3C669]/35 p-5 shadow-2xl animate-in slide-in-from-bottom duration-250 text-[#FFF8F0]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F3C669]/20">
                <div>
                  <h3
                    className="text-[17px] font-extrabold text-[#FFF8F0]"
                    style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                  >
                    Select Dining Table
                  </h3>
                  <p className="text-xs text-[#C8BCCF]">
                    Choose your table number or takeaway pickup
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTableModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#241038] border border-[#F3C669]/30 flex items-center justify-center text-[#F3C669] cursor-pointer"
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
                    className={`py-3 rounded-2xl text-xs font-bold tnum cursor-pointer transition-colors border ${
                      selectedTable === tbl
                        ? 'bg-gradient-to-r from-[#E89223] to-[#F3C669] text-[#140A20] border-[#F3C669] font-black shadow-md'
                        : 'bg-[#221034] text-[#FFF8F0] border-[#F3C669]/20 hover:bg-[#2B1444]'
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
            className="absolute inset-0 z-50 bg-black/75 backdrop-blur-[4px] flex items-end"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[32px] bg-[#180C26] border-t border-[#F3C669]/35 p-5 shadow-2xl animate-in slide-in-from-bottom duration-250 text-[#FFF8F0]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F3C669]/20">
                <h3
                  className="text-[17px] font-extrabold text-[#FFF8F0]"
                  style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                >
                  Filter Menu Dishes
                </h3>
                <button
                  type="button"
                  onClick={() => setFilterSheetOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#241038] border border-[#F3C669]/30 flex items-center justify-center text-[#F3C669] cursor-pointer"
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
                    label: 'Bestsellers & Chef Signatures',
                    active: bestsellersOnly,
                    toggle: () => setBestsellersOnly((v) => !v),
                  },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={opt.toggle}
                    className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between text-[13px] font-bold cursor-pointer transition-colors border ${
                      opt.active
                        ? 'bg-[#2B1444] border-[#F3C669] text-[#F3C669]'
                        : 'bg-[#221034] border-[#F3C669]/20 text-[#FFF8F0]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        opt.active ? 'bg-[#F3C669] text-[#140A20]' : 'border border-[#8E7E98]'
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
                  className="h-11 rounded-full bg-[#241038] border border-[#F3C669]/30 text-[#F3C669] text-xs font-extrabold cursor-pointer hover:bg-[#31164C]"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSheetOpen(false)}
                  className="h-11 rounded-full bg-gradient-to-r from-[#E89223] to-[#F3C669] text-[#140A20] text-xs font-black cursor-pointer hover:brightness-110"
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
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-[4px] flex items-end"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[32px] bg-[#180C26] border-t border-[#F3C669]/35 max-h-[88%] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-250 text-[#FFF8F0]"
            >
              {/* Dish Hero Photo */}
              <div className="relative h-[180px] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={customDish.image}
                  alt={customDish.name}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_FOOD_IMG
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#180C26] via-[#180C26]/60 to-transparent" />
                <button
                  type="button"
                  onClick={() => setCustomDish(null)}
                  className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-[#180C26]/80 border border-[#F3C669]/40 text-[#F3C669] flex items-center justify-center shadow-md cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-2">
                    <FssaiDot veg={customDish.veg} />
                    <span className="text-xs font-bold inline-flex items-center gap-1 tnum text-[#F3C669]">
                      <Star className="w-3.5 h-3.5 fill-[#E89223] text-[#E89223]" />
                      {customDish.rating} ({customDish.ratingCount})
                    </span>
                  </div>
                  <h3
                    className="text-[19px] font-extrabold mt-0.5 leading-tight text-[#FFF8F0]"
                    style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                  >
                    {customDish.name}
                  </h3>
                </div>
              </div>

              {/* Scrollable Customization Options */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                <p className="text-xs text-[#C8BCCF] leading-relaxed">
                  {customDish.description}
                </p>

                {/* Portion Size Toggle */}
                {customDish.halfPrice && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-extrabold text-[#FFF8F0]">
                        Choose Portion
                      </span>
                      <span className="text-[10px] font-bold text-[#F3C669]">Required</span>
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
                              ? 'bg-[#2B1444] border-[#F3C669] text-[#F3C669]'
                              : 'bg-[#221034] border-[#F3C669]/20 text-[#C8BCCF]'
                          }`}
                        >
                          <span className="text-xs font-bold">{opt.label}</span>
                          <span className="text-xs font-extrabold tnum">₹{opt.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spice Preference */}
                <div>
                  <span className="block text-[13px] font-extrabold text-[#FFF8F0] mb-2">
                    Spice Preference
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Mild', 'Medium Awadhi', 'Royal Spicy'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setCustomSpice(level)}
                        className={`py-2.5 px-2 rounded-2xl border text-[11px] font-bold inline-flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                          customSpice === level
                            ? 'bg-[#2B1444] border-[#F3C669] text-[#F3C669]'
                            : 'bg-[#221034] border-[#F3C669]/20 text-[#A89CB2]'
                        }`}
                      >
                        {level === 'Royal Spicy' && <Flame className="w-3 h-3 text-[#E89223]" />}
                        <span>{level}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recommended Add-ons */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-extrabold text-[#FFF8F0]">
                      Chef Add-ons
                    </span>
                    <span className="text-[10px] font-medium text-[#A89CB2]">Optional</span>
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
                              ? 'bg-[#2B1444] border-[#F3C669] text-[#F3C669]'
                              : 'bg-[#221034] border-[#F3C669]/20 text-[#C8BCCF]'
                          }`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <FssaiDot veg={addon.veg} />
                            <span>{addon.name}</span>
                          </span>
                          <span className="tnum text-[#F3C669] font-extrabold">+₹{addon.price}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <span className="block text-[13px] font-extrabold text-[#FFF8F0] mb-1.5">
                    Cooking Instructions
                  </span>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="e.g. Less oil, extra mint chutney, serve hot..."
                    className="w-full h-10 px-3.5 rounded-2xl bg-[#221034] border border-[#F3C669]/25 text-xs font-medium text-[#FFF8F0] placeholder-[#8E7E98] focus:outline-none focus:ring-2 focus:ring-[#F3C669]/40"
                  />
                </div>
              </div>

              {/* Sticky Add Button */}
              <div className="p-4 border-t border-[#F3C669]/20 bg-[#180C26]">
                <button
                  type="button"
                  onClick={confirmCustomizationAdd}
                  className="w-full h-12 rounded-full bg-gradient-to-r from-[#E89223] via-[#F3C669] to-[#D48016] text-[#140A20] text-[14px] font-black shadow-[0_8px_24px_rgba(232,146,35,0.4)] cursor-pointer transition-all hover:brightness-110 tnum"
                >
                  Add to Order — ₹{customTotalUnit}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            MODAL 4: ORDER BAG, CHECKOUT & LIVE KITCHEN ORDER TRACKER
           ================================================================= */}
        {cartOpen && (
          <div
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-[4px] flex items-end"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[32px] bg-[#180C26] border-t border-[#F3C669]/35 max-h-[90%] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-250 text-[#FFF8F0]"
            >
              {/* Header */}
              <div className="px-5 py-4 bg-[#1F0E31] border-b border-[#F3C669]/20 flex items-center justify-between">
                <div>
                  <h3
                    className="text-[17px] font-extrabold text-[#FFF8F0]"
                    style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                  >
                    {liveOrder && cartSummary.itemCount === 0
                      ? 'Live Kitchen Tracker'
                      : 'Your Table Order'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setTableModalOpen(true)}
                    className="text-[11.5px] font-bold text-[#F3C669] inline-flex items-center gap-1 mt-0.5 cursor-pointer tnum"
                  >
                    <span>{selectedTable} • {selectedTable === 'Takeaway' ? 'Pickup' : 'Dine-In'}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#F3C669]" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#241038] border border-[#F3C669]/30 flex items-center justify-center text-[#F3C669] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Live Kitchen Order Tracker State */}
              {liveOrder && cartSummary.itemCount === 0 ? (
                <div className="p-5 space-y-5 overflow-y-auto no-scrollbar">
                  {/* Rotating Mandala Royal Kitchen Seal */}
                  <div className="rounded-[24px] bg-gradient-to-br from-[#260E3A] via-[#381456] to-[#1A082B] p-5 text-white text-center relative overflow-hidden border border-[#F3C669]/30 shadow-2xl">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-[#F3C669]/30 text-[10.5px] font-bold text-[#FDEBD3] tnum">
                      Order #{liveOrder.id} • {liveOrder.table}
                    </span>

                    {/* Rotating Seal */}
                    <div className="relative w-[130px] h-[130px] mx-auto my-4 flex items-center justify-center">
                      <ArchitecturalMandalaSvg
                        className="absolute inset-0 w-full h-full opacity-75 animate-[spin_28s_linear_infinite]"
                        strokeColor="#F3C669"
                        accentColor="#E89223"
                        strokeWidth={1.3}
                      />
                      <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#E89223] to-[#D48016] text-[#140A20] flex items-center justify-center shadow-[0_0_24px_rgba(232,146,35,0.5)] relative z-10 border-2 border-[#F3C669]">
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
                    <h4
                      className="text-[19px] font-extrabold mt-1 text-[#FFF8F0]"
                      style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                    >
                      {liveOrder.stage === 0
                        ? 'Preparing in Tandoor'
                        : liveOrder.stage === 1
                        ? 'Plating & Saffron Garnish'
                        : 'Ready to Serve to Table'}
                    </h4>
                    <GoldHairline className="my-3 max-w-[170px] mx-auto" />
                    <p className="text-xs text-[#C8BCCF] tnum">
                      {liveOrder.itemsCount} {liveOrder.itemsCount === 1 ? 'item' : 'items'} • Grand Total ₹{liveOrder.total}
                    </p>
                  </div>

                  {/* 3-Step Visual Progress Tracker */}
                  <div className="rounded-[22px] bg-[#221034] border border-[#F3C669]/25 p-4 space-y-4">
                    {[
                      {
                        step: 0,
                        title: 'Tandoor & Dum Cooking',
                        desc: 'Chef is freshly preparing your dishes with royal Awadhi spices',
                      },
                      {
                        step: 1,
                        title: 'Plating & Garnish',
                        desc: 'Finishing with saffron, fried onions, and churned desi ghee',
                      },
                      {
                        step: 2,
                        title: 'Served to Your Table',
                        desc: `Steward is delivering piping hot to ${liveOrder.table}`,
                      },
                    ].map((st) => {
                      const isComplete = liveOrder.stage >= st.step
                      return (
                        <div key={st.step} className="flex items-start gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                              isComplete
                                ? 'bg-[#F3C669] text-[#140A20] border-[#F3C669]'
                                : 'bg-[#180C26] text-[#8E7E98] border-[#8E7E98]/30'
                            }`}
                          >
                            {isComplete ? <Check className="w-4 h-4 stroke-[3]" /> : st.step + 1}
                          </div>
                          <div>
                            <p
                              className={`text-xs font-bold ${
                                isComplete ? 'text-[#FFF8F0]' : 'text-[#8E7E98]'
                              }`}
                            >
                              {st.title}
                            </p>
                            <p className="text-[11px] text-[#A89CB2] mt-0.5">{st.desc}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleRingSteward}
                      className="h-11 rounded-full bg-[#241038] border border-[#F3C669]/30 text-[#F3C669] text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#31164C]"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Call Steward</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLiveOrder(null)}
                      className="h-11 rounded-full bg-[#241038] border border-[#F3C669]/30 text-[#FFF8F0] text-xs font-bold cursor-pointer hover:bg-[#31164C]"
                    >
                      Order More Dishes
                    </button>
                  </div>
                </div>
              ) : cartSummary.itemCount === 0 ? (
                /* Empty Cart */
                <div className="py-12 px-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#241038] border border-[#F3C669]/30 text-[#F3C669] flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4
                    className="text-[17px] font-extrabold text-[#FFF8F0]"
                    style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                  >
                    Your Order Bag is Empty
                  </h4>
                  <p className="text-xs text-[#A89CB2] max-w-[240px] mx-auto">
                    Explore our Awadhi handi biryani, tandoori starters, and signature mains.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCartOpen(false)
                      setActiveTab('menu')
                    }}
                    className="h-10 px-6 rounded-full bg-gradient-to-r from-[#E89223] to-[#F3C669] text-[#140A20] text-xs font-black cursor-pointer hover:brightness-110"
                  >
                    Explore Full Menu
                  </button>
                </div>
              ) : (
                /* Active Cart Review */
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                    {/* Item Entries */}
                    <div className="space-y-2.5">
                      {cartSummary.entries.map((entry) => (
                        <div
                          key={entry.key}
                          className="p-3 rounded-2xl bg-[#221034] border border-[#F3C669]/20 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <FssaiDot veg={entry.dish.veg} />
                              <h4 className="text-[13.5px] font-bold text-[#FFF8F0] truncate">
                                {entry.dish.name}
                              </h4>
                            </div>
                            <p className="text-[11px] text-[#A89CB2] mt-0.5">
                              {entry.portion}
                              {entry.spice !== 'Medium' && ` • ${entry.spice}`}
                              {entry.addons.length > 0 && ` • +${entry.addons.join(', ')}`}
                            </p>
                            <span className="text-xs font-extrabold text-[#F3C669] tnum mt-0.5 block">
                              ₹{entry.unitPrice * entry.qty}
                            </span>
                          </div>

                          {/* Stepper */}
                          <div className="h-7 px-2 rounded-full bg-gradient-to-r from-[#E89223] to-[#F3C669] text-[#140A20] inline-flex items-center gap-2 text-xs font-extrabold shadow-sm tnum shrink-0">
                            <button
                              type="button"
                              onClick={() => updateCartQty(entry.key, -1)}
                              className="cursor-pointer"
                              aria-label="Decrease"
                            >
                              <Minus className="w-3 h-3 stroke-[3]" />
                            </button>
                            <span>{entry.qty}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(entry.key, 1)}
                              className="cursor-pointer"
                              aria-label="Increase"
                            >
                              <Plus className="w-3 h-3 stroke-[3]" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cooking Notes */}
                    <div className="pt-1">
                      <span className="block text-[12px] font-bold text-[#FFF8F0] mb-1">
                        Kitchen Cooking Notes
                      </span>
                      <input
                        type="text"
                        value={cookingNotes}
                        onChange={(e) => setCookingNotes(e.target.value)}
                        placeholder="e.g. Serve biryani first, bring extra cutlery..."
                        className="w-full h-10 px-3.5 rounded-2xl bg-[#221034] border border-[#F3C669]/20 text-xs font-medium text-[#FFF8F0] placeholder-[#8E7E98] focus:outline-none focus:ring-2 focus:ring-[#F3C669]/40"
                      />
                    </div>

                    {/* Coupon Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter Coupon (e.g. ZAIKA25)"
                        className="flex-1 h-10 px-3.5 rounded-2xl bg-[#221034] border border-[#F3C669]/20 text-xs font-bold uppercase text-[#FFF8F0] placeholder-[#8E7E98] focus:outline-none focus:ring-2 focus:ring-[#F3C669]/40"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCouponCode(couponInput)}
                        className="h-10 px-4 rounded-2xl bg-[#241038] border border-[#F3C669]/40 text-[#F3C669] text-xs font-extrabold cursor-pointer hover:bg-[#341750]"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Royal Points Redeem Toggle */}
                    {royalPoints >= 50 && (
                      <button
                        type="button"
                        onClick={() => setRedeemPoints((r) => !r)}
                        className={`w-full p-3 rounded-2xl flex items-center justify-between text-left cursor-pointer transition-colors border ${
                          redeemPoints
                            ? 'bg-[#2B1444] border-[#F3C669]'
                            : 'bg-[#221034] border-[#F3C669]/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Award className="w-4 h-4 text-[#F3C669]" />
                          <div>
                            <p className="text-xs font-bold text-[#FFF8F0]">
                              Redeem 50 Royal Points (₹50 OFF)
                            </p>
                            <p className="text-[10px] text-[#A89CB2] tnum">
                              Balance: {royalPoints} PTS
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[11px] font-extrabold ${
                            redeemPoints ? 'text-[#F3C669]' : 'text-[#E89223]'
                          }`}
                        >
                          {redeemPoints ? 'Applied ✓' : 'Use'}
                        </span>
                      </button>
                    )}

                    {/* Bill Breakdown */}
                    <div className="rounded-2xl bg-[#221034] border border-[#F3C669]/20 p-4 space-y-2 text-xs tnum">
                      <div className="flex justify-between text-[#C8BCCF]">
                        <span>Subtotal</span>
                        <span className="font-semibold text-[#FFF8F0]">
                          ₹{cartSummary.subtotal}
                        </span>
                      </div>
                      {cartSummary.couponDiscount > 0 && (
                        <div className="flex justify-between text-[#22C55E] font-bold">
                          <span>Coupon Discount ({appliedCouponCode})</span>
                          <span>-₹{cartSummary.couponDiscount}</span>
                        </div>
                      )}
                      {cartSummary.pointsDiscount > 0 && (
                        <div className="flex justify-between text-[#22C55E] font-bold">
                          <span>Royal Rewards Credit</span>
                          <span>-₹{cartSummary.pointsDiscount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[#C8BCCF]">
                        <span>GST (5%)</span>
                        <span className="font-semibold text-[#FFF8F0]">₹{cartSummary.gst}</span>
                      </div>
                      <div className="flex justify-between text-[15px] font-extrabold text-[#FFF8F0] pt-2.5 border-t border-[#F3C669]/20">
                        <span>Grand Total</span>
                        <span className="text-[#F3C669]">₹{cartSummary.grandTotal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Place Table Order Button */}
                  <div className="p-4 bg-[#1F0E31] border-t border-[#F3C669]/20">
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      className="w-full h-12 rounded-full bg-gradient-to-r from-[#E89223] via-[#F3C669] to-[#D48016] text-[#140A20] text-[14px] font-black shadow-[0_10px_26px_rgba(232,146,35,0.45)] cursor-pointer transition-all hover:brightness-110 tnum"
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
            MODAL 5: 5-QUESTION GUEST FEEDBACK (+50 ROYAL PTS)
           ================================================================= */}
        {feedbackOpen && (
          <div
            onClick={() => setFeedbackOpen(false)}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-[4px] flex items-end"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[32px] bg-[#180C26] border-t border-[#F3C669]/35 p-5 max-h-[88%] overflow-y-auto no-scrollbar shadow-2xl animate-in slide-in-from-bottom duration-250 text-[#FFF8F0]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F3C669]/20">
                <div>
                  <h3
                    className="text-[17px] font-extrabold text-[#FFF8F0]"
                    style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                  >
                    Royal Guest Feedback
                  </h3>
                  <p className="text-xs text-[#C8BCCF]">
                    5 quick questions • Earn +50 Royal Points
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFeedbackOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#241038] border border-[#F3C669]/30 flex items-center justify-center text-[#F3C669] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {feedbackDone ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#15803D]/25 border border-[#22C55E]/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
                  </div>
                  <h4
                    className="text-[18px] font-extrabold text-[#FFF8F0]"
                    style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                  >
                    Thank You for Dining With Us!
                  </h4>
                  <p className="text-xs text-[#C8BCCF] max-w-[260px] mx-auto">
                    +50 Royal Points have been credited to your rewards card.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFeedbackOpen(false)}
                    className="h-10 px-7 rounded-full bg-gradient-to-r from-[#E89223] to-[#F3C669] text-[#140A20] text-xs font-black cursor-pointer hover:brightness-110"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {FEEDBACK_QUESTIONS.map((q) => (
                    <div
                      key={q.id}
                      className="px-3.5 py-2.5 rounded-2xl bg-[#221034] border border-[#F3C669]/20 flex items-center justify-between gap-2"
                    >
                      <span className="text-xs font-bold text-[#FFF8F0]">{q.label}</span>
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
                                  ? 'fill-[#F3C669] text-[#F3C669]'
                                  : 'text-[#8E7E98]/40'
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
                    className="w-full p-3.5 rounded-2xl bg-[#221034] border border-[#F3C669]/20 text-xs font-medium text-[#FFF8F0] placeholder-[#8E7E98] focus:outline-none focus:ring-2 focus:ring-[#F3C669]/40"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setFeedbackDone(true)
                      setRoyalPoints((p) => p + 50)
                      setFeedbackComment('')
                      showToast('Feedback submitted! +50 Royal Points earned')
                    }}
                    className="w-full h-12 rounded-full bg-gradient-to-r from-[#E89223] via-[#F3C669] to-[#D48016] text-[#140A20] text-[13.5px] font-black cursor-pointer hover:brightness-110 shadow-lg"
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
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-[4px] flex items-end"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[32px] bg-[#180C26] border-t border-[#EF4444]/40 p-5 shadow-2xl animate-in slide-in-from-bottom duration-250 text-[#FFF8F0]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EF4444]/25">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                  <div>
                    <h3
                      className="text-[16px] font-extrabold text-[#FFF8F0]"
                      style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
                    >
                      Admin Direct Escalation
                    </h3>
                    <p className="text-[11px] text-[#FCA5A5]">
                      Priority assistance for {selectedTable}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setComplaintOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#2A0E18] border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {['Food Quality', 'Order Delay', 'Billing Issue', 'Table Service'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setComplaintCategory(item)}
                      className={`h-8 px-3 rounded-full text-xs font-bold cursor-pointer transition-colors border ${
                        complaintCategory === item
                          ? 'bg-[#DC2626] border-[#EF4444] text-white'
                          : 'bg-[#2A0E18] border-[#EF4444]/30 text-[#FCA5A5]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  value={complaintNote}
                  onChange={(e) => setComplaintNote(e.target.value)}
                  placeholder="Tell us what went wrong so our manager can assist you immediately at your table..."
                  className="w-full p-3.5 rounded-2xl bg-[#221034] border border-[#EF4444]/30 text-xs font-medium text-[#FFF8F0] placeholder-[#8E7E98] focus:outline-none focus:ring-2 focus:ring-[#EF4444]/40"
                />

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <a
                    href="tel:+917488260572"
                    className="h-11 rounded-full bg-[#241038] border border-[#F3C669]/30 text-[#FFF8F0] text-xs font-extrabold inline-flex items-center justify-center gap-1.5 hover:bg-[#31164C]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#F3C669]" />
                    <span>Call Manager</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setComplaintOpen(false)
                      setComplaintNote('')
                      showToast(`Manager alerted for ${selectedTable}.`)
                    }}
                    className="h-11 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-black cursor-pointer shadow-lg"
                  >
                    Register Ticket
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
