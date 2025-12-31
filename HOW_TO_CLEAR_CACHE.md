# How to Clear Cache and Load Fresh Version

If you're seeing an old version of the website, follow these steps:

## Option 1: Automatic Cache Clear (EASIEST)

1. Visit: `http://localhost:3000/clear-cache`
2. Wait for the automatic cache clearing process (takes 5-10 seconds)
3. The page will automatically redirect you to the homepage with fresh content

## Option 2: Manual Browser Clear

### Chrome/Edge:
1. Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select "All time" as the time range
3. Check "Cached images and files"
4. Click "Clear data"
5. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Firefox:
1. Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select "Everything" as the time range
3. Check "Cache"
4. Click "Clear Now"
5. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Safari:
1. Go to Safari > Preferences > Advanced
2. Check "Show Develop menu in menu bar"
3. Go to Develop > Empty Caches
4. Hard refresh: `Cmd+Option+R`

## Option 3: Incognito/Private Window

1. Open a new incognito/private window
2. Visit `http://localhost:3000`
3. The fresh version will load without any cached content

## Why This Happens

Browsers aggressively cache content for performance. When you make updates during development, the browser may serve the cached (old) version instead of fetching the new content from the server.

## Prevention

The app now includes:
- Automatic cache busting on version changes
- Aggressive no-cache headers
- Unique build IDs per deployment

These measures should prevent cache issues in the future.
