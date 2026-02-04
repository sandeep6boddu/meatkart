# Deploying Meatkart to AWS EC2 - Manual Deployment Guide

This guide will help you deploy your Meatkart application to an AWS EC2 instance.

## Prerequisites

1. AWS Account
2. SSH key pair for EC2 access
3. Your Supabase database credentials

## Step 1: Launch AWS EC2 Instance

1. Log in to the **AWS Console**
2. Navigate to **EC2** → **Launch Instance**
3. Configure your instance:
   - **Name**: `Meatkart-Production`
   - **OS**: Ubuntu Server 22.04 LTS (Free Tier eligible)
   - **Instance Type**: `t2.micro` or `t3.micro` (Free Tier)
   - **Key Pair**: Create/select a key pair and download the `.pem` file
   - **Network Settings**:
     - ✅ Allow SSH traffic (port 22) - from your IP
     - ✅ Allow HTTP traffic (port 80) - from internet
     - ✅ Allow HTTPS traffic (port 443) - from internet
   - **Storage**: 30 GiB (Free Tier maximum)
4. Click **Launch Instance**
5. Note down your instance's **Public IP address**

## Step 2: Connect to Your EC2 Instance

```bash
# Set correct permissions for your key
chmod 400 /path/to/your-key.pem

# Connect via SSH
ssh -i "/path/to/your-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP
```

## Step 3: Server Setup (Automated)

Once connected to your EC2 instance, run the setup script:

```bash
# Download the setup script (or copy from project)
curl -O https://raw.githubusercontent.com/YOUR_REPO/main/setup-ec2.sh

# Make it executable
chmod +x setup-ec2.sh

# Run the setup script
./setup-ec2.sh
```

This script will install:
- Node.js 20.x
- npm
- PM2 (process manager)
- Nginx (web server)

## Step 4: Setup Swap Memory (Critical for Free Tier)

Free Tier instances have limited RAM (1GB). Add swap memory to prevent build failures:

```bash
# Download and run swap setup
curl -O https://raw.githubusercontent.com/YOUR_REPO/main/setup-swap.sh
chmod +x setup-swap.sh
./setup-swap.sh
```

## Step 5: Deploy Your Application

### Clone Your Repository

```bash
cd ~
git clone https://github.com/sandeep6webenrich/meatkart.git
cd meatkart
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create your `.env` file with production credentials:

```bash
nano .env
```

Add your environment variables:

```env
DATABASE_URL="your_supabase_database_url"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
NODE_ENV=production
```

Save and exit (Ctrl+O, Enter, Ctrl+X)

### Build the Application

```bash
# Generate Prisma client
npx prisma generate

# Build Next.js application
npm run build
```

**Note**: The build process may take 5-10 minutes on Free Tier instances due to limited resources.

### Start the Application with PM2

```bash
# Start the application
pm2 start npm --name "meatkart" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system reboot
pm2 startup
# Copy and run the command that PM2 outputs

# Check application status
pm2 status
pm2 logs meatkart
```

## Step 6: Configure Nginx (Reverse Proxy)

The `setup-ec2.sh` script should have already configured Nginx. Verify:

```bash
sudo systemctl status nginx
```

If you need to update the Nginx config:

```bash
sudo nano /etc/nginx/sites-available/default
```

Ensure it contains:

```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:

```bash
sudo systemctl restart nginx
```

## Step 7: Access Your Application

Your application is now live! 🎉

- Visit: `http://YOUR_EC2_PUBLIC_IP`
- Nginx proxies port 80 → port 3000 (Next.js)

## Updating Your Application

When you push new code to GitHub:

```bash
# SSH into your server
ssh -i "your-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP

# Navigate to project directory
cd ~/meatkart

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild the application
npm run build

# Restart PM2
pm2 restart meatkart

# Check status
pm2 logs meatkart
```

## Setting Up a Custom Domain (Optional)

See `DOMAIN_SSL_SETUP.md` for instructions on:
- Pointing your domain to the EC2 IP
- Setting up SSL with Let's Encrypt
- Enabling HTTPS

## Monitoring & Management

### PM2 Commands

```bash
pm2 status                  # Check app status
pm2 logs meatkart          # View logs
pm2 restart meatkart       # Restart app
pm2 stop meatkart          # Stop app
pm2 delete meatkart        # Remove app from PM2
```

### Server Resources

```bash
htop                       # Monitor CPU/RAM usage
df -h                      # Check disk space
free -h                    # Check memory usage
```

## Troubleshooting

### Application Won't Start
- Check PM2 logs: `pm2 logs meatkart`
- Verify environment variables: `cat .env`
- Check port 3000: `sudo netstat -tulpn | grep 3000`

### Build Fails (Out of Memory)
- Ensure swap is enabled: `free -h`
- Run swap setup script again

### Can't Access via Browser
- Check security group allows HTTP (port 80)
- Verify Nginx is running: `sudo systemctl status nginx`
- Check PM2 status: `pm2 status`

### Database Connection Issues
- Verify DATABASE_URL in `.env`
- Check Supabase allows connections from your EC2 IP

## Security Best Practices

1. **Firewall**: Only open necessary ports (22, 80, 443)
2. **SSH**: Use key-based authentication only (disable password auth)
3. **Updates**: Regularly update packages:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
4. **Environment Variables**: Never commit `.env` file to git
5. **SSL**: Set up HTTPS for production (see DOMAIN_SSL_SETUP.md)

## Support

For issues or questions:
- Check logs: `pm2 logs meatkart`
- Review setup scripts: `setup-ec2.sh`, `setup-swap.sh`
- Consult AWS EC2 documentation
