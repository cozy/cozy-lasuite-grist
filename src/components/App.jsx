import React from 'react'

import { useExternalBridge } from 'cozy-external-bridge/container'
import flag from 'cozy-flags'

const App = () => {
  const embeddedGristUrl = flag('grist.embedded-app-url')

  useExternalBridge(embeddedGristUrl)

  return <iframe id="embeddedApp" src={embeddedGristUrl}></iframe>
}

export default App
