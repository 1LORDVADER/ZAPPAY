import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  ShoppingCart,
  Sprout,
  Store,
  Truck,
  Package,
  Briefcase,
  User,
  Leaf,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { NotificationBell } from "@/components/NotificationBell";
import { getGuestCartCount } from "@/lib/cartPersistence";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";

interface NavHeaderProps {
  showCart?: boolean;
  cartCount?: number;
}

export function NavHeader({ showCart = true, cartCount }: NavHeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Fetch cart count if not provided
  const { data: cartItems = [] } = trpc.cart.getItems.useQuery(undefined, {
    enabled: isAuthenticated && showCart && cartCount === undefined,
  });

  const resolvedCartCount =
    cartCount !== undefined
      ? cartCount
      : isAuthenticated
      ? cartItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)
      : getGuestCartCount();

  return (
    <header className="sticky top-0 z-50 bg-[#1e3a5f]/98 backdrop-blur-sm border-b border-[#1e3a5f]/50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo - clean, no white rectangle */}
          <Link href="/">
            <img
              src="/logo.png"
              alt="ZAPPAY"
              className="h-12 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:text-red-400 hover:bg-white/10">
                Browse
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" size="sm" className="text-white hover:text-red-400 hover:bg-white/10">
                Pricing
              </Button>
            </Link>
            <Link href="/advertise">
              <Button variant="ghost" size="sm" className="text-white hover:text-red-400 hover:bg-white/10">
                Advertise
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="ghost" size="sm" className="text-white hover:text-red-400 hover:bg-white/10">
                How It Works
              </Button>
            </Link>
            <a href="mailto:Zappay.co@gmail.com">
              <Button variant="ghost" size="sm" className="text-white hover:text-red-400 hover:bg-white/10">
                Contact
              </Button>
            </a>

            {/* Apply Now Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:text-red-400 hover:bg-white/10">
                  Apply Now
                  <ChevronDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white shadow-xl border border-slate-200">
                <DropdownMenuItem asChild>
                  <Link href="/farmer/register">
                    <div className="flex items-center gap-2 w-full cursor-pointer py-1">
                      <Sprout className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">Licensed Farmer</div>
                        <div className="text-xs text-slate-500">Sell your cannabis products</div>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dispensary-application">
                    <div className="flex items-center gap-2 w-full cursor-pointer py-1">
                      <Store className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">Dispensary Partner</div>
                        <div className="text-xs text-slate-500">Connect with farmers</div>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/transportation/driver-register">
                    <div className="flex items-center gap-2 w-full cursor-pointer py-1">
                      <Truck className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">Transportation Driver</div>
                        <div className="text-xs text-slate-500">Deliver cannabis products</div>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/transportation/company-register">
                    <div className="flex items-center gap-2 w-full cursor-pointer py-1">
                      <Package className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">Transportation Company</div>
                        <div className="text-xs text-slate-500">Partner with ZAPPAY</div>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/sales/register">
                    <div className="flex items-center gap-2 w-full cursor-pointer py-1">
                      <Briefcase className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">SaaS Sales Rep</div>
                        <div className="text-xs text-slate-500">Join our sales team</div>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Admin dropdown */}
            {user?.role === "admin" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-yellow-300 hover:text-yellow-200 hover:bg-white/10 gap-1">
                    Admin <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-700">
                  <DropdownMenuItem asChild>
                    <Link href="/admin/applications" className="flex items-center gap-2 text-slate-200 hover:text-white cursor-pointer">
                      <Briefcase className="h-4 w-4" /> Applications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/analytics" className="flex items-center gap-2 text-slate-200 hover:text-white cursor-pointer">
                      <Package className="h-4 w-4" /> Analytics
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/sales" className="flex items-center gap-2 text-slate-200 hover:text-white cursor-pointer">
                      <Store className="h-4 w-4" /> Sales
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/payments" className="flex items-center gap-2 text-slate-200 hover:text-white cursor-pointer">
                      <Sprout className="h-4 w-4" /> Payments
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/transportation" className="flex items-center gap-2 text-slate-200 hover:text-white cursor-pointer">
                      <Truck className="h-4 w-4" /> Transportation
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/suppliers" className="flex items-center gap-2 text-slate-200 hover:text-white cursor-pointer">
                      <Leaf className="h-4 w-4" /> Supplier Review
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/waitlist" className="flex items-center gap-2 text-yellow-300 hover:text-yellow-200 cursor-pointer font-medium">
                      <User className="h-4 w-4" /> Waitlist
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Partner Portal dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:text-red-400 hover:bg-white/10 gap-1">
                  Partner Portal <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-slate-900 border-slate-700">
                <DropdownMenuItem asChild>
                  <Link href="/supplier/apply" className="flex items-center gap-2 text-slate-200 hover:text-white cursor-pointer">
                    <Leaf className="h-4 w-4 text-green-400" /> Become a Supplier
                  </Link>
                </DropdownMenuItem>
                {isAuthenticated && (
                  <DropdownMenuItem asChild>
                    <Link href="/supplier/dashboard" className="flex items-center gap-2 text-slate-200 hover:text-white cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" /> Supplier Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem asChild>
                  <Link href="/grower-marketplace" className="flex items-center gap-2 text-slate-200 hover:text-white cursor-pointer">
                    <Package className="h-4 w-4" /> Grower Marketplace
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* My Applications */}
            {isAuthenticated && user?.role !== "admin" && (
              <Link href="/my-applications">
                <Button variant="ghost" size="sm" className="text-white hover:text-red-400 hover:bg-white/10">
                  My Applications
                </Button>
              </Link>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            {showCart && (
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative text-white hover:text-red-400 hover:bg-white/10"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {resolvedCartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {resolvedCartCount > 9 ? "9+" : resolvedCartCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* Authenticated User Dropdown */}
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-red-400 hover:bg-white/10 max-w-[200px] pr-2"
                    >
                      <User className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      <span className="truncate text-xs hidden sm:inline">{user?.email}</span>
                      <ChevronDown className="ml-1 h-3 w-3 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 bg-white shadow-xl border border-slate-200">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || "User"}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">
                        <div className="flex items-center gap-2 cursor-pointer w-full">
                          <Package className="h-4 w-4 text-slate-500" />
                          <span className="text-sm">My Orders</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/rewards">
                        <div className="flex items-center gap-2 cursor-pointer w-full">
                          <span className="text-sm">🏆</span>
                          <span className="text-sm">Rewards</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {toggleTheme && (
                      <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                        <div className="flex items-center gap-2 w-full">
                          {theme === "dark" ? (
                            <Sun className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <Moon className="h-4 w-4 text-slate-500" />
                          )}
                          <span className="text-sm">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                        </div>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                asChild
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white border-0"
              >
                <a href={getLoginUrl()}>Login</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
