import {api} from './axios'
import {Order, OrderTemplate} from '@/models/order.ts'

export const getOrders = async (): Promise<Order[]> => {
    const res = await api.get('/orders')
    return res.data
}

export const createOrder = async (customerId: string, template?: OrderTemplate): Promise<Order> => {
    const res = await api.post('/orders/create', {customerId, orderTemplate: template})
    return res.data
}

export const filterOrders = async (search: {
    status?: string
    orderNumber?: string
    id?: string
    limit?: number
    offset?: number
}): Promise<Order[]> => {
    const res = await api.get('/orders/filter', {params: search})
    return res.data
}

export const updateOrder = async (id: string, status: Order['status']): Promise<Order> => {
    const res = await api.patch(`/orders/${id}`, {status})
    return res.data
}

export const deleteOrder = async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`)
}