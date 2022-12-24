import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useReducer } from 'react'
import Layout from '../../components/Layout'
import { getError } from '../../utils/error'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true }
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false }
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false }
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true }
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true }
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false }
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false }
    default:
      state
  }
}
export default function AdminProdcutsScreen({ dir }) {
  const router = useRouter()
  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  })

  const createHandler = async () => {
    if (!window.confirm('آیا اطمینان دارید؟')) {
      return
    }
    try {
      dispatch({ type: 'CREATE_REQUEST' })
      const { data } = await axios.post(`/api/admin/products`)
      dispatch({ type: 'CREATE_SUCCESS' })
      toast.success('Product created successfully')
      router.push(`/admin/product/${data.product._id}`)
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' })
      toast.error(getError(err))
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/admin/products`)
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' })
    } else {
      fetchData()
    }
  }, [successDelete])

  const deleteHandler = async (productId) => {
    if (!window.confirm('Are you sure?')) {
      return
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' })
      await axios.delete(`/api/admin/products/${productId}`)
      dispatch({ type: 'DELETE_SUCCESS' })
      toast.success('Product deleted successfully')
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' })
      toast.error(getError(err))
    }
  }

  return (
    <Layout title='Admin Products' dir={dir}>
      <div className='grid md:grid-cols-4 md:gap-5'>
        <div>
          <ul>
            <li className='mb-2'>
              <Link href='/admin/dashboard'>داشبورد</Link>
            </li>
            <li className='mb-2'>
              <Link href='/admin/orders'>سفارشات</Link>
            </li>
            <li className='mb-2'>
              <Link href='/admin/products' legacyBehavior>
                <a className='font-bold'>محصولات</a>
              </Link>
            </li>
            <li className='mb-2'>
              <Link href='/admin/users'>کاربران</Link>
            </li>
          </ul>
        </div>
        <div className='overflow-x-auto md:col-span-3'>
          <div className='flex justify-between'>
            <h1 className='mb-4 text-xl'>محصولات</h1>
            {loadingDelete && <div>در حال حذف محصول ...</div>}
            <button
              disabled={loadingCreate}
              onClick={createHandler}
              className='primary-button'
            >
              {loadingCreate ? 'در حال بارگذاری' : 'ساخت محصول جدید'}
            </button>
          </div>{' '}
          {loading ? (
            <div>درحال بارگذاری ...</div>
          ) : error ? (
            <div className='alert-error'>{error}</div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='px-5 text-right'>شماره</th>
                    <th className='p-5 text-right'>عنوان</th>
                    <th className='p-5 text-right'>قیمت</th>
                    <th className='p-5 text-right'>دسته‌بندی</th>
                    <th className='p-5 text-right'>تعداد موجود</th>
                    <th className='p-5 text-right'>رتبه بندی</th>
                    <th className='p-5 text-right'>اقدامات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className='border-b'>
                      <td className=' p-5 '>{product._id.substring(20, 24)}</td>
                      <td className=' p-5 '>{product.name}</td>
                      <td className=' p-5 '>${product.price}</td>
                      <td className=' p-5 '>{product.category}</td>
                      <td className=' p-5 '>{product.countInStock}</td>
                      <td className=' p-5 '>{product.rating}</td>
                      <td className=' p-5 '>
                        <Link href={`/admin/product/${product._id}`}>
                          ویرایش
                        </Link>
                        &nbsp;
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className='default-button'
                          type='button'
                        >
                          حذف
                        </button>
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

AdminProdcutsScreen.auth = { adminOnly: true }
