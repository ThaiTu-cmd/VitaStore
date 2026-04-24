import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = localStorage.getItem("cart_items");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem("cart_items", JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  const addToCart = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const next = existing
        ? prev.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + qty } : i,
          )
        : [...prev, { ...product, qty }];
      saveCart(next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== productId);
      saveCart(next);
      return next;
    });
  }, []);

  const updateQty = useCallback((productId, qty) => {
    if (qty < 1) return;
    setItems((prev) => {
      const next = prev.map((i) => (i.id === productId ? { ...i, qty } : i));
      saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    localStorage.removeItem("cart_items");
    setItems([]);
  }, []);

  const totalCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
