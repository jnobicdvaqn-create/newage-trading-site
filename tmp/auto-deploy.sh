#!/bin/bash
set +e

# Node 20+ (installed via n package manager)
export PATH="/usr/local/bin:$PATH"

REPO_DIR="/tmp/newage-trading-site"
WEB_DIR="/var/www/newage-trading.com"
BRANCH="main"

# Pull latest code
if [ -d "$REPO_DIR/.git" ]; then
  cd "$REPO_DIR" && git fetch origin $BRANCH --quiet && git reset --hard origin/$BRANCH --quiet
else
  rm -rf "$REPO_DIR" && git clone --depth 1 -b $BRANCH https://github.com/jnobicdvaqn-create/newage-trading-site.git "$REPO_DIR"
fi

# Install deps and build
cd "$REPO_DIR"
npm install --silent 2>/dev/null
./node_modules/.bin/astro build 2>&1 | tail -5
BUILD_EXIT=${PIPESTATUS[0]}

if [ $BUILD_EXIT -ne 0 ]; then
  echo "BUILD_FAILED $(date)" >> /tmp/deploy.log
  exit 1
fi

# Deploy to web root
if [ -d dist ]; then
  rm -rf "$WEB_DIR"/*
  cp -r dist/* "$WEB_DIR"/
  echo "DEPLOY_OK $(date)" >> /tmp/deploy.log
else
  echo "NO_DIST $(date)" >> /tmp/deploy.log
  exit 1
fi
