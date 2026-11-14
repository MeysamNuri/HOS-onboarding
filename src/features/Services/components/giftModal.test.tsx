import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GiftModal from './giftModal'

// Mock Lottie to simplify rendering
vi.mock('lottie-react', () => ({
  default: (props: any) => <div data-testid="lottie-mock" {...props} />
}))

// Mock Ant Design icons to simplify rendering
vi.mock('@ant-design/icons', async () => {
  const actual = await vi.importActual<any>('@ant-design/icons')
  return {
    ...actual,
    CloseOutlined: (props: any) => <span data-testid="close-icon" {...props}>X</span>
  }
})

describe('GiftModal', () => {
  it('renders modal content correctly', () => {
    const onCancel = vi.fn()
    render(<GiftModal onCancel={onCancel} />)

    // Check Lottie is rendered
    expect(screen.getByTestId('lottie-mock')).toBeInTheDocument()

    // Check the text
    expect(screen.getByText('استفاده از کد تخفیف ويژه شما')).toBeInTheDocument()

    // Check the button
    const button = screen.getByRole('button', { name: 'تایید' })
    expect(button).toBeInTheDocument()
  })

  it('calls onCancel when close icon is clicked', () => {
    const onCancel = vi.fn()
    render(<GiftModal onCancel={onCancel} />)

    const closeIcon = screen.getByTestId('close-icon')
    fireEvent.click(closeIcon)
    expect(onCancel).toHaveBeenCalled()
  })

  it('calls onCancel when تایید button is clicked', () => {
    const onCancel = vi.fn()
    render(<GiftModal onCancel={onCancel} />)

    const button = screen.getByRole('button', { name: 'تایید' })
    fireEvent.click(button)
    expect(onCancel).toHaveBeenCalled()
  })
})