import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Reactor from '../components/Reactor'
import './index.css'
import { SnackbarProvider } from 'notistack'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: '/:id',
        element: <Reactor />
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <SnackbarProvider
            maxSnack={3}
            dense
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}>
            <RouterProvider router={router} />
        </SnackbarProvider>
    </React.StrictMode>
)
