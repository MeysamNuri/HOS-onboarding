import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import BIPlans from './BIPlans'

// -------------------- HOISTED MOCKS --------------------
const mocks = vi.hoisted(() => ({
  useOnlineHooks: vi.fn(),
}))

// -------------------- HOOK MOCK --------------------
vi.mock('@/core/components/hooks/onlineExtraValuesHooks', () => ({
  default: mocks.useOnlineHooks,
}))

// -------------------- COMPONENT MOCKS --------------------
vi.mock('@/core/components/plansHero', () => ({
  default: (props: any) => (
    <div data-testid="plans-hero">{props.path}</div>
  ),
}))

vi.mock('@/core/components/HolooServicesPlansList', () => ({
  default: (props: any) => (
    <div data-testid="plans-list">{props.path}</div>
  ),
}))

vi.mock('@/core/components/FAQ', () => ({
  default: (props: any) => (
    <div data-testid="faq">
      {props.questions?.length ?? 0}
    </div>
  ),
}))

// -------------------- TEST --------------------
describe('BIPlans', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mocks.useOnlineHooks.mockReturnValue({
      path: '/bi-path',
      handleInvoiceDemoModal: vi.fn(),
      handleOpenModal: vi.fn(),
      BIFAQ: [{ q: 'q1' }, { q: 'q2' }],
    })
  })



  it('renders plans list with path', () => {
    render(<BIPlans />)

    expect(screen.getByTestId('plans-list')).toHaveTextContent(
      '/bi-path'
    )
  },10000)

  it('renders FAQ with correct count', () => {
    render(<BIPlans />)

    expect(screen.getByTestId('faq')).toHaveTextContent('2')
  })
})