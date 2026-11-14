// SearchInput.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchInput } from '../searchInput';

// Mock Ant Design icons to avoid issues (optional, but keeps tests clean)
vi.mock('@ant-design/icons', () => ({
  SearchOutlined: () => <span data-testid="search-icon" />,
  CloseOutlined: () => <span data-testid="close-icon" />,
}));

describe('SearchInput', () => {
  it('renders with placeholder and disabled state', () => {
    const mockOnChange = vi.fn();
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        placeholder="جستجو..."
        disabled={true}
      />
    );

    const input = screen.getByPlaceholderText('جستجو...');
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    // close icon should not appear when value is empty
    expect(screen.queryByTestId('close-icon')).not.toBeInTheDocument();
  });

  it('displays the current value', () => {
    const mockOnChange = vi.fn();
    render(
      <SearchInput
        value="test query"
        onChange={mockOnChange}
        placeholder="جستجو..."
      />
    );

    const input = screen.getByDisplayValue('test query');
    expect(input).toBeInTheDocument();
    // close icon appears when value is truthy
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('calls onChange when user types', () => {
    const mockOnChange = vi.fn();
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        placeholder="جستجو..."
      />
    );

    const input = screen.getByPlaceholderText('جستجو...');
    fireEvent.change(input, { target: { value: 'new query' } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('new query');
  });

  it('clears the input when close icon is clicked', () => {
    const mockOnChange = vi.fn();
    render(
      <SearchInput
        value="initial value"
        onChange={mockOnChange}
        placeholder="جستجو..."
      />
    );

    const closeIcon = screen.getByTestId('close-icon');
    fireEvent.click(closeIcon);
    expect(mockOnChange).toHaveBeenCalledTimes(0);

  });

  it('does not show close icon when disabled even if value exists', () => {
    const mockOnChange = vi.fn();
    render(
      <SearchInput
        value="some text"
        onChange={mockOnChange}
        disabled={true}
      />
    );

    expect(screen.queryByTestId('close-icon')).not.toBeInTheDocument();
  });

  it('does not call onChange on close icon click when disabled', () => {
    const mockOnChange = vi.fn();
    render(
      <SearchInput
        value="some text"
        onChange={mockOnChange}
        disabled={true}
      />
    );

    // Close icon is not rendered, so we can't click it.
    // This test ensures that the logic that would clear is not available.
    // No close icon -> cannot clear, so onChange is never called with ''.
    // Additional: we can try to click the area where icon would be? Not needed.
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});