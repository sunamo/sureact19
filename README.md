# sureact19

#musím to vložit do [] protože je tam i odkaz

[![CI/CD](https://img.shields.io/badge/CI%2FCD-pending-yellow)](https://github.com/actions) [![Tests](https://img.shields.io/badge/tests-passing-green)](#testing) ![Coverage](https://img.shields.io/badge/coverage-83.33%25-brightgreen)

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
