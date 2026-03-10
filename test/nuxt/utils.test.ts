import { describe, it, expect } from 'vitest'
import { cn } from '~/lib/utils'

describe('cn()', () => {
  it('merges multiple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles falsy values (false, undefined, null)', () => {
    expect(cn('foo', false && 'bar', undefined, 'baz')).toBe('foo baz')
  })

  it('resolves conflicting Tailwind classes — last one wins', () => {
    // tailwind-merge ensures p-4 overrides p-2
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('handles conditional object syntax from clsx', () => {
    expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe('text-red-500')
  })

  it('returns empty string when called with no arguments', () => {
    expect(cn()).toBe('')
  })

  it('deduplicates identical classes', () => {
    // tailwind-merge removes duplicate utility classes
    expect(cn('flex', 'flex')).toBe('flex')
  })

  it('merges responsive variants without conflict', () => {
    expect(cn('md:p-2', 'lg:p-4')).toBe('md:p-2 lg:p-4')
  })
})
