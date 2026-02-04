#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Meatkart Environment Setup..."

# 1. Update System
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# 2. Install Node.js 20 (LTS)
echo "🟢 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install Git and Nginx
echo "🔧 Installing Git and Nginx..."
sudo apt-get install -y git nginx

# 4. Install PM2 (Process Manager) globally
echo "📈 Installing PM2..."
sudo npm install -g pm2

# 5. Configure Nginx Reverse Proxy (Port 80 -> 3000)
echo "globe_with_meridians Configuring Nginx..."
# Create a backup of default config
if [ -f /etc/nginx/sites-available/default ]; then
    sudo mv /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup
fi

# Write new config
sudo tee /etc/nginx/sites-available/default > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Test and Restart Nginx
sudo nginx -t
sudo systemctl restart nginx

# 6. Firewall Setup (Optional but recommended)
echo "🛡️ Configuring UFW (Firewall)..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
# Enable non-interactively
echo "y" | sudo ufw enable

echo "✅ Environment Setup Complete!"
echo "------------------------------------------------"
echo "Next Steps:"
echo "1. git clone your_repo_url"
echo "2. cd meatkart"
echo "3. npm install"
echo "4. Create .env file with your secrets"
echo "5. npx prisma generate"
echo "6. npm run build"
echo "7. pm2 start npm --name 'meatkart' -- start"
echo "------------------------------------------------"
