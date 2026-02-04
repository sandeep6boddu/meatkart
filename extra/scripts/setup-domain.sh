#!/bin/bash
set -e
DOMAIN="dev.meatkart.com"

echo "🔧 Installing Certbot..."
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

echo "📝 Updating Nginx config..."
# Backup
if [ ! -f /etc/nginx/sites-available/default.pre-ssl.backup ]; then
    sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.pre-ssl.backup
fi

# Replace server_name
# We look for 'server_name _;' and replace it. 
if grep -q "server_name _;" /etc/nginx/sites-available/default; then
    sudo sed -i "s/server_name _;/server_name $DOMAIN;/" /etc/nginx/sites-available/default
    echo "Updated server_name from '_' to '$DOMAIN'"
else
    echo "Note: 'server_name _;' not found. Checking if it's already set..."
    if grep -q "server_name $DOMAIN;" /etc/nginx/sites-available/default; then
         echo "server_name is already set to $DOMAIN."
    else
         echo "⚠️  WARNING: Could not automatically set server_name."
         echo "Please edit /etc/nginx/sites-available/default and ensure it has: server_name $DOMAIN;"
    fi
fi

# Test and Reload
echo "🔄 Reloading Nginx..."
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Environment ready for SSL."
echo "------------------------------------------------"
echo "FINAL STEP: Request the Certificate"
echo "Run this command and follow the prompts (enter email, agree to terms):"
echo ""
echo "    sudo certbot --nginx -d $DOMAIN"
echo ""
echo "------------------------------------------------"
