# sureact19

[![CI/CD](https://img.shields.io/badge/CI%2FCD-pending-yellow)](https://github.com/actions) [![Tests](https://img.shields.io/badge/tests-passing-green)](#testing) [![Coverage](https://img.shields.io/badge/coverage-60%25-yellow

A modern React component library built with TypeScript and React 19.

## Features

- ✅ TypeScript support
- ✅ React 19 compatible
- ✅ Tree-shakable exports
- ✅ Comprehensive test coverage
- ✅ Modern build tooling
- ✅ ESLint and Prettier configured

## Installation

```bash
npm install sureact19
# or
yarn add sureact19
# or
pnpm add sureact19
```

## Usage

### H1 Component

A stylish heading component with optional gradient underline.

```tsx
import React from 'react';
import { H1 } from 'sureact19';

function App() {
  return (
    <div>
      {/* Default H1 with gradient underline */}
      <H1>Welcome to SureAct19</H1>

      {/* H1 without underline */}
      <H1 notUnderlineColor>Clean Heading</H1>
    </div>
  );
}
```

#### Props

| Prop                | Type              | Default | Description                             |
| ------------------- | ----------------- | ------- | --------------------------------------- |
| `children`          | `React.ReactNode` | -       | Content to display in the heading       |
| `notUnderlineColor` | `boolean`         | `false` | If true, removes the gradient underline |

## Development

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd sureact19

# Install dependencies
pnpm install
```

### Scripts

- `pnpm build` - Build the library
- `pnpm build:watch` - Build in watch mode
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm lint` - Lint code
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

### Testing

This project uses Jest with React Testing Library for testing. All components have comprehensive test coverage.

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests and ensure they pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Peer Dependencies

- React ^18.0.0 || ^19.0.0
- React DOM ^18.0.0 || ^19.0.0

## Browser Support

Modern browsers that support ES2020+ features.
