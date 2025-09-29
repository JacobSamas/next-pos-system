import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  cost: z.number().positive().optional(),
  barcode: z.string().optional(),
  sku: z.string().optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  lowStockThreshold: z.number().int().min(0).default(10),
  categoryId: z.string().min(1, 'Category is required'),
  isActive: z.boolean().default(true),
})

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
})

export const customerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  dateOfBirth: z.string().optional(),
  loyaltyPoints: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive('Quantity must be positive'),
  unitPrice: z.number().positive('Unit price must be positive'),
})

export const orderSchema = z.object({
  customerId: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
  discount: z.number().min(0).default(0),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
})

export const storeSettingsSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  storeAddress: z.string().optional(),
  storePhone: z.string().optional(),
  storeEmail: z.string().email().optional().or(z.literal('')),
  currency: z.string().default('USD'),
  taxRate: z.number().min(0).max(1).default(0),
  receiptFooter: z.string().optional(),
})

export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type CustomerInput = z.infer<typeof customerSchema>
export type OrderInput = z.infer<typeof orderSchema>
export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>