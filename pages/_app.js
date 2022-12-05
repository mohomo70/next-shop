import '../styles/globals.css'
import { SessionProvider, useSession } from 'next-auth/react'
import { StoreProvider } from '../utils/Store'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import { useRouter } from 'next/router'
import { IntlProvider } from 'react-intl'

import en from '../lang/en.json'
import fa from '../lang/fa.json'

const messages = { fa, en }
function getDirection(locale) {
  if (locale === 'fa') {
    return 'rtl'
  }
  return 'ltr'
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const { locale } = useRouter()
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <PayPalScriptProvider deferLoading={true}>
          <IntlProvider locale={locale} messages={messages[locale]}>
            {Component.auth ? (
              <Auth adminOnly={Component.auth.adminOnly}>
                <Component {...pageProps} dir={getDirection(locale)} />
              </Auth>
            ) : (
              <Component {...pageProps} dir={getDirection(locale)} />
            )}
          </IntlProvider>
        </PayPalScriptProvider>
      </StoreProvider>
    </SessionProvider>
  )
}

function Auth({ children, adminOnly }) {
  const router = useRouter()
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=login required')
    },
  })
  if (status === 'loading') {
    return <div>Loading ...</div>
  }
  if (adminOnly && !session.user.isAdmin) {
    router.push('/unauthorized?message=admin login required')
  }

  return children
}
