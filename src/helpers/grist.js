// Helpers wrapping the self-hosted Grist instance.
//
// `baseUrl` is provided at runtime by the `grist.embedded-app-url` flag and is
// expected to already include the org path prefix, e.g.
// `https://grist.linagora.com/o/docs`. From it we derive both the document UI
// URL (embedded in an iframe) and the REST API used to provision new docs.
//
// The API calls below are cross-origin and credentialed: they only succeed once
// the Grist host is whitelisted in the webapp `connect-src` CSP and Grist
// returns the matching CORS headers for the coquille origin.

export const makeGristDocUrl = (baseUrl, docId) => `${baseUrl}/doc/${docId}`

const fetchGristJSON = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      Accept: 'application/json',
      ...options.headers
    }
  })

  if (!response.ok) {
    throw new Error(`Grist request failed (${response.status}): ${url}`)
  }

  return response.json()
}

// `0` resolves to the org carried by the base URL path prefix, so we don't have
// to discover the org id first.
export const fetchFirstWorkspaceId = async baseUrl => {
  const workspaces = await fetchGristJSON(`${baseUrl}/api/orgs/0/workspaces`)

  return workspaces?.[0]?.id ?? null
}

export const createGristDoc = async (baseUrl, workspaceId, name) => {
  // Grist returns the new doc id as a bare (quoted) JSON string.
  const docId = await fetchGristJSON(
    `${baseUrl}/api/workspaces/${workspaceId}/docs`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    }
  )

  return typeof docId === 'string' ? docId : String(docId)
}
