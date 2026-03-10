import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { nextTick } from 'vue'
import UserActionsTable from '~/components/users/table/UserActionsTable.vue'

// Capture the onComplete callbacks so we can simulate mutation completion
let capturedToggleOnComplete: (() => void) | undefined
let capturedResendOnComplete: (() => void) | undefined

vi.mock('~/lib/mutations/users', () => ({
  usersMutations: {
    useToggleUserStatus: vi.fn(({ onComplete }: { onComplete?: () => void }) => {
      capturedToggleOnComplete = onComplete
      return { mutate: vi.fn() }
    }),
    useResendOnboardingEmail: vi.fn(({ onComplete }: { onComplete?: () => void }) => {
      capturedResendOnComplete = onComplete
      return { mutate: vi.fn() }
    }),
  },
}))

describe('UserActionsTable', () => {
  beforeEach(() => {
    capturedToggleOnComplete = undefined
    capturedResendOnComplete = undefined
  })

  it('renders without errors when user is active', async () => {
    const wrapper = await mountSuspended(UserActionsTable, {
      props: { userId: 1, active: true },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders without errors when user is inactive', async () => {
    const wrapper = await mountSuspended(UserActionsTable, {
      props: { userId: 1, active: false },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('contains a link to the user detail page with the correct userId', async () => {
    const wrapper = await mountSuspended(UserActionsTable, {
      props: { userId: 42, active: false },
    })
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toContain('/main/users/42')
  })

  it('emits action-complete when the toggle mutation completes', async () => {
    const wrapper = await mountSuspended(UserActionsTable, {
      props: { userId: 5, active: false },
    })

    // Simulate the mutation's onComplete callback being called
    capturedToggleOnComplete?.()
    await nextTick()

    expect(wrapper.emitted('action-complete')).toBeTruthy()
  })

  it('emits action-complete when the resend email mutation completes', async () => {
    const wrapper = await mountSuspended(UserActionsTable, {
      props: { userId: 5, active: false },
    })

    capturedResendOnComplete?.()
    await nextTick()

    expect(wrapper.emitted('action-complete')).toBeTruthy()
  })
})
