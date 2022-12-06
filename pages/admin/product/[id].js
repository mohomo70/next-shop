import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useReducer } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Layout from '../../../components/Layout'
import { getError } from '../../../utils/error'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}
export default function AdminProductEditScreen({ dir }) {
  const { query } = useRouter()
  const productId = query.id
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/admin/products/${productId}`)
        dispatch({ type: 'FETCH_SUCCESS' })
        setValue('name', data.name)
        setValue('slug', data.slug)
        setValue('price', data.price)
        setValue('image', data.image)
        setValue('category', data.category)
        setValue('brand', data.brand)
        setValue('countInStock', data.countInStock)
        setValue('description', data.description)
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }

    fetchData()
  }, [productId, setValue])

  const router = useRouter()

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    brand,
    countInStock,
    description,
  }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' })
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        slug,
        price,
        category,
        image,
        brand,
        countInStock,
        description,
      })
      dispatch({ type: 'UPDATE_SUCCESS' })
      toast.success('محصول با موفقیت بروزرسانی شد')
      router.push('/admin/products')
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) })
      toast.error(getError(err))
    }
  }

  return (
    <Layout title={`Edit Product ${productId}`} dir={dir}>
      <div className='grid md:grid-cols-4 md:gap-5'>
        <div>
          <ul>
            <li>
              <Link href='/admin/dashboard'>داشبورد</Link>
            </li>
            <li>
              <Link href='/admin/orders'>سفارشات</Link>
            </li>
            <li>
              <Link href='/admin/products' legacyBehavior>
                <a className='font-bold'>محصولات</a>
              </Link>
            </li>
            <li>
              <Link href='/admin/users'>کاربران</Link>
            </li>
          </ul>
        </div>
        <div className='md:col-span-3'>
          {loading ? (
            <div>درحال بارگذاری ...</div>
          ) : error ? (
            <div className='alert-error'>{error}</div>
          ) : (
            <form
              className='mx-auto max-w-screen-md'
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className='mb-4 text-xl'>{`ویرایش محصول با شماره ${productId}`}</h1>
              <div className='mb-4'>
                <label htmlFor='name'>عنوان</label>
                <input
                  type='text'
                  className='w-full'
                  id='name'
                  autoFocus
                  {...register('name', {
                    required: 'لطفا عنوان را وارد کنید',
                  })}
                />
                {errors.name && (
                  <div className='text-red-500'>{errors.name.message}</div>
                )}
              </div>
              <div className='mb-4'>
                <label htmlFor='slug'>شماره</label>
                <input
                  type='text'
                  className='w-full'
                  id='slug'
                  {...register('slug', {
                    required: 'لطفا شماره را وارد کنید',
                  })}
                />
                {errors.slug && (
                  <div className='text-red-500'>{errors.slug.message}</div>
                )}
              </div>
              <div className='mb-4'>
                <label htmlFor='price'>قیمت</label>
                <input
                  type='text'
                  className='w-full'
                  id='price'
                  {...register('price', {
                    required: 'لطفا قیمت را وارد کنید',
                  })}
                />
                {errors.price && (
                  <div className='text-red-500'>{errors.price.message}</div>
                )}
              </div>
              <div className='mb-4'>
                <label htmlFor='image'>عکس</label>
                <input
                  type='text'
                  className='w-full'
                  id='image'
                  {...register('image', {
                    required: 'لطفا عکس را وارد کنید',
                  })}
                />
                {errors.image && (
                  <div className='text-red-500'>{errors.image.message}</div>
                )}
              </div>
              <div className='mb-4'>
                <label htmlFor='category'>دسته‌بندی</label>
                <input
                  type='text'
                  className='w-full'
                  id='category'
                  {...register('category', {
                    required: 'لطفا دسته بندی را وارد کنید',
                  })}
                />
                {errors.category && (
                  <div className='text-red-500'>{errors.category.message}</div>
                )}
              </div>
              <div className='mb-4'>
                <label htmlFor='brand'>برند</label>
                <input
                  type='text'
                  className='w-full'
                  id='brand'
                  {...register('brand', {
                    required: 'لطفا برند را وارد کنید',
                  })}
                />
                {errors.brand && (
                  <div className='text-red-500'>{errors.brand.message}</div>
                )}
              </div>
              <div className='mb-4'>
                <label htmlFor='countInStock'>موجود در انبار</label>
                <input
                  type='text'
                  className='w-full'
                  id='countInStock'
                  {...register('countInStock', {
                    required: 'لطفا تعداد موجود در انبار را وارد کنید',
                  })}
                />
                {errors.countInStock && (
                  <div className='text-red-500'>
                    {errors.countInStock.message}
                  </div>
                )}
              </div>
              <div className='mb-4'>
                <label htmlFor='countInStock'>توضیحات</label>
                <input
                  type='text'
                  className='w-full'
                  id='description'
                  {...register('description', {
                    required: 'لطفا توضیحات را وارد کنید',
                  })}
                />
                {errors.description && (
                  <div className='text-red-500'>
                    {errors.description.message}
                  </div>
                )}
              </div>
              <div className='mb-4'>
                <button disabled={loadingUpdate} className='primary-button'>
                  {loadingUpdate ? 'درحال بارگذاری' : 'به‌روزرسانی'}
                </button>
              </div>
              <div className='mb-4'>
                <Link href={`/admin/products`}>بازگشت</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  )
}

AdminProductEditScreen.auth = { adminOnly: true }
