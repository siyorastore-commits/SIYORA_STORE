import { Product } from "@/types";

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Cherry Blossom Kurti",
    price: 799,
    originalPrice: 1199,
    category: "kurtis",
    tag: "NEW",
    rating: 4.8,
    reviews: 124,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#E8B4B8", "#C8A2C8", "#B5D5C5"],
    description: "Cherry blossom pure cotton soft fabric kurti ✔️🍒🌸, Perfect for spring and Pinterest coded girlies 🎀",
    longDescription: `Cherry blossom pure cotton soft fabric kurti ✔️🍒🌸, Perfect for spring and Pinterest coded girlies 🎀`,
    fabric: "100% Cotton",
    care: "Machine wash cold, gentle cycle. Do not bleach. Tumble dry low.",
    emoji: "🌸",
    bgColor: "#FFE8EE",
    highlights: ["Hand-embroidered neckline", "Breathable cotton fabric", "Relaxed fit", "Side slits for ease", "Available in 3 colours"],
    deliveryDays: "3–5",
    media: [
      { type: "image", src: "https://res.cloudinary.com/dghggvtdn/image/upload/v1773158047/WhatsApp_Image_2026-02-21_at_13.48.51_rvrdk1.jpg", alt: "Cherry Blossom Kurti - Front view", emoji: "🌸", bg: "#FFE8EE" },
      { type: "image", src: "https://res.cloudinary.com/dghggvtdn/image/upload/v1773158045/WhatsApp_Image_2026-02-21_at_13.48.50_rbddng.jpg", alt: "Cherry Blossom Kurti  Embroidery detail", emoji: "🌸", bg: "#EEC8D0" },
      { type: "image", src: "https://res.cloudinary.com/dghggvtdn/image/upload/v1773158046/WhatsApp_Image_2026-02-21_at_13.48.50_1_b8k6cm.jpg", alt: "Cherry Blossom Kurti", emoji: "🌸", bg: "#FFD5E0" },
    ],
  },
  {
    id: 2,
    name: "Pashmina Bloom co-ord set",
    price: 1599,
    originalPrice: 1999,
    category: "sets",
    tag: "BESTSELLER",
    rating: 4.9,
    reviews: 89,
    sizes: ["S", "M", "L", "XL"],
    colors: ["#F4A460", "#DEB887", "#FF8C94"],
    description: "Pashmina petals coordset 🧚🏻‍♀️ | Perfect for winters❄️ | Warm fabric with hand embroidery 🪡 and pilling free | Bell sleeves kurti with farshi salwar🤎",
    longDescription: "Pashmina petals coordset 🧚🏻‍♀️ | Perfect for winters❄️ | Warm fabric with hand embroidery 🪡 and pilling free | Bell sleeves kurti with farshi salwar🤎",
    fabric: "Pashmina",
    care: "Hand wash recommended. Use mild detergent. Do not wring. Dry in shade.",
    emoji: "🌹",
    bgColor: "#FFF0E8",
    highlights: ["Matching co-ord set", "Elasticated waistband", "Soft rayon blend", "Rose motif print", "Mix & match friendly"],
    deliveryDays: "3–5",
    media: [
      { type: "image", src: "https://res.cloudinary.com/dghggvtdn/image/upload/v1773159266/WhatsApp_Image_2025-12-11_at_13.34.44_oqeakk.jpg", alt: "Pashmina Bloom co-ord set - Full look", emoji: "🌹", bg: "#FFF0E8" },
      { type: "image", src: "https://res.cloudinary.com/dghggvtdn/image/upload/v1773159266/WhatsApp_Image_2025-12-11_at_13.34.44_1_pfvntk.jpg", alt: "Pashmina Bloom co-ord set", emoji: "🌹", bg: "#F5E5D5" },
      { type: "image", src: "https://res.cloudinary.com/dghggvtdn/image/upload/v1773159267/WhatsApp_Image_2025-12-11_at_13.34.45_dc5r4t.jpg", alt: "Pashmina Bloom co-ord set", emoji: "🌹", bg: "#EED8C8" },
      { type: "image", src: "https://res.cloudinary.com/dghggvtdn/image/upload/v1773159267/WhatsApp_Image_2025-12-11_at_13.34.45_1_rzvoxh.jpg ", alt: "Pashmina Bloom co-ord set", emoji: "🎬", bg: "#2D1515", poster: "" },
    ],
  },
  {
    id: 3,
    name: "Siya Classic White Kurta",
    price: 899,
    originalPrice: 899,
    category: "kurtis",
    tag: "SALE",
    rating: 4.6,
    reviews: 210,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["#FFFFFF", "#F5F5DC", "#E8E8E8"],
    description: "The timeless white kurta reimagined with subtle chikankari work. Your everyday essential, elevated.",
    longDescription: `Some things are timeless. The Siya Classic White Kurta is one of them. This is the piece you reach for when you want to look polished without trying too hard.

Crafted from linen-cotton blend that gets softer with every wash, featuring subtle chikankari work at the yoke that catches light beautifully. The straight silhouette is universally flattering.

Dress it up with statement earrings and heels, or keep it casual with kolhapuris and a tote. This kurta works for everything.`,
    fabric: "Linen cotton blend",
    care: "Dry clean preferred. If hand washing, use cold water and mild detergent.",
    emoji: "✨",
    bgColor: "#F8F8FF",
    highlights: ["Chikankari embroidery", "Linen-cotton blend", "Straight silhouette", "Available up to XXL", "Gets softer with every wash"],
    deliveryDays: "2–4",
    media: [
      { type: "image", src: "", alt: "Classic White Kurta - Front", emoji: "✨", bg: "#F8F8FF" },
      { type: "image", src: "", alt: "Classic White Kurta - Chikankari detail", emoji: "✨", bg: "#F0F0F8" },
      { type: "image", src: "", alt: "Classic White Kurta - Styled look", emoji: "✨", bg: "#E8E8F5" },
    ],
  },
  {
    id: 4,
    name: "Urban Lotus Printed Set",
    price: 1899,
    originalPrice: 2399,
    category: "sets",
    tag: "NEW",
    rating: 4.7,
    reviews: 56,
    sizes: ["S", "M", "L"],
    colors: ["#FF8C94", "#FFB347", "#9B59B6"],
    description: "Bold lotus print on breathable fabric. Make a statement wherever you go.",
    longDescription: `The Urban Lotus Set is for the woman who walks into a room and owns it. The bold lotus print is inspired by the national flower of India — a symbol of beauty, strength, and new beginnings.

Printed on breathable georgette, the fabric flows beautifully with every step. The crop top and flared pants combo creates an hourglass silhouette that's both comfortable and stunning.

Perfect for festive occasions, date nights, or whenever you want to make a statement.`,
    fabric: "Georgette",
    care: "Hand wash cold. Do not soak. Dry in shade. Steam iron only.",
    emoji: "🪷",
    bgColor: "#FFE8F8",
    highlights: ["Bold lotus block print", "Breathable georgette", "Crop top + flared pants", "Festive & party ready", "Statement piece"],
    deliveryDays: "3–5",
    media: [
      { type: "image", src: "", alt: "Urban Lotus Set - Full look", emoji: "🪷", bg: "#FFE8F8" },
      { type: "image", src: "", alt: "Urban Lotus Set - Print detail", emoji: "🪷", bg: "#F5D8EE" },
      { type: "image", src: "", alt: "Urban Lotus Set - Side view", emoji: "🪷", bg: "#EEC8E5" },
      { type: "video", src: "", alt: "Urban Lotus Set - Styling reel", emoji: "🎬", bg: "#2D1515", poster: "" },
    ],
  },
  {
    id: 5,
    name: "Marigold Anarkali Kurta",
    price: 1599,
    originalPrice: 1999,
    category: "kurtis",
    tag: "TRENDING",
    rating: 4.9,
    reviews: 167,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#FFD700", "#FF8C00", "#FF6347"],
    description: "Flowing anarkali silhouette in warm marigold hues. Festive perfection that moves with you.",
    longDescription: `The Marigold Anarkali is our ode to Indian festivities. Named after the marigold flowers that adorn every celebration — from weddings to Diwali — this piece carries the warmth and joy of every occasion.

The flowing anarkali silhouette is universally flattering, cinching at the waist and flaring out in a beautiful sweep. Made from silk-cotton blend that has just the right amount of sheen without being over the top.

Wear it with churidar or straight pants underneath.`,
    fabric: "Silk cotton blend",
    care: "Dry clean only. Store hanging to maintain shape.",
    emoji: "🌺",
    bgColor: "#FFF8E8",
    highlights: ["Flowing anarkali silhouette", "Silk cotton blend", "Festive & wedding ready", "Flattering for all body types", "Rich warm tones"],
    deliveryDays: "3–5",
    media: [
      { type: "image", src: "", alt: "Marigold Anarkali - Full length", emoji: "🌺", bg: "#FFF8E8" },
      { type: "image", src: "", alt: "Marigold Anarkali - Waist detail", emoji: "🌺", bg: "#F5EDD8" },
      { type: "image", src: "", alt: "Marigold Anarkali - Hem flare", emoji: "🌺", bg: "#EEE0C8" },
      { type: "image", src: "", alt: "Marigold Anarkali - Styled festive", emoji: "🌺", bg: "#FFEDD8" },
    ],
  },
  {
    id: 6,
    name: "Indigo Dreams Palazzo Set",
    price: 2199,
    originalPrice: 2799,
    category: "sets",
    tag: "SALE",
    rating: 4.5,
    reviews: 93,
    sizes: ["S", "M", "L", "XL"],
    colors: ["#4169E1", "#6A5ACD", "#483D8B"],
    description: "Deep indigo palazzo set with delicate silver threadwork. Day to dinner effortlessly.",
    longDescription: `The Indigo Dreams Palazzo Set is for every woman who needs a single outfit that transitions from a work presentation to a dinner out without missing a beat.

The deep indigo hue is rich and versatile. The delicate silver threadwork on the neckline and cuffs catches light beautifully. The palazzo pants are wide-cut and high-waisted — incredibly comfortable and elegant.`,
    fabric: "Chanderi silk",
    care: "Dry clean preferred. If washing, turn inside out, cold water.",
    emoji: "💐",
    bgColor: "#EEF0FF",
    highlights: ["Silver threadwork detail", "Chanderi silk fabric", "High-waisted palazzo pants", "Day to dinner versatile", "Rich indigo hue"],
    deliveryDays: "4–6",
    media: [
      { type: "image", src: "", alt: "Indigo Dreams Set - Full look", emoji: "💐", bg: "#EEF0FF" },
      { type: "image", src: "", alt: "Indigo Dreams Set - Threadwork detail", emoji: "💐", bg: "#DEE0F5" },
      { type: "image", src: "", alt: "Indigo Dreams Set - Palazzo pants", emoji: "💐", bg: "#CED0EE" },
    ],
  },
  {
    id: 7,
    name: "Peach Blossom Kurta",
    price: 1199,
    originalPrice: 1499,
    category: "kurtis",
    tag: "NEW",
    rating: 4.7,
    reviews: 78,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#FFDAB9", "#FFB6C1", "#FFC0CB"],
    description: "Soft peach kurta with intricate block print border. Effortlessly feminine for any occasion.",
    longDescription: `The Peach Blossom Kurta is pure femininity bottled into fabric. The soft peach colour is universally flattering, and the intricate block-printed border adds a beautiful traditional touch.

Made from mulmul cotton — the softest cotton in Indian textile tradition — this kurta feels like wearing a cloud. Light, breathable, perfect for all seasons.`,
    fabric: "Mulmul cotton",
    care: "Machine wash gentle, cold water. Dry in shade. Light iron.",
    emoji: "🌷",
    bgColor: "#FFF0E8",
    highlights: ["Block printed border", "Mulmul cotton fabric", "Universally flattering", "Light as a feather", "All-season wear"],
    deliveryDays: "2–4",
    media: [
      { type: "image", src: "", alt: "Peach Blossom Kurta - Front", emoji: "🌷", bg: "#FFF0E8" },
      { type: "image", src: "", alt: "Peach Blossom Kurta - Border detail", emoji: "🌷", bg: "#F5E5D5" },
      { type: "image", src: "", alt: "Peach Blossom Kurta - Styled", emoji: "🌷", bg: "#EED8C8" },
    ],
  },
  {
    id: 8,
    name: "Crimson Heritage Set",
    price: 2799,
    originalPrice: 3499,
    category: "sets",
    tag: "BESTSELLER",
    rating: 4.8,
    reviews: 145,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#DC143C", "#B22222", "#8B0000"],
    description: "Heritage-inspired crimson set with intricate zari work. Celebration-ready from the first wear.",
    longDescription: `The Crimson Heritage Set is our most opulent piece — made for women who celebrate unapologetically. The deep crimson colour is the colour of celebration in Indian culture.

The intricate zari work is done by master craftsmen from Varanasi, each piece taking over 5 hours of careful handwork. The art silk fabric has a beautiful sheen that photographs stunningly.

Wear it to weddings, receptions, festive gatherings, or any occasion where you want to be the most radiant person in the room.`,
    fabric: "Art silk",
    care: "Dry clean only. Store in a cotton bag. Avoid direct sunlight.",
    emoji: "🌻",
    bgColor: "#FFE8E8",
    highlights: ["Handcrafted zari work", "Art silk fabric", "Wedding & celebration ready", "Varanasi craftsmanship", "Available up to XXL"],
    deliveryDays: "4–6",
    media: [
      { type: "image", src: "", alt: "Crimson Heritage Set - Full look", emoji: "🌻", bg: "#FFE8E8" },
      { type: "image", src: "", alt: "Crimson Heritage Set - Zari work", emoji: "🌻", bg: "#F5D5D5" },
      { type: "image", src: "", alt: "Crimson Heritage Set - Top detail", emoji: "🌻", bg: "#EEC8C8" },
      { type: "video", src: "", alt: "Crimson Heritage Set - Movement", emoji: "🎬", bg: "#2D1515", poster: "" },
    ],
  },
];

export const CATEGORIES = [
  { id: "all", label: "All Styles", count: 8 },
  { id: "kurtis", label: "Kurtis", count: 5 },
  { id: "sets", label: "Co-ord Sets", count: 3 },
];

export const TESTIMONIALS = [
  { name: "Priya S.", city: "Mumbai", text: "Absolutely obsessed with my Gulabi Bloom kurta! The fabric quality is exceptional and it fits like a dream.", rating: 5, product: "Gulabi Bloom Kurta" },
  { name: "Ananya R.", city: "Delhi", text: "Siyora literally changed my wardrobe game. Street Rose set gets compliments every single time I wear it!", rating: 5, product: "Street Rose Co-ord Set" },
  { name: "Meera K.", city: "Bangalore", text: "Finally a brand that understands what Indian women actually want — stylish, comfortable, and affordable.", rating: 5, product: "Marigold Anarkali" },
];

export const MARQUEE_ITEMS = [
  "FREE SHIPPING ABOVE ₹999",
  "NEW ARRIVALS EVERY FRIDAY",
  "EASY 7-DAY RETURNS",
  "WHERE SIYA MEETS STREET",
  "COD AVAILABLE",
  "AUTHENTIC INDIAN CRAFTSMANSHIP",
];
