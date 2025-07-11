# IMPORTANT: OrdersContext.tsx File Size Warning

The `src/contexts/OrdersContext.tsx` file is now 285 lines long and getting quite large. After these updates, it should be refactored into smaller, more manageable files to maintain code quality and readability.

## Recent Changes Made:
- Added quotes table and context for RFQ functionality
- Updated checkout with credit card fields and bank wire details
- Fixed order/quote confirmation flow to use proper pages instead of dialogs
- Connected MyAccount to show real backend data
- Made bank wire details configurable through admin settings

## Next Steps:
Consider refactoring the OrdersContext.tsx into smaller components to improve maintainability.