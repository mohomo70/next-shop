import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className='card '>
      <Link legacyBehavior href={`/product/${product.slug}`}>
        <a>
          <Image
            src={product.image}
            alt={product.name}
            width='400'
            height='90'
            className='rounded-lg h-64'
          />
          {/* <div className='rounded-lg h-64 px-10 pt-1 bg-slate-500 animate-glow-hand'></div> */}
        </a>
      </Link>
      <div className='flex flex-col items-center justify-center p-5'>
        <Link legacyBehavior href={`/product/${product.slug}`}>
          <a>
            <h2 className='text-lg'>{product.name}</h2>
          </a>
        </Link>
        <p className='mb-2'>{product.brand}</p>
        <p className='mb-2'>{product.price}ريال</p>
        <button
          className='primary-button'
          type='button'
          onClick={() => addToCartHandler(product)}
        >
          اضافه به سبد خرید
        </button>
      </div>
    </div>
  )
}
