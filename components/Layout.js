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
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import SearchIcon from '@mui/icons-material/Search'
import Image from 'next/image'

export default function Layout({ title, children, dir }) {
  const intl = useIntl()
  const { status, data: session } = useSession()
  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const [cartItemsCount, setCartItemsCount] = useState(0)
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

      <div className='flex min-h-screen flex-col justify-between md:px-48 bg-[url("/images/background.png")] bg-yellow-100 bg-center bg-cover'>
        <header dir={dir} className='sticky top-0 z-10'>
          <nav className='flex h-20 items-center  justify-between shadow-md bg-cyan-200 px-2 md:px-16'>
            <div className='flex flex-col items-center '>
              <Link legacyBehavior href='/search'>
                <a className='p-2'>
                  <SearchIcon style={{ color: 'white' }} />
                </a>
              </Link>
              <div className='text-sm text-white font-medium'>جست‌وجو</div>
            </div>
            <Link legacyBehavior href='/'>
              <a className='text-lg font-bold'>
                <div className='w-16 flex h-16 justify-center items-center'>
                  <Image
                    src='/images/fish-logo.jpg'
                    width={56}
                    height={56}
                    alt='logo'
                    className='rounded-full'
                  />
                  {/* <FormattedMessage id='page.home.head.title' /> */}
                </div>
              </a>
            </Link>
            {/* <div>
              {[...locales].sort().map((locale) => (
                <Link key={locale} href='/' locale={locale}>
                  {locale}
                </Link>
              ))}
            </div> */}
            <div className='flex'>
              <div className='flex flex-col items-center'>
                <Link legacyBehavior href='/cart'>
                  <a className='p-2'>
                    <ShoppingCartOutlinedIcon style={{ color: 'white' }} />
                    {cartItemsCount > 0 && (
                      <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                        {cartItemsCount}
                      </span>
                    )}
                  </a>
                </Link>
                <div className='text-sm text-white font-medium'>سبد خرید</div>
              </div>
              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as='div' className='relative inline-block'>
                  <Menu.Button className='text-blue-600'>
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className='absolute left-0 w-48 origin-top-left bg-white  shadow-lg z-10 border-2 rounded-2xl'>
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
                <div className='flex flex-col items-center'>
                  <Link legacyBehavior href='/login'>
                    <a className='p-2'>
                      <AccountCircleOutlinedIcon style={{ color: 'white' }} />
                    </a>
                  </Link>
                  <div className='text-sm text-white font-medium'>ورود</div>
                </div>
              )}
            </div>
          </nav>
        </header>
        <main
          className='flex items-center xs:mx-auto justify-between'
          dir={dir}
        >
          {children}
        </main>
        <footer className='shadow-inner px-8 bg-cyan-200' dir={dir}>
          <div className='flex justify-between items-center'>
            <div className='w-16 flex h-20  items-center grow'>
              <Image
                src='/images/fish-logo.jpg'
                width={56}
                height={56}
                alt='logo'
                className='rounded-full'
              />
              {/* <FormattedMessage id='page.home.head.title' /> */}
            </div>
            <div>عرضه کننده انواع ماهی‌های آکواریومی </div>
          </div>
          <div className='border-2' />
          <div className='flex justify-center items-center h-12'>
            کپی‌رایت@2021
          </div>
        </footer>
      </div>
    </>
  )
}
