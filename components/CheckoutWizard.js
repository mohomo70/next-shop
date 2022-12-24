import react from 'react'

export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <div className='mb05 flex flex-wrap'>
      {['ورود کاربر', 'نشانی ارسال', 'روش پرداخت', 'ثبت سفارش'].map(
        (step, index) => (
          <div
            key={step}
            className={`flex-1 border-b-2
                        text-center
                        ${
                          index <= activeStep
                            ? 'border-indigo-500 text-indigo-500'
                            : 'border-gray-400 text-gray-400'
                        }
                        mb-4
                    `}
          >
            {step}
          </div>
        )
      )}
    </div>
  )
}
