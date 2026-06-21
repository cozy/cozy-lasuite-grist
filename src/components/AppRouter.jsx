import React from 'react'
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom'

import App from '@/components/App'
import AppLayout from '@/components/AppLayout'
import CreateGristDoc from '@/components/CreateGristDoc'
import GristDoc from '@/components/GristDoc'

const OutletWrapper = ({ Component }) => (
  <>
    <Component />
    <Outlet />
  </>
)

const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="bridge/grist/new/:folderId"
            element={<CreateGristDoc />}
          />
          <Route path="bridge/grist/:externalId" element={<GristDoc />} />
          <Route path="/" element={<OutletWrapper Component={App} />}>
            <Route path="bridge/*" />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default AppRouter
