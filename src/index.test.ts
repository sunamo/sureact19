import * as indexExports from './index';
import { H1 } from './components/headers/H1';

describe('Index exports', () => {
  it('exports H1 component', () => {
    expect(indexExports.H1).toBeDefined();
    expect(indexExports.H1).toBe(H1);
  });

  it('exports all expected components', () => {
    const exportedKeys = Object.keys(indexExports);
    expect(exportedKeys).toContain('H1');
  });

  it('has correct component signatures', () => {
    expect(typeof indexExports.H1).toBe('function');
  });
});
