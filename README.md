# Bing Chun Express (Nigeria) 🧋

> **Concept Prototype for Prospective Business Partnership**  
> *A premium, mobile-first online drink pre-ordering and express pickup web application designed specifically for **Bing Chun Nigeria**.*

---

## 🌟 Executive Summary

**Bing Chun Express** is a purpose-built customer pre-ordering and staff operations demo created to showcase how an express pickup platform would drive operational efficiency, shorter mall counter queues, and higher ticket volumes for Bing Chun outlets across Lagos.

This project is **not** a generic bubble tea template. It was built from ground-up based on verified menu research, authentic Nigerian store locations, and genuine local pricing (NGN ₦) for Bing Chun Nigeria (operated by Belu Meals Limited).

---

## 🏬 Verified Lagos Store Network

All branch data reflects actual Bing Chun outlets operating or announced across Lagos:

| Branch Name | Location & Mall Unit | Hours | Est. Prep Time | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Novare Mall, Sangotedo** | Shop L91.1, Food Court (Between Cinema & Kilimanjaro) | 9:00 AM – 9:00 PM | 10–15 mins | Verified / Express Ready |
| **Purple Mall, Maryland** | 350/360 Ikorodu Road, Anthony, Maryland | 10:00 AM – 9:00 PM | 12–18 mins | Verified / Express Ready |
| **Jara Mall, Ikeja** | 22 Simbiat Abiola Way, Ikeja Mainland | 9:30 AM – 9:00 PM | 10–15 mins | Verified / Express Ready |
| **Landmark Centre, VI** | Plot 2&3 Water Corporation Drive, Victoria Island | 10:00 AM – 10:00 PM | 15–20 mins | Verified / Express Ready |
| **Lekki Phase 1** | Admiralty Way Express Pickup Hub | 9:00 AM – 9:30 PM | 10–15 mins | Verified / Express Ready |
| **Surulere Branch** | Adeniran Ogunsanya St, Surulere | 9:30 AM – 8:30 PM | 12–18 mins | Verified / Express Ready |
| **Festac Town** | 23 Road, Festac Town | 10:00 AM – 8:00 PM | 15–20 mins | Demo Simulation |

---

## 🍵 Accurate Menu & Pricing Structure (NGN)

The catalogue is typed and categorized into Bing Chun's signature offerings, with verified sources marked (Chowdeck Nigeria & store menus):

### 1. Fruit Milk Tea
- **Brown Sugar Boba Milk Tea (黑糖波霸奶茶):** ₦4,200 *(Verified)*
- **Original Classic Milk Tea (经典原味奶茶):** ₦3,600 *(Verified)*
- **Coconut Milk Tea (生椰奶茶):** ₦4,200 *(Verified)*
- **Lychee Jasmine Milk Tea (荔枝茉莉奶绿):** ₦4,200 *(Verified)*
- **Strawberry Coconut Jasmine Milk Tea (草莓生椰茉莉):** ₦4,800 *(Verified)*

### 2. Fresh Fruit Tea (No Milk)
- **Fresh Iced Lemonade (冰鲜柠檬水):** ₦2,000 *(Verified signature value item)*
- **Jasmine Honey Tea (蜂蜜茉莉茶):** ₦2,700 *(Verified)*
- **Strawberry Lemon Tea (草莓柠檬红茶):** ₦3,700 *(Verified)*
- **Strawberry Mulberry Tea (草莓桑葚茶):** ₦4,200 *(Verified)*
- **Blueberry Fruit Tea (蓝莓果茶):** ₦3,700 *(Verified)*
- **Grape Crystal Tea (多肉葡萄晶球茶):** ₦4,300 *(Verified)*

### 3. Milkshakes & Smoothies
- **Chocolate Oreo Milkshake:** ₦4,500 *(Verified)*
- **Chocolate Boba Milkshake:** ₦4,200 *(Verified)*
- **Strawberry Smoothie:** ₦3,700 *(Verified)*
- **Blueberry Smoothie:** ₦3,700 *(Verified)*
- **Vanilla Boba Shake / Mango Passion Smoothie:** ₦4,000 *(Illustrative demo)*

