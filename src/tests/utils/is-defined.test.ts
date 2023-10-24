import { isDefined } from "../../utils/is-defined";

describe('isDefined helper function', () => {
  it('should reject null', () => {
    const result = isDefined(null);
    expect(result).toBe(false);
  });

  it('should reject undefined', () => {
    const result = isDefined(undefined);
    expect(result).toBe(false);
  });

  it('should accept number', () => {
    const result = isDefined(1);
    expect(result).toBe(true);
  });

  it('should accept zero', () => {
    const result = isDefined(0);
    expect(result).toBe(true);
  });

  it('should accept string', () => {
    const result = isDefined('string');
    expect(result).toBe(true);
  });

  it('should accept empty string', () => {
    const result = isDefined('');
    expect(result).toBe(true);
  });
});
