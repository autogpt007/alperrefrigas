

## Fix: 70 Overly Long Title Tags

### Root Cause
Two problems combine to create titles exceeding Google's ~60 character limit:

1. **SEOComponent suffix is 56 characters long**: ` | Alper Refrigerants - Professional Refrigerant Distributor` gets appended to any title not containing "Alper"
2. **Many page titles already include "Alper" but are still 70-100+ characters long** (e.g., HomePage title is 97 chars, FreonWholesalePage is 93 chars)

### Fix Strategy

**Step 1: Shorten the suffix in `SEOComponent.tsx`**
- Change from: `${title} | Alper Refrigerants - Professional Refrigerant Distributor` (56 char suffix)
- Change to: `${title} | Alper Refrigerants` (22 char suffix)
- This alone saves 34 characters on every page without "Alper" in the title

**Step 2: Trim individual page titles to stay under 60 chars total**

Here are the pages that need title shortening (showing current → proposed):

| Page | Current Title | Chars | Proposed Title | Chars |
|------|--------------|-------|----------------|-------|
| HomePage | `Alper Refrigerants - Wholesale Refrigerant Distributor \| R-410A, R-134a, R-22 Bulk Supplier \| EPA Certified` | 105 | `Wholesale Refrigerants \| R-410A, R-134a Bulk \| Alper` | 53 |
| Index | `HFO Refrigerant For Sale \| Bulk R-1234yf & Low GWP Solutions \| Alper` | 70 | `HFO Refrigerant For Sale \| Bulk R-1234yf \| Alper` | 50 |
| FreonWholesale | `Bulk Freon Distributor Contractors - R-22 R-410A R-134a Commercial Wholesale Pricing \| Alper Refrigerants` | 103 | `Bulk Freon Wholesale \| R-22, R-410A, R-134a \| Alper` | 52 |
| ContactUs | `Contact Alper Refrigerants - Get Wholesale Refrigerant Pricing Quote \| Turkey` | 78 | `Contact Us \| Wholesale Refrigerant Quotes \| Alper` | 50 |
| ShippingCalc | `Refrigerant Shipping Calculator - International Rates & HazMat Compliance \| Alper Refrigerants` | 94 | `Shipping Calculator \| HazMat Rates \| Alper` | 44 |
| ShippingPolicy | `Shipping Policy - Alper Refrigerants \| HazMat Refrigerant Delivery` | 67 | `Shipping Policy \| HazMat Delivery \| Alper` | 43 |
| TermsOfService | `Terms of Service - Alper Refrigerants Professional Refrigerant Distribution` | 75 | `Terms of Service \| Alper Refrigerants` | 38 |
| PrivacyPolicy | `Privacy Policy - Alper Refrigerants Professional Refrigerant Distribution` | 73 | `Privacy Policy \| Alper Refrigerants` | 36 |
| Sitemap | `Site Map - Alper Refrigerants Professional Refrigerant Distribution` | 67 | `Site Map \| Alper Refrigerants` | 30 |
| PaymentInfo | `Payment Information - Alper Refrigerants \| Accepted Payment Methods` | 67 | `Payment Methods \| Alper Refrigerants` | 37 |
| CryptoPayment | `Complete Your Crypto Payment - FrigidFlow` | 43 | `Complete Your Crypto Payment \| Alper` | 37 |
| NotFound | `Page Not Found - 404 Error \| Alper Refrigerants` | 48 | No change needed (under 60) |

All remaining pages (FAQ, EPA, RFQ, ProductCategory, etc.) will be checked and trimmed to ≤60 chars following the same pattern.

### Files Modified
1. **`src/components/seo/SEOComponent.tsx`** — shorten suffix
2. **`src/pages/Index.tsx`** — trim title
3. **`src/components/pages/HomePage.tsx`** — trim title
4. **`src/components/pages/FreonWholesalePage.tsx`** — trim title
5. **`src/components/pages/ContactUs.tsx`** — trim title
6. **`src/components/pages/ShippingCalculator.tsx`** — trim title
7. **`src/components/pages/ShippingPolicy.tsx`** — trim title
8. **`src/components/pages/TermsOfService.tsx`** — trim title
9. **`src/components/pages/PrivacyPolicy.tsx`** — trim title
10. **`src/components/pages/Sitemap.tsx`** — trim title
11. **`src/components/pages/PaymentInformation.tsx`** — trim title
12. **`src/components/pages/CryptoPaymentPage.tsx`** — fix brand name
13. All other pages with SEOComponent titles over 60 chars

### No screenshots needed from you — I have all the data from the codebase to fix every title.

