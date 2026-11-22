// @ts-nocheck
'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
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
  Crown,
  BookOpen,
  ChevronUp,
  Volume2,
  VolumeX
} from 'lucide-react';
import {
  playAddToCartSound,
  playRemoveFromCartSound,
  playStewardBellSound,
  playOrderPlacedSound,
  playFilterClickSound,
  isSoundEnabled,
  toggleSound
} from '@/lib/ordering/soundEffects';

// --- FALLBACK FOOD IMAGE ---
const FALLBACK_FOOD_IMG =
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80';

// --- AUTHENTIC PM ZAIKA MENU DATA ---
const MENU_ITEMS = [
  {
    id: "mutton-handi-biryani",
    name: "Mutton Handi Biryani",
    category: "Biryani",
    menuGroup: "BIRYANI & RICE",
    veg: false,
    price: 380,
    halfPrice: 220,
    rating: 4.9,
    ratingCount: "1.2K+",
    badge: "BESTSELLER",
    badgeType: "plum",
    popular: true,
    customizable: true,
    description: "Slow-cooked Awadhi mutton layered with saffron basmati in a sealed clay handi.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-dum-biryani",
    name: "Chicken Dum Biryani",
    category: "Biryani",
    menuGroup: "BIRYANI & RICE",
    veg: false,
    price: 290,
    halfPrice: 170,
    rating: 4.8,
    ratingCount: "980+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: true,
    customizable: true,
    description: "Fragrant long-grain basmati slow-steamed with spiced chicken, mint, and fried onions.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "veg-sweet-corn",
    name: "Veg Sweet Corn",
    category: "Soups",
    menuGroup: "SOUP",
    veg: true,
    price: 110,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "599+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Warming savory broth gently simmered with veg sweet corn and fragrant seasonings.",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "sweet-corn-non-veg",
    name: "Sweet Corn (Non Veg)",
    category: "Soups",
    menuGroup: "SOUP",
    veg: false,
    price: 140,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "474+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Warming savory broth gently simmered with sweet corn (non veg) and fragrant seasonings.",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "hot-n-sour-veg",
    name: "Hot N Sour (Veg)",
    category: "Soups",
    menuGroup: "SOUP",
    veg: true,
    price: 110,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "519+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Warming savory broth gently simmered with hot n sour (veg) and fragrant seasonings.",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "hot-n-sour-non-veg",
    name: "Hot N Sour (Non Veg)",
    category: "Soups",
    menuGroup: "SOUP",
    veg: false,
    price: 140,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "875+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Warming savory broth gently simmered with hot n sour (non veg) and fragrant seasonings.",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "veg-manchow",
    name: "Veg Manchow",
    category: "Soups",
    menuGroup: "SOUP",
    veg: true,
    price: 110,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "466+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Warming savory broth gently simmered with veg manchow and fragrant seasonings.",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-manchow-soup",
    name: "Chicken Manchow Soup",
    category: "Soups",
    menuGroup: "SOUP",
    veg: false,
    price: 140,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "714+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Warming savory broth gently simmered with chicken manchow  and fragrant seasonings.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "mushroom-soup",
    name: "Mushroom Soup",
    category: "Soups",
    menuGroup: "SOUP",
    veg: true,
    price: 110,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "434+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Warming savory broth gently simmered with mushroom  and fragrant seasonings.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-mushroom-soup",
    name: "Chicken Mushroom Soup",
    category: "Soups",
    menuGroup: "SOUP",
    veg: false,
    price: 160,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "814+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Warming savory broth gently simmered with chicken mushroom  and fragrant seasonings.",
    image: "https://images.unsplash.com/photo-1588566565463-180a5b2090f2?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "mix-veg-manchurian-dry",
    name: "Mix Veg Manchurian Dry",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: true,
    price: 250,
    halfPrice: 150,
    rating: 4.8,
    ratingCount: "554+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika mix veg manchurian dry prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "french-fry",
    name: "French Fry",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: true,
    price: 90,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "891+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Authentic PM Zaika french fry prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "penuts-masala",
    name: "Penuts Masala",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: true,
    price: 100,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "387+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Authentic PM Zaika penuts masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "paneer-chili-dry",
    name: "Paneer Chili Dry",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: true,
    price: 220,
    halfPrice: 132,
    rating: 4.9,
    ratingCount: "447+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika paneer chili dry prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "paneer-pakora",
    name: "Paneer Pakora",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: true,
    price: 200,
    halfPrice: 120,
    rating: 4.7,
    ratingCount: "657+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika paneer pakora prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "gobi-manchurian",
    name: "Gobi Manchurian",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: true,
    price: 200,
    halfPrice: 120,
    rating: 4.8,
    ratingCount: "706+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika gobi manchurian prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "veg-chili-dry",
    name: "Veg Chili Dry",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: true,
    price: 200,
    halfPrice: 120,
    rating: 4.8,
    ratingCount: "678+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika veg chili dry prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "paneer-65",
    name: "Paneer 65",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: true,
    price: 220,
    halfPrice: 132,
    rating: 4.9,
    ratingCount: "307+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika paneer 65 prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "crispy-chili-potatos",
    name: "Crispy Chili Potatos",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: true,
    price: 150,
    halfPrice: null,
    rating: 4.6,
    ratingCount: "804+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: false,
    customizable: false,
    description: "Authentic PM Zaika crispy chili potatos prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "honey-chili-potatos",
    name: "Honey Chili Potatos",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: true,
    price: 180,
    halfPrice: 108,
    rating: 4.8,
    ratingCount: "762+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika honey chili potatos prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "crispy-baby-corn-chilli",
    name: "Crispy Baby Corn Chilli",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: true,
    price: 240,
    halfPrice: 144,
    rating: 4.8,
    ratingCount: "714+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika crispy baby corn chilli prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "veg-cheese-roll",
    name: "Veg Cheese Roll",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: true,
    price: 200,
    halfPrice: 120,
    rating: 4.7,
    ratingCount: "665+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika veg cheese roll prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "mashroom-chili-dry",
    name: "Mashroom Chili Dry",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: true,
    price: 220,
    halfPrice: 132,
    rating: 4.7,
    ratingCount: "601+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika mashroom chili dry prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-lollypop",
    name: "Chicken Lollypop",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: false,
    price: 230,
    halfPrice: 138,
    rating: 4.6,
    ratingCount: "860+",
    badge: "BESTSELLER",
    badgeType: "plum",
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika chicken lollypop prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-pakora",
    name: "Chicken Pakora",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: false,
    price: 220,
    halfPrice: 132,
    rating: 4.7,
    ratingCount: "341+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken pakora prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-fried-2-pic-leg",
    name: "Chicken Fried (2 Pic Leg)",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: false,
    price: 220,
    halfPrice: 132,
    rating: 4.8,
    ratingCount: "786+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken fried (2 pic leg) prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-fried-800-gm-chicken",
    name: "Chicken Fried (800 gm Chicken)",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: false,
    price: 420,
    halfPrice: 252,
    rating: 4.8,
    ratingCount: "410+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken fried (800 gm chicken) prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-crunchy",
    name: "Chicken Crunchy",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: false,
    price: 220,
    halfPrice: 132,
    rating: 4.8,
    ratingCount: "498+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken crunchy prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "honey-chicken-chilli-dry",
    name: "Honey Chicken Chilli Dry",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: false,
    price: 260,
    halfPrice: 156,
    rating: 4.7,
    ratingCount: "329+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika honey chicken chilli dry prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-manchurian-dry",
    name: "Chicken Manchurian Dry",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: false,
    price: 260,
    halfPrice: 156,
    rating: 4.7,
    ratingCount: "441+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken manchurian dry prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-chili-bonless-dry",
    name: "Chicken Chili Bonless Dry",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: false,
    price: 220,
    halfPrice: 132,
    rating: 4.8,
    ratingCount: "838+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken chili bonless dry prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-65",
    name: "Chicken 65",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: false,
    price: 250,
    halfPrice: 150,
    rating: 4.6,
    ratingCount: "428+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken 65 prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-chilli-bone-dry",
    name: "Chicken Chilli Bone Dry",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: false,
    price: 200,
    halfPrice: 120,
    rating: 4.7,
    ratingCount: "401+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken chilli bone dry prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "lemon-chilli-dry",
    name: "Lemon Chilli Dry",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: false,
    price: 250,
    halfPrice: 150,
    rating: 4.9,
    ratingCount: "591+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika lemon chilli dry prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "butter-chicken-chilli-dry",
    name: "Butter Chicken Chilli Dry",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: false,
    price: 260,
    halfPrice: 156,
    rating: 4.6,
    ratingCount: "548+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika butter chicken chilli dry prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "egg-chili-dry",
    name: "Egg Chili Dry",
    category: "Starters",
    menuGroup: "STARTERS",
    veg: false,
    price: 150,
    halfPrice: null,
    rating: 4.7,
    ratingCount: "453+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: false,
    customizable: false,
    description: "Authentic PM Zaika egg chili dry prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "egg-curry",
    name: "Egg Curry",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 100,
    halfPrice: null,
    rating: 4.7,
    ratingCount: "525+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Authentic PM Zaika egg curry prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "egg-do-payaza",
    name: "Egg Do Payaza",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 120,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "790+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Authentic PM Zaika egg do payaza prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "egg-kadhai",
    name: "Egg Kadhai",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 120,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "642+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Authentic PM Zaika egg kadhai prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-curry",
    name: "Chicken Curry",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 260,
    halfPrice: 156,
    rating: 4.7,
    ratingCount: "377+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken curry prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-hyderabadi",
    name: "Chicken Hyderabadi",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 280,
    halfPrice: 168,
    rating: 4.7,
    ratingCount: "529+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken hyderabadi prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-do-payza",
    name: "Chicken Do Payza",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 280,
    halfPrice: 168,
    rating: 4.7,
    ratingCount: "381+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken do payza prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-hendi",
    name: "Chicken Hendi",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 280,
    halfPrice: 168,
    rating: 4.7,
    ratingCount: "657+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken hendi prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-kadahi",
    name: "Chicken Kadahi",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 280,
    halfPrice: 168,
    rating: 4.9,
    ratingCount: "399+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken kadahi prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-masala",
    name: "Chicken Masala",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 300,
    halfPrice: 180,
    rating: 4.6,
    ratingCount: "412+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-butter-masala",
    name: "Chicken Butter Masala",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 320,
    halfPrice: 192,
    rating: 4.6,
    ratingCount: "444+",
    badge: "BESTSELLER",
    badgeType: "plum",
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika chicken butter masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-tikka-masala",
    name: "Chicken Tikka Masala",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 370,
    halfPrice: 222,
    rating: 4.6,
    ratingCount: "576+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika chicken tikka masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-tikka-butter-masala",
    name: "Chicken Tikka Butter Masala",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 390,
    halfPrice: 234,
    rating: 4.8,
    ratingCount: "718+",
    badge: "BESTSELLER",
    badgeType: "plum",
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika chicken tikka butter masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-bharta",
    name: "Chicken Bharta",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 330,
    halfPrice: 198,
    rating: 4.6,
    ratingCount: "816+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken bharta prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-leg-kabab-masala-2-pic",
    name: "Chicken Leg Kabab Masala (2 Pic)",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 320,
    halfPrice: 192,
    rating: 4.9,
    ratingCount: "355+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken leg kabab masala (2 pic) prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-leg-kabab-butter-masala-2-pic",
    name: "Chicken Leg Kabab Butter Masala (2 Pic)",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 340,
    halfPrice: 204,
    rating: 4.9,
    ratingCount: "887+",
    badge: "BESTSELLER",
    badgeType: "plum",
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika chicken leg kabab butter masala (2 pic) prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-dehati-6-pic",
    name: "Chicken Dehati (6 Pic)",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 420,
    halfPrice: 252,
    rating: 4.8,
    ratingCount: "362+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken dehati (6 pic) prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-mughlai-mussalam",
    name: "Chicken Mughlai Mussalam",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 520,
    halfPrice: 312,
    rating: 4.9,
    ratingCount: "355+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken mughlai mussalam prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-tandoori-masala",
    name: "Chicken Tandoori Masala",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 520,
    halfPrice: 312,
    rating: 4.9,
    ratingCount: "523+",
    badge: null,
    badgeType: null,
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika chicken tandoori masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-punjabi",
    name: "Chicken Punjabi",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 320,
    halfPrice: 192,
    rating: 4.8,
    ratingCount: "818+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken punjabi prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-korhazori",
    name: "Chicken Korhazori",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 320,
    halfPrice: 192,
    rating: 4.9,
    ratingCount: "763+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken korhazori prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-bhuna",
    name: "Chicken Bhuna",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 320,
    halfPrice: 192,
    rating: 4.8,
    ratingCount: "466+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken bhuna prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-patiyala",
    name: "Chicken Patiyala",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 320,
    halfPrice: 192,
    rating: 4.7,
    ratingCount: "393+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken patiyala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-rata",
    name: "Chicken Rata",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 370,
    halfPrice: 222,
    rating: 4.9,
    ratingCount: "575+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken rata prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-kassa",
    name: "Chicken Kassa",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 300,
    halfPrice: 180,
    rating: 4.8,
    ratingCount: "718+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken kassa prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-istu",
    name: "Chicken Istu",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 300,
    halfPrice: 180,
    rating: 4.9,
    ratingCount: "887+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika chicken istu prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mutton-curry-4-pic",
    name: "Mutton Curry (4 Pic)",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 320,
    halfPrice: 192,
    rating: 4.7,
    ratingCount: "373+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika mutton curry (4 pic) prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "mutton-do-payza-4-pic",
    name: "Mutton do Payza (4 Pic)",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 320,
    halfPrice: 192,
    rating: 4.6,
    ratingCount: "616+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika mutton do payza (4 pic) prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mutton-hendi-4-pic",
    name: "Mutton Hendi (4 Pic)",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 320,
    halfPrice: 192,
    rating: 4.9,
    ratingCount: "755+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika mutton hendi (4 pic) prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mutton-dehati-6-pic",
    name: "Mutton Dehati (6 Pic)",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 470,
    halfPrice: 282,
    rating: 4.9,
    ratingCount: "655+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika mutton dehati (6 pic) prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mutton-istu-4-pic",
    name: "Mutton Istu (4 Pic)",
    category: "Mains",
    menuGroup: "CURRIES (NON-VEG)",
    veg: false,
    price: 340,
    halfPrice: 204,
    rating: 4.6,
    ratingCount: "620+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika mutton istu (4 pic) prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-tandoori",
    name: "Chicken Tandoori",
    category: "Tandoor",
    menuGroup: "TANDOOR & KEBABS",
    veg: false,
    price: 400,
    halfPrice: 240,
    rating: 4.8,
    ratingCount: "694+",
    badge: null,
    badgeType: null,
    popular: true,
    customizable: true,
    description: "Succulent skewers charred in authentic clay tandoor with aromatic yogurt marinade and herbs.",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-tikka",
    name: "Chicken Tikka",
    category: "Tandoor",
    menuGroup: "TANDOOR & KEBABS",
    veg: false,
    price: 300,
    halfPrice: 180,
    rating: 4.8,
    ratingCount: "746+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: true,
    customizable: true,
    description: "Succulent skewers charred in authentic clay tandoor with aromatic yogurt marinade and herbs.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-reshmi-kabab",
    name: "Chicken Reshmi Kabab",
    category: "Tandoor",
    menuGroup: "TANDOOR & KEBABS",
    veg: false,
    price: 350,
    halfPrice: 210,
    rating: 4.9,
    ratingCount: "831+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Succulent skewers charred in authentic clay tandoor with aromatic yogurt marinade and herbs.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-malai-kabab",
    name: "Chicken Malai Kabab",
    category: "Tandoor",
    menuGroup: "TANDOOR & KEBABS",
    veg: false,
    price: 350,
    halfPrice: 210,
    rating: 4.9,
    ratingCount: "451+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Succulent skewers charred in authentic clay tandoor with aromatic yogurt marinade and herbs.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-leg-kabab",
    name: "Chicken Leg Kabab",
    category: "Tandoor",
    menuGroup: "TANDOOR & KEBABS",
    veg: false,
    price: 300,
    halfPrice: 180,
    rating: 4.6,
    ratingCount: "304+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Succulent skewers charred in authentic clay tandoor with aromatic yogurt marinade and herbs.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-gullar-kabab",
    name: "Chicken Gullar Kabab",
    category: "Tandoor",
    menuGroup: "TANDOOR & KEBABS",
    veg: false,
    price: 250,
    halfPrice: 150,
    rating: 4.6,
    ratingCount: "416+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Succulent skewers charred in authentic clay tandoor with aromatic yogurt marinade and herbs.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-seekh-kabab",
    name: "Chicken Seekh Kabab",
    category: "Tandoor",
    menuGroup: "TANDOOR & KEBABS",
    veg: false,
    price: 250,
    halfPrice: 150,
    rating: 4.8,
    ratingCount: "318+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Succulent skewers charred in authentic clay tandoor with aromatic yogurt marinade and herbs.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-malai-seekh-kabab",
    name: "Chicken Malai Seekh Kabab",
    category: "Tandoor",
    menuGroup: "TANDOOR & KEBABS",
    veg: false,
    price: 300,
    halfPrice: 180,
    rating: 4.9,
    ratingCount: "443+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Succulent skewers charred in authentic clay tandoor with aromatic yogurt marinade and herbs.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-tagari",
    name: "Chicken Tagari",
    category: "Tandoor",
    menuGroup: "TANDOOR & KEBABS",
    veg: false,
    price: 350,
    halfPrice: 210,
    rating: 4.6,
    ratingCount: "540+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Succulent skewers charred in authentic clay tandoor with aromatic yogurt marinade and herbs.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "veg-biryani",
    name: "Veg Biryani",
    category: "Biryani",
    menuGroup: "BIRYANI & RICE",
    veg: true,
    price: 140,
    halfPrice: null,
    rating: 4.7,
    ratingCount: "501+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: true,
    customizable: false,
    description: "Authentic PM Zaika veg biryani prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "paneer-biryani",
    name: "Paneer Biryani",
    category: "Biryani",
    menuGroup: "BIRYANI & RICE",
    veg: true,
    price: 150,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "614+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: true,
    customizable: false,
    description: "Authentic PM Zaika paneer biryani prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "egg-biryani",
    name: "Egg Biryani",
    category: "Biryani",
    menuGroup: "BIRYANI & RICE",
    veg: false,
    price: 150,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "502+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: true,
    customizable: false,
    description: "Authentic PM Zaika egg biryani prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    category: "Biryani",
    menuGroup: "BIRYANI & RICE",
    veg: false,
    price: 170,
    halfPrice: null,
    rating: 4.6,
    ratingCount: "536+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: true,
    customizable: false,
    description: "Authentic PM Zaika chicken biryani prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "mutton-biryani",
    name: "Mutton Biryani",
    category: "Biryani",
    menuGroup: "BIRYANI & RICE",
    veg: false,
    price: 270,
    halfPrice: 162,
    rating: 4.6,
    ratingCount: "860+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika mutton biryani prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "zaika-spl-biryani",
    name: "Zaika Spl. Biryani",
    category: "Biryani",
    menuGroup: "BIRYANI & RICE",
    veg: false,
    price: 300,
    halfPrice: 180,
    rating: 4.8,
    ratingCount: "618+",
    badge: "BESTSELLER",
    badgeType: "plum",
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika zaika spl. biryani prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "aloo-gobhi",
    name: "Aloo Gobhi",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 160,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "394+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Authentic PM Zaika aloo gobhi prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "aloo-parwal",
    name: "Aloo Parwal",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 160,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "374+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Authentic PM Zaika aloo parwal prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "aloo-matter",
    name: "Aloo Matter",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 160,
    halfPrice: null,
    rating: 4.7,
    ratingCount: "361+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Authentic PM Zaika aloo matter prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "aloo-dum-bhojpuri",
    name: "Aloo dum Bhojpuri",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 220,
    halfPrice: 132,
    rating: 4.8,
    ratingCount: "894+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika aloo dum bhojpuri prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "aloo-dum-kashmiri",
    name: "Aloo Dum Kashmiri",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 260,
    halfPrice: 156,
    rating: 4.6,
    ratingCount: "780+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika aloo dum kashmiri prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "aloo-masala",
    name: "Aloo Masala",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 160,
    halfPrice: null,
    rating: 4.6,
    ratingCount: "396+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Authentic PM Zaika aloo masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "aloo-jeera",
    name: "Aloo Jeera",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 160,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "875+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Authentic PM Zaika aloo jeera prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-masala",
    name: "Paneer Masala",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 240,
    halfPrice: 144,
    rating: 4.7,
    ratingCount: "373+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika paneer masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-butter-masala",
    name: "Paneer Butter Masala",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 250,
    halfPrice: 150,
    rating: 4.8,
    ratingCount: "858+",
    badge: "BESTSELLER",
    badgeType: "plum",
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika paneer butter masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "paneer-do-pyazza",
    name: "Paneer Do Pyazza",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 250,
    halfPrice: 150,
    rating: 4.6,
    ratingCount: "800+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika paneer do pyazza prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-kadhai",
    name: "Paneer Kadhai",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 250,
    halfPrice: 150,
    rating: 4.6,
    ratingCount: "532+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika paneer kadhai prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "paneer-handi",
    name: "Paneer Handi",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 250,
    halfPrice: 150,
    rating: 4.9,
    ratingCount: "599+",
    badge: "CHEF'S PICK",
    badgeType: "emerald",
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika paneer handi prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-lababdar",
    name: "Paneer Lababdar",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 280,
    halfPrice: 168,
    rating: 4.6,
    ratingCount: "744+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika paneer lababdar prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-punjabi",
    name: "Paneer Punjabi",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 280,
    halfPrice: 168,
    rating: 4.7,
    ratingCount: "605+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika paneer punjabi prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-tikka-masala",
    name: "Paneer Tikka Masala",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 320,
    halfPrice: 192,
    rating: 4.9,
    ratingCount: "555+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika paneer tikka masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "paneer-tikka-butter-masala",
    name: "Paneer Tikka Butter Masala",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 340,
    halfPrice: 204,
    rating: 4.8,
    ratingCount: "722+",
    badge: "BESTSELLER",
    badgeType: "plum",
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika paneer tikka butter masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "paneer-kofta",
    name: "Paneer Kofta",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 300,
    halfPrice: 180,
    rating: 4.9,
    ratingCount: "479+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika paneer kofta prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "malai-kofta",
    name: "Malai Kofta",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 300,
    halfPrice: 180,
    rating: 4.6,
    ratingCount: "756+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika malai kofta prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-mushroom-masala",
    name: "Paneer Mushroom Masala",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 300,
    halfPrice: 180,
    rating: 4.8,
    ratingCount: "358+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika paneer mushroom masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-mushroom-butter-masala",
    name: "Paneer Mushroom Butter Masala",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 350,
    halfPrice: 210,
    rating: 4.7,
    ratingCount: "793+",
    badge: "BESTSELLER",
    badgeType: "plum",
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika paneer mushroom butter masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-capsicum",
    name: "Paneer Capsicum",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 300,
    halfPrice: 180,
    rating: 4.9,
    ratingCount: "659+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika paneer capsicum prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "shahi-paneer",
    name: "Shahi Paneer",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 300,
    halfPrice: 180,
    rating: 4.8,
    ratingCount: "470+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika shahi paneer prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "mushroom-curry",
    name: "Mushroom Curry",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 280,
    halfPrice: 168,
    rating: 4.7,
    ratingCount: "717+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika mushroom curry prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mushroom-masala",
    name: "Mushroom Masala",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 280,
    halfPrice: 168,
    rating: 4.7,
    ratingCount: "837+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika mushroom masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mushroom-do-pyaza",
    name: "Mushroom Do Pyaza",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 280,
    halfPrice: 168,
    rating: 4.6,
    ratingCount: "568+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika mushroom do pyaza prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mushroom-handi",
    name: "Mushroom Handi",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 280,
    halfPrice: 168,
    rating: 4.6,
    ratingCount: "780+",
    badge: "CHEF'S PICK",
    badgeType: "emerald",
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika mushroom handi prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mushroom-kadahi",
    name: "Mushroom Kadahi",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 280,
    halfPrice: 168,
    rating: 4.6,
    ratingCount: "604+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika mushroom kadahi prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mushroom-mather-masala",
    name: "Mushroom Mather Masala",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 340,
    halfPrice: 204,
    rating: 4.8,
    ratingCount: "790+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika mushroom mather masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mushroom-butter-masala",
    name: "Mushroom Butter Masala",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 320,
    halfPrice: 192,
    rating: 4.7,
    ratingCount: "625+",
    badge: "BESTSELLER",
    badgeType: "plum",
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika mushroom butter masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mushroom-dehati",
    name: "Mushroom Dehati",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 310,
    halfPrice: 186,
    rating: 4.8,
    ratingCount: "482+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika mushroom dehati prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mather-paneer",
    name: "Mather Paneer",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 200,
    halfPrice: 120,
    rating: 4.8,
    ratingCount: "726+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika mather paneer prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "kaju-paneer",
    name: "Kaju Paneer",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 270,
    halfPrice: 162,
    rating: 4.8,
    ratingCount: "870+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika kaju paneer prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "kaju-masala",
    name: "Kaju Masala",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 270,
    halfPrice: 162,
    rating: 4.8,
    ratingCount: "854+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika kaju masala prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "kaju-korma",
    name: "Kaju Korma",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 320,
    halfPrice: 192,
    rating: 4.7,
    ratingCount: "533+",
    badge: "CHEF'S PICK",
    badgeType: "emerald",
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika kaju korma prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mix-veg",
    name: "Mix Veg",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 210,
    halfPrice: 126,
    rating: 4.7,
    ratingCount: "541+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika mix veg prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "veg-korma",
    name: "Veg Korma",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 240,
    halfPrice: 144,
    rating: 4.7,
    ratingCount: "569+",
    badge: "CHEF'S PICK",
    badgeType: "emerald",
    popular: true,
    customizable: true,
    description: "Authentic PM Zaika veg korma prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "meth-matter-malai",
    name: "Meth Matter Malai",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 240,
    halfPrice: 144,
    rating: 4.7,
    ratingCount: "837+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Authentic PM Zaika meth matter malai prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    category: "Tandoor",
    menuGroup: "TANDOOR & KEBABS",
    veg: true,
    price: 240,
    halfPrice: 144,
    rating: 4.7,
    ratingCount: "749+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: true,
    customizable: true,
    description: "Succulent skewers charred in authentic clay tandoor with aromatic yogurt marinade and herbs.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "paneer-gullar-kabab",
    name: "Paneer Gullar Kabab",
    category: "Tandoor",
    menuGroup: "TANDOOR & KEBABS",
    veg: true,
    price: 260,
    halfPrice: 156,
    rating: 4.7,
    ratingCount: "489+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Succulent skewers charred in authentic clay tandoor with aromatic yogurt marinade and herbs.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-malai-tikka-kabab",
    name: "Paneer Malai Tikka Kabab",
    category: "Tandoor",
    menuGroup: "TANDOOR & KEBABS",
    veg: true,
    price: 270,
    halfPrice: 162,
    rating: 4.6,
    ratingCount: "620+",
    badge: "POPULAR",
    badgeType: "saffron",
    popular: true,
    customizable: true,
    description: "Succulent skewers charred in authentic clay tandoor with aromatic yogurt marinade and herbs.",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c8d50f2c?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "hara-bhara-kabab",
    name: "Hara-Bhara Kabab",
    category: "Tandoor",
    menuGroup: "TANDOOR & KEBABS",
    veg: true,
    price: 220,
    halfPrice: 132,
    rating: 4.7,
    ratingCount: "325+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Succulent skewers charred in authentic clay tandoor with aromatic yogurt marinade and herbs.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "veg-seekh-kabab",
    name: "Veg Seekh Kabab",
    category: "Tandoor",
    menuGroup: "TANDOOR & KEBABS",
    veg: true,
    price: 220,
    halfPrice: 132,
    rating: 4.8,
    ratingCount: "450+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Succulent skewers charred in authentic clay tandoor with aromatic yogurt marinade and herbs.",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "soya-malai-kabab",
    name: "Soya Malai Kabab",
    category: "Tandoor",
    menuGroup: "TANDOOR & KEBABS",
    veg: true,
    price: 220,
    halfPrice: 132,
    rating: 4.9,
    ratingCount: "455+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Succulent skewers charred in authentic clay tandoor with aromatic yogurt marinade and herbs.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "seya-malai-chap",
    name: "Seya Malai Chap",
    category: "Tandoor",
    menuGroup: "TANDOOR & KEBABS",
    veg: true,
    price: 220,
    halfPrice: 132,
    rating: 4.8,
    ratingCount: "738+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "Succulent skewers charred in authentic clay tandoor with aromatic yogurt marinade and herbs.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "plain-naan",
    name: "Plain Naan",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 35,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "766+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "butter-naan",
    name: "Butter Naan",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 40,
    halfPrice: null,
    rating: 4.6,
    ratingCount: "548+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "garlic-naan",
    name: "Garlic Naan",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 60,
    halfPrice: null,
    rating: 4.7,
    ratingCount: "317+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ginger-naan",
    name: "Ginger Naan",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 60,
    halfPrice: null,
    rating: 4.7,
    ratingCount: "325+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-stuff-naan",
    name: "Paneer Stuff Naan",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 80,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "795+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-garlic-naan",
    name: "Paneer Garlic Naan",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 100,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "322+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "paneer-ginger-naan",
    name: "Paneer Ginger Naan",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 100,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "522+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "veg-stuff-naan",
    name: "Veg Stuff Naan",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 70,
    halfPrice: null,
    rating: 4.7,
    ratingCount: "853+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "kulcha",
    name: "Kulcha",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 25,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "390+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-kulcha",
    name: "Paneer Kulcha",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 70,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "775+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "veg-stuff-kulcha",
    name: "Veg Stuff Kulcha",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 50,
    halfPrice: null,
    rating: 4.6,
    ratingCount: "728+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-stuff-naan",
    name: "Chicken Stuff Naan",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: false,
    price: 100,
    halfPrice: null,
    rating: 4.6,
    ratingCount: "516+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-garlic-naan",
    name: "Chicken Garlic Naan",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: false,
    price: 140,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "643+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-ginger-naan",
    name: "Chicken Ginger Naan",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: false,
    price: 140,
    halfPrice: null,
    rating: 4.7,
    ratingCount: "541+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-stuff-kulcha",
    name: "Chicken Stuff Kulcha",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: false,
    price: 90,
    halfPrice: null,
    rating: 4.6,
    ratingCount: "564+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "plain-roti",
    name: "Plain Roti",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 20,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "759+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "butter-roti",
    name: "Butter Roti",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 25,
    halfPrice: null,
    rating: 4.6,
    ratingCount: "608+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "lactha-butter-pratha",
    name: "Lactha Butter Pratha",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 30,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "730+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "aloo-pratha",
    name: "Aloo Pratha",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 50,
    halfPrice: null,
    rating: 4.7,
    ratingCount: "329+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "gobi-pratha",
    name: "Gobi Pratha",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 50,
    halfPrice: null,
    rating: 4.7,
    ratingCount: "429+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-pratha",
    name: "Paneer Pratha",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 90,
    halfPrice: null,
    rating: 4.7,
    ratingCount: "301+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-mugalai-pratha",
    name: "Paneer Mugalai Pratha",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 120,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "335+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-mugalai-pratha",
    name: "Chicken Mugalai Pratha",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: false,
    price: 150,
    halfPrice: null,
    rating: 4.7,
    ratingCount: "597+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mashroom-mugalai-pratha",
    name: "Mashroom Mugalai Pratha",
    category: "Breads",
    menuGroup: "BREADS & NAAN",
    veg: true,
    price: 150,
    halfPrice: null,
    rating: 4.6,
    ratingCount: "616+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Crisp, fluffy artisan bread freshly slapped in the roaring clay tandoor oven.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "yellow-daal",
    name: "Yellow Daal",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 100,
    halfPrice: null,
    rating: 4.6,
    ratingCount: "376+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Authentic PM Zaika yellow daal prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "daal-fry",
    name: "Daal Fry",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 120,
    halfPrice: null,
    rating: 4.7,
    ratingCount: "641+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Authentic PM Zaika daal fry prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "daal-tadka",
    name: "Daal Tadka",
    category: "Mains",
    menuGroup: "CURRIES & DAL (VEG)",
    veg: true,
    price: 140,
    halfPrice: null,
    rating: 4.7,
    ratingCount: "453+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: false,
    description: "Authentic PM Zaika daal tadka prepared with royal Awadhi spices and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "veg-noodles",
    name: "Veg Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: true,
    price: 110,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "698+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "paneer-noodles",
    name: "Paneer Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: true,
    price: 150,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "582+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mashroom-noodles",
    name: "Mashroom Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: true,
    price: 170,
    halfPrice: null,
    rating: 4.7,
    ratingCount: "509+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "egg-noodles",
    name: "Egg Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: false,
    price: 140,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "854+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "chicken-noodles",
    name: "Chicken Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: false,
    price: 170,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "310+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "mix-noodles",
    name: "Mix Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: false,
    price: 200,
    halfPrice: 120,
    rating: 4.7,
    ratingCount: "493+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "veg-hakka-noodles",
    name: "Veg Hakka Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: true,
    price: 140,
    halfPrice: null,
    rating: 4.6,
    ratingCount: "764+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-hakka-noodles",
    name: "Paneer Hakka Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: true,
    price: 170,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "403+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mashroom-hakka-noodles",
    name: "Mashroom Hakka Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: true,
    price: 200,
    halfPrice: 120,
    rating: 4.7,
    ratingCount: "449+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "egg-hakka-noodles",
    name: "Egg Hakka Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: false,
    price: 170,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "627+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-hakka-noodles",
    name: "Chicken Hakka Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: false,
    price: 220,
    halfPrice: 132,
    rating: 4.6,
    ratingCount: "764+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mix-hakka-noodles",
    name: "Mix Hakka Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: false,
    price: 260,
    halfPrice: 156,
    rating: 4.8,
    ratingCount: "490+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "veg-sizwan-noodles",
    name: "Veg Sizwan Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: true,
    price: 160,
    halfPrice: null,
    rating: 4.7,
    ratingCount: "577+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "chicken-sizwan-noodles",
    name: "Chicken Sizwan Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: false,
    price: 220,
    halfPrice: 132,
    rating: 4.9,
    ratingCount: "763+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mix-sizwan-noodles",
    name: "Mix Sizwan Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: false,
    price: 240,
    halfPrice: 144,
    rating: 4.6,
    ratingCount: "400+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-sizwan-noodles",
    name: "Paneer Sizwan Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: true,
    price: 200,
    halfPrice: 120,
    rating: 4.9,
    ratingCount: "703+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "egg-sizwan-noodles",
    name: "Egg Sizwan Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: false,
    price: 200,
    halfPrice: 120,
    rating: 4.8,
    ratingCount: "462+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "mashroom-sizwan-noodles",
    name: "Mashroom Sizwan Noodles",
    category: "Chinese",
    menuGroup: "CHINESE & ROLLS",
    veg: true,
    price: 220,
    halfPrice: 132,
    rating: 4.8,
    ratingCount: "754+",
    badge: null,
    badgeType: null,
    popular: false,
    customizable: true,
    description: "High flame wok-tossed long noodles with crisp julienned vegetables and zesty sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "double-egg-chicken-roll",
    name: "Double Egg Chicken Roll",
    category: "Rolls",
    menuGroup: "CHINESE & ROLLS",
    veg: false,
    price: 180,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "820+",
    badge: "BESTSELLER",
    badgeType: "saffron",
    popular: true,
    customizable: true,
    description: "Flaky layered paratha wrapped around succulent spiced chicken tikka, dual farm eggs, crisp onions, and zesty green chutney.",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "paneer-kathi-roll",
    name: "Paneer Kathi Roll",
    category: "Rolls",
    menuGroup: "CHINESE & ROLLS",
    veg: true,
    price: 150,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "610+",
    badge: "POPULAR",
    badgeType: "emerald",
    popular: true,
    customizable: true,
    description: "Char-grilled malai paneer wrapped in flaky tandoori paratha with mint relish and sliced bell peppers.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "special-motter-pulao-1kg",
    name: "Motter Pulao (1 Kg)",
    category: "Party Packs",
    menuGroup: "MEHMAN NAWAZI PARTY PACKS",
    veg: true,
    price: 500,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "410+",
    badge: "PARTY PACK",
    badgeType: "saffron",
    popular: true,
    customizable: false,
    description: "Mehman Nawazi Party Pack \u2014 1 kg aromatic basmati peas pulao.",
    image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "special-meetha-zarda-1kg",
    name: "Meetha Zarda (1 Kg)",
    category: "Party Packs",
    menuGroup: "MEHMAN NAWAZI PARTY PACKS",
    veg: true,
    price: 800,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "380+",
    badge: "ROYAL SWEET",
    badgeType: "plum",
    popular: true,
    customizable: false,
    description: "Mehman Nawazi Party Pack \u2014 1 kg royal sweet saffron rice with rich dry fruits.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "special-chicken-korma-1kg",
    name: "Chicken Korma (1 Kg)",
    category: "Party Packs",
    menuGroup: "MEHMAN NAWAZI PARTY PACKS",
    veg: false,
    price: 600,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "520+",
    badge: "PARTY PACK",
    badgeType: "saffron",
    popular: true,
    customizable: false,
    description: "Mehman Nawazi Party Pack \u2014 1 kg rich traditional Mughlai chicken curry.",
    image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "special-mutton-korma-1kg",
    name: "Mutton Korma (1 Kg)",
    category: "Party Packs",
    menuGroup: "MEHMAN NAWAZI PARTY PACKS",
    veg: false,
    price: 1200,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "640+",
    badge: "BESTSELLER",
    badgeType: "plum",
    popular: true,
    customizable: false,
    description: "Mehman Nawazi Party Pack \u2014 1 kg royal slow-cooked tender mutton curry.",
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "special-chicken-stick-kabab-1kg",
    name: "Chicken Stick Kabab (Boneless 1 Kg)",
    category: "Party Packs",
    menuGroup: "MEHMAN NAWAZI PARTY PACKS",
    veg: false,
    price: 1200,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "490+",
    badge: "MUST TRY",
    badgeType: "emerald",
    popular: true,
    customizable: false,
    description: "Mehman Nawazi Party Pack \u2014 1 kg skewered boneless kababs roasted in clay oven.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "special-murg-mussallam-pcs",
    name: "Murg Mussallam (Piece)",
    category: "Party Packs",
    menuGroup: "MEHMAN NAWAZI PARTY PACKS",
    veg: false,
    price: 650,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "780+",
    badge: "CHEF'S PICK",
    badgeType: "emerald",
    popular: true,
    customizable: false,
    description: "Mehman Nawazi Special \u2014 Whole chicken prepared in royal Mughlai rich gravy.",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "special-mutton-raan-e-arabia",
    name: "Mutton Rane-E-Arabia",
    category: "Party Packs",
    menuGroup: "MEHMAN NAWAZI PARTY PACKS",
    veg: false,
    price: 2500,
    halfPrice: null,
    rating: 5.0,
    ratingCount: "310+",
    badge: "GRAND SPECIAL",
    badgeType: "plum",
    popular: true,
    customizable: false,
    description: "Mehman Nawazi Grand Special \u2014 Whole slow-roasted Arabian mutton raan.",
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "special-baby-naan-1kg",
    name: "Baby Naan (1 Kg)",
    category: "Party Packs",
    menuGroup: "MEHMAN NAWAZI PARTY PACKS",
    veg: true,
    price: 450,
    halfPrice: null,
    rating: 4.8,
    ratingCount: "580+",
    badge: "PARTY PACK",
    badgeType: "saffron",
    popular: true,
    customizable: false,
    description: "Mehman Nawazi Party Pack \u2014 1 kg fresh tandoori baby naans.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "special-chicken-biryani-handi-45",
    name: "Chicken Biryani Handi (40-45 Persons)",
    category: "Party Packs",
    menuGroup: "MEHMAN NAWAZI PARTY PACKS",
    veg: false,
    price: 7500,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "210+",
    badge: "MEGA HANDI",
    badgeType: "plum",
    popular: true,
    customizable: false,
    description: "Shan-E-Biryani \u2014 Grand Chicken Handi serving 40-45 persons (~\u20b9165/person).",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "special-chicken-biryani-handi-80",
    name: "Chicken Biryani Handi (75-80 Persons)",
    category: "Party Packs",
    menuGroup: "MEHMAN NAWAZI PARTY PACKS",
    veg: false,
    price: 14000,
    halfPrice: null,
    rating: 4.9,
    ratingCount: "140+",
    badge: "MEGA HANDI",
    badgeType: "plum",
    popular: true,
    customizable: false,
    description: "Shan-E-Biryani \u2014 Mega Chicken Handi serving 75-80 persons (~\u20b9175/person).",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "special-mutton-biryani-handi-45",
    name: "Mutton Biryani Handi (40-45 Persons)",
    category: "Party Packs",
    menuGroup: "MEHMAN NAWAZI PARTY PACKS",
    veg: false,
    price: 12500,
    halfPrice: null,
    rating: 5.0,
    ratingCount: "190+",
    badge: "GRAND HANDI",
    badgeType: "plum",
    popular: true,
    customizable: false,
    description: "Shan-E-Biryani \u2014 Grand Mutton Handi serving 40-45 persons (~\u20b9275/person).",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "special-mutton-biryani-handi-80",
    name: "Mutton Biryani Handi (75-80 Persons)",
    category: "Party Packs",
    menuGroup: "MEHMAN NAWAZI PARTY PACKS",
    veg: false,
    price: 21500,
    halfPrice: null,
    rating: 5.0,
    ratingCount: "110+",
    badge: "GRAND HANDI",
    badgeType: "plum",
    popular: true,
    customizable: false,
    description: "Shan-E-Biryani \u2014 Mega Mutton Handi serving 75-80 persons (~\u20b9268/person).",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80"
  }
];

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
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80'
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
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80'
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
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=80'
  }
];


