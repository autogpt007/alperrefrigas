# Roadmap

- [x] Cart: estimated shipping/tax disclosure block above checkout button (CartPage.tsx) — real values: $45.00 US base + $25.00 HazMat, tax by ZIP
- [x] Address consistency sweep (llms.txt vs index.html/footer/contact) — llms.txt already consistent
- [x] Remove Zelle/CashApp/crypto payments: checkout, order confirmation, routes, admin, invoice PDF, create-order edge enforcement, content sweep (FAQ, ContactUs, ProductDetails, PaymentInformation, index.html noscript, ads copy), 22 AC product descriptions in the database, merchant feed regenerated
- [x] Verify: Product JSON-LD parity vs merchant feed price ($59 = $59); removed invented "MOQ 40 cylinders" claim from structured data
- [x] Verify: checkout test order on card completed (ORD-20260919-896289, FL 6% tax, create-order 200); create-order API rejects Zelle (400); site-wide mention search clean
- [ ] Publish + re-run GMC guard; user requests Merchant Center re-review
- [x] GMC correction: category 2364→605, remove unsupported AHRI feed/schema claim, preserve all availability states, align identity markup, regenerate/deploy; verified 73 complete products
- [x] Database restore from backup (db_cluster-05-08-2026): 55 historical orders + 57 order lines imported conflict-safe (ON CONFLICT id + order_number guard), 1 coupon, 2 quotes + items, 32 missing site settings. Current 3 orders untouched (58 total, 61 items). Profiles skipped — auth users cannot be recreated.
- [x] Bank wire / invoice settings restored; routing, account, bank name and SWIFT left blank — backup held placeholder zeros [NEEDS HUMAN VERIFICATION]
- [x] Cart cross-tab sync: storage + custom-event listeners in CartContext, all mutations merge with latest persisted cart
- [x] Itemized order totals: src/utils/orderTotals.ts shared breakdown (gross subtotal, coupon, bank wire discount, shipping, tax, net total) used in OrderManagement + OrderConfirmation
- [ ] Confirm real beneficiary bank details before sending bank wire instructions to buyers
