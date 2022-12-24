import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'
import Layout from '../../components/Layout'
import { getError } from '../../utils/error'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true }
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true }
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false }
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false }
    default:
      return state
  }
}

function AdminUsersScreen({ dir }) {
  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: '',
    })

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/admin/users`)
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

  const deleteHandler = async (userId) => {
    if (!window.confirm('آیا اطمینان دارید؟')) {
      return
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' })
      await axios.delete(`/api/admin/users/${userId}`)
      dispatch({ type: 'DELETE_SUCCESS' })
      toast.success('User deleted successfully')
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' })
      toast.error(getError(err))
    }
  }

  return (
    <Layout title='Users' dir={dir}>
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
              <Link href='/admin/products'>محصولات</Link>
            </li>
            <li className='mb-2'>
              <Link href='/admin/users' legacyBehavior>
                <a className='font-bold'>کاربران</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className='overflow-x-auto md:col-span-3'>
          <h1 className='mb-4 text-xl'>کاربران</h1>
          {loadingDelete && <div>درحال حذف ...</div>}
          {loading ? (
            <div>در حال بارگذاری...</div>
          ) : error ? (
            <div className='alert-error'>{error}</div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='px-5 text-right'>شماره</th>
                    <th className='p-5 text-right'>نام کاربر</th>
                    <th className='p-5 text-right'>پست الکترونیک</th>
                    <th className='p-5 text-right'>ادمین</th>
                    <th className='p-5 text-right'>اقدامات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className='border-b'>
                      <td className=' p-5 '>{user._id.substring(20, 24)}</td>
                      <td className=' p-5 '>{user.name}</td>
                      <td className=' p-5 '>{user.email}</td>
                      <td className=' p-5 '>{user.isAdmin ? 'بله' : 'خیر'}</td>
                      <td className=' p-5 '>
                        <Link
                          href={`/admin/user/${user._id}`}
                          passHref
                          legacyBehavior
                        >
                          <a type='button' className='default-button'>
                            ویرایش
                          </a>
                        </Link>
                        &nbsp;
                        <button
                          type='button'
                          className='default-button'
                          onClick={() => deleteHandler(user._id)}
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

AdminUsersScreen.auth = { adminOnly: true }
export default AdminUsersScreen
