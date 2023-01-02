import axios from 'axios'
import { useContext, useState } from 'react'
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
import { Menu } from '@headlessui/react'
import DropdownLink from '../components/DropdownLink'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

export default function Home({ products, featuredProducts, dir }) {
  const [toggle, setToggle] = useState(false)
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
      {/* <h2 className='h2 my-4'>
        <FormattedMessage id='page.home.main.title' />
      </h2> */}
      {/* bg-[url("/images/dot.png")] */}
      <div>
        <div className='h-[128px]  bg-gradient-to-r from-indigo-100 to-sky-300  bg-no-repeat bg-right flex items-center justify-center md:px-32'>
          <div className='text-white text-4xl'>انواع نژاد‌های گلدفیش </div>
        </div>
        <div className='grid grid-cols-5 bg-blue-50 px-1 pt-1 md:px-16 md:pt-20 pb-8'>
          <Menu
            as='div'
            className={`relative inline-block px-8 md:pl-8 md:pr-0 col-span-4 md:col-span-1  ${
              toggle === true ? 'mb-36' : ''
            }`}
          >
            <div className='flex space-between'>
              <div className='grow text-lg md:-mr-8'>
                انتخاب ماهی بر اساس نوع
              </div>
              <Menu.Button className='text-blue-600'>
                {toggle ? (
                  <button onClick={() => setToggle(!toggle)}>
                    <ExpandLessIcon style={{ color: 'black' }} />
                  </button>
                ) : (
                  <button onClick={() => setToggle(!toggle)}>
                    <ExpandMoreIcon style={{ color: 'black' }} />
                  </button>
                )}
              </Menu.Button>
            </div>
            <Menu.Items
              className='absolute right-12 md:-right-6 w-32 origin-top-right mt-4 border-0 rounded-2xl'
              onClick={() => setToggle(!toggle)}
            >
              <Menu.Item className='py-1 px-2 bg-yellow-200 rounded-md'>
                <div>گلدفیش</div>
              </Menu.Item>
              <Menu.Item className='pb-1'>
                <div>گوپی</div>
              </Menu.Item>
              <Menu.Item>
                <div className='pb-1'>پلاتی</div>
              </Menu.Item>
              <Menu.Item>
                <div>فایتر</div>
              </Menu.Item>
            </Menu.Items>
          </Menu>
          <div className='col-span-5 md:col-span-4 grid grid-cols-2 gap-1 gap-y-1 md:grid-cols-3 '>
            {products.map((product) => (
              <ProductItem
                product={product}
                key={product.slug}
                addToCartHandler={addToCartHandler}
              ></ProductItem>
              // <LoadingItem key={product.slug} />
            ))}
          </div>
        </div>
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
