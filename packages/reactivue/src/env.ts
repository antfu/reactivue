// TODO: should be repaced with bundle global injection
export const __DEV__ = true
export const isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'development'
