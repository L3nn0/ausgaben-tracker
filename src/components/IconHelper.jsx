import React from 'react';
import {
  Banknote,
  CreditCard,
  Wallet,
  ShoppingBag,
  Home,
  Car,
  Coffee,
  Tag,
  Heart,
  MoreHorizontal,
  CircleDollarSign,
  Smartphone,
  Gift,
  Film,
  Utensils,
  Plane,
  Briefcase,
  HelpCircle
} from 'lucide-react';

const ICON_MAP = {
  Banknote,
  CreditCard,
  Wallet,
  ShoppingBag,
  Home,
  Car,
  Coffee,
  Tag,
  Heart,
  MoreHorizontal,
  CircleDollarSign,
  Smartphone,
  Gift,
  Film,
  Utensils,
  Plane,
  Briefcase,
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

export default function IconHelper({ name, size = 20, color = 'currentColor', className = '' }) {
  const Component = ICON_MAP[name] || HelpCircle;
  return <Component size={size} color={color} className={className} />;
}
