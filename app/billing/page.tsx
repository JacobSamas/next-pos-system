"use client"

import { useState } from "react"
import { productsApi, ordersApi } from "@/lib/api"
import { useApi, useMutation } from "@/hooks/use-api"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const SearchIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const PlusIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const MinusIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M5 12h14" />
  </svg>
)

const TrashIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
)

const CreditCardIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <path d="M2 10h20" />
  </svg>
)

const BanknoteIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
)

const SmartphoneIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
)

const ReceiptIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
    <path d="M12 18V6" />
  </svg>
)

interface Product {
  id: string
  name: string
  price: number
  category: {
    id: string
    name: string
  }
  stock: number
  barcode: string
}

interface CartItem extends Product {
  quantity: number
  discount: number
}


export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [showInvoice, setShowInvoice] = useState(false)

  // Fetch products with search
  const { data: productsData, loading: productsLoading, error: productsError } = useApi(
    () => productsApi.getAll({ search: searchTerm || undefined, limit: 50 }),
    [searchTerm]
  )

  const products = productsData?.products || []
  const filteredProducts = products

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1, discount: 0 }])
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const updateDiscount = (id: string, discount: number) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, discount: Math.max(0, Math.min(100, discount)) } : item)))
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity
    const discountAmount = (itemTotal * item.discount) / 100
    return sum + (itemTotal - discountAmount)
  }, 0)

  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  const clearCart = () => {
    setCart([])
    setPaymentMethod("")
  }

  // Create order mutation
  const createOrderMutation = useMutation(ordersApi.create, {
    onSuccess: () => {
      setShowInvoice(true)
    }
  })

  const processPayment = async () => {
    if (cart.length === 0 || !paymentMethod) return

    const orderData = {
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
        discount: item.discount
      })),
      paymentMethod: paymentMethod.toUpperCase(),
      discount: 0 // Could add overall order discount if needed
    }

    await createOrderMutation.mutate(orderData)
  }

  return (
    <div>
      <Header />
      <main className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Billing</h1>
          <p className="text-muted-foreground">Process customer orders and payments</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Product Search & Selection */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Product Search</CardTitle>
                <CardDescription>Search by name or scan barcode</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <SearchIcon />
                  <Input
                    placeholder="Search products or scan barcode..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input border-border text-foreground"
                  />
                </div>

                {productsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading products...</div>
                ) : productsError ? (
                  <div className="text-center py-8 text-destructive">Error: {productsError}</div>
                ) : (
                <ScrollArea className="h-96">
                  <div className="grid gap-3 md:grid-cols-2">
                    {filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="bg-secondary border-border cursor-pointer hover:bg-secondary/80 transition-colors"
                        onClick={() => addToCart(product)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-secondary-foreground">{product.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {product.category.name}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-primary">${product.price}</span>
                            <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">#{product.barcode}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Shopping Cart */}
          <div>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Shopping Cart</CardTitle>
                <CardDescription>{cart.length} items</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 mb-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Cart is empty</p>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-secondary rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-secondary-foreground text-sm">{item.name}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <TrashIcon />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-6 w-6 p-0"
                            >
                              <MinusIcon />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-6 w-6 p-0"
                            >
                              <PlusIcon />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Input
                              type="number"
                              placeholder="Discount %"
                              value={item.discount || ""}
                              onChange={(e) => updateDiscount(item.id, Number(e.target.value))}
                              className="h-6 text-xs"
                              min="0"
                              max="100"
                            />
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              ${item.price} × {item.quantity}
                              {item.discount > 0 && ` (-${item.discount}%)`}
                            </span>
                            <span className="font-bold text-primary">
                              ${(item.price * item.quantity * (1 - item.discount / 100)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%):</span>
                    <span className="text-foreground">${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">Total:</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">
                        <div className="flex items-center gap-2">
                          <BanknoteIcon />
                          Cash
                        </div>
                      </SelectItem>
                      <SelectItem value="card">
                        <div className="flex items-center gap-2">
                          <CreditCardIcon />
                          Card
                        </div>
                      </SelectItem>
                      <SelectItem value="upi">
                        <div className="flex items-center gap-2">
                          <SmartphoneIcon />
                          UPI
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button onClick={processPayment} disabled={cart.length === 0 || !paymentMethod || createOrderMutation.loading} className="flex-1">
                      {createOrderMutation.loading ? "Processing..." : "Process Payment"}
                    </Button>
                    <Button variant="outline" onClick={clearCart} disabled={cart.length === 0}>
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Invoice Preview Dialog */}
        <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ReceiptIcon />
                Invoice Preview
              </DialogTitle>
              <DialogDescription>Transaction completed successfully</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-bold text-lg">RetailPro</h3>
                <p className="text-sm text-muted-foreground">Invoice #INV-{Date.now()}</p>
                <p className="text-xs text-muted-foreground">{new Date().toLocaleString()}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity * (1 - item.discount / 100)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">Payment Method: {paymentMethod?.toUpperCase()}</p>
                <p className="text-xs text-muted-foreground mt-2">Thank you for your business!</p>
              </div>

              <Button
                onClick={() => {
                  setShowInvoice(false)
                  clearCart()
                }}
                className="w-full"
              >
                New Transaction
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