// --- 9 CIRCULAR CATEGORIES ---
const CATEGORIES = [
  {
    id: 'All',
    label: 'All',
    image:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=240&q=80'
  },
  {
    id: 'Biryani',
    label: 'Biryani',
    image:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=240&q=80'
  },
  {
    id: 'Tandoor',
    label: 'Tandoor',
    image:
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=240&q=80'
  },
  {
    id: 'Mains',
    label: 'Curries',
    image:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=240&q=80'
  },
  {
    id: 'Starters',
    label: 'Starters',
    image:
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=240&q=80'
  },
  {
    id: 'Soups',
    label: 'Soups',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=240&q=80'
  },
  {
    id: 'Breads',
    label: 'Breads',
    image:
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=240&q=80'
  },
  {
    id: 'Chinese',
    label: 'Chinese',
    image:
      'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=240&q=80'
  },
  {
    id: 'Party Packs',
    label: 'Party Packs',
    image:
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=240&q=80'
  }
];

const MENU_GROUPS = [
  'SOUP',
  'BIRYANI & RICE',
  'TANDOOR & KEBABS',
  'STARTERS',
  'CURRIES (NON-VEG)',
  'CURRIES & DAL (VEG)',
  'BREADS & NAAN',
  'CHINESE & ROLLS',
  'MEHMAN NAWAZI PARTY PACKS'
];

