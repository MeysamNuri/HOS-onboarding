import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useActiveServicesHooks from './activeServicesHooks';

vi.mock('@/features/Services/reducers/endpoints', () => ({
  useGetActiveUserSerialsQuery: vi.fn(),
}));

vi.mock('../reducers/endpoints', () => ({
  useGetActiveServicesQuery: vi.fn(),
}));

import { useGetActiveUserSerialsQuery } from '@/features/Services/reducers/endpoints';
import { useGetActiveServicesQuery } from '../reducers/endpoints';

describe('useActiveServicesHooks', () => {
  const mockUseGetActiveUserSerialsQuery = useGetActiveUserSerialsQuery as unknown as ReturnType<typeof vi.fn>;
  const mockUseGetActiveServicesQuery = useGetActiveServicesQuery as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockUseGetActiveUserSerialsQuery.mockReturnValue({
      data: { Data: { serials: ['SN123', 'SN456'] } },
      isLoading: false,
    });
    mockUseGetActiveServicesQuery.mockReturnValue({
      data: { Data: [{ id: 1, name: 'Package A' }] },
      isFetching: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should store the first available serial before fetching active services', async () => {
    const { result } = renderHook(() => useActiveServicesHooks());

    expect(result.current.isMobile).toBe(false);
    expect(mockUseGetActiveServicesQuery).toHaveBeenNthCalledWith(
      1,
      { serial: '' },
      { skip: true }
    );
    await waitFor(() => {
      expect(result.current.selectedSerial).toBe('SN123');
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('serial', 'SN123');
    expect(mockUseGetActiveServicesQuery).toHaveBeenLastCalledWith(
      { serial: 'SN123' },
      { skip: false }
    );
    expect(result.current.usersSerialsList).toEqual({ Data: { serials: ['SN123', 'SN456'] } });
    expect(result.current.userListLoading).toBe(false);
    expect(result.current.activeServicesData).toEqual({ Data: [{ id: 1, name: 'Package A' }] });
    expect(result.current.isFetching).toBe(false);
    expect(result.current.setSelctedSerial).toBeInstanceOf(Function);
    expect(result.current.goBack).toBeInstanceOf(Function);
  });

  it('should save a selected serial before triggering the services query', async () => {
    const { result } = renderHook(() => useActiveServicesHooks());

    await waitFor(() => {
      expect(result.current.selectedSerial).toBe('SN123');
    });

    act(() => {
      result.current.setSelctedSerial('SN456');
    });

    expect(result.current.selectedSerial).toBe('SN456');
    expect(localStorage.setItem).toHaveBeenCalledWith('serial', 'SN456');

    await waitFor(() => {
      expect(mockUseGetActiveServicesQuery).toHaveBeenLastCalledWith(
        { serial: 'SN456' },
        { skip: false }
      );
    });
  });

  it('should detect mobile screen size', async () => {
    const originalInnerWidth = window.innerWidth;
    window.innerWidth = 500;
    const { result } = renderHook(() => useActiveServicesHooks());
    await waitFor(() => {
      expect(result.current.isMobile).toBe(true);
    });
    window.innerWidth = originalInnerWidth;
  });

  it('should listen to resize events and update isMobile accordingly', async () => {
    const { result } = renderHook(() => useActiveServicesHooks());
    // Initially based on default window width (likely >768 in jsdom)
    expect(result.current.isMobile).toBe(false);

    // Simulate resize to mobile width
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));

    await waitFor(() => {
      expect(result.current.isMobile).toBe(true);
    });
  });

  it('should call window.history.back when goBack is invoked', () => {
    const backSpy = vi.spyOn(window.history, 'back');
    const { result } = renderHook(() => useActiveServicesHooks());
    act(() => {
      result.current.goBack();
    });
    expect(backSpy).toHaveBeenCalledOnce();
    backSpy.mockRestore();
  });

  it('should return loading states correctly', () => {
    mockUseGetActiveUserSerialsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    mockUseGetActiveServicesQuery.mockReturnValue({
      data: undefined,
      isFetching: true,
    });
    const { result } = renderHook(() => useActiveServicesHooks());
    expect(result.current.userListLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);
  });

  it('should not treat a reserved package from another service description as a match', () => {
    mockUseGetActiveServicesQuery.mockReturnValue({
      data: {
        Data: {
          services: [
            { serviceTitle: 'اشتراک آنلاین اسناد', isReserved: false },
            { serviceTitle: 'هلو همراه', isReserved: true },
          ],
        },
      },
      isFetching: false,
    });

    const { result } = renderHook(() => useActiveServicesHooks());

    expect(result.current.hasReservedPackage('SendInvoice')).toBe(false);
  });

  it('should detect a reserved package for the same service description', () => {
    mockUseGetActiveServicesQuery.mockReturnValue({
      data: {
        Data: {
          services: [
            { serviceDescription: 'SendInvoice', isReserved: false },
            { serviceDescription: 'SendInvoice', isReserved: true },
            { serviceDescription: 'BI', isReserved: false },
          ],
        },
      },
      isFetching: false,
    });

    const { result } = renderHook(() => useActiveServicesHooks());

    expect(result.current.hasReservedPackage('SendInvoice')).toBe(true);
    expect(result.current.hasReservedPackage('BI')).toBe(false);
  });
});
