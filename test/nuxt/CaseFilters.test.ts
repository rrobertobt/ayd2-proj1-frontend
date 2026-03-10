import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CaseFilters from '~/components/cases/CaseFilters.vue'

describe('CaseFilters', () => {
  it('disables all inputs when loading=true', async () => {
    const wrapper = await mountSuspended(CaseFilters, {
      props: { loading: true },
    })
    const fieldset = wrapper.find('fieldset')
    expect(fieldset.element.disabled).toBe(true)
  })

  it('enables all inputs when loading=false', async () => {
    const wrapper = await mountSuspended(CaseFilters, {
      props: { loading: false },
    })
    const fieldset = wrapper.find('fieldset')
    expect(fieldset.element.disabled).toBe(false)
  })

  it('renders a search text input', async () => {
    const wrapper = await mountSuspended(CaseFilters, {
      props: { loading: false },
    })
    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBeGreaterThanOrEqual(1)
  })

  it('renders select elements for status, sortBy, and sortDir', async () => {
    const wrapper = await mountSuspended(CaseFilters, {
      props: { loading: false },
    })
    const selects = wrapper.findAll('select')
    // status + sortBy + sortDir = 3 selects
    expect(selects.length).toBe(3)
  })

  it('status select contains the expected options', async () => {
    const wrapper = await mountSuspended(CaseFilters, {
      props: { loading: false },
    })
    const text = wrapper.text()
    expect(text).toContain('Abierto')
    expect(text).toContain('En progreso')
    expect(text).toContain('Completado')
    expect(text).toContain('Cancelado')
  })

  it('sortBy select contains the expected options', async () => {
    const wrapper = await mountSuspended(CaseFilters, {
      props: { loading: false },
    })
    const text = wrapper.text()
    expect(text).toContain('Título')
    expect(text).toContain('Estado')
    expect(text).toContain('Fecha límite')
  })
})
