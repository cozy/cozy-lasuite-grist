import React from 'react'
import { useParams } from 'react-router-dom'

import flag from 'cozy-flags'

import { makeGristDocUrl } from '@/helpers/grist'

// Opened from the Drive when a `.grist` file is launched: the route carries the
// Grist doc id (`metadata.externalId`) and we embed that document, keeping the
// Cozy bar provided by AppLayout around it.
const GristDoc = () => {
  const { externalId } = useParams()
  const baseUrl = flag('grist.embedded-app-url')

  return (
    <iframe
      id="embeddedApp"
      title="Grist"
      src={baseUrl ? makeGristDocUrl(baseUrl, externalId) : null}
      allow="clipboard-read; clipboard-write"
    ></iframe>
  )
}

export default GristDoc
