# Deploying Meatkart to AWS EC2 (Free Tier) - No DevOps

This guide allows you to deploy your app manually to a free AWS EC2 instance without complex DevOps tools.

## 1. Launch AWS EC2 Instance

1.  Log in to the **AWS Console**.
2.  Search for **EC2** and click **Launch Instance**.
3.  **Name**: `Meatkart-Demo`
4.  **OS Images**: Select **Ubuntu** (Ubuntu Server 22.04 LTS).
5.  **Instance Type**: Select `t2.micro` or `t3.micro` (Free Tier eligible).
6.  **Key Pair**: Create a new key pair (e.g., `meatkart-key`), download the `.pem` file.
7.  **Network Settings**:
    - Check **Allow SSH traffic from** (Select "My IP" for security).
    - Check **Allow HTTP traffic from the internet**.
    - Check **Allow HTTPS traffic from the internet**.
8.  **Storage**: Set to **30 GiB** (Max for Free Tier).
9.  Click **Launch Instance**.

## 2. Connect to Instance

1.  Open your terminal on your local machine.
2.  Navigate to where you downloaded the `.pem` key.
3.  Change permissions (Mac/Linux only): `chmod 400 meatkart-key.pem`
4.  Connect:
    ```bash
    ssh -i "meatkart-key.pem" ubuntu@<YOUR_INSTANCE_PUBLIC_IP>
    ```

## 3. Setup Server (Using Script)

We have created an automated script `setup-ec2.sh` to install Node.js, Nginx, and PM2 for you.

1.  **On the Server**, download or create the script:
    ```bash
    nano setup.sh
    ```
2.  **Paste** the content of `setup-ec2.sh` from this project into the file.
3.  Save and exit (Ctrl+O, Enter, Ctrl+X).
4.  Make it executable and run it:
    ```bash
    chmod +x setup.sh
    ./setup.sh
    ```

## 4. Deploy Application

1.  **Clone your Code**:
    ```bash
    git clone <YOUR_GITHUB_REPO_URL>
    cd meatkart
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Set Environment Variables**:
    Create the `.env` file with your production secrets:
    ```bash
    nano .env
    ```
    Paste your variables:
    ```env
    DATABASE_URL="postgresql://..."
    NEXT_PUBLIC_SUPABASE_URL="https://..."
    NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
    ```

4.  **Setup Swap Memory (CRITICAL for Free Tier)**:
    Since the Free Tier instance has limited RAM (1GB), the build process might freeze. Run this to add virtual memory:
    ```bash
    nano setup-swap.sh
    # Paste content of setup-swap.sh from project
    chmod +x setup-swap.sh
    ./setup-swap.sh
    ```

5.  **Build**:
    ```bash
    npx prisma generate
    npm run build
    ```

5.  **Start Application**:
    ```bash
    pm2 start npm --name "meatkart" -- start
    pm2 save
    pm2 startup
    ```

## 5. Access App

Your app is now live! Verification steps:
- Open your browser and visit: `http://<YOUR_INSTANCE_PUBLIC_IP>`
- Nginx is proxying port 80 to your Next.js app on port 3000.
