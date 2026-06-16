import { Surface, Text } from './design'

function App() {
  return (
    <main style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 480 }}>

      <Text variant="heading">Mis Finanzas</Text>

      <Surface style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Text variant="muted">Saldo actual</Text>
        <Text variant="amount" style={{ color: 'var(--color-green)' }}>$ 142.500,00</Text>
      </Surface>

      <Surface variant="elevated" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Text>Último movimiento</Text>
        <Text variant="muted">Supermercado · hace 2 horas</Text>
        <Text variant="amount" style={{ color: 'var(--color-red)' }}>− $ 3.240,00</Text>
      </Surface>

      <Surface style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
        <Text variant="muted" style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.08em' }}>TOKENS</Text>
        <span style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
        <Text variant="amount" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-green)' }}>IBM Plex Sans</Text>
        <Text variant="muted" style={{ fontSize: 'var(--text-xs)' }}>·</Text>
        <Text variant="amount" style={{ fontSize: 'var(--text-sm)' }}>IBM Plex Mono</Text>
      </Surface>

    </main>
  )
}

export default App
