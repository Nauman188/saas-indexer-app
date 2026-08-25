console.log("Forgot password route hit");

import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await db.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    // Log env vars (remove after debugging)
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASS exists:", !!process.env.SMTP_PASS);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"SaaS Indexer" <onboarding@resend.dev>`,
        to: user.email,
        subject: "Reset your password",
        html: `
          <p>Hi ${user.name || "there"},</p>
          <p>Click below to reset your password (expires in 30 mins):</p>
          <a href="${resetLink}">${resetLink}</a>
        `,
      });
    } catch (smtpError) {
      console.error("SMTP ERROR:", smtpError);
      return NextResponse.json(
        { error: "Failed to send email. Check SMTP settings." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}