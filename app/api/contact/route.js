import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, name, email, subject, message, extraData } = body;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Save to local feedback.json database for Admin Dashboard
    try {
      const dataFile = path.join(process.cwd(), 'data', 'feedback.json');
      let fbData = [];
      try {
        const fileContent = await fs.readFile(dataFile, 'utf8');
        fbData = JSON.parse(fileContent);
      } catch(e) {}
      
      fbData.unshift({
        id: 'f-' + Date.now().toString().slice(-6),
        type: type === 'bug' ? 'bug' : 'contact',
        subject: subject || 'New Message from ' + name,
        body: message,
        senderName: name,
        senderEmail: email,
        status: 'new',
        createdAt: new Date().toISOString()
      });
      await fs.writeFile(dataFile, JSON.stringify(fbData, null, 2), 'utf8');
    } catch (dbErr) {
      console.error('Failed to save feedback to local DB:', dbErr);
    }

    // Configure the SMTP transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Format the email content
    let htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>New Swinglify ${type === 'bug' ? 'Bug Report 🐛' : 'Support Message 📩'}</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
    `;

    if (type === 'bug' && extraData) {
      htmlContent += `
        <p><strong>Severity:</strong> ${extraData.severity || 'N/A'}</p>
        <p><strong>Affected Page:</strong> ${extraData.affectedPage || 'N/A'}</p>
        <p><strong>Expected Behavior:</strong><br/> ${extraData.expected || 'N/A'}</p>
        <p><strong>Steps to Reproduce:</strong><br/> ${extraData.steps || 'N/A'}</p>
      `;
    }

    htmlContent += `
        <p><strong>Message/Description:</strong><br/> ${message.replace(/\n/g, '<br/>')}</p>
      </div>
    `;

    // Send the email
    await transporter.sendMail({
      from: `"Swinglify System" <${process.env.SMTP_USER}>`, // sender address
      to: process.env.RECEIVER_EMAIL || 'team@swinglify.online', // receiver
      replyTo: email,
      subject: `[Swinglify ${type === 'bug' ? 'Bug' : 'Support'}] ${subject || 'New Message from ' + name}`,
      html: htmlContent,
    });

    return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email. Check SMTP configuration.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
