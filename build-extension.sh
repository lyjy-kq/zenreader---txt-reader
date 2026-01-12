#!/bin/bash

echo "Building Edge extension..."
npm run build

echo "Copying manifest.json to dist..."
cp manifest.json dist/

echo "Creating icon files..."
node create-icons.cjs

echo ""
echo "Creating distribution package..."
cd dist
zip -r ../zenreader-extension.zip . -x "*.DS_Store"
cd ..

echo ""
echo "✅ Build complete!"
echo ""
echo "📦 Extension package created: zenreader-extension.zip"
echo "📁 Unpacked extension in: dist/"
echo ""
echo "To install in Edge:"
echo "1. Open Edge and go to edge://extensions/"
echo "2. Enable 'Developer mode' (toggle in bottom-left)"
echo ""
echo "Option A - Load unpacked (for development):"
echo "   - Click 'Load unpacked'"
echo "   - Select the 'dist' folder"
echo ""
echo "Option B - Load from zip (for distribution):"
echo "   - Unzip 'zenreader-extension.zip' first"
echo "   - Then load the unzipped folder"
echo ""
echo "⚠️  Note: The icons are simple 1x1 placeholders."
echo "   For production, please create proper PNG icons."

