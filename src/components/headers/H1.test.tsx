import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { H1 } from './H1';

describe('H1 Component', () => {
  it('renders children correctly', () => {
    render(<H1>Test Heading</H1>);
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  it('renders with default underline gradient', () => {
    const { container } = render(<H1>Test Heading</H1>);
    const gradientSpan = container.querySelector('span.bg-gradient-to-r');
    expect(gradientSpan).toBeInTheDocument();
    expect(gradientSpan).toHaveClass(
      'bg-gradient-to-r',
      'from-red-500',
      'via-orange-400',
      'to-yellow-600'
    );
  });

  it('does not render underline when notUnderlineColor is true', () => {
    const { container } = render(<H1 notUnderlineColor>Test Heading</H1>);
    const gradientSpan = container.querySelector('span.bg-gradient-to-r');
    expect(gradientSpan).not.toBeInTheDocument();
  });

  it('has correct structure and classes', () => {
    const { container } = render(<H1>Test Heading</H1>);
    const outerDiv = container.querySelector('div.block.mb-3');
    expect(outerDiv).toBeInTheDocument();
    expect(outerDiv).toHaveClass('block', 'mb-3');

    const innerDiv = container.querySelector('div.relative.inline-block');
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv).toHaveClass('relative', 'inline-block');

    const textSpan = screen.getByText('Test Heading');
    expect(textSpan).toHaveClass('text-3xl', 'font-extrabold');
  });

  it('renders with different children types', () => {
    const { rerender } = render(<H1>Simple Text</H1>);
    expect(screen.getByText('Simple Text')).toBeInTheDocument();

    rerender(
      <H1>
        <span>Complex</span> Content
      </H1>
    );
    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('has correct default prop behavior', () => {
    const { container } = render(<H1>Test</H1>);
    // Test that notUnderlineColor defaults to false (underline should be present)
    const gradientSpan = container.querySelector('span.bg-gradient-to-r');
    expect(gradientSpan).toBeInTheDocument();
  });

  it('applies gradient positioning correctly', () => {
    const { container } = render(<H1>Test</H1>);
    const gradientSpan = container.querySelector('span.bg-gradient-to-r');
    expect(gradientSpan).toHaveClass('absolute', '-bottom-1', 'left-0', 'w-full', 'h-1');
  });
});