### 4. Ice Cream & Sundaes
- **Original Soft-Serve Ice Cream Cone:** ₦1,000 *(Verified)*
- **Brown Sugar Boba Sundae:** ₦2,800 *(Verified)*
- **Strawberry Jam Sundae:** ₦2,800 *(Verified)*
- **Oreo Chocolate Sundae:** ₦3,000 *(Verified)*

### 5. Handcrafted Toppings & Add-ons
- Brown Sugar Boba (+₦600), Tapioca Pearls (+₦500), Coconut Jelly (+₦500), Crystal Agar Boba (+₦600), Signature Cheese Foam (+₦700), Mango Popping Boba (+₦600).
- Insulated Cooler Ice Bag (+₦500) for Lagos traffic transit.

---

## 📱 Features & Screen Overview

### 1. Customer Storefront (`/`)
- Distinctive Bing Chun visual identity using brand primary blue `#0C5CC4`, sunny accent `#FFD23F`, and soft ice `#EEF5FF`.
- Hero banner with headline: *"Your Bing Chun favourites. Ready when you are."*
- Real-time active branch indicator with quick switcher modal.
- Search filter and horizontal category pills (Fruit Milk Tea, Fresh Fruit Tea, Milkshakes, Smoothies, Ice Cream, Extras).
- "Verified Only" toggle for transparent review of real vs. demo items.

### 2. Product Customization Modal
- Dynamic pricing calculator based on size and selected toppings.
- Drink-specific controls (Tea sweetness: 0%, 25%, 50%, 75%, 100%; Ice levels: No Ice, Less Ice, Regular Ice, Extra Ice).
- Dessert-specific controls (Waffle cone vs. Sundae cup).
- Special preparation instructions field.

### 3. Express Cart Drawer & Checkout
- Slide-over bag showing detailed customization breakdown.
- Quantity steppers and itemized subtotals.
- Checkout modal collecting customer pickup name and phone number.
- Simulated payment options (Card, Bank Transfer, Pay at Counter).

### 4. Live Order Tracking (`/track/[id]` & `/track`)
- 5-stage progress timeline:
  1. **Order Received**
  2. **Confirmed by Store**
  3. **Preparing (In Kitchen)**
  4. **Ready for Pickup**
  5. **Collected**
- High-contrast order number (e.g. `BC-1042`) and 4-character pickup PIN (e.g. `H7K9`).
- Scannable demo QR code generated dynamically via `qrcode.react`.
- Quick simulation buttons to fast-forward order state.

### 5. Staff Storefront & Kitchen Ops (`/staff`)
- Operational KPI metrics (New orders, queued, in kitchen, ready on counter, day volume).
- Status-based order queue tabs.
- Barista action triggers: Accept order, Start brewing, Mark ready for pickup, Hand to customer, Cancel order.
- Instant reactive state synchronization between customer and staff screens.

### 6. Menu Management Administration (`/staff/menu`)
- Catalog editor to adjust prices, descriptions, and categories.
- One-click stock availability toggle (In Stock / Sold Out).
- Ability to add new demo items.
- "Reset Demo Data" action to restore clean default state.

---

## 🛠️ Technical Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Language:** TypeScript in strict mode
- **Styling:** Tailwind CSS with custom Bing Chun brand tokens
- **Typography:** `Baloo 2` (headings and wordmarks) & `Inter` (body)
- **Icons:** Lucide React
- **QR Code:** `qrcode.react`
- **State Management:** Reactive Store Context with `localStorage` persistence across browser tabs

---

## 🚀 Running the Project Locally

```bash
# 1. Navigate to the project directory
cd /Users/oluwasegun/.gemini/antigravity-ide/scratch/bingchun-express

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

To build and validate for production:
```bash
npm run build
npm start
```

---

## ⚖️ Demo Boundaries & Transparency

1. **Partnership Concept:** This is an independent concept demonstration developed for partnership discussions with Bing Chun Nigeria. It is not an officially endorsed product of Belu Meals Limited or Bing Chun.
2. **Simulated Payments:** No real financial transactions are processed.
3. **Simulated Communications:** SMS and WhatsApp pickup notifications are not sent to mobile telecom carriers.
4. **Offline Resilience:** All mock data is stored in the browser's `localStorage` and can be reset at any time via the "Reset Demo" button in the staff portal.
