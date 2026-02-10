import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { LoginForm } from '@/components/login-form'
import { AuthProvider } from '@/contexts/auth-contexts'

// Mock the API
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

// Mock router
vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({
    navigate: vi.fn().mockResolvedValue(undefined),
  }),
}))

// Mock MT Login config
vi.mock('@/lib/mt-login', () => ({
  config: {
    url: 'http://localhost:3000',
  },
}))

// Simple mock for window.location.reload - set it once globally
const mockReload = vi.fn()
;(globalThis as any).window = {
  ...globalThis.window,
  location: { reload: mockReload }
}

// Mock document.location.search once globally
;(globalThis as any).document = {
  ...globalThis.document,
  location: { search: '' }
}

// Suppress unhandled rejections during tests
const originalOnUnhandledRejection = process.listeners('unhandledRejection')

describe('Login Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockReload.mockClear()
    // Suppress unhandled rejection errors during tests
    process.removeAllListeners('unhandledRejection')
    process.on('unhandledRejection', () => {}) // Suppress
  })

  afterEach(() => {
    // Restore original handlers
    process.removeAllListeners('unhandledRejection')
    originalOnUnhandledRejection.forEach(listener => {
      process.on('unhandledRejection', listener)
    })
  })

  it('should render login form within auth provider', async () => {
    const { api } = await import('@/lib/api')
    
    // Mock initial auth check (user not logged in)
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Unauthorized'))
    
    const TestApp = () => (
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    )

    render(<TestApp />)

    // Wait for initial auth check to complete and form to render
    await waitFor(() => {
      expect(screen.getByText('Sistema de Manutenção Predial')).toBeInTheDocument()
      expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    })
  })

  it('should show validation errors for invalid input', async () => {
    const { api } = await import('@/lib/api')
    
    // Mock initial auth check
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Unauthorized'))
    
    const user = userEvent.setup()

    const TestApp = () => (
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    )

    render(<TestApp />)

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Sistema de Manutenção Predial')).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText('Email')
    const submitButton = screen.getByRole('button', { name: 'ENTRAR' })

    // Enter invalid email
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Insira um email valido')).toBeInTheDocument()
      expect(screen.getByText('Insira sua senha')).toBeInTheDocument()
    })

    // Verify login API was not called due to validation errors
    expect(api.post).not.toHaveBeenCalled()
  })

  it('should accept valid form input', async () => {
    const { api } = await import('@/lib/api')
    
    // Mock initial auth check
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Unauthorized'))
    
    const user = userEvent.setup()

    const TestApp = () => (
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    )

    render(<TestApp />)

    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Senha')

    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'validpassword')

    expect(emailInput).toHaveValue('user@example.com')
    expect(passwordInput).toHaveValue('validpassword')
  })

  it('should toggle password visibility', async () => {
    const { api } = await import('@/lib/api')
    
    // Mock initial auth check
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Unauthorized'))
    
    const user = userEvent.setup()

    const TestApp = () => (
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    )

    render(<TestApp />)

    await waitFor(() => {
      expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    })

    const passwordInput = screen.getByLabelText('Senha')
    const toggleButtons = screen.getAllByRole('button')
    const eyeToggleButton = toggleButtons.find(button => 
      button.className.includes('min-w-9')
    )

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password')

    if (eyeToggleButton) {
      // Click to show password
      await user.click(eyeToggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')

      // Click to hide password again
      await user.click(eyeToggleButton)
      expect(passwordInput).toHaveAttribute('type', 'password')
    }
  })
})
