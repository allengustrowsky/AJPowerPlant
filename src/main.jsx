import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Reactor from '../components/Reactor'
import './index.css'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>
    },
    {
        path: '/:id',
        element: <Reactor/>
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
