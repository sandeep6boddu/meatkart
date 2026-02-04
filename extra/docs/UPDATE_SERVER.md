# Updating Your EC2 Server

This guide shows you how to update your running application on EC2 with the latest code from GitHub.

## Quick Update (Automated Script)

### Method 1: Using the Update Script

1. **SSH into your EC2 server:**
   ```bash
   ssh -i "your-key.pem" ubuntu@YOUR_EC2_IP
   ```

2. **Navigate to project directory:**
   ```bash
   cd ~/meatkart
   ```

3. **Pull the update script (first time only):**
   ```bash
   git pull origin main
   chmod +x update-server.sh
   ```

4. **Run the update script:**
   ```bash
   ./update-server.sh
   ```

That's it! The script will:
- Pull latest code from GitHub
- Install dependencies
- Generate Prisma client
- Run migrations
- Build the application
- Restart PM2

---

## Manual Update Steps

If you prefer to run commands manually:

### 1. Connect to Your Server
```bash
ssh -i "your-key.pem" ubuntu@YOUR_EC2_IP
```

### 2. Navigate to Project Directory
```bash
cd ~/meatkart
```

### 3. Pull Latest Code
```bash
git pull origin main
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Generate Prisma Client
```bash
npx prisma generate
```

### 6. Run Database Migrations (if any)
```bash
npx prisma migrate deploy
```

### 7. Build Application
```bash
npm run build
```

### 8. Restart Application
```bash
pm2 restart meatkart
```

### 9. Verify Status
```bash
pm2 status
pm2 logs meatkart
```

---

## Monitoring After Update

### Check Application Status
```bash
pm2 status
```

### View Logs (Real-time)
```bash
pm2 logs meatkart
```

### View Last 100 Lines of Logs
```bash
pm2 logs meatkart --lines 100
```

### Stop Viewing Logs
Press `Ctrl + C`

---

## Troubleshooting

### Build Fails (Out of Memory)
If the build fails due to memory issues:

```bash
# Restart the build process
npm run build

# If it still fails, check swap memory
free -h

# If swap is not enabled, run:
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Application Won't Start After Update
```bash
# Check PM2 logs for errors
pm2 logs meatkart --err

# Check if port 3000 is in use
sudo netstat -tulpn | grep 3000

# Try deleting and recreating PM2 process
pm2 delete meatkart
pm2 start npm --name "meatkart" -- start
pm2 save
```

### Database Migration Errors
```bash
# Check database connection
npx prisma db pull

# Reset migrations (CAUTION: This will delete data)
# Only use in development/testing
npx prisma migrate reset
```

### Git Pull Conflicts
If you have local changes that conflict:

```bash
# Stash local changes
git stash

# Pull latest code
git pull origin main

# Apply stashed changes (if needed)
git stash pop

# Or discard local changes
git reset --hard origin/main
```

---

## Best Practices

1. **Backup Before Major Updates**
   ```bash
   # Backup database (if using local PostgreSQL)
   pg_dump your_database > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Test Locally First**
   - Always test updates on your local machine before deploying
   - Run `npm run build` locally to catch build errors

3. **Monitor Logs After Update**
   - Watch logs for 1-2 minutes after restart
   - Check for any errors or warnings

4. **Keep Dependencies Updated**
   ```bash
   npm outdated
   npm update
   ```

---

## Rollback to Previous Version

If the update causes issues, rollback to the previous commit:

```bash
# View recent commits
git log --oneline -5

# Rollback to previous commit
git reset --hard HEAD~1

# Rebuild and restart
npm install
npm run build
pm2 restart meatkart
```

---

## Automated Updates (Future Enhancement)

Consider setting up a webhook for automatic deployments:

1. Create a webhook endpoint in your app
2. Configure GitHub webhook to trigger on push
3. Webhook pulls code, builds, and restarts automatically

Or use GitHub Actions with SSH deployment (requires additional setup).

---

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs meatkart`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Check system resources: `htop` or `free -h`
4. Verify environment variables: `cat .env` (on server)
