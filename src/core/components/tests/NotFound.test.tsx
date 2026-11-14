import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotFound from '../NotFound';

// mock react-router
const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('NotFound component', () => {
  it('renders 404 page and navigates to home on button click', () => {
    render(<NotFound />);

    // ✅ check title text (AntD Result does NOT use <h1>)
    expect(screen.getByText('404')).toBeInTheDocument();

    // subtitle
    expect(
      screen.getByText('متأسفیم، صفحه مورد نظر شما پیدا نشد')
    ).toBeInTheDocument();

    // button
    const button = screen.getByRole('button', {
      name: 'برگشت به صفحه اصلی',
    });

    expect(button).toBeInTheDocument();

    // click button
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
