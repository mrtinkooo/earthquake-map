# Myanmar Earthquake Map

An interactive web map application visualizing Myanmar earthquake data with tectonic lineaments.

## Features

- **Interactive Map**: Built with React and MapLibre GL JS
- **OSM Basemap**: OpenStreetMap tiles for geographic context
- **Tectonic Lineaments**: Myanmar's tectonic fault lines displayed as background layer
- **Earthquake Points**: 44 earthquake events from March-April 2025
- **Color-coded by Magnitude**:
  - Green: < 4.0
  - Yellow: 4.0 - 4.9
  - Orange: 5.0 - 5.9
  - Red: ≥ 6.0
- **Interactive Popups**: Click on any earthquake point to see detailed information
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Data Sources

- **Earthquake Data**: USGS earthquake catalog (query.csv)
  - 44 earthquakes from March-April 2025
  - Centered around Mandalay region, Myanmar
  - Includes notable 7.7 magnitude event on March 28, 2025

- **Tectonic Lineaments**: [Myanmar Tectonic Map 2011](https://raw.githubusercontent.com/drtinkooo/myanmar-earthquake-archive/refs/heads/main/Myanmar_Tectonic_Map_2011.geojson)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool
- **MapLibre GL JS** - Open-source mapping library
- **react-map-gl** - React wrapper for MapLibre
- **PapaParse** - CSV parsing library

## Project Structure

```
earthquake-map/
├── public/
│   └── query.csv           # Earthquake data
├── src/
│   ├── components/
│   │   ├── MapComponent.jsx    # Main map component
│   │   └── MapComponent.css    # Map styling
│   ├── utils/
│   │   └── dataUtils.js        # Data processing utilities
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
└── package.json
```

## Usage

1. Open the application in your browser (default: http://localhost:5173)
2. Explore the map by panning and zooming
3. Click on any colored circle (earthquake point) to view details
4. Use the legend in the bottom-right to understand magnitude colors

## Development

The application automatically fetches:
- Earthquake data from `/public/query.csv`
- Tectonic lineaments from the GitHub repository

To modify data sources, edit `src/utils/dataUtils.js`.

## Credits

- Earthquake data: USGS Earthquake Catalog
- Tectonic lineaments: Myanmar Earthquake Archive
- Basemap: OpenStreetMap contributors via CartoDB Positron style
- Built with MapLibre GL JS (open-source fork of Mapbox GL JS)

## License

This project is for educational and research purposes.

