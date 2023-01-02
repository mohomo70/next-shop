import React from 'react'
import Layout from '../components/Layout'
import RegisterComp from '../components/RegisterComp'
import LoginComp from '../components/LoginComp'

const signUp = ({ dir }) => {
  return (
    <Layout dir={dir}>
      <div className='grid grid-cols-2 gap-4 md:gap-12 grow py-4 md:py-14 px-4 md:px-12 bg bg-[url("/images/circle.png")] bg-fuchsia-100 bg-center bg-cover '>
        <div className='col-span-2 md:col-span-1 bg-white rounded p-2 md:p-16 shadow'>
          <LoginComp />
        </div>
        <div className='col-span-2 md:col-span-1 bg-white rounded p-2 md:p-16 shadow'>
          <RegisterComp />
        </div>
      </div>
    </Layout>
  )
}

export default signUp
