import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LoginForm } from '../login-form'

// Mock the dependencies
vi.mock('@/lib/api', () => ({
  api: {
    post: vi.fn(),
  },
}))

vi.mock('@/lib/mt-login', () => ({
  config: {
    url: 'http://localhost:3000',
  },
}))

vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({
    navigate: vi.fn(),
  }),
}))

vi.mock('@/contexts/auth-contexts', () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue(undefined),
    user: null,
    isAuthenticated: false,
    logout: vi.fn(),
  }),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form correctly', () => {
    render(<LoginForm />)

    expect(screen.getByText('Sistema de Manutenção Predial')).toBeInTheDocument()
    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ENTRAR' })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: 'ENTRAR' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Insira seu email')).toBeInTheDocument()
      expect(screen.getByText('Insira sua senha')).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email')
    const submitButton = screen.getByRole('button', { name: 'ENTRAR' })

    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Insira um email valido')).toBeInTheDocument()
    })
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm />)

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

  it('accepts valid form input', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Senha')

    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'validpassword')

    expect(emailInput).toHaveValue('user@example.com')
    expect(passwordInput).toHaveValue('validpassword')
  })

  it('renders MT Login section', () => {
    render(<LoginForm />)

    // Check if MT Login section is rendered (the "OU" separator)
    expect(screen.getByText('OU')).toBeInTheDocument()
    
    // Should have multiple buttons (submit + MT login buttons)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(1)
  })
})
