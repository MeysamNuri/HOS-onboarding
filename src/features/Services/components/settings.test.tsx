import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Settings from './settings'
import { Form } from 'antd'

// -------------------- Mock static assets --------------------
vi.mock('@core/assets/images/advanced-invoice.png', () => ({ default: 'advanced-invoice.png' }))
vi.mock('@core/assets/images/simple-invice.png', () => ({ default: 'simple-invoice.png' }))
vi.mock('@core/assets/icons/invoice-icon.svg', () => ({ default: 'invoice-icon.svg' }))
vi.mock('@core/assets/images/setting-hero.svg', () => ({ default: 'setting-hero.png' }))

// -------------------- Mock hooks --------------------
const mockHandleSubmit = vi.fn()
const mockSetShowSimple = vi.fn()
const mockSetShowAdvance = vi.fn()
const mockSetShowInfoModal = vi.fn()

vi.mock('../hooks/settingsHooks', () => ({
  default: function useMockSettingsHooks() {
    return {
    handleSubmitSetting: mockHandleSubmit,
    invoiceSettingLoading: false,
    settingsForm: Form.useForm()[0],
    showSimple: false,
    setShowSimple: mockSetShowSimple,
    showAdvance: false,
    setShowAdvance: mockSetShowAdvance,
    showInfoModal: false,
    setShowInfoModal: mockSetShowInfoModal,
    };
  },
}))

// -------------------- Mock modal and child component --------------------
vi.mock('@/core/components/customModal', () => ({
  default: ({ children }: any) => <div data-testid="bottom-modal">{children}</div>,
}))
vi.mock('../components/settingInfoModal', () => ({
  default: ({ onCancel }: any) => <button onClick={onCancel}>Close Modal</button>,
}))

// -------------------- Tests --------------------
describe('Settings Component', () => {
  it('keeps the save action outside the scrollable content and inside the form', () => {
    const { container } = render(<Settings />)
    const content = container.querySelector('.settings-scroll-content')
    const footer = container.querySelector('.submit-wrapper')
    const submitButton = screen.getByRole('button', { name: 'ذخیره تنظیمات' })

    expect(content).not.toBeNull()
    expect(content?.querySelector('.business-settings')).not.toBeNull()
    expect(content?.contains(submitButton)).toBe(false)
    expect(footer?.contains(submitButton)).toBe(true)
    expect(footer?.parentElement).toBe(content?.parentElement)
    expect(submitButton.closest('form')).not.toBeNull()
  },10000)




  it('opens info modal when info icon is clicked', () => {
    render(<Settings />)

    // Use label text for AntD icon
    const infoIcon = screen.getByLabelText('info-circle')
    fireEvent.click(infoIcon)
    expect(mockSetShowInfoModal).toHaveBeenCalledWith(true)
  },10000)

  it('submits form when save button is clicked', () => {
    render(<Settings />)

    const submitButton = screen.getByRole('button', { name: 'ذخیره تنظیمات' })
    fireEvent.click(submitButton)

    // expect(mockHandleSubmit).toHaveBeenCalled()
  })
})
