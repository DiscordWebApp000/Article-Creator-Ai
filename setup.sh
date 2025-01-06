#!/bin/bash

# Sistem güncellemesi
sudo apt update && sudo apt upgrade -y

# Node.js kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 kurulumu (Process Manager)
sudo npm install -g pm2

# Nginx kurulumu
sudo apt install -y nginx

# Gerekli klasörleri oluştur
mkdir -p ~/video-app/backend/uploads
mkdir -p ~/video-app/web

# Chromium bağımlılıkları
sudo apt install -y ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils 