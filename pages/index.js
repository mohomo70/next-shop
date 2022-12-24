import axios from 'axios'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import Layout from '../components/Layout'
import ProductItem from '../components/ProductItem'
import Product from '../models/Product'
import db from '../utils/db'
import { Store } from '../utils/Store'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import LoadingItem from '../components/LoadingItem'

export default function Home({ products, featuredProducts, dir }) {
  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await axios.get(`/api/products/${product._id}`)

    if (data.countInStock < quantity) {
      return toast.error('متاسفانه محصول موجود نمی باشد')
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })

    toast.success('محصول به سبد خرید اضافه شد')
  }
  return (
    <Layout title='Home Page' dir={dir}>
      {/* <Carousel showThumbs={false} autoPlay>
        {featuredProducts.map((product) => (
          <div key={product._id}>
            <Link href={`/product/${product.slug}`} passHref legacyBehavior>
              <a className='flex'>
                <img src={product.banner} alt={product.name} />
              </a>
            </Link>
          </div>
        ))}
      </Carousel> */}
      <h2 className='h2 my-4'>
        <FormattedMessage id='page.home.main.title' />
      </h2>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
          // <LoadingItem key={product.slug} />
        ))}
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  await db.connect()
  const products = await Product.find().lean()
  const featuredProducts = await Product.find({ isFeatured: true }).lean()
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
    },
  }
}
