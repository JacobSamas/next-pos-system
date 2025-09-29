"use client"

import { useState, useEffect } from "react"
import { customersApi } from "@/lib/api"
import { useApi } from "@/hooks/use-api"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const Search = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  zipCode: string
  loyaltyPoints: number
  isActive: boolean
  _count: {
    orders: number
  }
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Fetch customers with search and pagination
  const { data: customersData, loading: customersLoading, error: customersError } = useApi(
    () => customersApi.getAll({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm || undefined,
    }),
    [currentPage, searchTerm]
  )

  if (customersLoading && currentPage === 1) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Customers</h1>
              <p className="text-muted-foreground">Loading customers...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (customersError) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Customers</h1>
              <p className="text-destructive">Error: {customersError}</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const customers = customersData?.customers || []
  const pagination = customersData?.pagination

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Customers</h1>
            <p className="text-muted-foreground">Manage your customer relationships</p>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-card-foreground">Customer Database</CardTitle>
                  <CardDescription>{pagination?.total || 0} total customers</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input border-border"
                  />
                </div>
              </div>

              {/* Customers Table */}
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Loyalty Points</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer: Customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{customer.phone || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{customer.city || 'N/A'}</div>
                            <div className="text-muted-foreground">{customer.zipCode || ''}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{customer._count.orders} orders</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{customer.loyaltyPoints} pts</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={customer.isActive ? "default" : "secondary"}>
                            {customer.isActive ? "Active" : "Inactive"}
                          </Badge>
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
                    customers
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1 || customersLoading}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.pages || customersLoading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}