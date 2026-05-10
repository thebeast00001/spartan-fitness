"use server";

import { db } from "@/db";
import { trials, memberships } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from 'resend';
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const trialSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phoneNumber: z.string().min(5).max(20),
});

const membershipSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email().max(255),
  planType: z.string().min(1).max(100),
  durationMonths: z.number().int().min(1).max(12),
  price: z.string(),
});

export async function submitTrialAction(formData: FormData) {
  // Validate input strictly
  const parsed = trialSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
  });

  if (!parsed.success) {
    return { error: "validation_error", message: "Invalid input data. Please check your details." };
  }

  const { fullName, email, phoneNumber } = parsed.data;

  // Check if a trial with this email already exists
  const existingTrial = await db.select().from(trials).where(eq(trials.email, email));
  if (existingTrial.length > 0) {
    return { error: "already_booked", message: "You have already booked a free trial." };
  }

  await db.insert(trials).values({
    fullName,
    email,
    phoneNumber,
  });

  // Send Confirmation Email (Fire and forget for faster response time)
  if (process.env.RESEND_API_KEY) {
    Promise.resolve().then(() => {
      return resend.emails.send({
        from: 'Spartan Fitness <onboarding@resend.dev>',
        to: email,
        subject: 'SPARTAN FITNESS // Trial Confirmed',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border: 1px solid #333;">
            <h1 style="color: #e31b23; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">#LETSFUCKINGGO</h1>
            <p style="font-size: 16px; line-height: 1.5; color: #ccc;">
              <strong>${fullName.toUpperCase()}</strong>,
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #ccc;">
              Your 3-day trial is secured. No contracts. Just raw discipline.
              Check in at the front desk with this email. See you on the floor.
            </p>
            <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
              <p style="font-size: 12px; color: #666; text-transform: uppercase;">
                SPARTAN FITNESS INC. // NO EXCUSES
              </p>
            </div>
          </div>
        `
      });
    }).catch(error => {
      console.error("Failed to send email:", error);
    });
  }

  return { success: true };
}

export async function submitMembershipAction(formData: FormData) {
  const parsed = membershipSchema.safeParse({
    name: formData.get("name") || undefined,
    email: formData.get("email"),
    planType: formData.get("planType"),
    durationMonths: parseInt(formData.get("durationMonths") as string || "1"),
    price: formData.get("price"),
  });

  if (!parsed.success) {
    return { error: "validation_error", message: "Invalid membership data." };
  }

  const { email, name, planType, durationMonths, price } = parsed.data;

  await db.insert(memberships).values({
    email,
    planType,
    status: 'pending', // Set to pending by default for manager approval
  });

  if (process.env.RESEND_API_KEY) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationMonths);

    const formattedStart = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedEnd = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    Promise.resolve().then(() => {
      return resend.emails.send({
        from: 'Spartan Fitness <onboarding@resend.dev>',
        to: email,
        subject: 'SPARTAN FITNESS // Membership Activated',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border: 1px solid #333;">
            <h1 style="color: #e31b23; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">WELCOME TO THE IRON CULT</h1>
            <p style="font-size: 16px; line-height: 1.5; color: #ccc;">
              <strong>${name ? name.toUpperCase() : "RECRUIT"}</strong>,
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #ccc;">
              Your transaction of ₹${price} was approved. You are officially locked in.
            </p>
            <div style="margin: 30px 0; padding: 20px; background: #111; border-left: 4px solid #e31b23;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #888;">MEMBERSHIP PLAN</p>
              <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: bold; text-transform: uppercase;">${planType}</p>
              
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #888;">TIMELINE</p>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="color: #ccc;">Start Date:</span>
                <span style="font-weight: bold;">${formattedStart}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #ccc;">End Date:</span>
                <span style="font-weight: bold;">${formattedEnd}</span>
              </div>
            </div>
            <p style="font-size: 16px; line-height: 1.5; color: #ccc;">
              Bring this receipt to the front desk for your physical access card. No excuses.
            </p>
            <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
              <p style="font-size: 12px; color: #666; text-transform: uppercase;">
                SPARTAN FITNESS INC. // NO EXCUSES
              </p>
            </div>
          </div>
        `
      });
    }).catch(error => {
      console.error("Failed to send membership email:", error);
    });
  }

  return { success: true };
}

export async function updateMembershipStatus(id: number, status: string) {
  // Ensure strict values
  if (!['active', 'inactive', 'pending'].includes(status)) {
    return { error: "Invalid status" };
  }

  await db.update(memberships)
    .set({ status })
    .where(eq(memberships.id, id));

  return { success: true };
}
