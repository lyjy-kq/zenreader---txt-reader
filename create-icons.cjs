const fs = require('fs');

// Create simple PNG icons using data URL approach
const sizes = [16, 32, 48, 128];

sizes.forEach(size => {
  // Create a simple red square PNG using Canvas API would be ideal,
  // but for now let's create a minimal valid PNG
  
  // This is a minimal 1x1 red pixel PNG
  const redPixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
  const buffer = Buffer.from(redPixelBase64, 'base64');
  
  fs.writeFileSync(`dist/icon${size}.png`, buffer);
  console.log(`Created icon${size}.png`);
});

console.log('\n✓ Icons created successfully!');
console.log('Note: These are placeholder 1x1 icons. Please replace with proper icons.');
