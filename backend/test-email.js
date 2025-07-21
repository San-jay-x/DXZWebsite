/**
 * Email Test Script for DXZ Data Manager
 * 
 * This script tests Gmail SMTP configuration
 * Run with: node backend/test-email.js
 */

require('dotenv').config({ path: './.env' });
const nodemailer = require('nodemailer');

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email configuration
async function testEmail() {
  console.log('🧪 Testing Gmail SMTP Configuration...\n');
  
  console.log('📧 Email Settings:');
  console.log(`Host: ${process.env.EMAIL_HOST}`);
  console.log(`Port: ${process.env.EMAIL_PORT}`);
  console.log(`User: ${process.env.EMAIL_USER}`);
  console.log(`Pass: ${process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 4) + '***' : 'NOT SET'}`);
  console.log(`From: ${process.env.EMAIL_FROM}\n`);

  try {
    // Verify SMTP connection
    console.log('🔗 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Send test email
    console.log('📨 Sending test email...');
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: '✅ DXZ Data Manager - Email Test Successful',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">🎉 Email Configuration Successful!</h2>
          <p>Congratulations! Your DXZ Data Manager email configuration is working perfectly.</p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">✅ What's Working:</h3>
            <ul style="color: #6B7280;">
              <li>Gmail SMTP connection</li>
              <li>Authentication with app password</li>
              <li>Email delivery</li>
              <li>HTML email formatting</li>
            </ul>
          </div>
          
          <p style="color: #6B7280;">
            <strong>Next steps:</strong><br>
            • User registration emails will now work<br>
            • Password reset emails will be delivered<br>
            • Welcome emails will be sent<br>
          </p>
          
          <hr style="border: 1px solid #E5E7EB; margin: 30px 0;">
          <p style="color: #9CA3AF; font-size: 12px;">
            This email was sent by DXZ Data Manager email test script.
          </p>
        </div>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📨 Check your inbox: ${process.env.EMAIL_USER}\n`);
    
    console.log('🎉 EMAIL CONFIGURATION IS WORKING!');
    console.log('📧 Registration emails will now be delivered.');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\n🔧 Troubleshooting Steps:');
    
    if (error.message.includes('Invalid login')) {
      console.log('1. ❌ Authentication failed - Check app password');
      console.log('2. 🔐 Enable 2FA: https://myaccount.google.com/security');
      console.log('3. 🔑 Generate app password: https://myaccount.google.com/apppasswords');
      console.log('4. 📝 Update EMAIL_PASS in backend/.env');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('1. 🌐 Check internet connection');
      console.log('2. 🔍 Verify EMAIL_HOST setting');
    } else {
      console.log('1. 📧 Check email settings in backend/.env');
      console.log('2. 🔐 Verify Gmail allows app passwords');
      console.log('3. 📁 Check spam/junk folder');
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Email test interrupted');
  process.exit(0);
});

// Run the test
console.log('🚀 DXZ Data Manager - Email Test\n');
testEmail().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});