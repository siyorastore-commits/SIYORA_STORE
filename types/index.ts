export interface ProductMedia {
  type: "image" | "video";
  src: string;       // real URL when you have photos: "/images/product1-front.jpg"
  alt: string;
  emoji: string;     // placeholder until you add real photos
  bg: string;        // placeholder background color
  poster?: string;   // for video thumbnail
}

export interface ReviewItem {
  name: string;
  city: string;
  rating: number;
  text: string;
  date: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  category: "kurtis" | "sets" | "dresses" | "tops" | "kurta";
  tag: string;
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
  description: string;
  longDescription?: string;
  fabric: string;
  care: string;
  emoji: string;
  bgColor: string;
  media: ProductMedia[];
  highlights?: string[];
  deliveryDays?: string;
  outOfStock?: boolean;
  reviewsList?: ReviewItem[];
}

export interface CustomSize {
  bust: string;
  waist: string;
  hip: string;
  // Men's kurta fields
  chest?: string;
  frontLength?: string;
  acrossShoulder?: string;
}

export interface CartItem extends Product {
  cartId: string;
  qty: number;
  selectedSize: string;
  selectedColor: number;
  customSize?: CustomSize;
}

export interface OrderForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id?: string;
  created_at?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: CartItem[];
  total_amount: number;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  payment_status: "pending" | "paid" | "failed" | "cod_pending";
  order_status: "confirmed" | "processing" | "shipped" | "delivered";
}
