# Domain & SSL Setup (GoDaddy + Let's Encrypt)

Follow these steps to connect `dev.meatkart.com` and enable HTTPS.

## 1. GoDaddy DNS Configuration (Do this FIRST)

1.  Log in to your **GoDaddy** account.
2.  Go to **DNS Management** for your domain `meatkart.com`.
3.  Click **Add New Record**.
    -   **Type**: `A`
    -   **Name**: `dev`
    -   **Value**: `<YOUR_EC2_IP_ADDRESS>` (Copy this from AWS Console, it looks like `3.45.xx.xx`)
    -   **TTL**: `1/2 Hour` or lowest setting.
4.  Click **Save**.

*Wait 2-5 minutes. You can check if it worked by running `ping dev.meatkart.com` on your computer. It should show your AWS IP.*

## 2. Server Configuration

I have created a script `setup-domain.sh` to automate the Nginx configuration.

1.  **Connect to your Server** (SSH).
2.  **Create the script**:
    ```bash
    nano setup-domain.sh
    ```
3.  **Paste** the content of `setup-domain.sh` from this project.
4.  **Run the script**:
    ```bash
    chmod +x setup-domain.sh
    ./setup-domain.sh
    ```

## 3. Generate SSL Certificate

The script will prepare the environment. The final step is interactive, so you must run it manually:

```bash
sudo certbot --nginx -d dev.meatkart.com
```

**Prompts you will see:**
1.  **Email**: Enter your email address.
2.  **Terms**: Type `Y` and Enter.
3.  **Emails**: `Y` or `N`.
4.  **Redirect**: It might ask if you want to redirect HTTP to HTTPS. Choose **2 (Redirect)** if asked.

## 4. Verification

Visit **[https://dev.meatkart.com](https://dev.meatkart.com)**

---
**Troubleshooting:**
- If Certbot fails with "Unauthorized", it means DNS hasn't propagated yet. Wait 10 minutes and try Step 3 again.
