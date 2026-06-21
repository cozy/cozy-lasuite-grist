import { makeGristDocUrl } from '@/helpers/grist'

describe('makeGristDocUrl', () => {
  it('builds the org-scoped document URL from the base URL', () => {
    expect(makeGristDocUrl('https://grist.linagora.com/o/docs', 'abc123')).toBe(
      'https://grist.linagora.com/o/docs/doc/abc123'
    )
  })
})
