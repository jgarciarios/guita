import type { ReactNode } from 'react'
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
import { Text } from '../design'

const clerkAppearance = {
  variables: {
    colorPrimary: '#2FBF71',
    colorBackground: '#121A16',
    colorInputBackground: '#18231E',
    colorInputText: '#E7EFEA',
    colorText: '#E7EFEA',
    colorTextSecondary: '#8A988F',
    colorDanger: '#E5544B',
    colorNeutral: '#233029',
    colorShimmer: '#233029',
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
    borderRadius: '4px',
  },
  elements: {
    card: {
      boxShadow: 'none',
      border: '1px solid #233029',
    },
    headerTitle: {
      fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
      fontWeight: 500,
    },
    headerSubtitle: {
      color: '#8A988F',
    },
    formButtonPrimary: {
      textTransform: 'none',
      fontSize: '14px',
      boxShadow: 'none',
    },
    footer: {
      background: 'none',
    },
    dividerLine: {
      backgroundColor: '#233029',
    },
    socialButtonsBlockButton: {
      borderColor: '#233029',
    },
  },
}

export function AuthGate({ children }: { children: ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <main
          style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-8)',
            padding: 'var(--space-8)',
            background: 'var(--color-bg)',
          }}
        >
          <Text variant="heading">Mango</Text>
          <SignIn appearance={clerkAppearance} />
        </main>
      </SignedOut>
    </>
  )
}
