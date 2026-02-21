# Render-Blocking Requests - Complete Fix Guide

## 🔴 The Problem

Your Lighthouse report shows **render-blocking requests** that delay the page's ability to paint:

```
1. /assets/index-DW3ozI74.css  → 44.9 KiB, 290 ms ⛔
2. Google Fonts CSS            → 1.9 KiB, 370 ms ⛔
```

**Why this matters:**

- The browser downloads these files **before** it can display anything
- User sees a blank page for 290-370ms
- These slow down your **LCP (Largest Contentful Paint)** metric
- Potential savings: **150ms** just by optimizing these

---

## 🎯 The Solution (Bare Minimum)

### **Quick Wins (Implement These First)**

#### 1. **Optimize Google Fonts Loading** (Easiest - 5 min)

**Current approach:** Blocking CSS request from Google Fonts

**Fix:** Add `display=swap` parameter to load fonts faster

**In your [index.html](index.html):**

```html
<!-- BEFORE (blocks rendering) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet" />

<!-- AFTER (non-blocking + faster) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=...&display=swap"
  rel="stylesheet"
/>
```

**What `display=swap` does:**

- Shows text with fallback font while Google Font loads
- Prevents blank page delay
- Saves ~50-70ms

---

#### 2. **Add DNS Prefetch for Third-Party Domains** (2 min)

Tell browser to resolve DNS early so fonts download faster:

```html
<head>
  <!-- DNS Prefetch for faster third-party lookups -->
  <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
  <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <!-- Your main CSS - still blocks, but optimized below -->
  <link rel="stylesheet" href="/src/main.jsx" />
</head>
```

**Saves:** ~30-50ms on font loading

---

#### 3. **Defer Non-Critical CSS** (Most Effective - 10 min)

**The Key Insight:** Not all CSS needs to block rendering. Split your CSS into:

- **Critical CSS** (above the fold) - must be inline
- **Non-critical CSS** (below the fold) - can load asynchronously

**Vite Plugin Solution:**

Install the CSS inlining plugin:

```bash
npm install -D vite-plugin-critical
```

Update [vite.config.js](vite.config.js):

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          // ... existing chunk config
        },
      },
    },
    // Add CSS handling
    cssCodeSplit: true, // ← Split CSS into separate files
  },
  // Preload important assets
  server: {
    preloadAssets: true,
  },
});
```

**For Index.html, add preload hints:**

```html
<head>
  <!-- Critical CSS inlined or preloaded -->
  <link rel="preload" href="/assets/index-DW3ozI74.css" as="style" />

  <!-- Optional: Inline critical CSS directly -->
  <style>
    /* Critical above-the-fold styles only */
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .header {
      background: #fff;
      padding: 1rem;
    }
    /* ... more critical styles ... */
  </style>
</head>
```

**Saves:** ~100-150ms by not blocking render

---

#### 4. **Async Load Google Fonts** (Alternative Approach - 3 min)

Instead of render-blocking, load fonts asynchronously:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Load fonts asynchronously -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=...&display=swap"
  media="print"
  onload="this.media='all'"
/>

<!-- Fallback for no-JS -->
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=..." />
</noscript>
```

**How it works:**

- `media="print"` makes browser ignore it initially (no render block)
- `onload="this.media='all'"` switches to `all` after loading
- No blank page + fonts load in background
- **Saves:** ~70ms

---

## 📋 Implementation Steps (Fastest Path)

