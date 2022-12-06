import Link from 'next/link'
import React, { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import Layout from '../components/Layout'
import { getError } from '../utils/error'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function LoginScreen({ dir }) {
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
    <Layout title='Create Account' dir={dir}>
      <form
        className='mx-auto max-w-screen-md'
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className='mb-4 text-xl'>ساخت حساب کاربری</h1>
        <div className='mb-4'>
          <label htmlFor='name'> نام کاربری</label>
          <input
            type='text'
            className='w-full'
            id='name'
            autoFocus
            {...register('name', {
              required: 'Please enter name',
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
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email',
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
              required: 'Please enter password',
              minLength: { value: 6, message: 'password is more than 5 chars' },
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
              required: 'Please enter confirm password',
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 6,
                message: 'confirm password is more than 5 chars',
              },
            })}
          />
          {errors.confirmPassword && (
            <div className='text-red-500 '>
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className='text-red-500 '>رمز عبور یکسان نیست</div>
            )}
        </div>

        <div className='mb-4 '>
          <button className='primary-button'>ثبت نام</button>
        </div>
        <div className='mb-4 '>
          حساب کاربری دارید؟ &nbsp;
          <Link href={`/login?redirect=${redirect || '/'}`}>ورود</Link>
        </div>
      </form>
    </Layout>
  )
}
