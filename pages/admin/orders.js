import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useReducer } from 'react'
import Layout from '../../components/Layout'
import { getError } from '../../utils/error'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      state
  }
}
export default function AdminOrderScreen({ dir }) {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/admin/orders`)
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    fetchData()
  }, [])
  return (
    <Layout title='Admin Dashboard' dir={dir}>
      <div className='grid md:grid-cols-4 md:gap-5'>
        <div>
          <ul>
            <li className='mb-2'>
              <Link href='/admin/dashboard'>داشبورد</Link>
            </li>
            <li className='mb-2'>
              <Link href='/admin/orders' legacyBehavior>
                <a className='font-bold'>سفارشات</a>
              </Link>
            </li>
            <li className='mb-2'>
              <Link href='/admin/products'>محصولات</Link>
            </li>
            <li className='mb-2'>
              <Link href='/admin/users'>کاربران</Link>
            </li>
          </ul>
        </div>
        <div className='overflow-x-auto md:col-span-3'>
          <h1 className='mb-4 text-xl'>سفارشات ادمین</h1>

          {loading ? (
            <div>درحال بارگذاری...</div>
          ) : error ? (
            <div className='alert-error'>{error}</div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='px-5 text-right'>شماره</th>
                    <th className='p-5 text-right'>نام کاربر</th>
                    <th className='p-5 text-right'>تاریخ</th>
                    <th className='p-5 text-right'>مجموع</th>
                    <th className='p-5 text-right'>وضعیت پرداخت</th>
                    <th className='p-5 text-right'>وضعیت ارسال</th>
                    <th className='p-5 text-right'>اقدامات</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className='border-b'>
                      <td className='p-5'>{order._id.substring(20, 24)}</td>
                      <td className='p-5'>
                        {order.user ? order.user.name : 'DELETED USER'}
                      </td>
                      <td className='p-5'>
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className='p-5'>${order.totalPrice}</td>
                      <td className='p-5'>
                        {order.isPaid
                          ? `${order.paidAt.substring(0, 10)}`
                          : 'not paid'}
                      </td>
                      <td className='p-5'>
                        {order.isDelivered
                          ? `${order.deliveredAt.substring(0, 10)}`
                          : 'not delivered'}
                      </td>
                      <td className='p-5'>
                        <Link
                          legacyBehavior
                          href={`/order/${order._id}`}
                          passHref
                        >
                          <a>جزئیات</a>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

AdminOrderScreen.auth = { adminOnly: true }
