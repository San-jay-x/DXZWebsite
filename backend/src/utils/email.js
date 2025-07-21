const nodemailer = require('nodemailer');

/**
 * Email utility for DXZ Data Manager
 * Handles sending verification and password reset emails
 */

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Send verification email to new users
 */
const sendVerificationEmail = async (email, username, verificationToken) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    const mailOptions = {
      from: `"DXZ Data Manager" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: '✨ Welcome to DXZ Data Manager - Verify Your Email',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification - DXZ Data Manager</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: rgba(255, 255, 255, 0.95);
              border-radius: 15px;
              padding: 30px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              backdrop-filter: blur(10px);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              background: linear-gradient(45deg, #667eea, #764ba2);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 10px;
            }
            .welcome {
              color: #555;
              font-size: 18px;
              margin-bottom: 20px;
            }
            .verify-btn {
              display: inline-block;
              background: linear-gradient(45deg, #667eea, #764ba2);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 10px;
              font-weight: bold;
              font-size: 16px;
              margin: 20px 0;
              transition: transform 0.3s ease;
            }
            .verify-btn:hover {
              transform: translateY(-2px);
            }
            .info {
              background: rgba(102, 126, 234, 0.1);
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
              border-left: 4px solid #667eea;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
            .social-links {
              margin-top: 20px;
            }
            .social-links a {
              color: #667eea;
              text-decoration: none;
              margin: 0 10px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🚀 DXZ Data Manager</div>
              <p class="welcome">Welcome to the future of data management!</p>
            </div>
            
            <h2>Hello ${username}! 👋</h2>
            
            <p>Thank you for joining <strong>DXZ Data Manager</strong>! We're excited to have you on board.</p>
            
            <p>To complete your registration and start managing your data securely, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="verify-btn">
                ✨ Verify My Email Address
              </a>
            </div>
            
            <div class="info">
              <h3>🔐 What you'll get access to:</h3>
              <ul>
                <li><strong>Secure Data Management</strong> - Store passwords, UIDs, 2FA keys, and emails safely</li>
                <li><strong>Random Name Generator</strong> - Generate Indian names with smart password creation</li>
                <li><strong>2FA Code Generation</strong> - Real-time TOTP code generation</li>
                <li><strong>Data Export</strong> - Download your data in multiple formats</li>
                <li><strong>Professional Interface</strong> - Enjoy our futuristic, glass-morphism design</li>
              </ul>
            </div>
            
            <p><strong>Security Note:</strong> This verification link will expire in 24 hours for your security.</p>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea; font-family: monospace; background: #f5f5f5; padding: 10px; border-radius: 5px;">
              ${verificationUrl}
            </p>
            
            <div class="footer">
              <p>If you didn't create an account with DXZ Data Manager, please ignore this email.</p>
              
              <div class="social-links">
                <p>Join our community:</p>
                <a href="https://chat.whatsapp.com/IECS5uR40MNHEBcAEJGMVN?mode=r_t" target="_blank">💬 WhatsApp</a>
                <a href="https://t.me/DXZWorkzone" target="_blank">📱 Telegram</a>
              </div>
              
              <p style="margin-top: 20px;">
                © ${new Date().getFullYear()} DXZ Data Manager. All rights reserved.<br>
                <em>Securing your digital future with style.</em>
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, username, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: `"DXZ Data Manager" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: '🔐 Password Reset - DXZ Data Manager',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - DXZ Data Manager</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: rgba(255, 255, 255, 0.95);
              border-radius: 15px;
              padding: 30px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              backdrop-filter: blur(10px);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              background: linear-gradient(45deg, #667eea, #764ba2);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 10px;
            }
            .reset-btn {
              display: inline-block;
              background: linear-gradient(45deg, #ff6b6b, #ee5a24);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 10px;
              font-weight: bold;
              font-size: 16px;
              margin: 20px 0;
              transition: transform 0.3s ease;
            }
            .reset-btn:hover {
              transform: translateY(-2px);
            }
            .warning {
              background: rgba(255, 107, 107, 0.1);
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
              border-left: 4px solid #ff6b6b;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🔐 DXZ Data Manager</div>
              <h2>Password Reset Request</h2>
            </div>
            
            <p>Hello ${username},</p>
            
            <p>We received a request to reset your password for your DXZ Data Manager account.</p>
            
            <p>If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="reset-btn">
                🔑 Reset My Password
              </a>
            </div>
            
            <div class="warning">
              <h3>⚠️ Important Security Information:</h3>
              <ul>
                <li>This reset link will expire in <strong>1 hour</strong> for your security</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Your password will remain unchanged unless you click the link above</li>
                <li>Never share this email or link with anyone</li>
              </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea; font-family: monospace; background: #f5f5f5; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
            
            <div class="footer">
              <p>If you're having trouble, please contact our support team.</p>
              <p style="margin-top: 20px;">
                © ${new Date().getFullYear()} DXZ Data Manager. All rights reserved.<br>
                <em>Your security is our priority.</em>
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send welcome email after successful verification
 */
const sendWelcomeEmail = async (email, username) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"DXZ Data Manager" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: '🎉 Welcome to DXZ Data Manager - You\'re All Set!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome - DXZ Data Manager</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: rgba(255, 255, 255, 0.95);
              border-radius: 15px;
              padding: 30px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              backdrop-filter: blur(10px);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              background: linear-gradient(45deg, #667eea, #764ba2);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 10px;
            }
            .celebrate {
              font-size: 48px;
              margin: 20px 0;
            }
            .get-started-btn {
              display: inline-block;
              background: linear-gradient(45deg, #667eea, #764ba2);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 10px;
              font-weight: bold;
              font-size: 16px;
              margin: 20px 0;
              transition: transform 0.3s ease;
            }
            .features {
              background: rgba(102, 126, 234, 0.1);
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
            .social-links {
              margin-top: 20px;
            }
            .social-links a {
              color: #667eea;
              text-decoration: none;
              margin: 0 10px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🚀 DXZ Data Manager</div>
              <div class="celebrate">🎉</div>
              <h2>Welcome Aboard, ${username}!</h2>
            </div>
            
            <p>Congratulations! Your email has been verified and your DXZ Data Manager account is now active.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/login" class="get-started-btn">
                🚀 Get Started Now
              </a>
            </div>
            
            <div class="features">
              <h3>🌟 Ready to explore? Here's what you can do:</h3>
              <ul>
                <li><strong>🔐 Data Manager</strong> - Securely store and manage your sensitive data</li>
                <li><strong>🎲 Name Generator</strong> - Generate random Indian names with smart passwords</li>
                <li><strong>🔑 2FA Codes</strong> - Generate time-based authentication codes</li>
                <li><strong>📁 Data Export</strong> - Download your data in TXT or Excel format</li>
                <li><strong>💬 Join Community</strong> - Connect with us on WhatsApp and Telegram</li>
              </ul>
            </div>
            
            <p><strong>Pro Tip:</strong> Check out our Random Name Generator for creating unique names and passwords!</p>
            
            <div class="footer">
              <div class="social-links">
                <p>Join our community:</p>
                <a href="https://chat.whatsapp.com/IECS5uR40MNHEBcAEJGMVN?mode=r_t" target="_blank">💬 WhatsApp</a>
                <a href="https://t.me/DXZWorkzone" target="_blank">📱 Telegram</a>
              </div>
              
              <p style="margin-top: 20px;">
                © ${new Date().getFullYear()} DXZ Data Manager. All rights reserved.<br>
                <em>Your journey to secure data management starts now!</em>
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email failures
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};