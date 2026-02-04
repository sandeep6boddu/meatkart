#!/bin/bash

# Exit on error
set -e

echo "💾 Setting up Swap Memory..."

# check if swap file already exists
if [ -f /swapfile ]; then
    echo "Swap file already exists."
else
    # 1. Create a 4GB file
    echo "📦 Allocating 4GB swap file..."
    sudo fallocate -l 4G /swapfile

    # 2. Set permissions
    sudo chmod 600 /swapfile

    # 3. Mark as swap
    sudo mkswap /swapfile

    # 4. Enable swap
    sudo swapon /swapfile

    # 5. Make permanent
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    
    echo "✅ Swap created successfully!"
fi

# Show memory status
echo "📊 Current Memory Status:"
free -h
