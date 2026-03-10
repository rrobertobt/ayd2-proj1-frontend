import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { valueUpdater } from '../../app/utils/valueUpdater'

describe('valueUpdater()', () => {
  it('sets ref value directly when passed a plain value', () => {
    const myRef = ref('initial')
    valueUpdater('updated', myRef)
    expect(myRef.value).toBe('updated')
  })

  it('sets ref value using an updater function', () => {
    const counter = ref(0)
    valueUpdater((prev: number) => prev + 1, counter)
    expect(counter.value).toBe(1)
  })

  it('passes the current ref value to the updater function', () => {
    const myRef = ref([1, 2])
    valueUpdater((prev: number[]) => [...prev, 3], myRef)
    expect(myRef.value).toEqual([1, 2, 3])
  })

  it('sets ref to false when passed false', () => {
    const myRef = ref(true)
    valueUpdater(false, myRef)
    expect(myRef.value).toBe(false)
  })

  it('replaces object value directly', () => {
    const myRef = ref({ a: 1 })
    valueUpdater({ b: 2 }, myRef)
    expect(myRef.value).toEqual({ b: 2 })
  })
})
