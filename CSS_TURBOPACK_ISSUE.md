# CSS Turbopack Issue - Next.js 16

## Problem
Error CSS parsing di Turbopack Next.js 16:
```
⨯ ./src/app/globals.css:32100:18
Parsing CSS source code failed
> 32100 | .focus\:border-0:focusheader.bg-white\/80.backdrop-blur-sm.shadow-xs.h-16.flex-shrink-0 {
        |                  ^
'focusheader' is not recognized as a valid pseudo-class.
```

## Root Cause
- Turbopack (default di Next.js 16) memiliki bug CSS parsing 
- Error menunjukkan baris 32100 padahal file globals.css hanya 1096 baris
- Kemungkinan ada CSS compilation corruption di Turbopack

## Solution
Gunakan **webpack mode** sebagai default untuk development dan build:

### Package.json Scripts Updated:
```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "dev:turbo": "next dev",
    "build": "next build --webpack", 
    "build:turbo": "next build",
    "start": "next start"
  }
}
```

### Commands:
- **Development**: `pnpm dev` (webpack mode)
- **Development with Turbo**: `pnpm run dev:turbo` (jika ingin test)
- **Build Production**: `pnpm build` (webpack mode) 
- **Build with Turbo**: `pnpm run build:turbo` (jika diperlukan)

## Status
✅ **RESOLVED**: Webpack mode berfungsi normal tanpa CSS parsing errors
❌ **Turbopack**: Masih bermasalah dengan CSS parsing (known issue)

## Performance
- **Webpack**: Stable, proven, compatible dengan CSS kita
- **Turbopack**: Faster compilation tapi masih beta dengan bugs

## Recommendation
Tetap gunakan **webpack mode** sampai Turbopack bug fixes di Next.js versi mendatang.