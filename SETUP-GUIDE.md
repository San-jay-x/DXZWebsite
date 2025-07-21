# 🚀 DXZ Data Manager Setup Guide

This guide will walk you through setting up MongoDB and Gmail SMTP for the DXZ Data Manager application.

## 📋 Prerequisites

- Node.js (v16 or higher)
- Git
- A Gmail account
- Internet connection

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)

MongoDB Atlas is a fully managed cloud database service that's perfect for development and production.

#### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Try Free" or "Sign Up"
3. Create your account using email or Google sign-in
4. Complete the welcome survey (optional)

#### Step 2: Create a Database Cluster
1. Click "Build a Database"
2. Choose "Shared" (Free tier - M0 Sandbox)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to your location
5. Name your cluster (e.g., "dxz-data-manager")
6. Click "Create Cluster" (this may take 1-3 minutes)

#### Step 3: Create Database User
1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication method
4. Enter a username (e.g., "dxz-admin")
5. Generate a secure password or create your own (save this!)
6. Under "Database User Privileges", select "Read and write to any database"
7. Click "Add User"

#### Step 4: Configure Network Access
1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production, add your specific server IP addresses
5. Click "Confirm"

#### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as the driver
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<database>` with `dxz-data-manager`

**Example Connection String:**
```
mongodb+srv://dxz-admin:yourpassword@cluster0.abc123.mongodb.net/dxz-data-manager?retryWrites=true&w=majority
```

### Option 2: Local MongoDB (Alternative)

If you prefer to run MongoDB locally, it's already installed on this system.

#### Start Local MongoDB:
```bash
sudo mongod --fork --logpath /var/log/mongodb/mongod.log
```

#### Verify MongoDB is Running:
```bash
mongosh
# Type 'exit' to quit
```

#### Local Connection String:
```
mongodb://localhost:27017/dxz-data-manager
```

## 📧 Gmail SMTP Setup

Gmail SMTP allows the application to send emails for user verification, password resets, and notifications.

### Step 1: Enable 2-Factor Authentication

You **must** have 2FA enabled to use Gmail SMTP with app passwords.

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click "2-Step Verification"
3. Follow the setup process to enable 2FA
4. Use your phone number or Google Authenticator app

### Step 2: Generate App Password

App passwords are 16-character codes that allow apps to access your Gmail account securely.

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. If prompted, sign in to your Google account
3. At the bottom, click "Select app" → Choose "Mail"
4. Click "Select device" → Choose "Other (Custom name)"
5. Type "DXZ Data Manager" as the name
6. Click "Generate"
7. Copy the 16-character password (format: `abcd efgh ijkl mnop`)
8. **Important:** Remove the spaces when using it in the config

### Step 3: SMTP Configuration Details

Use these settings for Gmail SMTP:

| Setting | Value |
|---------|-------|
| Host | smtp.gmail.com |
| Port | 587 |
| Security | STARTTLS |
| Username | your-gmail@gmail.com |
| Password | Your 16-character app password |

## ⚙️ Environment Configuration

### Step 1: Create Environment File

```bash
cd backend
cp .env.example .env
```

### Step 2: Edit the .env File

Open `backend/.env` and update the following values:

```env
# Database (choose one option)
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dxz-data-manager?retryWrites=true&w=majority

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Gmail SMTP
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-gmail@gmail.com
```

### Step 3: Generate JWT Secret

For security, generate a random JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

## 🧪 Testing the Setup

### Step 1: Install Dependencies

```bash
# Install all dependencies
npm install
npm run install:all
```

### Step 2: Start the Application

```bash
# Start both frontend and backend
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend application on http://localhost:3000

### Step 3: Test Database Connection

Check the backend console for:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

### Step 4: Test Email Functionality

1. Open http://localhost:3000 in your browser
2. Click "Register" to create a new account
3. Fill out the registration form
4. Check your email for the verification message
5. If you receive the email, SMTP is working correctly!

## 🔧 Troubleshooting

### MongoDB Issues

**Problem:** Can't connect to MongoDB Atlas
- Check your connection string format
- Verify username and password are correct
- Ensure your IP is whitelisted in Network Access
- Check if cluster is running (green status)

**Problem:** Local MongoDB won't start
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Restart MongoDB
sudo pkill mongod
sudo mongod --fork --logpath /var/log/mongodb/mongod.log
```

### Gmail SMTP Issues

**Problem:** Authentication failed
- Verify 2FA is enabled on your Google account
- Make sure you're using the app password, not your regular password
- Check that the email address is correct
- Regenerate the app password if needed

**Problem:** "Less secure app access" error
- This error means you're using your regular password instead of an app password
- Follow the app password generation steps above

**Problem:** Email not sending
- Check your internet connection
- Verify SMTP settings (host: smtp.gmail.com, port: 587)
- Make sure EMAIL_SECURE=false in your .env file

### General Issues

**Problem:** Environment variables not loading
- Ensure the .env file is in the `backend/` directory
- Check that variable names match exactly (no extra spaces)
- Restart the server after changing .env file

**Problem:** Port conflicts
- If port 5000 or 3000 is in use, update the PORT in .env file
- Kill any existing processes using those ports

## 🔐 Production Considerations

### MongoDB Atlas Production Setup
- Use specific IP addresses instead of allowing all (0.0.0.0/0)
- Enable database encryption
- Set up monitoring and alerts
- Use MongoDB Atlas backup features

### Gmail SMTP for Production
- Consider using a dedicated email service like SendGrid, Mailgun, or AWS SES
- Gmail has daily sending limits (500 emails/day for regular accounts)
- For high-volume applications, use a transactional email service

### Security Best Practices
- Use environment variables instead of .env files in production
- Regularly rotate JWT secrets and app passwords
- Enable HTTPS/TLS in production
- Use strong, unique passwords for all accounts
- Monitor access logs and set up alerts

## 📞 Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Test each component individually (database, then email)
4. Refer to the official documentation:
   - [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
   - [Gmail SMTP Guide](https://support.google.com/accounts/answer/185833)

## ✅ Quick Checklist

Before running the application, ensure:

- [ ] MongoDB Atlas cluster is created and running
- [ ] Database user is created with proper permissions
- [ ] Network access is configured
- [ ] Gmail 2FA is enabled
- [ ] Gmail app password is generated
- [ ] .env file is created and configured
- [ ] JWT secret is generated
- [ ] Dependencies are installed
- [ ] Both servers start without errors
- [ ] Test registration sends verification email

Once all items are checked, your DXZ Data Manager should be fully operational! 🎉