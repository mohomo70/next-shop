import { signOut, useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import Cookies from 'js-cookie'
import React, { useContext, useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { Menu } from '@headlessui/react'
import 'react-toastify/dist/ReactToastify.css'
import { Store } from '../utils/Store'
import DropdownLink from './DropdownLink'
import { FormattedMessage, useIntl } from 'react-intl'

export default function Layout({ title, children, dir }) {
  const intl = useIntl()
  const { status, data: session } = useSession()
  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const [cartItemsCount, setCartItemsCount] = useState(0)
  console.log(dir)
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0))
  }, [cart.cartItems])

  const logoutClickHandler = () => {
    Cookies.remove('cart')
    dispatch({ type: 'CART_RESET' })
    signOut({ callbackUrl: '/login' })
  }
  return (
    <>
      <Head>
        <title>{title ? title + ' -shop' : 'Shop'}</title>
        <meta name='description' content='Ecommerce Website' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <ToastContainer position='bottom-center' limit={1} />

      <div className='flex min-h-screen flex-col justify-between'>
        <header dir={dir}>
          <nav className='flex h-12 items-center px-4 justify-between shadow-md'>
            <Link legacyBehavior href='/'>
              <a className='text-lg font-bold'>
                <FormattedMessage id='page.home.head.title' />
              </a>
            </Link>
            {/* <div>
              {[...locales].sort().map((locale) => (
                <Link key={locale} href='/' locale={locale}>
                  {locale}
                </Link>
              ))}
            </div> */}
            <div>
              <Link legacyBehavior href='/cart'>
                <a className='p-2'>
                  سبد خرید
                  {cartItemsCount > 0 && (
                    <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as='div' className='relative inline-block'>
                  <Menu.Button className='text-blue-600'>
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className='absolute left-0 w-48 origin-top-left bg-white  shadow-lg '>
                    <Menu.Item>
                      <DropdownLink className='dropdown-link' href='/profile'>
                        مشخصات کاربری
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className='dropdown-link'
                        href='/order-history'
                      >
                        تاریخچه سفارشات
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className='dropdown-link'
                          href='/admin/dashboard'
                        >
                          داشبورد ادمین
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className='dropdown-link'
                        href='#'
                        onClick={logoutClickHandler}
                      >
                        خروج
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link legacyBehavior href='/login'>
                  <a className='p-2'>ورود</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className='container m-auto mt-4 px-4' dir={dir}>
          {children}
        </main>
        <footer className='flex h-10 justify-center items-center shadow-inner'>
          <p>کپی رایت @ 1401</p>
        </footer>
      </div>
    </>
  )
}
