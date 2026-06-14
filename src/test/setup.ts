import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' })) // yes, i want errors on non existing handlers
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
