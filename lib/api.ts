const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}/api${endpoint}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new ApiError(response.status, error.error || 'Request failed')
  }

  return response.json()
}

// Products API
export const productsApi = {
  getAll: (params?: {
    page?: number
    limit?: number
    search?: string
    categoryId?: string
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId)

    const query = searchParams.toString()
    return fetchApi<{
      products: any[]
      pagination: {
        page: number
        limit: number
        total: number
        pages: number
      }
    }>(`/products${query ? `?${query}` : ''}`)
  },

  getById: (id: string) => fetchApi<any>(`/products/${id}`),

  create: (data: any) =>
    fetchApi<any>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchApi<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<any>(`/products/${id}`, {
      method: 'DELETE',
    }),
}

// Categories API
export const categoriesApi = {
  getAll: () => fetchApi<any[]>('/categories'),

  create: (data: { name: string; description?: string }) =>
    fetchApi<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Customers API
export const customersApi = {
  getAll: (params?: {
    page?: number
    limit?: number
    search?: string
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)

    const query = searchParams.toString()
    return fetchApi<{
      customers: any[]
      pagination: {
        page: number
        limit: number
        total: number
        pages: number
      }
    }>(`/customers${query ? `?${query}` : ''}`)
  },

  getById: (id: string) => fetchApi<any>(`/customers/${id}`),

  create: (data: any) =>
    fetchApi<any>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchApi<any>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<any>(`/customers/${id}`, {
      method: 'DELETE',
    }),
}

// Orders API
export const ordersApi = {
  getAll: (params?: {
    page?: number
    limit?: number
    status?: string
    customerId?: string
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.status) searchParams.set('status', params.status)
    if (params?.customerId) searchParams.set('customerId', params.customerId)

    const query = searchParams.toString()
    return fetchApi<{
      orders: any[]
      pagination: {
        page: number
        limit: number
        total: number
        pages: number
      }
    }>(`/orders${query ? `?${query}` : ''}`)
  },

  getById: (id: string) => fetchApi<any>(`/orders/${id}`),

  create: (data: any) =>
    fetchApi<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: string) =>
    fetchApi<any>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
}

// Dashboard API
export const dashboardApi = {
  getStats: () => fetchApi<{
    totalSales: number
    salesGrowth: number
    ordersToday: number
    ordersGrowth: number
    totalProducts: number
    lowStockProducts: number
    totalCustomers: number
    recentOrders: any[]
    topProducts: any[]
  }>('/dashboard/stats'),
}

export { ApiError }