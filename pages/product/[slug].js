import Image from 'next/image'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import { Store } from '../../utils/Store'
import { toast } from 'react-toastify'
import Product from '../../models/Product'
import db from '../../utils/db'

export default function ProductScreen(props) {
  const { product, dir } = props
  const { state, dispatch } = useContext(Store)
  const router = useRouter()

  if (!product) {
    return <Layout title='Product Not Found'>Product Not Found</Layout>
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await axios.get(`/api/products/${product._id}`)

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock')
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
    router.push('/cart')
  }

  return (
    <Layout title={product.name} dir={dir}>
      <div
        className='grid md:grid-cols-5 gap-4 md:gap-8 bg-gradient-to-l from-fuchsia-100 via-purple-100 to-white py-8 md:py-24  px-8 grow'
        style={{ height: '78vh' }}
      >
        <div className='md:col-span-3'>
          <Image
            src={product.image}
            alt={product.name}
            width={320}
            height={320}
            layout='responsive'
            className='border bg-slate-500 rounded-lg '
          ></Image>
        </div>
        <div className='md:col-span-2'>
          <ul>
            <div className='flex justify-center mb-4'>
              <div className='text-2xl font-bold'>{product.name}</div>
            </div>
            <div className='mb-2 flex justify-between'>
              <div>دسته بندی: </div>
              <div>{product.category} </div>{' '}
            </div>
            <div className='mb-2 flex justify-between'>
              <div> برند: </div>
              <div>{product.brand}</div>
            </div>
            {/* <li>
              {product.rating} of {product.numReviews} reviews
            </li> */}
            <div className='mb-2 flex justify-between'>
              <div> توضیحات :</div> <div>{product.description}</div>
            </div>
            <div className='mb-2 flex justify-between'>
              <div>قیمت</div>
              <div>{product.price}ريال</div>
            </div>
            <div className='mb-2 flex justify-between'>
              <div>وضعیت</div>
              <div>
                {product.countInStock > 0 ? 'موجود در انبار' : 'موجود نمی‌باشد'}
              </div>
            </div>
            <button
              className='primary-button w-full'
              onClick={addToCartHandler}
            >
              اضافه کردن به سبد خرید
            </button>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { params } = context
  const { slug } = params

  await db.connect()
  const product = await Product.findOne({ slug }).lean()
  await db.disconnect()
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  }
}
