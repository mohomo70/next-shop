import axios from 'axios'
import Link from 'next/link'
import { Bar } from 'react-chartjs-2'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import React, { useEffect, useReducer } from 'react'
import Layout from '../../components/Layout'
import { getError } from '../../utils/error'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
}

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      state
  }
}
function AdminDashboardScreen({ dir }) {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/admin/summary`)
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }

    fetchData()
  }, [])

  const data = {
    labels: summary.salesData.map((x) => x._id), // 2022/01 2022/03
    datasets: [
      {
        label: 'فروش',
        backgroundColor: 'rgba(162, 222, 208, 1)',
        data: summary.salesData.map((x) => x.totalSales),
      },
    ],
  }
  return (
    <Layout title='Admin Dashboard' dir={dir}>
      <div className='grid  md:grid-cols-4 md:gap-5'>
        <div>
          <ul>
            <li className='mb-2'>
              <Link href='/admin/dashboard' legacyBehavior>
                <a className='font-bold'>داشبورد</a>
              </Link>
            </li>
            <li className='mb-2'>
              <Link href='/admin/orders'>سفارشات</Link>
            </li>
            <li className='mb-2'>
              <Link href='/admin/products'>محصولات</Link>
            </li>
            <li className='mb-2'>
              <Link href='/admin/users'>کاربران</Link>
            </li>
          </ul>
        </div>
        <div className='md:col-span-3 col-span-1'>
          <h1 className='mb-4 text-xl'>داشبورد ادمین</h1>
          {loading ? (
            <div>درحال بارگذاری...</div>
          ) : error ? (
            <div className='alert-error'>{error}</div>
          ) : (
            <div>
              <div className='grid grid-cols-1 md:grid-cols-4'>
                <div className='card m-5 p-5'>
                  <p className='text-3xl'>{summary.ordersPrice} ريال</p>
                  <p>فروش</p>
                  <Link href='/admin/orders'>مشاهده فروش</Link>
                </div>
                <div className='card m-5 p-5'>
                  <p className='text-3xl'>{summary.ordersCount} </p>
                  <p>سفارشات</p>
                  <Link href='/admin/orders'>مشاهده سفارشات</Link>
                </div>
                <div className='card m-5 p-5'>
                  <p className='text-3xl'>{summary.productsCount} </p>
                  <p>محصولات</p>
                  <Link href='/admin/products'>مشاهده محصولات</Link>
                </div>
                <div className='card m-5 p-5'>
                  <p className='text-3xl'>{summary.usersCount} </p>
                  <p>کاربران</p>
                  <Link href='/admin/users'>مشاهده کاربران</Link>
                </div>
              </div>
              <h2 className='text-xl'>گزارش فروش</h2>
              <Bar
                options={{
                  legend: { display: true, position: 'right' },
                }}
                data={data}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

AdminDashboardScreen.auth = { adminOnly: true }
export default AdminDashboardScreen
