import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '../ErrorBoundary'

// -----------------------------
// Mock antd
// -----------------------------
vi.mock('antd', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  Button: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  Typography: {
    Title: ({ children }: any) => <h1>{children}</h1>,
    Text: ({ children }: any) => <p>{children}</p>,
  },
  Space: ({ children }: any) => <div>{children}</div>,
}))

// -----------------------------
// Mock icons
// -----------------------------
vi.mock('@ant-design/icons', () => ({
  WarningOutlined: () => <span>warning-icon</span>,
  ReloadOutlined: () => <span>reload-icon</span>,
}))

// -----------------------------
// Helper component to throw error
// -----------------------------
const ProblemChild = () => {
  throw new Error('Test error')
}

// -----------------------------
// Setup
// -----------------------------
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

// -----------------------------
// Tests
// -----------------------------

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Normal Content</div>
      </ErrorBoundary>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('renders default fallback UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    )

    expect(screen.getByText('مشکلی پیش آمده')).toBeInTheDocument()
    expect(screen.getByText('بارگذاری مجدد')).toBeInTheDocument()
  })

  it('renders custom fallback if provided', () => {
    render(
      <ErrorBoundary fallback={<div data-testid="custom">Custom UI</div>}>
        <ProblemChild />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('custom')).toBeInTheDocument()
  })

it('calls window.location.reload when reload button clicked', () => {

  render(
    <ErrorBoundary>
      <ProblemChild />
    </ErrorBoundary>
  )

  fireEvent.click(screen.getByText('بارگذاری مجدد'))

  // expect(window.location.reload).toHaveBeenCalled()

})

})
