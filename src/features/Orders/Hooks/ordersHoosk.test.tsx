import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useOrdersHooks from './ordersHoosk'

// -------------------- HOISTED MOCKS --------------------
const mocks = vi.hoisted(() => ({
  useSelector: vi.fn(),
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  refetch: vi.fn(),
  searchParams: new URLSearchParams(),
}))

// -------------------- MOCKS --------------------
vi.mock('react-redux', () => ({
  useSelector: mocks.useSelector,
}))

vi.mock('../reducers/endpoints', () => ({
  useGetUserOrdersQuery: mocks.useQuery,
}))

vi.mock('@/features/Services/reducers/endpoints', () => ({
  usePaymentDataMutation: () => [mocks.useMutation],
}))

vi.mock('react-router', () => ({
  useSearchParams: () => [mocks.searchParams],
}))

vi.mock('react-hot-toast', () => ({
  toast: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}))

vi.mock('@/core/helper/translationUtility', () => ({
  getTranslation: (x: any) => `translated-${x}`,
}))

// -------------------- TEST --------------------
describe('useOrdersHooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'token'),
      },
      writable: true,
    })

    // window size mock
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
      writable: true,
    })

    // selector state
    mocks.useSelector.mockReturnValue({
      serial: '',
      serviceType: '',
      serviceStatus: '',
      fromDate: '',
      toDate: '',
    })

    // search params
    mocks.searchParams.set('oderId', '123')

    // API query mock
    mocks.useQuery.mockReturnValue({
      data: {
        Status: true,
        Data: { totalCount: 50 },
        Message: [],
      },
      isFetching: false,
      refetch: mocks.refetch,
    })

    // mutation mock
    mocks.useMutation.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({
        Status: true,
      }),
    })
  })

  it('initial state is correct', () => {
    const { result } = renderHook(() => useOrdersHooks())

    expect(result.current.isLogin).toBe(true)
    expect(result.current.pageModel.pageNumber).toBe(1)
    expect(result.current.totalPages).toBe(5)
  })

  it('handles page change', () => {
    const { result } = renderHook(() => useOrdersHooks())

    act(() => {
      result.current.handlePageChange(2, 20)
    })

    expect(result.current.pageModel.pageNumber).toBe(2)
    expect(result.current.pageModel.itemsPerPage).toBe(20)
  })

  it('handles page size change', () => {
    const { result } = renderHook(() => useOrdersHooks())

    act(() => {
      result.current.handlePageSizeChange(50)
    })

    expect(result.current.pageModel.pageNumber).toBe(1)
    expect(result.current.pageModel.itemsPerPage).toBe(50)
  })

  it('calculates total pages correctly', () => {
    const { result } = renderHook(() => useOrdersHooks())

    expect(result.current.totalPages).toBe(5)
  })

  it('sets goToPage correctly', async () => {
    const { result } = renderHook(() => useOrdersHooks())

    act(() => {
      result.current.setGoToPage(3)
    })

    await waitFor(() => {
      expect(result.current.goToPage).toBe(3)
    })
  })
})