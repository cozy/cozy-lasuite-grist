import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useClient } from 'cozy-client'
import flag from 'cozy-flags'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { createGristDoc, fetchFirstWorkspaceId } from '@/helpers/grist'

const DEFAULT_DOC_NAME = 'Sans titre'

// Reached from the Drive "+ Create > Grist" entry (slug grist, hash
// /bridge/grist/new/:folderId). We provision a Grist doc, materialize a matching
// `.grist` file in the target folder carrying its id in `metadata.externalId`,
// then hand over to the open route. The Drive recognizes the file afterwards via
// `isGrist` (name ends with `.grist` and has an externalId).
const CreateGristDoc = () => {
  const { folderId } = useParams()
  const client = useClient()
  const navigate = useNavigate()
  const { t } = useI18n()
  const [hasError, setHasError] = useState(false)
  // StrictMode mounts effects twice in development; guard so we create one doc.
  const hasStartedRef = useRef(false)

  useEffect(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    const createGristDocAndFile = async () => {
      try {
        const baseUrl = flag('grist.embedded-app-url')
        const workspaceId = await fetchFirstWorkspaceId(baseUrl)

        if (!workspaceId) {
          throw new Error('No Grist workspace available')
        }

        const docId = await createGristDoc(
          baseUrl,
          workspaceId,
          DEFAULT_DOC_NAME
        )

        await client.collection('io.cozy.files').createFile('', {
          name: `${DEFAULT_DOC_NAME}.grist`,
          dirId: folderId,
          contentType: 'application/octet-stream',
          metadata: { externalId: docId }
        })

        navigate(`/bridge/grist/${docId}`, { replace: true })
      } catch (error) {
        setHasError(true)
      }
    }

    createGristDocAndFile()
  }, [client, folderId, navigate])

  if (hasError) {
    return <p className="u-error">{t('grist.create_error')}</p>
  }

  return <Spinner size="xxlarge" middle />
}

export default CreateGristDoc
