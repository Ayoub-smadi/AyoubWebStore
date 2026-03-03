## Packages
zustand | Lightweight state management for the shopping cart
recharts | Data visualization for the admin dashboard statistics

## Notes
- `zustand` is used for global cart state
- Price amounts in the API are stored as strings (numeric in PG) and must be coerced to `Number()` for display and calculations
- Using standard `Intl.NumberFormat` for JOD currency formatting
- Admin features require user role 'admin'
- CSV Import is stubbed to hit `/api/products/import` with an empty post
