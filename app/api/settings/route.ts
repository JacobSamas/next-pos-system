import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Try to get existing settings or create default ones
    let settings = await prisma.storeSettings.findFirst()

    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.storeSettings.create({
        data: {
          storeName: "RetailPro",
          storeAddress: "123 Business St, City, State 12345",
          storePhone: "+1 (555) 123-4567",
          storeEmail: "contact@retailpro.com",
          taxRate: 10,
          currency: "USD",
          receiptFooter: "Visit us again soon!",
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Get existing settings or create if none exist
    let settings = await prisma.storeSettings.findFirst()

    if (!settings) {
      // Create new settings record
      settings = await prisma.storeSettings.create({
        data: {
          storeName: body.storeName || "RetailPro",
          storeAddress: body.storeAddress,
          storePhone: body.storePhone,
          storeEmail: body.storeEmail,
          taxRate: parseFloat(body.taxRate) || 10,
          currency: body.currency || "USD",
          receiptFooter: body.receiptFooter,
        },
      })
    } else {
      // Update existing settings
      settings = await prisma.storeSettings.update({
        where: { id: settings.id },
        data: {
          storeName: body.storeName,
          storeAddress: body.storeAddress,
          storePhone: body.storePhone,
          storeEmail: body.storeEmail,
          taxRate: parseFloat(body.taxRate) || 0,
          currency: body.currency,
          receiptFooter: body.receiptFooter,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}