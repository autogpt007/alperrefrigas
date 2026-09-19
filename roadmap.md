# Roadmap

- [x] Cart: estimated shipping/tax disclosure block above checkout button (CartPage.tsx) — real values: $45.00 US base + $25.00 HazMat, tax by ZIP
- [x] Address consistency sweep (llms.txt vs index.html/footer/contact) — llms.txt already consistent
- [x] Remove Zelle/CashApp/crypto payments: checkout, order confirmation, routes, admin, invoice PDF, create-order edge enforcement, content sweep (FAQ, ContactUs, ProductDetails, PaymentInformation, index.html noscript, ads copy), 22 AC product descriptions in the database, merchant feed regenerated
- [x] Verify: Product JSON-LD parity vs merchant feed price ($59 = $59); removed invented "MOQ 40 cylinders" claim from structured data
- [x] Verify: checkout test order on card completed (ORD-20260919-896289, FL 6% tax, create-order 200); create-order API rejects Zelle (400); site-wide mention search clean
- [ ] Publish + re-run GMC guard; user requests Merchant Center re-review
- [ ] GMC correction: category 2364→605, remove unsupported AHRI feed/schema claim, preserve all availability states, align identity markup, regenerate/deploy/publish/verify
