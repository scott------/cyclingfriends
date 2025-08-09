# CyclingFriends

An Expo + TypeScript starter to track cycling rides with GPS, view a map, and store ride history locally.

## Run

```powershell
npm start
# or
npm run android
```

## Features
- Foreground ride tracking with Expo Location
- Haversine distance calculation
- Local ride history via expo-sqlite
- Basic navigation with tabs and a details stack
- CyclOSM tiles for bike-friendly base maps via react-native-maps UrlTile

## Permissions
- iOS: location (when in use + always for background)
- Android: fine/coarse + background location

## Map tiles
- Dev uses CyclOSM OSM tiles (free, community). Respect their usage limits. For heavy traffic, consider a paid provider or tile hosting.
- Android release builds often need a Google Maps API key configured in app.json for default maps. Our screens set mapType="none" and use UrlTile, so the base doesn’t rely on Google.
