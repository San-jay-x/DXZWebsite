# 🚀 DXZ Data Manager

A professional, futuristic web application for managing user-specific data including passwords, Facebook UIDs, 2FA keys, and emails. Built with modern technologies and featuring a stunning glassmorphism UI with smooth animations.

## ✨ Features

### 🔐 Authentication & Security
- **User Registration** with email verification
- **Secure Login** with JWT authentication
- **Password Reset** functionality
- **Email Verification** system
- **Rate Limiting** for security
- **Password Hashing** with bcrypt
- **XSS Protection** and input sanitization

### 📊 Data Management
- **Secure Storage** of passwords, UIDs, 2FA keys, and emails
- **User-Specific Data** isolation
- **Date-Based Organization** of data entries
- **Data Export** in TXT and Excel formats
- **Facebook UID Extraction** from URLs
- **CRUD Operations** with full data control

### 🎲 Random Name Generator
- **500 Unique Indian Male Names** with surnames
- **500 Unique Indian Female Names** with surnames
- **Smart Password Generation** (Username+FirstName+@+TomorrowDate)
- **Copy-to-Clipboard** functionality
- **No Duplicate Names** guarantee

### 🔑 2FA Code Generation
- **Real-time TOTP Code Generation** using otpauth library
- **30-second Refresh Cycle**
- **Copy-to-Clipboard** for codes
- **Visual Timer** for code expiration

### 🎨 Modern UI/UX
- **Futuristic Design** with glassmorphism effects
- **Professional Color Palette** (Purple/Pink gradients)
- **Smooth Animations** with Framer Motion
- **Responsive Design** for all devices
- **Dark Theme** optimized for readability
- **Particle Background** effects
- **Loading States** and transitions

### 🌐 Social Integration
- **WhatsApp Channel** link integration
- **Telegram Channel** link integration
- **External Link Handling**

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Nodemailer** for email services
- **bcrypt** for password hashing
- **Rate Limiting** with express-rate-limit
- **Input Validation** with express-validator
- **CORS** and security headers

### Frontend
- **React 18** with modern hooks
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Hook Form** for forms
- **React Hot Toast** for notifications
- **Axios** for API calls

### Libraries & Tools
- **otpauth** (v9.1.4) for 2FA generation
- **xlsx** for Excel file generation
- **js-file-download** for file downloads
- **Lucide React** for icons
- **date-fns** for date handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd dxz-data-manager
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm run install:all
```

3. **Environment Setup**

Create `.env` file in the `backend` directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dxz-data-manager
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@dxzdatamanager.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

4. **Start Development Servers**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:backend  # Backend on http://localhost:5000
npm run dev:frontend # Frontend on http://localhost:3000
```

5. **Seed the Names Database**

After starting the servers, the Indian names database needs to be seeded:
- Register and login to the application
- Navigate to the Name Generator
- The system will automatically prompt to seed the database
- Or manually call: `POST /api/names/seed`

## 📱 Usage Guide

### 1. Account Creation
1. Go to `/register`
2. Fill in username, email, and password
3. Check your email for verification link
4. Click the verification link
5. Login with your credentials

### 2. Data Manager
- **Add Data**: Enter UID, password, 2FA key, or email
- **View Data**: See all your data organized by date
- **Export Data**: Download as TXT or Excel file
- **Delete Data**: Remove individual entries or entire dates
- **UID Extraction**: Paste Facebook URLs to extract UIDs

### 3. Name Generator
- **Select Gender**: Choose male or female
- **Generate Names**: Get 5 random Indian names
- **Copy Functions**: Copy first name, surname, or generated password
- **Password Format**: `{username}{firstname}@{tomorrow_date}`

### 4. 2FA Code Generation
- **Enter 2FA Key**: Paste your 2FA secret key
- **Live Codes**: See real-time TOTP codes
- **Copy Codes**: One-click copy to clipboard
- **Timer**: Visual countdown for code expiration

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/me` - Get user profile

### Data Management
- `POST /api/data` - Save data entry
- `GET /api/data` - Get all user data
- `GET /api/data/:date` - Get data by date
- `DELETE /api/data/:id` - Delete specific entry
- `DELETE /api/data/date/:date` - Delete all data for date
- `GET /api/data/export/txt` - Export as text file
- `GET /api/data/export/xlsx` - Export as Excel file
- `POST /api/data/extract-uid` - Extract UID from URL

### Name Generator
- `GET /api/names/:gender` - Get random names
- `GET /api/names/stats/:gender` - Get name statistics
- `POST /api/names/seed` - Seed names database
- `GET /api/names/search/:gender` - Search names

## 🎨 Customization

### Color Palette
The application uses a professional futuristic color scheme:
- **Primary**: Purple gradients (#6366f1)
- **Secondary**: Pink gradients (#d946ef)
- **Accent**: Green gradients (#10b981)
- **Background**: Dark gradients with glassmorphism

### Fonts
- **Display**: Orbitron (futuristic headers)
- **Body**: Inter (readable content)
- **Mono**: JetBrains Mono (code/data)

### Animations
- Glassmorphism effects
- Smooth page transitions
- Hover animations
- Loading states
- Particle background
- Floating elements

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** with bcrypt (cost factor 12)
- **Rate Limiting** (5 auth requests per 15 minutes)
- **Input Sanitization** with XSS protection
- **CORS Configuration** for secure cross-origin requests
- **Environment Variables** for sensitive data
- **Email Verification** for account security
- **Token Expiration** handling

## 📊 Database Schema

### Users Collection
```javascript
{
  username: String (unique, 3-20 chars),
  email: String (unique, validated),
  password: String (hashed),
  isVerified: Boolean,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  lastLogin: Date
}
```

### UserData Collection
```javascript
{
  userId: ObjectId (ref: User),
  uid: String (FB UID format),
  password: String,
  twoFaKey: String,
  email: String,
  date: String (YYYY-MM-DD),
  createdAt: Date,
  updatedAt: Date
}
```

### Names Collection
```javascript
{
  firstName: String,
  surname: String,
  gender: String (male/female),
  isActive: Boolean,
  createdAt: Date
}
```

## 🌐 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Start production server
npm run start
```

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dxz-data-manager
JWT_SECRET=production-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=production-email@domain.com
EMAIL_PASS=production-app-password
FRONTEND_URL=https://yourdomain.com
```

### Recommended Hosting
- **Frontend**: Vercel, Netlify, or AWS S3
- **Backend**: Heroku, Railway, or AWS EC2
- **Database**: MongoDB Atlas
- **Email**: Gmail SMTP or SendGrid

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@dxzdatamanager.com or join our community:

- 💬 [WhatsApp Channel](https://chat.whatsapp.com/IECS5uR40MNHEBcAEJGMVN?mode=r_t)
- 📱 [Telegram Channel](https://t.me/DXZWorkzone)

## 📝 Changelog

### Version 1.0.0
- Initial release
- Complete authentication system
- Data management functionality
- Random name generator with 1000 Indian names
- 2FA code generation
- Modern glassmorphism UI
- Export functionality
- Social media integration

---

**Built with ❤️ by the DXZ Team**

*Securing your digital future with style.*