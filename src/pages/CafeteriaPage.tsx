import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CafeteriaItem, DietaryTag, CafeteriaCounter, CafeteriaOrder } from '../types';
import {
  UtensilsCrossed,
  Search,
  ShoppingBag,
  Clock,
  Users,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Info,
  RotateCcw,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const CafeteriaPage: React.FC = () => {
  const {
    cafeteriaItems,
    cart,
    cafeteriaOrders,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    advanceOrderStatus,
  } = useApp();

  const [selectedCounter, setSelectedCounter] = useState<string>('All');
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [placedOrderModal, setPlacedOrderModal] = useState<any | null>(null);

  const counters: (CafeteriaCounter | 'All')[] = [
    'All',
    'Meals',
    'Snacks',
    'Drinks',
    'Healthy Bowls',
  ];

  const dietaryOptions: DietaryTag[] = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Spicy',
    'Contains Dairy',
  ];

  // Counter queue wait stats (simulated values)
  const counterStats: Record<CafeteriaCounter, { wait: string; rush: string; level: 'low' | 'med' | 'high' }> = {
    Meals: { wait: '8–11 mins', rush: 'Moderate lunch queue', level: 'med' },
    Snacks: { wait: '3–5 mins', rush: 'Fast turnaround', level: 'low' },
    Drinks: { wait: '2–4 mins', rush: 'Express pickup', level: 'low' },
    'Healthy Bowls': { wait: '4–6 mins', rush: 'Fresh assembly line', level: 'med' },
  };

  const filteredItems = useMemo(() => {
    return cafeteriaItems.filter((item) => {
      if (selectedCounter !== 'All' && item.counter !== selectedCounter) return false;
      if (selectedDietary !== 'All' && !item.dietary.includes(selectedDietary)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [cafeteriaItems, selectedCounter, selectedDietary, searchQuery]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  }, [cart]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const order = placeOrder(
      selectedCounter === 'All' ? 'Main Food Court Counter' : `${selectedCounter} Counter`
    );
    setPlacedOrderModal(order);
    setCartDrawerOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E5E8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E3E5E8] text-xs font-semibold text-[#667085] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#20845A]" />
            <span>Dining Commons & Food Court · Open 08:00 – 19:30</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#17243A]">
            Campus Dining without the queue chaos
          </h2>
          <p className="text-xs sm:text-sm text-[#475467] mt-1 max-w-xl">
            Live sample counter estimates, real-time dietary markers, and express demo order pickup.
          </p>
        </div>

        {/* Cart Trigger */}
        <button
          onClick={() => setCartDrawerOpen(true)}
          className="relative px-5 py-2.5 bg-[#315CEB] hover:bg-[#2447C5] text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center gap-3 transition-colors shadow-xs"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>View Cart</span>
          {cart.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#DDF36A] text-[#17243A] text-xs font-bold">
              {cart.reduce((s, i) => s + i.quantity, 0)} · ${cartSubtotal.toFixed(2)}
            </span>
          )}
        </button>
      </div>

      {/* Seating Availability & Queue Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Seating Indicator */}
        <div className="p-4 rounded-3xl bg-[#FAF9F5] border border-[#E3E5E8] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#17243A]">Seating Status</span>
            <Badge variant="mint" size="sm" dot>
              Limited
            </Badge>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-bold font-display text-[#17243A]">68%</span>
              <span className="text-[11px] text-[#667085]">Occupancy</span>
            </div>
            <div className="w-full h-1.5 bg-[#E3E5E8] rounded-full overflow-hidden">
              <div className="h-full bg-[#20845A] w-[68%]" />
            </div>
          </div>
          <span className="text-[10px] text-[#A0AEC0] mt-2 block">
            *Sample estimate · Outdoor patio has open tables
          </span>
        </div>

        {/* Counter Wait Estimates */}
        {(['Meals', 'Snacks', 'Drinks'] as CafeteriaCounter[]).map((counter) => {
          const stat = counterStats[counter];
          return (
            <div
              key={counter}
              className="p-4 rounded-3xl bg-white border border-[#E3E5E8] shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#17243A]">{counter} Counter</span>
                <Clock className="w-3.5 h-3.5 text-[#315CEB]" />
              </div>
              <div className="my-1">
                <span className="text-lg font-bold font-display text-[#315CEB]">
                  {stat.wait}
                </span>
                <span className="text-xs text-[#667085] block">{stat.rush}</span>
              </div>
              <span className="text-[10px] text-[#A0AEC0] block">
                Simulated average wait time
              </span>
            </div>
          );
        })}
      </div>

      {/* Filter and Category Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#E3E5E8] shadow-xs space-y-4">
        {/* Counter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E3E5E8] scrollbar-none">
          {counters.map((ctr) => (
            <button
              key={ctr}
              onClick={() => setSelectedCounter(ctr)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
                selectedCounter === ctr
                  ? 'bg-[#17243A] text-white shadow-2xs'
                  : 'text-[#667085] hover:bg-[#FAF9F5] hover:text-[#17243A]'
              }`}
            >
              {ctr}
            </button>
          ))}
        </div>

        {/* Dietary chips & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedDietary('All')}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors border ${
                selectedDietary === 'All'
                  ? 'bg-[#315CEB] text-white border-[#315CEB]'
                  : 'bg-[#FAF9F5] text-[#667085] border-[#E3E5E8]'
              }`}
            >
              All Dietaries
            </button>
            {dietaryOptions.map((diet) => (
              <button
                key={diet}
                onClick={() => setSelectedDietary(diet)}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors border ${
                  selectedDietary === diet
                    ? 'bg-[#315CEB] text-white border-[#315CEB]'
                    : 'bg-[#FAF9F5] text-[#667085] border-[#E3E5E8] hover:border-[#315CEB]'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, drinks..."
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#17243A] focus:outline-none focus:border-[#315CEB]"
            />
          </div>
        </div>
      </div>

      {/* Active Orders Section (if any orders exist) */}
      {cafeteriaOrders.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-[#E3E5E8] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[#17243A] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#315CEB]" />
              <span>Your Demo Orders & Pickups</span>
            </h3>
            <span className="text-[11px] text-[#667085]">
              Simulated kitchen pipeline
            </span>
          </div>

          <div className="space-y-3">
            {cafeteriaOrders.slice(0, 3).map((order) => {
              const steps: CafeteriaOrder['status'][] = [
                'Received',
                'Preparing',
                'Ready',
                'Completed',
              ];
              const currentStepIndex = steps.indexOf(order.status);

              return (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E3E5E8] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-sm text-[#17243A]">
                        Order #{order.orderNumber}
                      </span>
                      <Badge
                        variant={order.status === 'Ready' ? 'mint' : 'cobalt'}
                        size="sm"
                      >
                        {order.status}
                      </Badge>
                      <span className="text-xs text-[#667085]">· {order.counter}</span>
                    </div>
                    <p className="text-xs text-[#475467]">
                      {order.items.map((i) => `${i.quantity}x ${i.item.name}`).join(', ')} · $
                      {order.totalAmount.toFixed(2)}
                    </p>
                  </div>

                  {/* Stepper & Action */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-[#667085]">
                      {steps.map((st, i) => (
                        <React.Fragment key={st}>
                          <span
                            className={
                              i <= currentStepIndex
                                ? 'text-[#315CEB] font-bold'
                                : 'text-[#9CA3AF]'
                            }
                          >
                            {st}
                          </span>
                          {i < steps.length - 1 && <span className="text-[#CBD5E1]">→</span>}
                        </React.Fragment>
                      ))}
                    </div>

                    {order.status !== 'Completed' && (
                      <button
                        onClick={() => advanceOrderStatus(order.id)}
                        className="px-3 py-1 bg-white hover:bg-[#EEF2FF] text-[#315CEB] border border-[#C7D2FE] text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                      >
                        Simulate Next Status
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const inCart = cart.find((c) => c.item.id === item.id);

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-[#E3E5E8] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap gap-1">
                    {item.dietary.map((d) => (
                      <Badge
                        key={d}
                        variant={
                          d === 'Vegetarian' || d === 'Vegan'
                            ? 'lime'
                            : d === 'Gluten-Free'
                            ? 'mint'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {d}
                      </Badge>
                    ))}
                  </div>

                  {item.popular && (
                    <Badge variant="coral" size="sm">
                      Popular
                    </Badge>
                  )}
                </div>

                <h3 className="font-display font-bold text-base text-[#17243A] leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-[#667085] mt-0.5">{item.counter} Counter</p>

                <p className="text-xs text-[#475467] mt-2.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E3E5E8] mt-4 flex items-center justify-between">
                <div>
                  <span className="text-base font-bold font-display text-[#17243A]">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-[#667085] block">
                    ~{item.estimatedWaitMins}m wait
                  </span>
                </div>

                {inCart ? (
                  <div className="flex items-center gap-2 bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl p-1">
                    <button
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="p-1 rounded-lg text-[#667085] hover:bg-white hover:text-[#17243A]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-[#17243A] px-1">
                      {inCart.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="p-1 rounded-lg text-[#667085] hover:bg-white hover:text-[#17243A]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item)}
                    className="px-3.5 py-1.5 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Drawer Modal */}
      <Modal
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        title="Cafeteria Cart & Express Checkout"
        subtitle="Review your meal order. Demo pickup simulation only."
        maxWidth="md"
      >
        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <ShoppingBag className="w-8 h-8 text-[#9CA3AF] mx-auto" />
              <p className="text-sm font-semibold text-[#17243A]">Your cart is empty</p>
              <p className="text-xs text-[#667085]">
                Browse the menu items above and add food or drinks to your tray.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {cart.map((cartItem) => (
                  <div
                    key={cartItem.item.id}
                    className="p-3 bg-[#FAF9F5] rounded-2xl border border-[#E3E5E8] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-[#17243A] truncate">
                        {cartItem.item.name}
                      </div>
                      <div className="text-[11px] text-[#667085]">
                        ${cartItem.item.price.toFixed(2)} each
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 bg-white border border-[#E3E5E8] rounded-xl p-0.5">
                        <button
                          onClick={() => updateCartQuantity(cartItem.item.id, -1)}
                          className="p-1 rounded text-[#667085] hover:bg-[#F3F4F6]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(cartItem.item.id, 1)}
                          className="p-1 rounded text-[#667085] hover:bg-[#F3F4F6]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-xs text-[#17243A] w-12 text-right">
                        ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                      </span>

                      <button
                        onClick={() => removeFromCart(cartItem.item.id)}
                        className="text-[#9CA3AF] hover:text-[#B93838] p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal & Notice */}
              <div className="pt-3 border-t border-[#E3E5E8] space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#475467]">Estimated Total</span>
                  <span className="text-lg font-bold font-display text-[#17243A]">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </div>

                <div className="p-3 bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl text-[11px] text-[#2447C5]">
                  <span className="font-bold block">Prototype Order Notice:</span>
                  No real payments are collected. You will receive a simulated pickup ticket.
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3">
                <button
                  type="button"
                  onClick={clearCart}
                  className="px-3 py-2 text-xs font-semibold text-[#667085] hover:text-[#B93838]"
                >
                  Clear Cart
                </button>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="px-5 py-2.5 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Place Demo Order (${cartSubtotal.toFixed(2)})
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Order Confirmed Dialog */}
      {placedOrderModal && (
        <Modal
          isOpen={true}
          onClose={() => setPlacedOrderModal(null)}
          title="Demo Order Confirmed!"
          subtitle={`Order #${placedOrderModal.orderNumber}`}
          maxWidth="sm"
        >
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#F0FDF4] text-[#20845A] flex items-center justify-center mx-auto border border-[#BBF7D0]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="text-xs text-[#667085] block">Order Token</span>
              <span className="text-3xl font-mono font-bold text-[#17243A] tracking-wider block mt-0.5">
                #{placedOrderModal.orderNumber}
              </span>
            </div>

            <p className="text-xs text-[#475467] leading-relaxed">
              Your order was queued at <strong className="text-[#17243A]">{placedOrderModal.counter}</strong>. Simulated status is currently{' '}
              <strong className="text-[#315CEB] font-semibold">Received</strong>.
            </p>

            <button
              onClick={() => setPlacedOrderModal(null)}
              className="w-full py-2 bg-[#315CEB] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Close & View In-App Order Status
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
