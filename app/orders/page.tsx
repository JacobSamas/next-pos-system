"use client"

import { useState } from "react"
import { ordersApi, customersApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const Search = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const ReceiptIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
    <path d="M12 18V6" />
  </svg>
)

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const PrinterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="6,9 6,2 18,2 18,9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
)

const FilterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
  </svg>
)

interface Order {
  id: string
  orderNumber: string
  customerId?: string
  customer?: {
    id: string
    firstName: string
    lastName: string
    email?: string
    phone?: string
  }
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
  items: {
    id: string
    productId: string
    quantity: number
    unitPrice: number
    total: number
    product: {
      id: string
      name: string
      category: {
        name: string
      }
    }
  }[]
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [customerFilter, setCustomerFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const itemsPerPage = 10

  // Fetch orders with filters and pagination
  const { data: ordersData, loading: ordersLoading, error: ordersError } = useApi(
    () => ordersApi.getAll({
      page: currentPage,
      limit: itemsPerPage,
      status: statusFilter !== "all" ? statusFilter : undefined,
      customerId: customerFilter !== "all" ? customerFilter : undefined,
    }),
    [currentPage, statusFilter, customerFilter]
  )

  // Fetch customers for filter dropdown
  const { data: customersData } = useApi(() => customersApi.getAll({ limit: 100 }), [])

  const orders = ordersData?.orders || []
  const pagination = ordersData?.pagination
  const customers = customersData?.customers || []

  // Filter orders by search term
  const filteredOrders = orders.filter((order: Order) =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.customer &&
      `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailDialogOpen(true)
  }

  const handlePrintInvoice = (order: Order) => {
    // In a real app, this would generate and print a PDF
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>INVOICE</h2>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Customer:</strong> ${order.customer ?
          `${order.customer.firstName} ${order.customer.lastName}` : 'Guest Customer'}</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="border-bottom: 1px solid #ddd;">
              <th style="text-align: left; padding: 8px;">Item</th>
              <th style="text-align: right; padding: 8px;">Qty</th>
              <th style="text-align: right; padding: 8px;">Price</th>
              <th style="text-align: right; padding: 8px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px;">${item.product.name}</td>
                <td style="text-align: right; padding: 8px;">${item.quantity}</td>
                <td style="text-align: right; padding: 8px;">$${item.unitPrice.toFixed(2)}</td>
                <td style="text-align: right; padding: 8px;">$${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 20px; text-align: right;">
          <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
          <p><strong>Tax:</strong> $${order.tax.toFixed(2)}</p>
          <p><strong>Discount:</strong> -$${order.discount.toFixed(2)}</p>
          <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        </div>
      </div>
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
      printWindow.close()
    }
  }

  if (ordersLoading && currentPage === 1) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Orders & Invoices</h1>
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (ordersError) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Orders & Invoices</h1>
              <p className="text-destructive">Error: {ordersError}</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Orders & Invoices</h1>
            <p className="text-muted-foreground">Complete transaction history and invoice management</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <ReceiptIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{pagination?.total || 0}</p>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {orders.filter((o: Order) => o.status === 'COMPLETED').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-sm">•</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {orders.filter((o: Order) => o.status === 'PENDING').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">$</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      ${orders.reduce((sum: number, o: Order) => sum + o.total, 0).toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <ReceiptIcon className="h-5 w-5" />
                    Transaction History
                  </CardTitle>
                  <CardDescription>All orders and invoices from your business</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order number or customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input border-border"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <FilterIcon className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={customerFilter} onValueChange={setCustomerFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Customers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    {customers.map((customer: any) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Orders Table */}
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Number</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order: Order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className="font-mono text-sm font-medium">{order.orderNumber}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {order.customer ? (
                              <>
                                <div className="font-medium">
                                  {order.customer.firstName} {order.customer.lastName}
                                </div>
                                {order.customer.phone && (
                                  <div className="text-xs text-muted-foreground">
                                    {order.customer.phone}
                                  </div>
                                )}
                              </>
                            ) : (
                              <span className="text-muted-foreground">Guest Customer</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.items.length} items</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{order.paymentMethod}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">${order.total.toFixed(2)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                              title="View Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePrintInvoice(order)}
                              title="Print Invoice"
                            >
                              <PrinterIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{" "}
                    orders
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1 || ordersLoading}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.pages || ordersLoading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Detail Dialog */}
          <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ReceiptIcon className="h-5 w-5" />
                  Order Details - {selectedOrder?.orderNumber}
                </DialogTitle>
                <DialogDescription>
                  Complete order information and invoice details
                </DialogDescription>
              </DialogHeader>

              {selectedOrder && (
                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Order Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Order ID:</span> {selectedOrder.orderNumber}</p>
                        <p><span className="text-muted-foreground">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        <p><span className="text-muted-foreground">Status:</span>
                          <Badge className={`ml-2 ${statusColors[selectedOrder.status as keyof typeof statusColors]}`}>
                            {selectedOrder.status}
                          </Badge>
                        </p>
                        <p><span className="text-muted-foreground">Payment:</span> {selectedOrder.paymentMethod}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Customer Information</h4>
                      <div className="space-y-1 text-sm">
                        {selectedOrder.customer ? (
                          <>
                            <p><span className="text-muted-foreground">Name:</span> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                            {selectedOrder.customer.email && (
                              <p><span className="text-muted-foreground">Email:</span> {selectedOrder.customer.email}</p>
                            )}
                            {selectedOrder.customer.phone && (
                              <p><span className="text-muted-foreground">Phone:</span> {selectedOrder.customer.phone}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-muted-foreground">Guest Customer</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h4 className="font-semibold mb-2">Order Items</h4>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.product.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.product.category.name}</Badge>
                              </TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                              <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>${selectedOrder.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span>-${selectedOrder.discount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePrintInvoice(selectedOrder)}
                    >
                      <PrinterIcon className="h-4 w-4 mr-2" />
                      Print Invoice
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // In a real app, this would download a PDF
                        alert("PDF download feature would be implemented here")
                      }}
                    >
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}