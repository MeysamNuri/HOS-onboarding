import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ActivationGuideInstructions from './activationInstructions'

// Mock images
vi.mock('@core/assets/images/guides/guides-1.svg', () => ({ default: 'guides1.svg' }))
vi.mock('@core/assets/images/guides/guides-2.svg', () => ({ default: 'guides2.svg' }))
vi.mock('@core/assets/icons/guide-step1.svg', () => ({ default: 'step1.svg' }))
vi.mock('@core/assets/icons/guide-step2.svg', () => ({ default: 'step2.svg' }))
vi.mock('@core/assets/icons/notification_settings.svg', () => ({ default: 'notice.svg' }))

describe('ActivationGuideInstructions', () => {
  it('renders all guide cards with titles and descriptions', () => {
    render(<ActivationGuideInstructions />)

    // Check titles
    expect(screen.getByText('مرحله ی اول')).toBeDefined()
    expect(screen.getByText('مرحله دوم')).toBeDefined()
    expect(screen.getByText('عدم نمایش مراحل')).toBeDefined()
  })

  it('renders buttons and triggers navigation', () => {
    render(<ActivationGuideInstructions />)

    // Mock window.location.href safely
    const originalHref = window.location.href
    const mockAssign = vi.fn()
    // @ts-expect-error: mocking window.location.assign
    delete window.location
    // @ts-expect-error: mocking window.location
    window.location = { href: originalHref, assign: mockAssign } as unknown as Location

    const connectButton = screen.getByText('اتصال به هلو')
    fireEvent.click(connectButton)

    // The component sets window.location.href directly
    expect(window.location.href).toBe('https://portfolio.invalid/device-auth')

    // Restore window.location
    window.location.href = originalHref
  })

  it('renders images for cards that have them', () => {
    render(<ActivationGuideInstructions />)

    const images = screen.getAllByRole('img')
    expect(images.some(img => img.getAttribute('src') === 'guides1.svg')).toBe(true)
    expect(images.some(img => img.getAttribute('src') === 'step1.svg')).toBe(true)
  })
})
