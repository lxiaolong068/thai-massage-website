import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assuming prisma client setup

export const dynamic = 'force-dynamic'; // Ensure fresh data

export async function GET() {
  console.log("Fetching active public contact methods..."); // Add log
  try {
    const activeMethods = await prisma.contactMethod.findMany({
      where: {
        isActive: true,
        qrCode: {
          not: null, // Ensure qrCode is not null
          // notIn: [''], // Allow empty string if needed, filter later if necessary
        },
      },
      select: {
        type: true,
        qrCode: true,
        value: true, // Add value field
        id: true, // Include id for key prop
      },
      orderBy: {
        // Define a specific order if desired, e.g., based on type or a custom order field
         type: 'asc', // Default alphabetical order by type
      }
    });

    // Filter out methods with empty string qrCode explicitly if API returns them
    const result = activeMethods
       .filter(method => method.qrCode && method.qrCode.trim() !== '')
       .map(method => ({
         id: method.id,
         type: method.type,
         value: method.value, // Include value in the result
         qrCode: method.qrCode
       }));

    console.log(`Found ${result.length} active methods with QR codes.`); // Log count
    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error("Error fetching active contact methods:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch contact methods" }, { status: 500 });
  } finally {
    // Prisma disconnect might not be necessary with Next.js >= 13. Vercel handles this.
    // if (prisma) {
    //   await prisma.$disconnect();
    // }
  }
} 