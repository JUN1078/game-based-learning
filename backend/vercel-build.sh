#!/bin/bash
set -e

# 1. Build TypeScript -> JavaScript
echo "Compiling TypeScript..."
rm -rf dist
./node_modules/.bin/tsc -p tsconfig.json
echo "TypeScript build complete."
ls -la dist/main.js

# 2. Create Build Output API v3 structure
rm -rf .vercel/output
mkdir -p .vercel/output/functions/api.func

# 3. Bundle with ncc (all dependencies into one file)
echo "Bundling with ncc..."
./node_modules/.bin/ncc build dist/main.js -o .vercel/output/functions/api.func

# 4. Create a wrapper entry point that exports the default handler
mv .vercel/output/functions/api.func/index.js .vercel/output/functions/api.func/_main.js
cat > .vercel/output/functions/api.func/index.js << 'ENTRY'
const app = require('./_main');
module.exports = app.default || app;
ENTRY

# 5. Create function config
cat > .vercel/output/functions/api.func/.vc-config.json << 'VCCONFIG'
{
  "runtime": "nodejs20.x",
  "handler": "index.js",
  "launcherType": "Nodejs",
  "maxDuration": 30
}
VCCONFIG

# 6. Create output config with routing
cat > .vercel/output/config.json << 'CONFIG'
{
  "version": 3,
  "routes": [
    {
      "src": "/(.*)",
      "headers": {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
      },
      "continue": true
    },
    {
      "src": "/(.*)",
      "dest": "/api"
    }
  ]
}
CONFIG

echo "Build output created successfully"
