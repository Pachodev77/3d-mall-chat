# Running the 3D Mall Chat Locally

## Quick Start

### Option 1: Using the Static Server (Recommended)
```bash
# Install dependencies if you haven't already
npm install

# Run the static server
node server-static.js
```

Then open http://localhost:3000 in your browser.

### Option 2: Using Python's built-in server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open http://localhost:8000 in your browser.

### Option 3: Using Node.js http-server
```bash
# Install http-server globally
npm install -g http-server

# Run the server
http-server -p 8080
```

Then open http://localhost:8080 in your browser.

## Why a Server is Needed

The application loads logo images from the `assets/images/` directory. When you open the HTML file directly in a browser (file:// protocol), the browser blocks loading of local files for security reasons, causing 404 errors for the logo images.

Using a web server (http:// protocol) allows the browser to properly load all static assets including the logo images.

## Troubleshooting

If you still see 404 errors for logo images:
1. Make sure you're accessing the site via http:// not file://
2. Verify that the `assets/images/` directory contains all the logo files
3. Check that the server is running and serving static files correctly 
