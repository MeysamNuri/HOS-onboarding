import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FAQ from '../FAQ';
import type { CollapseProps } from 'antd';

describe('FAQ component', () => {
  const mockQuestions: CollapseProps['items'] = [
    {
      key: '1',
      label: 'سوال اول',
      children: <p>پاسخ سوال اول</p>,
    },
    {
      key: '2',
      label: 'سوال دوم',
      children: <p>پاسخ سوال دوم</p>,
    },
  ];

  it('renders FAQ title and questions correctly', () => {
    render(<FAQ questions={mockQuestions} />);

    // Main title
    expect(
      screen.getByRole('heading', { name: 'سوالات متداول' })
    ).toBeTruthy();

    // Question titles
    expect(screen.getByText('سوال اول')).toBeTruthy();
    expect(screen.getByText('سوال دوم')).toBeTruthy();

    // Default active question content
    expect(screen.getByText('پاسخ سوال اول')).toBeTruthy();
  },10000);
});
