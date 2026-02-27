/**
 * Cart Persistence Utility
 * Manages localStorage cart for guest users
 */

export interface CartItem {
  productId: number;
  quantity: number;
  addedAt: number;
}

const CART_STORAGE_KEY = 'zappay_guest_cart';
const CART_EXPIRY_DAYS = 30;

/**
 * Get guest cart from localStorage
 */
export function getGuestCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    
    const cart: CartItem[] = JSON.parse(stored);
    
    // Filter out expired items (older than 30 days)
    const now = Date.now();
    const expiryMs = CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    
    const validCart = cart.filter(item => 
      now - item.addedAt < expiryMs
    );
    
    // Update storage if items were removed
    if (validCart.length !== cart.length) {
      saveGuestCart(validCart);
    }
    
    return validCart;
  } catch (error) {
    console.error('Error reading guest cart:', error);
    return [];
  }
}

/**
 * Save guest cart to localStorage
 */
export function saveGuestCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving guest cart:', error);
  }
}

/**
 * Add item to guest cart
 */
export function addToGuestCart(productId: number, quantity: number): void {
  const cart = getGuestCart();
  const existingIndex = cart.findIndex(item => item.productId === productId);
  
  if (existingIndex >= 0) {
    // Update existing item
    cart[existingIndex].quantity += quantity;
    cart[existingIndex].addedAt = Date.now();
  } else {
    // Add new item
    cart.push({
      productId,
      quantity,
      addedAt: Date.now(),
    });
  }
  
  saveGuestCart(cart);
}

/**
 * Update item quantity in guest cart
 */
export function updateGuestCartQuantity(productId: number, quantity: number): void {
  let cart = getGuestCart();
  
  if (quantity <= 0) {
    // Remove item
    cart = cart.filter(item => item.productId !== productId);
  } else {
    // Update quantity
    const existingIndex = cart.findIndex(item => item.productId === productId);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity = quantity;
      cart[existingIndex].addedAt = Date.now();
    }
  }
  
  saveGuestCart(cart);
}

/**
 * Remove item from guest cart
 */
export function removeFromGuestCart(productId: number): void {
  const cart = getGuestCart();
  const filtered = cart.filter(item => item.productId !== productId);
  saveGuestCart(filtered);
}

/**
 * Clear guest cart
 */
export function clearGuestCart(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing guest cart:', error);
  }
}

/**
 * Get total item count in guest cart
 */
export function getGuestCartCount(): number {
  const cart = getGuestCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