const ADDONS = [
  { id: 'raita', name: 'Burhani Raita', price: 40, veg: true },
  { id: 'butter-naan', name: 'Butter Naan', price: 55, veg: true },
  { id: 'mint-chutney', name: 'Mint Chutney', price: 30, veg: true }
];

const COUPONS = [
  {
    code: 'ZAIKA25',
    badge: 'POPULAR',
    title: '25% OFF up to ₹150',
    subtitle: 'Valid on orders above ₹499 • Royal Combos & Biryani',
    type: 'percent',
    value: 25,
    maxDiscount: 150,
    minOrder: 499
  },
  {
    code: 'TABLE10',
    badge: 'DINE-IN',
    title: 'Flat ₹60 OFF on Table Orders',
    subtitle: 'Valid on dine-in orders above ₹349',
    type: 'flat',
    value: 60,
    maxDiscount: 60,
    minOrder: 349
  },
  {
    code: 'ROYALRAITA',
    badge: 'COMBO PERK',
    title: 'Flat ₹40 OFF (Free Burhani Raita)',
    subtitle: 'Valid on orders above ₹249',
    type: 'flat',
    value: 40,
    maxDiscount: 40,
    minOrder: 249
  }
];

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
  'Takeaway'
];

const FEEDBACK_QUESTIONS = [
  { id: 'taste', label: 'Food Taste & Quality' },
  { id: 'service', label: 'Staff & Table Service' },
  { id: 'ambience', label: 'Dining Ambience' },
  { id: 'value', label: 'Value for Money' },
  { id: 'overall', label: 'Overall Experience' }
];

// --- EXACT GEOMETRIC MANDALA WIREFRAME (FOREGROUND ARCHITECTURAL MOTIF) ---
const ArchitecturalMandalaSvg = ({
  className = '',
  strokeColor = '#D9B9E8',
  accentColor = '#F3C669',
  strokeWidth = 0.85
}) => {
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const pearls = Array.from({ length: 24 }, (_, i) => i * 15);
  const latticeAngles = Array.from({ length: 8 }, (_, i) => i * 45);

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
  );
};

// --- HORIZONTAL BRUSHED-GOLD HAIRLINE ---
const GoldHairline = ({ className = '' }) => (
  <div
    className={`w-full h-[1px] ${className}`}
    style={{
      background:
        'linear-gradient(90deg, rgba(232,146,35,0) 0%, rgba(212,155,62,0.55) 18%, rgba(246,204,116,0.95) 50%, rgba(212,155,62,0.55) 82%, rgba(232,146,35,0) 100%)'
    }}
  />
);

