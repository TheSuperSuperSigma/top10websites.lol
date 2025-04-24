import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  // Verify environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Missing email configuration');
    return NextResponse.json(
      { error: 'Server email configuration error' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
    } catch (error) {
      console.error('Email transporter verification failed:', error);
      return NextResponse.json(
        { error: 'Email service configuration error' },
        { status: 500 }
      );
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'theindymower@gmail.com',
      subject: 'ORDER - New Lawn Service Booking',
      html: `
        <h2>New Booking Request</h2>
        <h3>Customer Information:</h3>
        <p><strong>Email:</strong> ${body.customerInfo.email}</p>
        <p><strong>Address:</strong> ${body.customerInfo.address}</p>
        <p><strong>Preferred Date:</strong> ${new Date(body.customerInfo.date).toLocaleDateString()}</p>
        <p><strong>Preferred Time:</strong> ${body.customerInfo.time}</p>
        ${body.customerInfo.phone ? `<p><strong>Phone:</strong> ${body.customerInfo.phone}</p>` : ''}
        
        <h3>Selected Services:</h3>
        <p>${body.services}</p>
        
        <h3>Total Price:</h3>
        <p>$${body.totalPrice}</p>
        
        <p><strong>Booking Time:</strong> ${new Date(body.timestamp).toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

