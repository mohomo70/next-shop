import React, { useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import Cookies from 'js-cookie'
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'
import { useRouter } from 'next/router'

export default function ShippingScreen({ dir }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm()

  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const { shippingAddress } = cart
  const router = useRouter()

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName)
    setValue('address', shippingAddress.address)
    setValue('city', shippingAddress.city)
    setValue('postalCode', shippingAddress.postalCode)
    setValue('country', shippingAddress.country)
  }, [setValue, shippingAddress])

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country },
    })
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    )
    router.push('/payment')
  }

  return (
    <Layout title='Shipping Address' dir={dir}>
      <CheckoutWizard activeStep={1} />
      <form
        className='mx-auto max-w-screen-md'
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className='mb-4 text-xl'>آدرس دریافت محصول</h1>
        <div className='mb-4'>
          <label htmlFor='fullName'>نام و نام خانوادگی</label>
          <input
            className='w-full'
            id='fullName'
            autoFocus
            {...register('fullName', {
              required: 'لطفا نام خود را وارد کنید',
            })}
          />
          {errors.fullName && (
            <div className='text-red-500'>{errors.fullName.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='address'>نشانی</label>
          <input
            className='w-full'
            id='address'
            {...register('address', {
              required: 'لطفا نشانی را وارد کنید',
              minLength: { value: 3, message: 'Address is more than 2 chars' },
            })}
          />
          {errors.address && (
            <div className='text-red-500'>{errors.address.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='city'>شهر</label>
          <input
            className='w-full'
            id='city'
            {...register('city', {
              required: 'شهر را وارد کنید',
            })}
          />
          {errors.city && (
            <div className='text-red-500 '>{errors.city.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='postalCode'>کد پستی</label>
          <input
            className='w-full'
            id='postalCode'
            {...register('postalCode', {
              required: 'لطفا کد پستی را وارد کنید',
            })}
          />
          {errors.postalCode && (
            <div className='text-red-500 '>{errors.postalCode.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='country'>کشور</label>
          <input
            className='w-full'
            id='country'
            {...register('country', {
              required: 'لطفا کشور را وارد کنید',
            })}
          />
          {errors.country && (
            <div className='text-red-500 '>{errors.country.message}</div>
          )}
        </div>
        <div className='mb-4 flex justify-between'>
          <button className='primary-button'>بعدی</button>
        </div>
      </form>
    </Layout>
  )
}
