/**
 * Curated high-resolution food images for PM Zaika menu items.
 * Clean, verified, and appetizing food photography matching the brochure.
 */
export const FOOD_IMAGE_MAP: Record<string, string> = {
  // Biryani & Rice
  'chicken biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
  'mutton biryani': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
  'zaika spl. biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
  'mutton biryani handi': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
  'chicken biryani handi': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',

  // Starters Non Veg & Tandoor
  'chicken lollypop': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
  'chicken 65': 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
  'chicken tandoori': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
  'chicken malai kabab': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
  'murg mussallam': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
  'mutton rane-e-arabia': 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=600&q=80',

  // Starters Veg & Main Course
  'paneer butter masala': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
  'paneer tikka': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
  'butter naan': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
}

export interface ChefSignatureItem {
  id: string
  name: string
  categoryName: string
  pricePaise: number
  veg: 'veg' | 'nonveg' | 'egg'
  description: string
  imageUrl: string
  tag: string
}

export const CHEF_SIGNATURES: ChefSignatureItem[] = [
  {
    id: 'mutton-biryani-handi',
    name: 'Mutton Handi Biryani',
    categoryName: 'Shan-E-Biryani',
    pricePaise: 1250000,
    veg: 'nonveg',
    description: 'Slow-cooked in a sealed clay handi with long-grain basmati, saffron, and Awadhi spices.',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
    tag: 'Royal Special',
  },
  {
    id: 'murg-mussallam',
    name: 'Murg Mussallam',
    categoryName: 'Mehman Nawazi',
    pricePaise: 65000,
    veg: 'nonveg',
    description: 'Whole roasted chicken braised gently in a decadent almond, cashew, and saffron gravy.',
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    tag: 'Chef Signature',
  },
  {
    id: 'chicken-malai-kabab',
    name: 'Chicken Malai Kabab',
    categoryName: 'Tandoori Khazana',
    pricePaise: 24000,
    veg: 'nonveg',
    description: 'Melt-in-mouth chicken skewers marinated in clotted cream, green cardamom, and roasted garlic.',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    tag: 'Must Try',
  },
  {
    id: 'paneer-butter-masala',
    name: 'Paneer Butter Masala',
    categoryName: 'Indian Main Course',
    pricePaise: 22000,
    veg: 'veg',
    description: 'Velvety cottage cheese cubes simmered in a slow-simmered rich tomato butter cream sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    tag: 'Vegetarian Delicacy',
  },
  {
    id: 'chicken-lollypop',
    name: 'Chicken Lollypop',
    categoryName: 'Starter Non Veg',
    pricePaise: 23000,
    veg: 'nonveg',
    description: 'Crisp chicken drumettes flash-fried and glazed with fragrant ginger, scallions, and chillies.',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    tag: 'Crispy Bestseller',
  },
]

/**
 * Returns an image URL ONLY if there is a specific, bespoke match.
 * Eliminates repetitive copy-paste stock photos across line items.
 */
export function getFoodImage(name: string, categoryId?: string): string | null {
  const lower = name.toLowerCase().trim()
  if (FOOD_IMAGE_MAP[lower]) return FOOD_IMAGE_MAP[lower]
  return null
}
