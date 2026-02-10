import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AuthProvider, useAuth } from '../auth-contexts'
import { api } from '@/lib/api'

// Mock the API
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

// Test component that uses the auth context
const TestComponent = () => {
  const { isAuthenticated, user, login, logout, loading } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="user">{user ? user.name : 'no-user'}</div>
      <button onClick={() => login('test@test.com', 'password')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

// Mock window.location.reload
const mockReload = vi.fn()
Object.defineProperty(window, 'location', {
  writable: true,
  value: { reload: mockReload },
})

// Add global error handler to suppress unhandled rejections during tests
const originalOnUnhandledRejection = process.listeners('unhandledRejection')

describe('AuthContext', () => {
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

  it('should show loading initially', () => {
    const mockGetMe = vi.mocked(api.get)
    mockGetMe.mockReturnValue(new Promise(() => {})) // Never resolves
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Should show loading spinner initially - just check for the spinner element
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('should handle successful authentication', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@test.com', role: 'user' }
    const mockGetMe = vi.mocked(api.get)
    mockGetMe.mockResolvedValue({ data: mockUser })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
      expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated')
      expect(screen.getByTestId('user')).toHaveTextContent('John Doe')
    })
  })

  it('should handle failed authentication', async () => {
    const mockGetMe = vi.mocked(api.get)
    mockGetMe.mockRejectedValueOnce(new Error('Unauthorized'))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
      expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated')
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    })
  })

  it('should handle login', async () => {
    const mockGetMe = vi.mocked(api.get)
    const mockLogin = vi.mocked(api.post)
    
    mockGetMe.mockResolvedValue({ data: null })
    mockLogin.mockResolvedValue({})

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })

    const loginButton = screen.getByText('Login')
    loginButton.click()

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('/api/v1/sessions', {
        email: 'test@test.com',
        password: 'password'
      })
      expect(mockReload).toHaveBeenCalled()
    })
  })

  it('should handle logout', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@test.com', role: 'user' }
    const mockGetMe = vi.mocked(api.get)
    const mockLogout = vi.mocked(api.delete)
    
    mockGetMe.mockResolvedValue({ data: mockUser })
    mockLogout.mockResolvedValue({})

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated')
    })

    const logoutButton = screen.getByText('Logout')
    logoutButton.click()

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledWith('/api/v1/sessions')
      expect(mockReload).toHaveBeenCalled()
    })
  })

  it('should throw error when useAuth is used outside provider', () => {
    const TestComponentWithoutProvider = () => {
      try {
        useAuth()
        return <div>Should not render</div>
      } catch (error) {
        return <div data-testid="error">{(error as Error).message}</div>
      }
    }

    render(<TestComponentWithoutProvider />)
    
    expect(screen.getByTestId('error')).toHaveTextContent('useAuth precisa estar dentro do AuthProvider')
  })
})
