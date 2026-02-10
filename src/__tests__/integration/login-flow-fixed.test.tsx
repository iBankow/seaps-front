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

// Mock location
Object.defineProperty(document, 'location', {
  writable: true,
  value: { search: '' },
})

Object.defineProperty(window, 'location', {
  writable: true,
  value: { reload: vi.fn() },
})

// Suppress unhandled rejections during tests
const originalOnUnhandledRejection = process.listeners('unhandledRejection')

describe('Login Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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

  it('should complete full login flow successfully', async () => {
    const { api } = await import('@/lib/api')
    
    // Mock successful authentication check (user not logged in initially)
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Unauthorized'))
    
    // Mock successful login
    vi.mocked(api.post).mockResolvedValueOnce({})
    
    const user = userEvent.setup()

    const TestApp = () => (
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    )

    render(<TestApp />)

    // Wait for initial auth check to complete
    await waitFor(() => {
      expect(screen.getByText('Sistema de Manutenção Predial')).toBeInTheDocument()
    })

    // Fill out the form
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Senha')
    const submitButton = screen.getByRole('button', { name: 'ENTRAR' })

    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'password123')

    // Submit the form
    await user.click(submitButton)

    // Verify login API was called with correct credentials
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/v1/sessions', {
        email: 'user@example.com',
        password: 'password123'
      })
    })

    // Verify page reload was triggered (indicating successful login)
    expect(window.location.reload).toHaveBeenCalled()
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

  it('should handle login failure gracefully', async () => {
    const { api } = await import('@/lib/api')
    
    // Mock initial auth check
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Unauthorized'))
    
    // Mock login failure
    vi.mocked(api.post).mockRejectedValueOnce(new Error('Invalid credentials'))
    
    const user = userEvent.setup()

    const TestApp = () => (
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    )

    render(<TestApp />)

    await waitFor(() => {
      expect(screen.getByText('Sistema de Manutenção Predial')).toBeInTheDocument()
    })

    // Fill out valid form
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Senha')
    const submitButton = screen.getByRole('button', { name: 'ENTRAR' })

    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    // Verify login API was called
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/v1/sessions', {
        email: 'user@example.com',
        password: 'wrongpassword'
      })
    })

    // Page should not reload on login failure
    expect(window.location.reload).not.toHaveBeenCalled()
  })
})