// --- ARCHITECTURAL MANDALA HAIRLINE DIVIDER ---
const ArchitecturalMandalaDivider = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-2.5 py-1 ${className}`} aria-hidden="true">
    <div
      className="h-[1px] flex-1"
      style={{
        background:
          'linear-gradient(90deg, rgba(212,155,62,0) 0%, rgba(212,155,62,0.55) 65%, rgba(232,146,35,0.9) 100%)'
      }}
    />
    <svg viewBox="0 0 64 24" className="w-[54px] h-[20px] shrink-0" fill="none">
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
          'linear-gradient(90deg, rgba(232,146,35,0.9) 0%, rgba(212,155,62,0.55) 35%, rgba(212,155,62,0) 100%)'
      }}
    />
  </div>
);

// --- PM ZAIKA METALLIC ROYAL PASS CARD ---
const RoyalPassCard = ({
  royalPoints,
  selectedTable,
  onRedeem,
  compact = false
}) => (
  <section
    className={`rounded-[24px] bg-gradient-to-br from-[#1B0A2B] via-[#281040] to-[#2D1148] text-white relative overflow-hidden border border-[#F3C669]/30 shadow-[0_16px_34px_rgba(27,10,43,0.28)] ${compact ? 'p-4' : 'p-5'
      }`}
  >
    <ArchitecturalMandalaSvg
      className={`absolute -right-14 top-1/2 -translate-y-1/2 opacity-[0.26] ${compact ? 'w-[190px] h-[190px]' : 'w-[240px] h-[240px]'
        }`}
      strokeColor="#E8D2F5"
      accentColor="#F3C669"
      strokeWidth={1.05}
    />

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

    <div className="relative z-10 -mx-5 my-0.5">
      <GoldHairline />
    </div>

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
);

// --- HELPER: FORMAT CATEGORY GROUP NAME TO TITLE CASE ---
const formatGroupName = (group: string) => {
  if (!group) return '';
  if (group === 'SOUP') return 'Soups';
  if (group === 'TANDOOR & KEBABS') return 'Tandoor & Kebabs';
  if (group === 'BIRYANI & RICE') return 'Biryani & Mains';
  if (group === 'STARTERS') return 'Starters';
  if (group === 'CURRIES (NON-VEG)') return 'Curries (Non-Veg)';
  if (group === 'CURRIES & DAL (VEG)') return 'Curries & Dal (Veg)';
  if (group === 'BREADS & NAAN') return 'Breads & Naans';
  if (group === 'CHINESE & ROLLS') return 'Chinese & Rolls';
  if (group === 'MEHMAN NAWAZI PARTY PACKS') return 'Party Packs';
  return group.charAt(0).toUpperCase() + group.slice(1).toLowerCase();
};

// --- AUTHENTIC INDIAN FSSAI VEG / NON-VEG SQUARE INDICATOR (DARK PALETTE) ---
const FssaiDot = ({ veg, size = 'sm' }: { veg: boolean; size?: 'sm' | 'md' }) => {
  const box = size === 'sm' ? 'w-[14px] h-[14px]' : 'w-[16px] h-[16px]';
  const dot = size === 'sm' ? 'w-[6px] h-[6px]' : 'w-[7px] h-[7px]';
  return (
    <span
      className={`inline-flex items-center justify-center ${box} rounded-[3px] border bg-[#140b20] shrink-0 ${veg ? 'border-emerald-500' : 'border-rose-500'
        }`}
      title={veg ? 'Vegetarian' : 'Non-Vegetarian'}
      aria-label={veg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
      {veg ? (
        <span className={`${dot} rounded-full bg-emerald-500`} />
      ) : (
        <svg viewBox="0 0 10 10" className="w-[7px] h-[7px] fill-rose-500">
          <polygon points="5,1.5 9,8.5 1,8.5" />
        </svg>
      )}
    </span>
  );
};

// --- PM ZAIKA ROYAL CREST FRAMED BY FINE-LINE LOTUS PETAL RING ---
const PmZaikaCrest = () => (
  <div className="relative w-[72px] h-[72px] flex items-center justify-center shrink-0">
    <ArchitecturalMandalaSvg
      className="absolute inset-0 w-full h-full opacity-90"
      strokeColor="#C88B2B"
      accentColor="#E89223"
      strokeWidth={1.6}
    />
    <div className="w-[48px] h-[48px] rounded-full overflow-hidden border border-[#F3C669]/80 relative z-10 shadow-[0_6px_16px_rgba(0,0,0,0.6)] bg-black/90 p-0.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="PM Zaika Restaurant"
        className="w-full h-full object-contain rounded-full"
      />
    </div>
  </div>
);

function MainApp() {
  const searchParams = useSearchParams();
  const params = useParams();
  const slug = (params?.slug as string) || 'pm-zaika';

  // Navigation Tab: 'home' | 'menu' | 'offers' | 'hub'
  const [activeTab, setActiveTab] = useState('home');

  // Toast Notification
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 2600);
  };

  // Derive initial table from URL query param (?table=02 or ?table=Table%2002)
  const initialTable = useMemo(() => {
    const raw = searchParams?.get('table');
    if (!raw) return 'Table 04';
    const trimmed = raw.trim();
    if (/^takeaway$/i.test(trimmed)) return 'Takeaway';
    if (/^table\s*\d+/i.test(trimmed)) {
      const num = trimmed.replace(/\D/g, '').padStart(2, '0');
      return `Table ${num}`;
    }
    if (/^\d+$/.test(trimmed)) {
      return `Table ${trimmed.padStart(2, '0')}`;
    }
    return trimmed;
  }, [searchParams]);

  // Table & Steward State
  const [selectedTable, setSelectedTable] = useState(initialTable);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [stewardAlerted, setStewardAlerted] = useState(false);

  useEffect(() => {
    if (initialTable) {
      setSelectedTable(initialTable);
    }
  }, [initialTable]);

  // Hero Carousel State
  const [heroIndex, setHeroIndex] = useState(0);

  // Search, Category & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [under250, setUnder250] = useState(false);
  const [bestsellersOnly, setBestsellersOnly] = useState(false);
  const [ratings45Only, setRatings45Only] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  // Sound Effects State
  const [soundActive, setSoundActive] = useState<boolean>(true);

  useEffect(() => {
    setSoundActive(isSoundEnabled());
    const handler = (e: any) => setSoundActive(e.detail?.enabled ?? true);
    window.addEventListener('pmz-sound-toggle', handler);
    return () => window.removeEventListener('pmz-sound-toggle', handler);
  }, []);

  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundActive(next);
    showToast(next ? 'Sound Effects Enabled 🔔' : 'Sound Effects Muted 🔕');
  };

  const toggleCategoryCollapse = (grp: string) => {
    playFilterClickSound();
    setCollapsedGroups((prev) => ({ ...prev, [grp]: !prev[grp] }));
  };

  // Progressive Scroll Menu Rendering & Category Jump Drawer
  const [visibleGroupCount, setVisibleGroupCount] = useState(2);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const mainScrollRef = useRef(null);
  const sentinelRef = useRef(null);

  // Favorites Set (persisted)
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('pm_zaika_favorites');
        if (saved) return JSON.parse(saved);
      } catch { }
    }
    return {
      'mutton-handi-biryani': true,
      'paneer-tikka-shashlik': true
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('pm_zaika_favorites', JSON.stringify(favorites));
      } catch { }
    }
  }, [favorites]);

  // Cart State (persisted & safely sanitized)
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('pm_zaika_cart');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            const cleanCart = {};
            for (const [key, val] of Object.entries(parsed)) {
              if (
                val &&
                typeof val === 'object' &&
                val.dish &&
                val.dish.id &&
                typeof val.qty === 'number' &&
                val.qty > 0
              ) {
                cleanCart[key] = val;
              }
            }
            if (Object.keys(cleanCart).length > 0) {
              return cleanCart;
            }
          }
        }
      } catch { }
    }
    return {
      'mutton-handi-biryani__Full__Medium__': {
        key: 'mutton-handi-biryani__Full__Medium__',
        dish: MENU_ITEMS[0],
        portion: 'Full',
        spice: 'Medium',
        addons: [],
        notes: '',
        unitPrice: 380,
        qty: 1
      }
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('pm_zaika_cart', JSON.stringify(cart));
      } catch { }
    }
  }, [cart]);

  // ─── LOYALTY / PHONE-LOGIN STATE ───────────────────────────────────────────
  // Persisted customer session (from phone login)
  const [loyaltyCustomer, setLoyaltyCustomer] = useState<{
    name: string; phone: string; customerId: string;
  } | null>(null);
  const [loyaltySnapshot, setLoyaltySnapshot] = useState<{
    availablePoints: number; earnedTotal: number; redeemedTotal: number;
  } | null>(null);

  // Modal state
  const [loyaltyModalOpen, setLoyaltyModalOpen] = useState(false);
  const [loyaltyStep, setLoyaltyStep] = useState<'phone' | 'otp' | 'loggedIn'>('phone');
  const [loyaltyPhone, setLoyaltyPhone] = useState('');
  const [loyaltyName, setLoyaltyName] = useState('');
  const [loyaltyOtp, setLoyaltyOtp] = useState('');
  const [loyaltyLoading, setLoyaltyLoading] = useState(false);
  const [loyaltyError, setLoyaltyError] = useState('');
  const [loyaltyOtpSent, setLoyaltyOtpSent] = useState(false);
  const [loyaltySandboxCode, setLoyaltySandboxCode] = useState('');
  // Track if the modal opened as part of place-order flow
  const [loyaltyPendingOrder, setLoyaltyPendingOrder] = useState(false);

  // Restore loyalty session from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('pm_zaika_loyalty_customer');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.customerId && parsed?.phone) {
            setLoyaltyCustomer(parsed);
            setLoyaltyStep('loggedIn');
          }
        }
        const snap = window.localStorage.getItem('pm_zaika_loyalty_snapshot');
        if (snap) {
          const parsed = JSON.parse(snap);
          if (typeof parsed?.availablePoints === 'number') {
            setLoyaltySnapshot(parsed);
          }
        }
      } catch {}
    }
  }, []);

  // Persist loyalty customer
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (loyaltyCustomer) {
          window.localStorage.setItem('pm_zaika_loyalty_customer', JSON.stringify(loyaltyCustomer));
        } else {
          window.localStorage.removeItem('pm_zaika_loyalty_customer');
          window.localStorage.removeItem('pm_zaika_loyalty_snapshot');
        }
      } catch {}
    }
  }, [loyaltyCustomer]);

  // Persist loyalty snapshot
  useEffect(() => {
    if (typeof window !== 'undefined' && loyaltySnapshot) {
      try {
        window.localStorage.setItem('pm_zaika_loyalty_snapshot', JSON.stringify(loyaltySnapshot));
      } catch {}
    }
  }, [loyaltySnapshot]);

  // Derived: real points from server, fallback 0 if not logged in
  const royalPoints = loyaltySnapshot?.availablePoints ?? 0;

  // Loyalty login handler (passwordless phone-login)
  const handleLoyaltyPhoneSubmit = async () => {
    const phone = loyaltyPhone.replace(/\D/g, '').slice(-10);
    if (phone.length !== 10 || !/^[6-9]/.test(phone)) {
      setLoyaltyError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setLoyaltyLoading(true);
    setLoyaltyError('');
    try {
      const res = await fetch('/api/public/loyalty/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'phone-login', phone, name: loyaltyName.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoyaltyError(data.error || 'Login failed. Try again.');
        return;
      }
      // Success — session cookie set by server
      const customer = data.customer;
      const snap = data.snapshot;
      setLoyaltyCustomer({ name: customer.name, phone: customer.phone, customerId: customer.customerId });
      if (snap) setLoyaltySnapshot({ availablePoints: snap.availablePoints ?? 0, earnedTotal: snap.earnedTotal ?? 0, redeemedTotal: snap.redeemedTotal ?? 0 });
      setLoyaltyStep('loggedIn');
      showToast(`Welcome back, ${customer.name || 'Royal Guest'}! 🎉`);
      if (loyaltyPendingOrder) {
        setLoyaltyPendingOrder(false);
        setLoyaltyModalOpen(false);
        // Proceed with the order after a brief delay
        setTimeout(() => executePlaceOrder(), 300);
      }
    } catch {
      setLoyaltyError('Network error. Please try again.');
    } finally {
      setLoyaltyLoading(false);
    }
  };

  const handleLoyaltyLogout = () => {
    setLoyaltyCustomer(null);
    setLoyaltySnapshot(null);
    setLoyaltyStep('phone');
    setLoyaltyPhone('');
    setLoyaltyName('');
    setLoyaltyOtp('');
    setLoyaltyError('');
    setRedeemPoints(false);
    // Clear server cookie
    fetch('/api/public/loyalty/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    }).catch(() => {});
    showToast('Logged out of Royal Points');
  };

  // Rewards & Coupons (persisted)
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState(null);
  const [couponInput, setCouponInput] = useState('');

  // Customization Sheet
  const [customDish, setCustomDish] = useState(null);
  const [customPortion, setCustomPortion] = useState('Full');
  const [customSpice, setCustomSpice] = useState('Medium');
  const [customAddons, setCustomAddons] = useState([]);
  const [customNotes, setCustomNotes] = useState('');

  // Cart & Order Tracker Drawer (persisted live order)
  const [cartOpen, setCartOpen] = useState(false);
  const [cookingNotes, setCookingNotes] = useState('');
  const [liveOrder, setLiveOrder] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('pm_zaika_live_order');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (
            parsed &&
            typeof parsed === 'object' &&
            parsed.id &&
            typeof parsed.stage === 'number'
          ) {
            return parsed;
          }
        }
      } catch { }
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (liveOrder) {
          window.localStorage.setItem('pm_zaika_live_order', JSON.stringify(liveOrder));
        } else {
          window.localStorage.removeItem('pm_zaika_live_order');
        }
      } catch { }
    }
  }, [liveOrder]);

  // Auto-advance live order stages smoothly (simulated kitchen flow)
  useEffect(() => {
    if (!liveOrder || liveOrder.stage >= 2) return;
    const timer = setTimeout(() => {
      setLiveOrder((prev) => (prev && prev.stage < 2 ? { ...prev, stage: prev.stage + 1 } : prev));
    }, 28000);
    return () => clearTimeout(timer);
  }, [liveOrder]);

  // Guest Feedback Sheet
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackRatings, setFeedbackRatings] = useState({
    taste: 5,
    service: 5,
    ambience: 5,
    value: 5,
    overall: 5
  });
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackDone, setFeedbackDone] = useState(false);

  // Admin Direct Complaint Modal
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [complaintCategory, setComplaintCategory] = useState('Food Quality');
  const [complaintNote, setComplaintNote] = useState('');
  const [complaintPhone, setComplaintPhone] = useState('');
  const [complaintSubmitting, setComplaintSubmitting] = useState(false);

  // Copy Phone Feedback
  const [phoneCopied, setPhoneCopied] = useState(false);

  // Auto-advance hero carousel gently every 5.5s when on Home
  useEffect(() => {
    if (activeTab !== 'home') return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [activeTab]);

  // Progressive scroll rendering: load subsequent sections as user scrolls down
  const handleMainScroll = (e) => {
    if (activeTab !== 'menu') return;
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 650) {
      setVisibleGroupCount((prev) => {
        if (prev < MENU_GROUPS.length) {
          return Math.min(prev + 2, MENU_GROUPS.length);
        }
        return prev;
      });
    }
  };

  // IntersectionObserver for bottom sentinel in Menu tab
  useEffect(() => {
    if (activeTab !== 'menu') return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setVisibleGroupCount((prev) => {
            if (prev < MENU_GROUPS.length) {
              return Math.min(prev + 2, MENU_GROUPS.length);
            }
            return prev;
          });
        }
      },
      {
        root: mainScrollRef.current || null,
        rootMargin: '600px',
        threshold: 0.05
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [activeTab, visibleGroupCount]);

  // --- HELPER: FILTERING ---
  const activeFilterCount =
    (vegOnly ? 1 : 0) +
    (nonVegOnly ? 1 : 0) +
    (under250 ? 1 : 0) +
    (bestsellersOnly ? 1 : 0) +
    (ratings45Only ? 1 : 0);

  const matchesFilters = (dish: any, applyCategory = true) => {
    const q = searchQuery.trim().toLowerCase();
    if (
      q &&
      !dish.name.toLowerCase().includes(q) &&
      !dish.description.toLowerCase().includes(q) &&
      !dish.category.toLowerCase().includes(q) &&
      !dish.menuGroup.toLowerCase().includes(q)
    ) {
      return false;
    }
    if (applyCategory && selectedCategory !== 'All') {
      const catLower = selectedCategory.toLowerCase();
      if (catLower === 'mains' || catLower === 'curries') {
        const dCat = dish.category.toLowerCase();
        const dGrp = dish.menuGroup.toLowerCase();
        if (!dCat.includes('curries') && !dGrp.includes('curries')) {
          return false;
        }
      } else if (catLower === 'rolls') {
        if (!dish.name.toLowerCase().includes('roll') && !dish.category.toLowerCase().includes('roll')) {
          return false;
        }
      } else if (
        !dish.category.toLowerCase().includes(catLower) &&
        !dish.menuGroup.toLowerCase().includes(catLower)
      ) {
        return false;
      }
    }
    if (vegOnly && !dish.veg) return false;
    if (nonVegOnly && dish.veg) return false;
    if (under250 && dish.price > 250) return false;
    if (bestsellersOnly && !dish.badge) return false;
    if (ratings45Only && (dish.rating || 0) < 4.5) return false;
    return true;
  };

  const homeDishes = useMemo(() => {
    const filtered = MENU_ITEMS.filter((d) => matchesFilters(d, true));
    if (selectedCategory === 'All' && !searchQuery.trim() && activeFilterCount === 0) {
      return filtered.filter((d) => d.popular);
    }
    return filtered;
  }, [searchQuery, selectedCategory, vegOnly, nonVegOnly, under250, bestsellersOnly, ratings45Only]);

  const menuGroupedDishes = useMemo(() => {
    const groups: Record<string, typeof MENU_ITEMS> = {};
    MENU_GROUPS.forEach((grp) => {
      groups[grp] = MENU_ITEMS.filter(
        (d) => d.menuGroup === grp && matchesFilters(d, false)
      );
    });
    return groups;
  }, [searchQuery, vegOnly, nonVegOnly, under250, bestsellersOnly, ratings45Only]);

  const totalMenuResults = useMemo(
    () => Object.values(menuGroupedDishes).reduce((acc, arr) => acc + arr.length, 0),
    [menuGroupedDishes]
  );

  // Progressive Scroll rendering bounds: expand all during search or dietary filtering
  const isFilteredOrSearching = Boolean(searchQuery.trim()) || activeFilterCount > 0;
  const effectiveVisibleCount = isFilteredOrSearching ? MENU_GROUPS.length : visibleGroupCount;
  const displayedMenuGroups = useMemo(
    () => MENU_GROUPS.slice(0, effectiveVisibleCount),
    [effectiveVisibleCount]
  );

  // --- HELPER: CART OPERATIONS ---
  const getDishQty = (dishId) => {
    if (!dishId || !cart) return 0;
    return Object.values(cart)
      .filter((entry) => entry && entry.dish && entry.dish.id === dishId)
      .reduce((sum, entry) => sum + (entry.qty || 0), 0);
  };

  const quickAddDish = (dish) => {
    playAddToCartSound();
    const key = `${dish.id}__Full__Medium__`;
    setCart((prev) => {
      const existing = prev[key];
      return {
        ...prev,
        [key]: {
          key,
          dish,
          portion: 'Full',
          spice: 'Medium',
          addons: [],
          unitPrice: dish.price,
          qty: (existing?.qty || 0) + 1
        }
      };
    });
    showToast(`Added ${dish.name} to your bag`);
  };

  const quickDecrementDish = (dishId) => {
    playRemoveFromCartSound();
    setCart((prev) => {
      const matchingKeys = Object.keys(prev).filter((k) => prev[k] && prev[k].dish && prev[k].dish.id === dishId);
      if (matchingKeys.length === 0) return prev;
      const target = matchingKeys[matchingKeys.length - 1];
      const next = { ...prev };
      if (next[target].qty <= 1) {
        delete next[target];
      } else {
        next[target] = { ...next[target], qty: next[target].qty - 1 };
      }
      return next;
    });
  };

  const updateCartQty = (key, delta) => {
    if (delta > 0) {
      playAddToCartSound();
    } else {
      playRemoveFromCartSound();
    }
    setCart((prev) => {
      const entry = prev[key];
      if (!entry) return prev;
      const nextQty = entry.qty + delta;
      const next = { ...prev };
      if (nextQty <= 0) {
        delete next[key];
      } else {
        next[key] = { ...entry, qty: nextQty };
      }
      return next;
    });
  };

  // --- CUSTOMIZATION SHEET ---
  const openCustomization = (dish) => {
    setCustomDish(dish);
    setCustomPortion('Full');
    setCustomSpice('Medium');
    setCustomAddons([]);
    setCustomNotes('');
  };

  const customTotalUnit = useMemo(() => {
    if (!customDish) return 0;
    const base =
      customPortion === 'Half' && customDish.halfPrice
        ? customDish.halfPrice
        : customDish.price;
    const addonSum = customAddons.reduce((sum, id) => {
      const found = ADDONS.find((a) => a.id === id);
      return sum + (found ? found.price : 0);
    }, 0);
    return base + addonSum;
  }, [customDish, customPortion, customAddons]);

  const confirmCustomizationAdd = () => {
    if (!customDish) return;
    playAddToCartSound();
    const addonLabels = customAddons
      .map((id) => ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean);
    const trimmedNote = customNotes.trim();
    const key = `${customDish.id}__${customPortion}__${customSpice}__${addonLabels.join(',')}__${trimmedNote}`;
    setCart((prev) => {
      const existing = prev[key];
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
          qty: (existing?.qty || 0) + 1
        }
      };
    });
    showToast(`Added ${customDish.name} (${customPortion})`);
    setCustomDish(null);
  };

  // --- BILLING & COUPON CALCULATION ---
  const cartSummary = useMemo(() => {
    const entries = Object.values(cart || {}).filter(
      (e) => e && e.dish && e.dish.id && typeof e.qty === 'number'
    );
    const itemCount = entries.reduce((sum, e) => sum + (e.qty || 0), 0);
    const subtotal = entries.reduce(
      (sum, e) => sum + (e.unitPrice || 0) * (e.qty || 0),
      0
    );

    let couponDiscount = 0;
    let activeCouponObj = null;
    if (appliedCouponCode) {
      const c = COUPONS.find((cp) => cp.code === appliedCouponCode);
      if (c && subtotal >= c.minOrder) {
        activeCouponObj = c;
        if (c.type === 'percent') {
          couponDiscount = Math.min(Math.round((subtotal * c.value) / 100), c.maxDiscount);
        } else {
          couponDiscount = c.value;
        }
      }
    }

    const pointsDiscount = redeemPoints && royalPoints >= 50 && subtotal > 0 ? 50 : 0;
    const totalDiscount = Math.min(subtotal, couponDiscount + pointsDiscount);
    const taxable = Math.max(0, subtotal - totalDiscount);
    const gst = Math.round(taxable * 0.05);
    const grandTotal = taxable + gst;

    return {
      entries,
      itemCount,
      subtotal,
      couponDiscount,
      pointsDiscount,
      activeCouponObj,
      gst,
      grandTotal
    };
  }, [cart, appliedCouponCode, redeemPoints, royalPoints]);

  const handleApplyCouponCode = (codeRaw) => {
    const code = codeRaw.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code === code);
    if (!found) {
      showToast('Invalid coupon code. Try ZAIKA25 or TABLE10.');
      return;
    }
    setAppliedCouponCode(found.code);
    setCouponInput(found.code);
    if (cartSummary.subtotal >= found.minOrder) {
      showToast(`${found.code} applied to your order!`);
    } else {
      const diff = found.minOrder - cartSummary.subtotal;
      showToast(`${found.code} saved! Add ₹${diff} more to unlock.`);
    }
  };

  // Actual order execution (called after loyalty modal or directly if already logged in)
  const executePlaceOrder = async () => {
    playOrderPlacedSound();
    const orderId = `PMZ-${Math.floor(400 + Math.random() * 580)}`;
    const usedPoints = cartSummary.pointsDiscount > 0;
    if (usedPoints && loyaltySnapshot) {
      setLoyaltySnapshot((prev) => prev ? { ...prev, availablePoints: Math.max(0, prev.availablePoints - 50), redeemedTotal: prev.redeemedTotal + 50 } : prev);
      setRedeemPoints(false);
    }
    const newOrder = {
      id: orderId,
      table: selectedTable,
      total: cartSummary.grandTotal,
      itemsCount: cartSummary.itemCount,
      stage: 0,
      createdAt: new Date().toISOString(),
      customerPhone: loyaltyCustomer?.phone || null,
      customerName: loyaltyCustomer?.name || null,
    };
    setLiveOrder(newOrder);
    setCart({});
    setCookingNotes('');
    setCartOpen(false);
    showToast(`Order #${orderId} placed for ${selectedTable}!`);

    // Non-blocking background notification to kitchen service queue
    try {
      await fetch('/api/public/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          tableLabel: selectedTable,
          type: 'assistance',
          note: `New Order #${orderId} (${newOrder.itemsCount} items, ₹${newOrder.total})${loyaltyCustomer ? ` | Customer: ${loyaltyCustomer.name} (${loyaltyCustomer.phone})` : ''}`
        })
      });
    } catch { }

    // Award points on backend (non-blocking)
    if (loyaltyCustomer && loyaltySnapshot !== null) {
      // Optimistically add points earned (1 point per order by default)
      setLoyaltySnapshot((prev) => prev ? { ...prev, availablePoints: prev.availablePoints + 10, earnedTotal: prev.earnedTotal + 10 } : prev);
    }
  };

  const handlePlaceOrder = () => {
    if (!loyaltyCustomer) {
      // Show loyalty login modal first
      setLoyaltyModalOpen(true);
      setLoyaltyPendingOrder(true);
      setLoyaltyStep('phone');
      setLoyaltyError('');
    } else {
      executePlaceOrder();
    }
  };

  const handleRedeemRoyalPoints = () => {
    if (royalPoints >= 50) {
      setRedeemPoints(true);
      setCartOpen(true);
      showToast('₹50 Royal Pass credit activated in cart!');
    } else {
      showToast('Earn 50 pts to redeem ₹50 off');
    }
  };

  const handleRingSteward = async (optionalNote?: string) => {
    playStewardBellSound();
    setStewardAlerted(true);
    showToast(`Steward notified for ${selectedTable}`);
    try {
      await fetch('/api/public/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          tableLabel: selectedTable,
          type: 'steward',
          note: optionalNote || `Steward called to table ${selectedTable}`
        })
      });
    } catch { }
    setTimeout(() => setStewardAlerted(false), 9000);
  };

  const handleRegisterComplaint = async () => {
    if (!complaintNote.trim()) {
      showToast('Please describe your concern');
      return;
    }
    setComplaintSubmitting(true);
    try {
      await fetch('/api/public/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          name: `Guest at ${selectedTable}`,
          phone: complaintPhone.trim() || '9876543210',
          complaint: complaintNote.trim(),
          category: complaintCategory,
          tableNumber: selectedTable
        })
      });
    } catch { }
    setComplaintSubmitting(false);
    setComplaintOpen(false);
    setComplaintNote('');
    setComplaintPhone('');
    showToast(`Manager alerted for ${selectedTable}. Priority support assigned.`);
  };

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText('+917488260572');
    setPhoneCopied(true);
    showToast('Copied +91 74882 60572');
    setTimeout(() => setPhoneCopied(false), 2200);
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = !prev[id];
      showToast(next ? 'Saved to favorites' : 'Removed from favorites');
      return { ...prev, [id]: next };
    });
  };

  const badgeStyle = (type) => {
    if (type === 'saffron') return 'bg-[#E89223] text-white';
    if (type === 'emerald') return 'bg-[#1A7F5A] text-white';
    return 'bg-[#3B155E] text-white';
  };

  const activeSlide = HERO_SLIDES[heroIndex];

  return (
    <div className="min-h-screen w-full bg-[#07030b] text-white flex justify-center sm:py-5 font-jakarta antialiased selection:bg-[#f59e0b]/20 selection:text-[#f59e0b]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600;1,700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
        .font-editorial { font-family: 'Playfair Display', Georgia, serif; }
        .tnum { font-variant-numeric: tabular-nums; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Mobile Viewport Container (430px centered on desktop, full-bleed on mobile) */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[852px] bg-[#0c0615] relative sm:rounded-[34px] shadow-[0_0_60px_rgba(0,0,0,0.9)] sm:border sm:border-[#2b1942] overflow-hidden flex flex-col text-white">
        {/* Subtle architectural background watermark matching client reference */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.08] overflow-hidden z-0">
          <ArchitecturalMandalaSvg
            className="w-[720px] h-[720px] -top-28 -left-36 absolute"
            strokeColor="#7241a3"
            accentColor="#f59e0b"
            strokeWidth={0.8}
          />
        </div>

        {/* Floating Toast */}
        {toast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[88%] max-w-[340px] pointer-events-none">
            <div className="px-4 py-2.5 rounded-2xl bg-[#1c0f2e] border border-[#3b1d5c] text-white text-xs font-semibold shadow-[0_12px_28px_rgba(0,0,0,0.6)] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#f59e0b] shrink-0" />
              <span className="truncate">{toast}</span>
            </div>
          </div>
        )}

        {/* =================================================================
            MAIN SCROLLABLE CONTENT AREA
           ================================================================= */}
        <main
          ref={mainScrollRef}
          onScroll={handleMainScroll}
          className="flex-1 overflow-y-auto no-scrollbar pb-28"
        >
          {/* ---------------------------------------------------------------
              TAB 1: HOME (TACO BELL CLEAN D2C RHYTHM — PM ZAIKA IDENTITY)
             --------------------------------------------------------------- */}
          {activeTab === 'home' && (
            <div className="px-4 pt-4 space-y-5">
              {/* 1. Top App Header */}
              <header className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => setTableModalOpen(true)}
                    className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#f59e0b]/60 shadow-md shadow-amber-500/10 hover:border-[#f59e0b] transition-all cursor-pointer shrink-0 bg-black/80 p-0.5"
                    aria-label="Switch dining table or view restaurant info"
                    title="PM Zaika Restaurant • Select Table"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo.png"
                      alt="PM Zaika Restaurant"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </button>

                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => setTableModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8e829c] hover:text-white cursor-pointer tnum"
                    >
                      <span>
                        {selectedTable} •{' '}
                        {selectedTable === 'Takeaway' ? 'Pickup' : 'Dine-In'}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#E89223]" />
                    </button>
                    <h1 className="text-[21px] font-black tracking-tight text-white leading-none mt-0.5">
                      PM ZAIKA
                    </h1>
                    <p className="text-[11px] font-medium text-[#8e829c] mt-0.5 truncate">
                      Indian • Chinese • Tandoor • Rolls
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Rewards Points — tap to open loyalty modal */}
                  <button
                    type="button"
                    onClick={() => { setLoyaltyModalOpen(true); setLoyaltyStep(loyaltyCustomer ? 'loggedIn' : 'phone'); setLoyaltyPendingOrder(false); setLoyaltyError(''); }}
                    className="h-10 px-2.5 rounded-2xl bg-[#140b20] border border-[#2b1942] shadow-md flex items-center gap-1.5 text-white hover:bg-[#1c0f2e] transition-colors cursor-pointer"
                    title="Royal Loyalty Points"
                    aria-label="Royal Points"
                  >
                    <Crown className="w-3.5 h-3.5 text-[#E89223]" />
                    <span className="text-[11px] font-black text-white tnum">{royalPoints}</span>
                    <span className="text-[9px] font-bold text-[#f59e0b]">PTS</span>
                  </button>

                  {/* Steward Bell */}
                  <button
                    type="button"
                    onClick={() => handleRingSteward()}
                    className={`relative w-10 h-10 rounded-2xl border border-[#2b1942] shadow-md flex items-center justify-center transition-colors cursor-pointer ${stewardAlerted
                      ? 'bg-[#f59e0b] text-[#140b20]'
                      : 'bg-[#140b20] text-white hover:bg-[#1c0f2e]'
                      }`}
                    aria-label="Notify Steward"
                    title="Call Steward to Table"
                  >
                    <Bell className="w-[18px] h-[18px]" />
                    <span className="absolute -top-1 -right-1 w-[16px] h-[16px] rounded-full bg-[#f59e0b] text-[#140b20] text-[9px] font-black flex items-center justify-center border-2 border-[#0c0615] tnum">
                      {stewardAlerted ? '✓' : '1'}
                    </span>
                  </button>

                  {/* Sound FX Toggle */}
                  <button
                    type="button"
                    onClick={handleToggleSound}
                    className="w-10 h-10 rounded-2xl bg-[#140b20] border border-[#2b1942] shadow-md flex items-center justify-center text-[#8e829c] hover:text-[#f59e0b] hover:bg-[#1c0f2e] transition-colors cursor-pointer"
                    aria-label={soundActive ? 'Mute sound effects' : 'Enable sound effects'}
                    title={soundActive ? 'Sound Effects Active (Tap to Mute)' : 'Sound Effects Muted (Tap to Enable)'}
                  >
                    {soundActive ? (
                      <Volume2 className="w-[18px] h-[18px] text-[#f59e0b]" />
                    ) : (
                      <VolumeX className="w-[18px] h-[18px] text-[#8e829c]" />
                    )}
                  </button>

                  {/* Bag Button */}
                  <button
                    type="button"
                    onClick={() => setCartOpen(true)}
                    className="relative w-10 h-10 rounded-2xl bg-[#140b20] border border-[#2b1942] shadow-md flex items-center justify-center text-white hover:bg-[#1c0f2e] transition-colors cursor-pointer"
                    aria-label="Open Order Bag"
                  >
                    <ShoppingBag className="w-[18px] h-[18px]" />
                    {cartSummary.itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-[#f59e0b] text-[#140b20] text-[9px] font-black flex items-center justify-center border-2 border-[#0c0615] tnum">
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
                    className="w-full h-12 rounded-2xl bg-[#140b20] border border-[#2b1942] pl-11 pr-9 text-[13.5px] font-medium text-white placeholder-[#796d8a] focus:outline-none focus:border-[#7241a3] transition-colors"
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
                  className={`relative w-12 h-12 rounded-2xl border border-[#2b1942] shadow-md flex items-center justify-center transition-colors cursor-pointer shrink-0 ${activeFilterCount > 0
                    ? 'bg-[#f59e0b] text-[#140b20]'
                    : 'bg-[#140b20] text-white hover:bg-[#1c0f2e]'
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

              {/* 3. Hero Promo Banner Carousel */}
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
                        );
                        if (target) openCustomization(target);
                      }}
                      className="mt-3.5 w-fit h-9 pl-4 pr-1.5 rounded-full bg-[#E89223] hover:bg-[#D48016] text-white text-[12px] font-bold inline-flex items-center gap-2 shadow-[0_6px_16px_rgba(232,146,35,0.35)] transition-colors cursor-pointer"
                    >
                      <span>{activeSlide.cta}</span>
                      <span className="w-6 h-6 rounded-full bg-white text-[#2D1148] flex items-center justify-center">
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.6]" />
                      </span>
                    </button>
                  </div>

                  {/* Right Column (44%) */}
                  <div className="w-[44%] pr-3.5 py-4 flex items-center justify-center relative">
                    <div className="relative w-[144px] h-[144px] flex items-center justify-center">
                      <ArchitecturalMandalaSvg
                        className="absolute inset-0 w-full h-full opacity-55"
                        strokeColor="#E8D2F5"
                        accentColor="#F3C669"
                        strokeWidth={1.25}
                      />
                      <div className="w-[100px] h-[100px] rounded-full p-[3px] bg-gradient-to-tr from-[#E89223] via-[#F7D794] to-[#6E3B9E] shadow-[0_10px_24px_rgba(12,4,22,0.55)] relative z-10">
                        <img
                          src={activeSlide.image}
                          alt={activeSlide.accent}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_FOOD_IMG;
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
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === heroIndex
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
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                      >
                        <div
                          className={`w-[64px] h-[64px] rounded-full p-1 transition-all ${isActive
                            ? 'bg-[#180e28] ring-2 ring-[#f59e0b]'
                            : 'bg-[#140b20] border border-[#2b1942] group-hover:border-[#7241a3]'
                            }`}
                        >
                          <img
                            src={cat.image}
                            alt={cat.label}
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_FOOD_IMG;
                            }}
                            className="w-full h-full rounded-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <span
                          className={`text-[11.5px] leading-none ${isActive
                            ? 'font-bold text-[#f59e0b]'
                            : 'font-semibold text-[#8e829c]'
                            }`}
                        >
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Architectural Mandala Hairline Divider */}
              <ArchitecturalMandalaDivider className="-my-1" />

              {/* 5. Popular Picks Horizontal Scrollable Card Row */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[18px] font-extrabold text-white tracking-tight">
                    {selectedCategory === 'All' && !searchQuery.trim()
                      ? 'Popular Picks'
                      : selectedCategory !== 'All'
                        ? `${selectedCategory} Specials`
                        : 'Search Results'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('menu');
                      setVisibleGroupCount(MENU_GROUPS.length);
                      if (selectedCategory !== 'All') {
                        setTimeout(() => {
                          const matchedGroup = MENU_GROUPS.find((g) =>
                            g.toLowerCase().includes(selectedCategory.toLowerCase())
                          );
                          if (matchedGroup) {
                            const targetId = `section-${matchedGroup.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }, 120);
                      }
                    }}
                    className="text-[13px] font-bold text-[#f59e0b] hover:text-[#fbbf24] inline-flex items-center gap-1 cursor-pointer"
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
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setVegOnly(false);
                        setNonVegOnly(false);
                        setUnder250(false);
                        setBestsellersOnly(false);
                      }}
                      className="mt-3 h-8 px-4 rounded-full bg-[#2D1148] text-white text-xs font-bold cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
                    {homeDishes.map((dish) => {
                      const qty = getDishQty(dish.id);
                      const isFav = !!favorites[dish.id];
                      return (
                        <article
                          key={dish.id}
                          onClick={() => openCustomization(dish)}
                          className="w-[168px] shrink-0 bg-[#140b20] border border-[#2b1942] rounded-[22px] p-3 shadow-lg flex flex-col justify-between cursor-pointer hover:border-[#7241a3] transition-colors"
                        >
                          <div>
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
                                  className={`w-4 h-4 transition-colors ${isFav
                                    ? 'fill-[#E84C6F] text-[#E84C6F]'
                                    : 'text-[#B2A9BC]'
                                    }`}
                                />
                              </button>
                            </div>

                            <div className="relative mb-2.5">
                              <img
                                src={dish.image}
                                alt={dish.name}
                                onError={(e) => {
                                  e.currentTarget.src = FALLBACK_FOOD_IMG;
                                }}
                                className="h-[96px] w-full rounded-[14px] object-cover"
                                loading="lazy"
                              />
                            </div>

                            <h3 className="text-[14px] font-bold text-white truncate leading-snug">
                              {dish.name}
                            </h3>
                            <p className="text-[11px] text-[#8e829c] line-clamp-1 mt-0.5">
                              {dish.description}
                            </p>

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

                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-3 pt-1 flex items-center justify-between"
                          >
                            <span className="text-[15px] font-black text-white tnum">
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
                                className="w-8 h-8 rounded-full bg-[#140b20] border border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-[#140b20] flex items-center justify-center shadow-lg cursor-pointer transition-colors"
                                aria-label={`Add ${dish.name}`}
                              >
                                <Plus className="w-4 h-4 stroke-[2.8]" />
                              </button>
                            ) : (
                              <div className="h-8 px-1.5 rounded-full bg-[#140b20] border border-[#f59e0b] text-[#f59e0b] inline-flex items-center gap-2 text-xs font-black tnum shadow-lg">
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
                      );
                    })}
                  </div>
                )}
              </section>

              {/* 6. Exclusive Offer Banner */}
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
                      handleApplyCouponCode('ZAIKA25');
                      setActiveTab('offers');
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
              <section className="rounded-[22px] bg-[#140b20] border border-[#2b1942] p-3.5 shadow-md flex items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#FDEBD3] flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 fill-[#E89223] text-[#E89223]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-bold text-white leading-snug">
                      Dining at PM Zaika?
                    </p>
                    <p className="text-[11px] text-[#8e829c] truncate">
                      Share 30-sec feedback &amp; earn 50 pts
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackDone(false);
                    setFeedbackOpen(true);
                  }}
                  className="shrink-0 h-8 px-4 rounded-full bg-[#f59e0b] text-[#140b20] text-xs font-black cursor-pointer transition-colors shadow-md"
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
            <div className="pb-10">
              {/* Sticky Search & Filter Header matching client reference screenshot */}
              <div className="sticky top-0 z-20 bg-[#0c0615]/95 backdrop-blur-md px-4 pt-3.5 pb-3 border-b border-[#2b1942] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[#796d8a] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for biryani, paneer, soup, rolls..."
                    className="w-full h-11 rounded-xl sm:rounded-2xl bg-[#180e28] border border-[#2e1d44] text-white placeholder-[#796d8a] pl-10 pr-9 text-xs sm:text-[13px] font-medium focus:outline-none focus:border-[#7241a3] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#796d8a] hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* 4 Filter Chips row: Veg Only, Non-Veg, Bestseller, Ratings 4.5+ */}
                <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => {
                      playFilterClickSound();
                      setVegOnly((v) => !v);
                      if (!vegOnly) setNonVegOnly(false);
                    }}
                    className={`h-8 px-3 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${vegOnly
                      ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-[#180e28] border border-[#2e1d44] text-[#cfc5db] hover:border-[#4d2d73]'
                      }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-[3px] border border-emerald-500 bg-[#140b20] flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </span>
                    <span>Veg Only</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playFilterClickSound();
                      setNonVegOnly((v) => !v);
                      if (!nonVegOnly) setVegOnly(false);
                    }}
                    className={`h-8 px-3 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${nonVegOnly
                      ? 'bg-rose-950/80 border border-rose-500 text-rose-300 font-bold'
                      : 'bg-[#180e28] border border-[#2e1d44] text-[#cfc5db] hover:border-[#4d2d73]'
                      }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-[3px] border border-rose-500 bg-[#140b20] flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 10 10" className="w-[6px] h-[6px] fill-rose-500">
                        <polygon points="5,1.5 9,8.5 1,8.5" />
                      </svg>
                    </span>
                    <span>Non-Veg</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playFilterClickSound();
                      setBestsellersOnly((v) => !v);
                    }}
                    className={`h-8 px-3.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${bestsellersOnly
                      ? 'bg-amber-950/80 border border-[#f59e0b] text-[#f59e0b] font-bold'
                      : 'bg-[#180e28] border border-[#2e1d44] text-[#cfc5db] hover:border-[#4d2d73]'
                      }`}
                  >
                    Bestseller
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playFilterClickSound();
                      setRatings45Only((v) => !v);
                    }}
                    className={`h-8 px-3.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${ratings45Only
                      ? 'bg-amber-950/80 border border-[#f59e0b] text-[#f59e0b] font-bold'
                      : 'bg-[#180e28] border border-[#2e1d44] text-[#cfc5db] hover:border-[#4d2d73]'
                      }`}
                  >
                    Ratings 4.5+
                  </button>
                </div>
              </div>

              {/* Category Accordion Cards List */}
              <div className="px-4 pt-4 pb-20 space-y-4">
                {displayedMenuGroups.map((group) => {
                  const dishes = menuGroupedDishes[group] || [];
                  if (dishes.length === 0) return null;
                  const isCollapsed = !!collapsedGroups[group];

                  return (
                    <section
                      key={group}
                      id={`section-${group.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      className="scroll-mt-36 rounded-2xl sm:rounded-3xl bg-[#140b20] border border-[#2b1942] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                    >
                      {/* Accordion Card Header */}
                      <button
                        type="button"
                        onClick={() => toggleCategoryCollapse(group)}
                        className="w-full px-4 py-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
                      >
                        <h2 className="text-white font-bold text-[15px] sm:text-base tracking-tight">
                          {formatGroupName(group)}{' '}
                          <span className="text-[#8e829c] font-semibold text-sm">({dishes.length})</span>
                        </h2>
                        <div className="text-[#8e829c] p-1">
                          {isCollapsed ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronUp className="w-4 h-4" />
                          )}
                        </div>
                      </button>

                      {/* Dish Rows separated by divide-y */}
                      {!isCollapsed && (
                        <div className="divide-y divide-[#221334] border-t border-[#221334]">
                          {dishes.map((dish) => {
                            const qty = getDishQty(dish.id);
                            const hasBadge = dish.badge || dish.popular;
                            const badgeLabel = dish.badge === 'BESTSELLER' ? 'Bestseller' : (dish.badge === 'POPULAR' || dish.popular ? 'Must Try' : dish.badge);

                            return (
                              <article
                                key={dish.id}
                                onClick={() => openCustomization(dish)}
                                className="p-3.5 sm:p-4 flex items-start justify-between gap-3 cursor-pointer hover:bg-white/[0.015] transition-colors"
                              >
                                {/* Left: Info */}
                                <div className="flex-1 min-w-0 pr-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <FssaiDot veg={dish.veg} />
                                    {hasBadge && (
                                      <span className="text-[#f59e0b] font-bold text-xs flex items-center gap-1">
                                        ★ {badgeLabel}
                                      </span>
                                    )}
                                  </div>

                                  <h3 className="text-white font-bold text-[15px] sm:text-base leading-snug mt-1 cursor-pointer hover:text-[#f59e0b] transition-colors">
                                    {dish.name}
                                  </h3>

                                  <div className="flex items-center gap-2 mt-1 tnum">
                                    <span className="text-white font-black text-sm sm:text-base">
                                      ₹{dish.price}
                                    </span>
                                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400">
                                      ★ {dish.rating || 4.7}
                                    </span>
                                    <span className="text-[#8e829c] text-xs font-medium">
                                      ({dish.ratingCount || '150+'})
                                    </span>
                                  </div>

                                  <p className="text-[12px] text-[#9d93a8] line-clamp-2 mt-1.5 leading-relaxed font-normal">
                                    {dish.description}
                                  </p>
                                </div>

                                {/* Right: Image & Docked ADD Button */}
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex flex-col items-center shrink-0"
                                >
                                  <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                                    <img
                                      src={dish.image}
                                      alt={dish.name}
                                      onClick={() => openCustomization(dish)}
                                      onError={(e) => {
                                        e.currentTarget.src = FALLBACK_FOOD_IMG;
                                      }}
                                      className="w-full h-full rounded-2xl object-cover cursor-pointer border border-white/5 shadow-md"
                                      loading="lazy"
                                    />
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
                                      {qty === 0 ? (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            dish.customizable
                                              ? openCustomization(dish)
                                              : quickAddDish(dish)
                                          }
                                          className="h-7 px-5 rounded-lg bg-[#140b20] border border-[#f59e0b] hover:bg-[#f59e0b] hover:text-[#140b20] text-[#f59e0b] text-[11px] font-black uppercase tracking-wider shadow-lg cursor-pointer transition-colors whitespace-nowrap"
                                        >
                                          ADD
                                        </button>
                                      ) : (
                                        <div className="h-7 px-2 rounded-lg bg-[#140b20] border border-[#f59e0b] text-[#f59e0b] inline-flex items-center gap-2 text-xs font-black shadow-lg tnum">
                                          <button
                                            type="button"
                                            onClick={() => quickDecrementDish(dish.id)}
                                            className="cursor-pointer hover:text-white"
                                            aria-label="Decrease"
                                          >
                                            <Minus className="w-3.5 h-3.5 stroke-[2.8]" />
                                          </button>
                                          <span className="min-w-[14px] text-center">{qty}</span>
                                          <button
                                            type="button"
                                            onClick={() => quickAddDish(dish)}
                                            className="cursor-pointer hover:text-white"
                                            aria-label="Increase"
                                          >
                                            <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {dish.customizable && (
                                    <span className="text-[10px] text-[#8e829c] mt-3.5 block text-center font-medium">
                                      Customisable
                                    </span>
                                  )}
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  );
                })}

                {/* Progressive Scroll Loading Sentinel */}
                {effectiveVisibleCount < MENU_GROUPS.length && !isFilteredOrSearching && (
                  <div
                    ref={sentinelRef}
                    className="pt-4 pb-8 flex flex-col items-center justify-center gap-2.5"
                  >
                    <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#140b20] border border-[#2b1942] shadow-sm">
                      <div className="w-3.5 h-3.5 border-2 border-[#f59e0b] border-t-transparent rounded-full animate-spin shrink-0" />
                      <span className="text-[11.5px] font-bold text-[#cfc5db] tracking-wide">
                        Revealing royal sections ({effectiveVisibleCount} of {MENU_GROUPS.length})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVisibleGroupCount(MENU_GROUPS.length)}
                      className="text-[11px] font-bold text-[#f59e0b] hover:text-[#fbbf24] underline cursor-pointer"
                    >
                      Load all sections now
                    </button>
                  </div>
                )}

                {/* End of Menu Marker */}
                {effectiveVisibleCount >= MENU_GROUPS.length && totalMenuResults > 0 && !isFilteredOrSearching && (
                  <div className="pt-6 pb-8 text-center space-y-1 opacity-75">
                    <p className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-[#f59e0b]">
                      ◈ End of PM Zaika Royal Menu ◈
                    </p>
                    <p className="text-[11px] font-medium text-[#8e829c]">
                      {totalMenuResults} authentic Awadhi delicacies freshly prepared to order
                    </p>
                  </div>
                )}

                {/* Empty State */}
                {totalMenuResults === 0 && (
                  <div className="p-8 rounded-[22px] bg-[#140b20] border border-[#2b1942] text-center shadow-lg">
                    <p className="text-sm font-bold text-white">
                      No dishes match your filters
                    </p>
                    <p className="text-xs text-[#8e829c] mt-1">
                      Try adjusting your search query or dietary filters.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setVegOnly(false);
                        setNonVegOnly(false);
                        setBestsellersOnly(false);
                        setUnder250(false);
                        setRatings45Only(false);
                      }}
                      className="mt-3 h-9 px-5 rounded-full bg-[#f59e0b] text-[#140b20] text-xs font-black cursor-pointer shadow-md hover:brightness-110"
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
                <h1 className="text-[21px] font-extrabold text-white">
                  Offers &amp; Rewards
                </h1>
                <p className="text-xs font-medium text-[#8e829c] mt-0.5">
                  Exclusive PM Zaika dine-in privileges &amp; combos
                </p>
              </div>

              <RoyalPassCard
                royalPoints={royalPoints}
                selectedTable={selectedTable}
                onRedeem={handleRedeemRoyalPoints}
              />

              <section className="space-y-3">
                <h2 className="text-[15px] font-extrabold text-white">
                  Available Coupons
                </h2>
                {COUPONS.map((c) => {
                  const isApplied = appliedCouponCode === c.code;
                  return (
                    <div
                      key={c.code}
                      className="rounded-[22px] bg-[#140b20] border border-[#2b1942] p-4 shadow-lg flex items-center justify-between gap-3 text-white"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#180e28] text-[#f59e0b] border border-[#2b1942] text-[11px] font-extrabold tracking-wider tnum">
                            {c.code}
                          </span>
                          <span className="text-[9.5px] font-bold uppercase text-[#f59e0b]">
                            {c.badge}
                          </span>
                        </div>
                        <h3 className="text-[14.5px] font-bold text-white mt-1.5">
                          {c.title}
                        </h3>
                        <p className="text-[11.5px] text-[#8e829c] mt-0.5">
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
                        className={`shrink-0 h-9 px-4 rounded-full text-xs font-bold cursor-pointer transition-colors ${isApplied
                          ? 'bg-[#1A7F5A] text-white'
                          : 'bg-[#f59e0b] hover:bg-[#d97706] text-[#140b20] font-black'
                          }`}
                      >
                        {isApplied ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                  );
                })}
              </section>
            </div>
          )}

          {/* ---------------------------------------------------------------
              TAB 4: INFO / CONCIERGE HUB
             --------------------------------------------------------------- */}
          {activeTab === 'hub' && (
            <div className="px-4 pt-5 space-y-4">
              <section className="rounded-[24px] bg-[#140b20] border border-[#2b1942] p-4 shadow-lg flex items-center gap-3.5 text-white">
                <PmZaikaCrest />
                <div className="min-w-0">
                  <h1 className="text-[18px] font-extrabold text-white leading-tight">
                    PM ZAIKA RESTAURANT
                  </h1>
                  <p className="text-[11.5px] font-medium text-[#8e829c] mt-0.5">
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

              <RoyalPassCard
                royalPoints={royalPoints}
                selectedTable={selectedTable}
                onRedeem={handleRedeemRoyalPoints}
                compact
              />

              <section className="rounded-[22px] bg-[#140b20] border border-[#2b1942] p-4 shadow-lg space-y-3 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8e829c]">
                    Restaurant Contact &amp; Orders
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#180e28] border border-[#2b1942] text-[#f59e0b] text-[10px] font-bold">
                    Main Helpline
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div>
                    <a
                      href="tel:+917488260572"
                      className="text-[17px] font-extrabold text-white hover:text-[#f59e0b] tnum"
                    >
                      +91 74882 60572
                    </a>
                    <p className="text-[11.5px] text-[#8e829c] mt-0.5 tnum">
                      Secondary Helpline: 95257 48843
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="h-9 px-3 rounded-xl bg-[#180e28] hover:bg-[#201036] border border-[#2b1942] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
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
                      className="h-9 px-3.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#140b20] text-xs font-black inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              </section>

              <section className="rounded-[22px] bg-[#140b20] border border-[#2b1942] p-4 shadow-lg flex items-start justify-between gap-3 text-white">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#F2EAF8] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#2D1148]" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-[13px] font-bold text-white">
                      Phulwari Sharif, Patna
                    </h2>
                    <p className="text-[11.5px] text-[#8e829c] leading-relaxed mt-0.5">
                      Phulwari Rd, Near Shaheed Bhagat Singh Chowk, Birla Colony, Phulwari Sharif, Patna, Bihar 801505
                    </p>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Phulwari+Rd+Near+Shaheed+Bhagat+Singh+Chowk+Birla+Colony+Phulwari+Sharif+Patna+Bihar+801505"
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 h-8 px-3 rounded-full bg-[#180e28] hover:bg-[#201036] border border-[#2b1942] text-[#f59e0b] text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </section>

              <button
                type="button"
                onClick={() => {
                  setFeedbackDone(false);
                  setFeedbackOpen(true);
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
            BOTTOM 5-TAB NAVIGATION (DARK OBSIDIAN GLASS WITH GOLD ACCENTS)
           ================================================================= */}
        <nav
          aria-label="Primary Navigation"
          className="absolute bottom-0 left-0 right-0 z-30 h-[74px] bg-[#0c0615]/95 backdrop-blur-md rounded-t-[26px] border-t border-[#2b1942] shadow-[0_-8px_30px_rgba(0,0,0,0.6)] px-3 grid grid-cols-5 items-center"
        >
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <Home
              className={`w-[21px] h-[21px] transition-colors ${activeTab === 'home' ? 'text-[#f59e0b] stroke-[2.4]' : 'text-[#8e829c]'
                }`}
            />
            <span
              className={`text-[10.5px] ${activeTab === 'home'
                ? 'font-extrabold text-[#f59e0b]'
                : 'font-semibold text-[#8e829c]'
                }`}
            >
              Home
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <LayoutGrid
              className={`w-[21px] h-[21px] transition-colors ${activeTab === 'menu' ? 'text-[#f59e0b] stroke-[2.4]' : 'text-[#8e829c]'
                }`}
            />
            <span
              className={`text-[10.5px] ${activeTab === 'menu'
                ? 'font-extrabold text-[#f59e0b]'
                : 'font-semibold text-[#8e829c]'
                }`}
            >
              Menu
            </span>
          </button>

          <div className="flex flex-col items-center justify-center relative">
            <div className="relative -mt-7 w-[74px] h-[74px] flex items-center justify-center">
              <ArchitecturalMandalaSvg
                className="absolute inset-0 w-full h-full opacity-60"
                strokeColor="#7241a3"
                accentColor="#f59e0b"
                strokeWidth={1.5}
              />
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="w-[62px] h-[62px] rounded-full bg-[#180c29] hover:bg-[#201036] text-[#f59e0b] shadow-[0_10px_24px_rgba(0,0,0,0.7)] border-2 border-[#f59e0b] flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95 relative z-10"
                aria-label="Open Cart & Order"
              >
                <ShoppingBag className="w-[20px] h-[20px]" />
                <span className="text-[9.5px] font-bold mt-0.5 leading-none">Order</span>
                {cartSummary.itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] px-1 rounded-full bg-[#f59e0b] text-[#0c0615] text-[10px] font-extrabold flex items-center justify-center border-2 border-[#0c0615] tnum">
                    {cartSummary.itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('offers')}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <Tag
              className={`w-[21px] h-[21px] transition-colors ${activeTab === 'offers' ? 'text-[#f59e0b] stroke-[2.4]' : 'text-[#8e829c]'
                }`}
            />
            <span
              className={`text-[10.5px] ${activeTab === 'offers'
                ? 'font-extrabold text-[#f59e0b]'
                : 'font-semibold text-[#8e829c]'
                }`}
            >
              Offers
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hub')}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <User
              className={`w-[21px] h-[21px] transition-colors ${activeTab === 'hub' ? 'text-[#f59e0b] stroke-[2.4]' : 'text-[#8e829c]'
                }`}
            />
            <span
              className={`text-[10.5px] ${activeTab === 'hub'
                ? 'font-extrabold text-[#f59e0b]'
                : 'font-semibold text-[#8e829c]'
                }`}
            >
              Hub
            </span>
          </button>
        </nav>

        {/* Floating 📖 MENU Quick-Jump Button on Menu tab */}
        {activeTab === 'menu' && (
          <button
            type="button"
            onClick={() => setCategoryDrawerOpen(true)}
            className="absolute bottom-[86px] right-4 z-20 h-10 px-4 rounded-full bg-[#140b20] border border-[#f59e0b] text-[#f59e0b] font-black text-xs tracking-wider shadow-[0_8px_24px_rgba(0,0,0,0.6)] flex items-center gap-2 cursor-pointer active:scale-95 transition-all select-none hover:bg-[#f59e0b] hover:text-[#140b20]"
            aria-label="Browse Menu Categories"
          >
            <BookOpen className="w-4 h-4 stroke-[2.5]" />
            <span>MENU</span>
          </button>
        )}

        {/* MODAL 1: TABLE SELECTOR */}
        {tableModalOpen && (
          <div
            onClick={() => setTableModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[430px] rounded-t-[28px] bg-[#140b20] border-t border-[#2b1942] p-5 shadow-2xl animate-in slide-in-from-bottom duration-200 text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#2b1942]">
                <div>
                  <h3 className="text-[16px] font-extrabold text-white">
                    Select Dining Table
                  </h3>
                  <p className="text-xs text-[#8e829c]">
                    Choose your table number or takeaway pickup
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTableModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#180e28] flex items-center justify-center text-[#8e829c] hover:text-white cursor-pointer"
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
                      setSelectedTable(tbl);
                      try {
                        const url = new URL(window.location.href);
                        if (tbl === 'Takeaway') {
                          url.searchParams.set('table', 'takeaway');
                        } else {
                          const num = tbl.replace(/\D/g, '');
                          url.searchParams.set('table', num ? num.padStart(2, '0') : tbl.toLowerCase());
                        }
                        window.history.replaceState({}, '', url.toString());
                      } catch { }
                      setTableModalOpen(false);
                      showToast(`Switched to ${tbl}`);
                    }}
                    className={`py-2.5 rounded-2xl text-xs font-bold tnum cursor-pointer transition-colors ${selectedTable === tbl
                      ? 'bg-[#f59e0b] text-[#140b20] font-black shadow-lg'
                      : 'bg-[#180e28] border border-[#2b1942] text-white hover:bg-[#201036]'
                      }`}
                  >
                    {tbl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: FILTER BOTTOM SHEET */}
        {filterSheetOpen && (
          <div
            onClick={() => setFilterSheetOpen(false)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[430px] rounded-t-[28px] bg-[#140b20] border-t border-[#2b1942] p-5 shadow-2xl animate-in slide-in-from-bottom duration-200 text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#2b1942]">
                <h3 className="text-[16px] font-extrabold text-white">
                  Filter Menu
                </h3>
                <button
                  type="button"
                  onClick={() => setFilterSheetOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#180e28] flex items-center justify-center text-[#8e829c] hover:text-white cursor-pointer"
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
                      setVegOnly((v) => !v);
                      if (!vegOnly) setNonVegOnly(false);
                    }
                  },
                  {
                    label: 'Non-Veg Only',
                    active: nonVegOnly,
                    toggle: () => {
                      setNonVegOnly((v) => !v);
                      if (!nonVegOnly) setVegOnly(false);
                    }
                  },
                  {
                    label: 'Ratings 4.5+ Only',
                    active: ratings45Only,
                    toggle: () => setRatings45Only((v) => !v)
                  },
                  {
                    label: 'Under ₹250',
                    active: under250,
                    toggle: () => setUnder250((v) => !v)
                  },
                  {
                    label: 'Bestsellers & Chef Picks',
                    active: bestsellersOnly,
                    toggle: () => setBestsellersOnly((v) => !v)
                  }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={opt.toggle}
                    className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between text-[13px] font-bold cursor-pointer transition-colors ${opt.active
                      ? 'bg-amber-950/70 border border-[#f59e0b] text-[#f59e0b]'
                      : 'bg-[#180e28] border border-[#2b1942] text-white hover:bg-[#201036]'
                      }`}
                  >
                    <span>{opt.label}</span>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${opt.active ? 'bg-[#f59e0b] text-[#140b20]' : 'bg-[#140b20] border border-[#3e245c]'
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
                    setVegOnly(false);
                    setNonVegOnly(false);
                    setRatings45Only(false);
                    setUnder250(false);
                    setBestsellersOnly(false);
                  }}
                  className="h-11 rounded-full bg-[#180e28] border border-[#2b1942] text-[#8e829c] hover:text-white text-xs font-extrabold cursor-pointer transition-colors"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSheetOpen(false)}
                  className="h-11 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#140b20] text-xs font-black cursor-pointer transition-colors shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: DISH DETAIL & CUSTOMIZATION SHEET */}
        {customDish && (
          <div
            onClick={() => setCustomDish(null)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[430px] rounded-t-[28px] bg-[#140b20] border-t border-[#2b1942] max-h-[88%] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200 text-white"
            >
              <div className="relative h-[168px] shrink-0">
                <img
                  src={customDish.image}
                  alt={customDish.name}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_FOOD_IMG;
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140b20] via-black/40 to-transparent" />
                <button
                  type="button"
                  onClick={() => setCustomDish(null)}
                  className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-[#140b20]/90 border border-white/20 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-[#140b20]"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-2">
                    <FssaiDot veg={customDish.veg} />
                    <span className="text-xs font-bold inline-flex items-center gap-1 tnum">
                      <Star className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                      {customDish.rating} ({customDish.ratingCount})
                    </span>
                  </div>
                  <h3 className="text-[19px] font-extrabold mt-0.5 leading-tight">
                    {customDish.name}
                  </h3>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                <p className="text-xs text-[#9d93a8] leading-relaxed">
                  {customDish.description}
                </p>

                {customDish.halfPrice && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-extrabold text-white">
                        Choose Portion
                      </span>
                      <span className="text-[10.5px] font-bold text-[#f59e0b]">
                        Required
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: 'Half', price: customDish.halfPrice },
                        { label: 'Full', price: customDish.price }
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => setCustomPortion(opt.label)}
                          className={`p-3 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-colors ${customPortion === opt.label
                            ? 'bg-amber-950/70 border-[#f59e0b] text-[#f59e0b]'
                            : 'bg-[#180e28] border-[#2b1942] text-white hover:bg-[#201036]'
                            }`}
                        >
                          <span className="text-xs font-bold">{opt.label}</span>
                          <span className="text-xs font-extrabold tnum">₹{opt.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="block text-[13px] font-extrabold text-white mb-2">
                    Spice Preference
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Mild', 'Medium', 'Royal Spicy'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setCustomSpice(level)}
                        className={`py-2.5 px-2 rounded-2xl border text-[11.5px] font-bold inline-flex items-center justify-center gap-1 cursor-pointer transition-colors ${customSpice === level
                          ? 'bg-amber-950/70 border-[#f59e0b] text-[#f59e0b]'
                          : 'bg-[#180e28] border-[#2b1942] text-white hover:bg-[#201036]'
                          }`}
                      >
                        {level === 'Royal Spicy' && (
                          <Flame className="w-3 h-3 text-[#f59e0b]" />
                        )}
                        <span>{level}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[13px] font-extrabold text-white mb-2">
                    Add Royal Accompaniments
                  </span>
                  <div className="space-y-2">
                    {ADDONS.map((addon) => {
                      const isSelected = customAddons.includes(addon.id);
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() =>
                            setCustomAddons((prev) =>
                              prev.includes(addon.id)
                                ? prev.filter((id) => id !== addon.id)
                                : [...prev, addon.id]
                            )
                          }
                          className={`w-full p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${isSelected
                            ? 'bg-amber-950/70 border-[#f59e0b] text-[#f59e0b]'
                            : 'bg-[#180e28] border-[#2b1942] text-white hover:bg-[#201036]'
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-black ${isSelected
                                ? 'bg-[#f59e0b] text-[#140b20]'
                                : 'bg-[#140b20] border border-[#3e245c]'
                                }`}
                            >
                              {isSelected && '✓'}
                            </span>
                            <span className="text-xs font-bold">{addon.name}</span>
                          </div>
                          <span className="text-xs font-extrabold tnum">+₹{addon.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="block text-[13px] font-extrabold text-white mb-1.5">
                    Cooking Instructions
                  </span>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="e.g. Less oil, extra crispy, no onion..."
                    className="w-full h-11 px-3.5 rounded-2xl bg-[#180e28] border border-[#2b1942] text-xs font-medium text-white placeholder-[#796d8a] focus:outline-none focus:border-[#7241a3]"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#140b20] border-t border-[#2b1942] flex items-center justify-between gap-4">
                <div>
                  <span className="block text-[10.5px] uppercase tracking-wider text-[#8e829c]">
                    Dish Total
                  </span>
                  <span className="text-[20px] font-black text-white tnum">
                    ₹{customTotalUnit}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={confirmCustomizationAdd}
                  className="flex-1 h-12 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#140b20] text-sm font-black shadow-lg cursor-pointer transition-colors"
                >
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 4: CART, CHECKOUT & LIVE KITCHEN ORDER TRACKER */}
        {cartOpen && (
          <div
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[430px] rounded-t-[28px] bg-[#0c0615] border-t border-[#2b1942] max-h-[90%] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
            >
              <div className="px-5 py-4 bg-[#140b20] border-b border-[#2b1942] flex items-center justify-between">
                <div>
                  <h3 className="text-[17px] font-extrabold text-white">
                    {liveOrder && cartSummary.itemCount === 0
                      ? 'Live Order Tracker'
                      : 'Your Order Bag'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setTableModalOpen(true)}
                    className="text-[11.5px] font-bold text-[#f59e0b] inline-flex items-center gap-1 mt-0.5 cursor-pointer tnum"
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
                  className="w-8 h-8 rounded-full bg-[#180e28] flex items-center justify-center text-[#8e829c] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {liveOrder && cartSummary.itemCount === 0 ? (
                <div className="p-5 space-y-5 overflow-y-auto no-scrollbar">
                  <div className="rounded-[24px] bg-gradient-to-br from-[#1B0A2B] via-[#2D1148] to-[#3B155E] p-5 text-white text-center relative overflow-hidden border border-[#F3C669]/25">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10.5px] font-bold text-[#FDEBD3] tnum">
                      Order #{liveOrder.id} • {liveOrder.table}
                    </span>

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

                  <div className="rounded-[22px] bg-white p-4 shadow-[0_6px_20px_rgba(45,17,72,0.05)] space-y-4">
                    {[
                      {
                        step: 0,
                        title: 'Preparing in Tandoor',
                        desc: 'Chef is freshly preparing your royal dishes'
                      },
                      {
                        step: 1,
                        title: 'Plating',
                        desc: 'Garnishing with saffron, herbs & hot chutneys'
                      },
                      {
                        step: 2,
                        title: 'Serving to Table',
                        desc: `On its way hot to ${liveOrder.table}`
                      }
                    ].map((st) => {
                      const done = liveOrder.stage >= st.step;
                      const current = liveOrder.stage === st.step;
                      return (
                        <div key={st.step} className="flex items-start gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${done
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
                              className={`text-[13.5px] font-bold ${current
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
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {liveOrder.stage === 2 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setLiveOrder(null);
                          showToast('Order completed. Ready for new orders!');
                        }}
                        className="h-11 rounded-full bg-[#15803D] hover:bg-[#166534] text-white text-xs font-extrabold cursor-pointer transition-colors"
                      >
                        Start New Order
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRingSteward('Table Assistance / Order Status')}
                        className="h-11 rounded-full bg-white border border-[#2D1148]/15 text-[#2D1148] hover:bg-[#FAF5F0] text-xs font-extrabold cursor-pointer transition-colors"
                      >
                        Call Steward
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setCartOpen(false);
                        setActiveTab('menu');
                      }}
                      className="h-11 rounded-full bg-[#2D1148] text-white text-xs font-extrabold cursor-pointer"
                    >
                      Order More
                    </button>
                  </div>
                </div>
              ) : cartSummary.itemCount === 0 ? (
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
                      setCartOpen(false);
                      setActiveTab('menu');
                    }}
                    className="mt-2 h-10 px-6 rounded-full bg-[#E89223] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
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

                    <input
                      type="text"
                      value={cookingNotes}
                      onChange={(e) => setCookingNotes(e.target.value)}
                      placeholder="Add cooking instructions (less spicy, extra chutney)..."
                      className="w-full h-11 px-4 rounded-2xl bg-white shadow-sm text-xs font-medium text-[#1B1026] placeholder-[#948B9E] focus:outline-none focus:ring-2 focus:ring-[#E89223]/40"
                    />

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

                    {/* Loyalty login CTA or redeem widget */}
                    {!loyaltyCustomer ? (
                      <button
                        type="button"
                        onClick={() => { setLoyaltyModalOpen(true); setLoyaltyPendingOrder(false); setLoyaltyStep('phone'); setLoyaltyError(''); }}
                        className="w-full p-3.5 rounded-[20px] bg-gradient-to-r from-[#1a0a2e] to-[#160c26] border border-[#f59e0b]/25 flex items-center gap-3 cursor-pointer hover:border-[#f59e0b]/50 transition-all"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center shrink-0">
                          <Crown className="w-4 h-4 text-[#f59e0b]" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-[12px] font-bold text-white">Login to earn Royal Points</p>
                          <p className="text-[10.5px] text-[#9B92A6]">Enter phone → earn points on every order</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#f59e0b]/60 shrink-0" />
                      </button>
                    ) : royalPoints >= 50 ? (
                      <button
                        type="button"
                        onClick={() => setRedeemPoints((r) => !r)}
                        className={`w-full p-3.5 rounded-[20px] flex items-center justify-between text-left cursor-pointer transition-colors ${redeemPoints
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
                              Balance: {royalPoints} PTS · Hi, {loyaltyCustomer.name?.split(' ')[0] || 'Guest'}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[11px] font-extrabold ${redeemPoints ? 'text-[#2D1148]' : 'text-[#E89223]'
                            }`}
                        >
                          {redeemPoints ? 'Applied ✓' : 'Use'}
                        </span>
                      </button>
                    ) : loyaltyCustomer ? (
                      <div className="w-full p-3.5 rounded-[20px] bg-[#f8f4ff] flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-[#E89223] shrink-0" />
                        <div>
                          <p className="text-[11px] font-bold text-[#1B1026]">Hi, {loyaltyCustomer.name?.split(' ')[0] || 'Guest'} · {royalPoints} Royal Points</p>
                          <p className="text-[10px] text-[#6E6578]">Earn more to unlock ₹50 reward</p>
                        </div>
                      </div>
                    ) : null}

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
                      <div className="flex justify-between text-[15px] font-black text-white pt-2.5 border-t border-[#EFE8DF]">
                        <span>Grand Total</span>
                        <span className="text-[#2D1148]">₹{cartSummary.grandTotal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#140b20] border-t border-[#2b1942]">
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      className="w-full h-12 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#140b20] font-black text-[14px] font-extrabold shadow-[0_10px_24px_rgba(45,17,72,0.28)] cursor-pointer transition-colors tnum"
                    >
                      Place Table Order • ₹{cartSummary.grandTotal}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* MODAL 4.5: ROYAL POINTS PHONE LOGIN */}
        {loyaltyModalOpen && (
          <div
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setLoyaltyModalOpen(false);
                setLoyaltyPendingOrder(false);
                setLoyaltyError('');
              }
            }}
          >
            <div className="w-full max-w-[430px] bg-[#0c0615] rounded-t-[32px] sm:rounded-[28px] border border-[#2b1942] shadow-[0_-20px_60px_rgba(245,158,11,0.15)] overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-b from-[#1a0a2e] to-[#0c0615] p-6 pb-5 text-center border-b border-[#2b1942]">
                {/* Decorative gold ring */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#07030b] border-2 border-[#f59e0b] flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                  <Crown className="w-6 h-6 text-[#f59e0b]" />
                </div>
                <div className="mt-5">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#f59e0b]/70 mb-1">PM Zaika</p>
                  <h2 className="text-[18px] font-black text-white font-editorial leading-tight">Royal Rewards</h2>
                  <p className="text-[11.5px] text-[#9B92A6] mt-1.5">
                    {loyaltyStep === 'loggedIn'
                      ? `Logged in as ${loyaltyCustomer?.name || 'Royal Guest'}`
                      : loyaltyPendingOrder
                        ? 'Enter your mobile to earn loyalty points on this order'
                        : 'Login to earn & redeem Royal Points'}
                  </p>
                </div>
                <button
                  onClick={() => { setLoyaltyModalOpen(false); setLoyaltyPendingOrder(false); setLoyaltyError(''); }}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#2b1942] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4 text-[#9B92A6]" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {loyaltyStep === 'loggedIn' && loyaltyCustomer ? (
                  /* ── LOGGED IN VIEW ── */
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-gradient-to-br from-[#1a0a2e] to-[#160b28] border border-[#f59e0b]/20 p-5 text-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-2 right-4 text-6xl font-black text-[#f59e0b] select-none">★</div>
                      </div>
                      <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#f59e0b]/60 mb-1">Available Balance</p>
                      <p className="text-[46px] font-black text-[#f59e0b] leading-none tnum">{royalPoints}</p>
                      <p className="text-[11px] text-[#9B92A6] mt-1">Royal Points</p>
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <div className="h-px flex-1 bg-[#2b1942]" />
                        <span className="text-[10px] font-bold text-[#6E6578] tracking-widest uppercase">Account</span>
                        <div className="h-px flex-1 bg-[#2b1942]" />
                      </div>
                      <div className="mt-3 space-y-1">
                        <p className="text-[12px] font-bold text-white">{loyaltyCustomer.name || 'Royal Guest'}</p>
                        <p className="text-[11px] text-[#9B92A6]">
                          +91 ****{loyaltyCustomer.phone.slice(-4)}
                        </p>
                      </div>
                    </div>
                    {royalPoints >= 50 && (
                      <button
                        onClick={() => { setRedeemPoints((r) => !r); setLoyaltyModalOpen(false); setCartOpen(true); showToast(redeemPoints ? 'Royal Points removed' : '₹50 Royal Points credit activated!'); }}
                        className={`w-full h-12 rounded-2xl font-black text-[13px] transition-all cursor-pointer ${redeemPoints ? 'bg-[#f59e0b] text-[#07030b]' : 'bg-[#1a0a2e] border border-[#f59e0b]/40 text-[#f59e0b]'}`}
                      >
                        {redeemPoints ? '✓ ₹50 Royal Points Applied' : 'Use 50 Pts — ₹50 OFF This Order'}
                      </button>
                    )}
                    <button
                      onClick={handleLoyaltyLogout}
                      className="w-full h-10 rounded-2xl bg-[#1a0a2e] border border-[#2b1942] text-[#9B92A6] text-[12px] font-bold cursor-pointer hover:border-[#DC2626]/40 hover:text-[#DC2626] transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  /* ── PHONE ENTRY VIEW ── */
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-[#9B92A6] mb-1.5 tracking-wide uppercase">Your Name (optional)</label>
                      <input
                        type="text"
                        value={loyaltyName}
                        onChange={(e) => setLoyaltyName(e.target.value)}
                        placeholder="e.g. Rajan Sharma"
                        className="w-full h-12 px-4 rounded-2xl bg-[#180e28] border border-[#2b1942] text-white text-[13px] font-medium placeholder-[#4a3a60] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/30 focus:border-[#f59e0b]/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#9B92A6] mb-1.5 tracking-wide uppercase">Mobile Number *</label>
                      <div className="flex items-center gap-2">
                        <div className="h-12 w-14 rounded-2xl bg-[#180e28] border border-[#2b1942] flex items-center justify-center text-[12px] font-bold text-[#9B92A6] shrink-0">+91</div>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          value={loyaltyPhone}
                          onChange={(e) => { setLoyaltyPhone(e.target.value.replace(/\D/g, '')); setLoyaltyError(''); }}
                          onKeyDown={(e) => e.key === 'Enter' && handleLoyaltyPhoneSubmit()}
                          placeholder="98XXXXXXXX"
                          className="flex-1 h-12 px-4 rounded-2xl bg-[#180e28] border border-[#2b1942] text-white text-[16px] font-bold placeholder-[#4a3a60] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/30 focus:border-[#f59e0b]/50 transition-colors tnum tracking-widest"
                        />
                      </div>
                    </div>
                    {loyaltyError && (
                      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/20">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                        <p className="text-[11.5px] text-[#DC2626] font-medium">{loyaltyError}</p>
                      </div>
                    )}
                    <button
                      onClick={handleLoyaltyPhoneSubmit}
                      disabled={loyaltyLoading || loyaltyPhone.length < 10}
                      className="w-full h-12 rounded-2xl bg-[#f59e0b] text-[#07030b] font-black text-[13.5px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all shadow-[0_8px_20px_rgba(245,158,11,0.3)] active:scale-[0.98]"
                    >
                      {loyaltyLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-[#07030b]/30 border-t-[#07030b] rounded-full animate-spin" />
                          Logging in…
                        </span>
                      ) : loyaltyPendingOrder ? 'Login & Place Order →' : 'Login to Royal Points →'}
                    </button>
                    {loyaltyPendingOrder && (
                      <button
                        onClick={() => { setLoyaltyModalOpen(false); setLoyaltyPendingOrder(false); executePlaceOrder(); }}
                        className="w-full h-10 rounded-2xl border border-[#2b1942] text-[#9B92A6] text-[12px] font-bold cursor-pointer hover:border-[#f59e0b]/30 transition-colors"
                      >
                        Skip & Place Order without Points
                      </button>
                    )}
                    <p className="text-center text-[10.5px] text-[#4a3a60]">
                      No OTP needed · Instant login · Your data stays private
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL 5: 5-QUESTION GUEST FEEDBACK SHEET */}
        {feedbackOpen && (
          <div
            onClick={() => setFeedbackOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[430px] rounded-t-[28px] bg-[#140b20] border-t border-[#2b1942] p-5 max-h-[88%] text-white overflow-y-auto no-scrollbar shadow-2xl animate-in slide-in-from-bottom duration-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#2b1942]">
                <div>
                  <h3 className="text-[17px] font-extrabold text-white">
                    Guest Feedback
                  </h3>
                  <p className="text-xs text-[#8e829c]">
                    5 quick questions • Earn +50 Royal Points
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFeedbackOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#180e28] flex items-center justify-center text-[#8e829c] hover:text-white cursor-pointer"
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
                  <p className="text-xs text-[#8e829c] max-w-[260px] mx-auto">
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
                                [q.id]: star
                              }))
                            }
                            className="p-0.5 cursor-pointer"
                            aria-label={`Rate ${q.label} ${star}`}
                          >
                            <Star
                              className={`w-4 h-4 ${star <= feedbackRatings[q.id]
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
                    className="w-full p-3.5 rounded-2xl bg-[#180e28] border border-[#2b1942] text-xs font-medium text-white placeholder-[#948B9E] focus:outline-none focus:ring-2 focus:ring-[#E89223]/40"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setFeedbackDone(true);
                      if (loyaltyCustomer && loyaltySnapshot) {
                        setLoyaltySnapshot((prev) => prev ? { ...prev, availablePoints: prev.availablePoints + 50, earnedTotal: prev.earnedTotal + 50 } : prev);
                      }
                      setFeedbackComment('');
                      showToast('Feedback submitted! +50 Royal Points earned');
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

        {/* MODAL 6: ADMIN DIRECT COMPLAINT ESCALATION */}
        {complaintOpen && (
          <div
            onClick={() => setComplaintOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[430px] rounded-t-[28px] bg-[#140b20] border-t border-[#2b1942] p-5 shadow-2xl text-white animate-in slide-in-from-bottom duration-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#2b1942]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#C81E3A]" />
                  <div>
                    <h3 className="text-[16px] font-extrabold text-white">
                      Admin Direct Escalation
                    </h3>
                    <p className="text-[11px] text-[#8e829c]">
                      Priority assistance for {selectedTable}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setComplaintOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#180e28] flex items-center justify-center text-[#8e829c] hover:text-white cursor-pointer"
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
                        className={`h-8 px-3 rounded-full text-xs font-bold cursor-pointer transition-colors ${complaintCategory === item
                          ? 'bg-[#C81E3A] text-white'
                          : 'bg-[#180e28] border border-[#2b1942] text-white'
                          }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>

                <input
                  type="tel"
                  value={complaintPhone}
                  onChange={(e) => setComplaintPhone(e.target.value)}
                  placeholder="Your phone number (e.g. 9876543210)"
                  className="w-full h-11 px-3.5 rounded-2xl bg-[#180e28] border border-[#2b1942] text-xs font-medium text-white placeholder-[#948B9E] focus:outline-none focus:ring-2 focus:ring-[#C81E3A]/30"
                />

                <textarea
                  rows={3}
                  value={complaintNote}
                  onChange={(e) => setComplaintNote(e.target.value)}
                  placeholder="Tell us what went wrong so our floor manager can resolve it immediately..."
                  className="w-full p-3.5 rounded-2xl bg-[#180e28] border border-[#2b1942] text-xs font-medium text-white placeholder-[#948B9E] focus:outline-none focus:ring-2 focus:ring-[#C81E3A]/30"
                />

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <a
                    href="tel:+917488260572"
                    className="h-11 rounded-full bg-[#180e28] border border-[#2b1942] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#2D1148]" />
                    <span>Call Manager</span>
                  </a>
                  <button
                    type="button"
                    disabled={complaintSubmitting}
                    onClick={handleRegisterComplaint}
                    className="h-11 rounded-full bg-[#C81E3A] hover:bg-[#A61730] text-white text-xs font-extrabold cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    {complaintSubmitting ? 'Submitting...' : 'Register Complaint'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 7: CATEGORY QUICK JUMP DRAWER */}
        {categoryDrawerOpen && (
          <div
            onClick={() => setCategoryDrawerOpen(false)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[430px] rounded-t-[28px] bg-[#140b20] border-t border-[#2b1942] p-5 shadow-2xl animate-in slide-in-from-bottom duration-200 max-h-[80vh] flex flex-col text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#2b1942] shrink-0">
                <div>
                  <h3 className="text-[16px] font-extrabold text-white">
                    Menu Categories
                  </h3>
                  <p className="text-xs text-[#8e829c]">
                    Jump directly to any royal section
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCategoryDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#180e28] flex items-center justify-center text-[#8e829c] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto no-scrollbar py-3 space-y-2 mt-2">
                {MENU_GROUPS.map((grp) => {
                  const count = (menuGroupedDishes[grp] || []).length;
                  return (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => {
                        setVisibleGroupCount(MENU_GROUPS.length);
                        setCategoryDrawerOpen(false);
                        setTimeout(() => {
                          const el = document.getElementById(
                            `section-${grp.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                          );
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }, 80);
                      }}
                      className="w-full px-4 py-3 rounded-2xl bg-[#180e28] hover:bg-[#201036] border border-[#2b1942] flex items-center justify-between text-left transition-colors cursor-pointer shadow-md active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[#f59e0b] font-black text-xs">◈</span>
                        <span className="text-[13.5px] font-bold text-white">
                          {formatGroupName(grp)}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-[#8e829c] px-2.5 py-0.5 rounded-full bg-[#140b20] border border-[#2b1942] tnum">
                        {count} items
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}</div>
    </div>
  );
}

export default function OrderMenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07030b]" />}>
      <MainApp />
    </Suspense>
  );
}
