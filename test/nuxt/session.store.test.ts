import { describe, it, expect, beforeEach } from 'vitest'
import { useSessionStore, type LoginResponse, type RoleCode } from '~/stores/session'

function createMockSession(roleCode: RoleCode): LoginResponse {
  return {
    username: 'testuser',
    email: 'test@example.com',
    active: true,
    token: 'mock-token',
    onboardingCompleted: true,
    employee: {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      firstName: 'Test',
      lastName: 'User',
      hourlyRate: 50,
    },
    role: {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      code: roleCode,
      name: roleCode,
      description: '',
    },
  }
}

describe('useSessionStore — computed properties', () => {
  beforeEach(() => {
    const store = useSessionStore()
    store.session = undefined
  })

  describe('isAuthenticated', () => {
    it('is false when there is no session', () => {
      const store = useSessionStore()
      expect(store.isAuthenticated).toBe(false)
    })

    it('is true when a session is set', () => {
      const store = useSessionStore()
      store.session = createMockSession('DEVELOPER')
      expect(store.isAuthenticated).toBe(true)
    })

    it('goes back to false after clearing the session', () => {
      const store = useSessionStore()
      store.session = createMockSession('DEVELOPER')
      expect(store.isAuthenticated).toBe(true)
      store.session = undefined
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('role', () => {
    it('is undefined when there is no session', () => {
      const store = useSessionStore()
      expect(store.role).toBeUndefined()
    })

    it('returns the role from the active session', () => {
      const store = useSessionStore()
      store.session = createMockSession('PROJECT_ADMIN')
      expect(store.role?.code).toBe('PROJECT_ADMIN')
    })
  })

  describe('roleChecker', () => {
    it('marks isSystemAdmin when role is SYSTEM_ADMIN', () => {
      const store = useSessionStore()
      store.session = createMockSession('SYSTEM_ADMIN')
      expect(store.roleChecker.isSystemAdmin).toBe(true)
      expect(store.roleChecker.isProjectAdmin).toBe(false)
      expect(store.roleChecker.isDeveloper).toBe(false)
    })

    it('marks isProjectAdmin when role is PROJECT_ADMIN', () => {
      const store = useSessionStore()
      store.session = createMockSession('PROJECT_ADMIN')
      expect(store.roleChecker.isProjectAdmin).toBe(true)
      expect(store.roleChecker.isSystemAdmin).toBe(false)
      expect(store.roleChecker.isDeveloper).toBe(false)
    })

    it('marks isDeveloper when role is DEVELOPER', () => {
      const store = useSessionStore()
      store.session = createMockSession('DEVELOPER')
      expect(store.roleChecker.isDeveloper).toBe(true)
      expect(store.roleChecker.isSystemAdmin).toBe(false)
      expect(store.roleChecker.isProjectAdmin).toBe(false)
    })

    it('all flags are false when there is no session', () => {
      const store = useSessionStore()
      expect(store.roleChecker.isSystemAdmin).toBe(false)
      expect(store.roleChecker.isProjectAdmin).toBe(false)
      expect(store.roleChecker.isDeveloper).toBe(false)
    })
  })
})
