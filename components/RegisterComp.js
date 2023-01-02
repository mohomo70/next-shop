import Link from 'next/link'
import React, { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { getError } from '../utils/error'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function RegisterComp({ dir }) {
  const { data: session } = useSession()

  const router = useRouter()
  const { redirect } = router.query

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/')
    }
  }, [router, session, redirect])

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm()
  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      })

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (result.error) {
        toast.error(result.error)
      }
    } catch (err) {
      toast.error(getError(err))
    }
  }
  return (
    <form
      className='mx-auto max-w-screen-md'
      onSubmit={handleSubmit(submitHandler)}
    >
      <h1 className='mb-4 text-xl text-center font-semibold'>
        ساخت حساب کاربری جدید
      </h1>
      <div className='mb-4'>
        <label htmlFor='name'> نام کاربری</label>
        <input
          type='text'
          className='w-full'
          id='name'
          autoFocus
          {...register('name', {
            required: 'لطفا نام را وارد کنید',
          })}
        />
        {errors.name && (
          <div className='text-red-500'>{errors.name.message}</div>
        )}
      </div>

      <div className='mb-4'>
        <label htmlFor='email'>پست الکترونیک</label>
        <input
          type='email'
          {...register('email', {
            required: 'لطفا پست الکترونیکی را وارد کنید',
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
              message: 'لطفا پست الکترونیکی را وارد کنید',
            },
          })}
          className='w-full'
          id='email'
        ></input>
        {errors.email && (
          <div className='text-red-500'>{errors.email.message}</div>
        )}
      </div>
      <div className='mb-4'>
        <label htmlFor='password'>رمز عبور</label>
        <input
          type='password'
          {...register('password', {
            required: 'لطفا رمز عبور را وارد کنید',
            minLength: {
              value: 6,
              message: 'رمز عبور باید بیش از 5 کاراکتر باشد',
            },
          })}
          className='w-full'
          id='password'
          autoFocus
        ></input>
        {errors.password && (
          <div className='text-red-500 '>{errors.password.message}</div>
        )}
      </div>
      <div className='mb-4'>
        <label htmlFor='confirmPassword'>تایید رمز عبور</label>
        <input
          className='w-full'
          type='password'
          id='confirmPassword'
          {...register('confirmPassword', {
            required: 'لطفا رمز عبور را وارد کنید',
            validate: (value) => value === getValues('password'),
            minLength: {
              value: 6,
              message: 'رمز عبور باید بیش از 5 کاراکتر باشد',
            },
          })}
        />
        {errors.confirmPassword && (
          <div className='text-red-500 '>{errors.confirmPassword.message}</div>
        )}
        {errors.confirmPassword &&
          errors.confirmPassword.type === 'validate' && (
            <div className='text-red-500 '>رمز عبور یکسان نیست</div>
          )}
      </div>

      <div className='mb-4 flex justify-center'>
        <button className='primary-button text-white w-[128px]'>ثبت نام</button>
      </div>
    </form>
  )
}
