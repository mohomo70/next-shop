import Link from 'next/link'
import React from 'react'

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className='card '>
      <Link legacyBehavior href={`/product/${product.slug}`}>
        <a>
          {/* <img
            src={product.image}
            alt={product.name}
            className='rounded-lg w-72 h-64 pr-3 pt-1'
          /> */}
          <div className='rounded-lg h-64 px-10 pt-1 bg-slate-500 animate-glow-hand'></div>
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
