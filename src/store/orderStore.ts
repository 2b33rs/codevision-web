import {getOrders} from '../api/order'
import {create} from 'zustand/react'
import {Order} from '@/models/order.ts'

type OrderStore = {
    orders: Order[]
    loading: boolean
    fetchOrders: () => Promise<void>
}

export const useOrderStore = create<OrderStore>((set) => ({
    orders: [],
    loading: false,
    fetchOrders: async () => {
        set({loading: true})
        const response = await getOrders()
        set({orders: response, loading: false})
    },
}))