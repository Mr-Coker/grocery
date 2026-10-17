"use client";

import { Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../../context/CartContext";

interface BottomNavProps {
  cartItemCount?: number;
}

export function BottomNav({ cartItemCount = 0 }: BottomNavProps) {
  const pathname = usePathname();
  const { openCart } = useCart();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Categories", href: "#categories", icon: LayoutGrid },
    { label: "Cart", onClick: openCart, icon: ShoppingBag, badge: cartItemCount },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-4 py-2 safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href ? pathname === item.href : false;

          const content = (
            <>
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1">{item.label}</span>
            </>
          );

          if (item.onClick) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-95 text-stone-400 hover:text-stone-600 font-medium cursor-pointer"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? "text-emerald-600 font-semibold"
                  : "text-stone-400 hover:text-stone-600 font-medium"
              }`}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
