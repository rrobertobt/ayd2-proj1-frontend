import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { ColumnDef } from '@tanstack/vue-table'
import DataTable from '~/components/partials/DataTable.vue'

type Row = { name: string; age: number }

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Nombre', meta: { displayName: 'Nombre' } },
  { accessorKey: 'age', header: 'Edad', meta: { displayName: 'Edad' } },
]

describe('DataTable', () => {
  it('shows empty state text when no data is provided', async () => {
    const wrapper = await mountSuspended(DataTable, {
      props: { columns, data: [], totalPages: 0, totalElements: 0 },
    })
    expect(wrapper.text()).toContain('Sin registros disponibles')
  })

  it('renders one table row per data item', async () => {
    const data: Row[] = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]
    const wrapper = await mountSuspended(DataTable, {
      props: { columns, data, totalPages: 1, totalElements: 2 },
    })
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
  })

  it('shows total element count in the pagination bar', async () => {
    const wrapper = await mountSuspended(DataTable, {
      props: {
        columns,
        data: [{ name: 'Test', age: 1 }],
        totalPages: 3,
        totalElements: 99,
        paginationState: { pageIndex: 0, pageSize: 10 },
      },
    })
    expect(wrapper.text()).toContain('99')
  })

  it('shows the current page number in the pagination bar', async () => {
    const wrapper = await mountSuspended(DataTable, {
      props: {
        columns,
        data: [{ name: 'Test', age: 1 }],
        totalPages: 5,
        totalElements: 50,
        paginationState: { pageIndex: 2, pageSize: 10 },
      },
    })
    // pageIndex is 0-based, so page 3 is shown as "Página 3 de 5"
    expect(wrapper.text()).toContain('3')
    expect(wrapper.text()).toContain('Página')
  })

  it('hides the pagination bar when disablePagination is true', async () => {
    const wrapper = await mountSuspended(DataTable, {
      props: { columns, data: [], disablePagination: true },
    })
    expect(wrapper.text()).not.toContain('Página')
  })

  it('renders a column header for each column definition', async () => {
    const wrapper = await mountSuspended(DataTable, {
      props: { columns, data: [], totalPages: 0, totalElements: 0 },
    })
    expect(wrapper.text()).toContain('Nombre')
    expect(wrapper.text()).toContain('Edad')
  })
})