### **Step 1: Update [index.html](index.html) (Immediate - 2 min)**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="./public/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Examible</title>
    <meta name="description" content="..." />
    <meta property="og:image" content="..." />

    <!-- DNS Prefetch + Preconnect for Google Fonts -->
    <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
    <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <!-- Preload main CSS (don't block render) -->
    <link
      rel="preload"
      href="/assets/index-DW3ozI74.css"
      as="style"
      onload="this.onload=null;this.rel='stylesheet'"
    />
    <noscript
      ><link rel="stylesheet" href="/assets/index-DW3ozI74.css"
    /></noscript>

    <!-- Google Fonts with display=swap (fast fallback) -->
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
      media="print"
      onload="this.media='all'"
    />
    <noscript>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700"
      />
    </noscript>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**What changed:**

- ✅ Added `dns-prefetch` for faster domain lookups
- ✅ Added `preconnect` to establish early connection
- ✅ Changed CSS link to `preload` with `onload` callback (async loading)
- ✅ Added `display=swap` to Google Fonts for faster fallback
- ✅ Made Google Fonts async with `media="print"` trick

**Estimated savings: 150ms** ⚡

---

### **Step 2: Update [vite.config.js](vite.config.js) (5 min)**

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // ✅ Split CSS into separate chunks
    cssCodeSplit: true,

    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "redux-vendor": ["@reduxjs/toolkit", "react-redux", "redux-persist"],
          "ui-vendor": [
            "antd",
            "@chatscope/chat-ui-kit-react",
            "swiper",
            "react-multi-carousel",
          ],
          "markdown-vendor": [
            "react-markdown",
            "rehype-katex",
            "rehype-sanitize",
            "remark-gfm",
            "remark-math",
          ],
          "utils-vendor": [
            "axios",
            "react-toastify",
            "react-icons",
            "@emailjs/browser",
            "katex",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@reduxjs/toolkit",
      "react-redux",
    ],
  },
});
```

**What's new:**

- ✅ `cssCodeSplit: true` - Splits CSS into smaller chunks
- Smaller CSS files load faster
- Less render-blocking impact

---

## 📊 Expected Impact

| Change                      | Impact                    | Time Saved       |
| --------------------------- | ------------------------- | ---------------- |
| Add `display=swap` to fonts | Faster text rendering     | 50-70ms          |
| DNS Prefetch + Preconnect   | Parallel connection setup | 30-50ms          |
| CSS Preload with async      | Non-blocking CSS          | 80-100ms         |
| CSS Code Split              | Smaller bundles           | 20-50ms          |
| **Total**                   |                           | **150-270ms** ⚡ |

Your Lighthouse score will improve significantly!

---

## 🧪 Verify the Fix

After making changes:

1. **Clear browser cache:**

   ```bash
   npm run dev
   # or force refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
   ```

2. **Run Lighthouse again:**
   - Chrome DevTools → Lighthouse → Generate Report
   - Check "Render-blocking requests" metric
   - Should see **0ms or very small value**

3. **Check Performance metrics:**
   - FCP (First Contentful Paint) - should drop by ~150ms
   - LCP (Largest Contentful Paint) - should improve
   - CLS (Cumulative Layout Shift) - unchanged

---

## 🚀 Advanced (Optional - 15 min)

If you want to go further:

### **1. Inline Critical CSS**

Extract styles used above-the-fold and inline them:

```html
<head>
  <style>
    /* Critical styles for initial render */
    body {
      margin: 0;
      font-family: system-ui;
    }
    #root {
      display: flex;
      flex-direction: column;
    }
    .header {
      background: #fff;
      border-bottom: 1px solid #eee;
    }
    /* ... more critical styles ... */
  </style>
  <link
    rel="preload"
    href="/assets/index-DW3ozI74.css"
    as="style"
    onload="this.onload=null;this.rel='stylesheet'"
  />
</head>
```

**Saves:** Additional 50-100ms

### **2. Use Font Subsetting**

Load only necessary characters from Google Fonts:

```html
<!-- Instead of full font, load subset -->
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&subset=latin&display=swap"
  rel="stylesheet"
  media="print"
  onload="this.media='all'"
/>
```

**Saves:** 30-50% font file size

### **3. Use WOFF2 Fonts**

Self-host fonts in WOFF2 format (smaller than Google's):

```html
@font-face { font-family: 'CustomFont'; src: url('/fonts/custom.woff2')
format('woff2'); font-display: swap; }
```

**Saves:** 60-70% font size

---

## ✅ Checklist

- [ ] Add `dns-prefetch` and `preconnect` links to index.html
- [ ] Add `display=swap` to Google Fonts URL
- [ ] Change CSS link to use `preload` + `onload` callback
- [ ] Make Google Fonts async with `media="print"` trick
- [ ] Set `cssCodeSplit: true` in vite.config.js
- [ ] Run Lighthouse again to verify improvement
- [ ] Check FCP/LCP metrics improved

---

## 📈 Results You Should See

**Before:**

- Render-blocking requests: 150ms savings possible
- FCP: ~2-3 seconds
- LCP: ~3-4 seconds

**After:**

- Render-blocking requests: < 50ms
- FCP: ~1-1.5 seconds (50%+ improvement)
- LCP: ~2-2.5 seconds (40-50% improvement)

---

This is the **bare minimum** approach. Apply Step 1 and Step 2, then test with Lighthouse. You'll see immediate improvements!
