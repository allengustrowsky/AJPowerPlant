import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Reactor from '../components/Reactor'
import './index.css'
import { SnackbarProvider } from 'notistack'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
    typography: {
        fontFamily: 'Lato, sans-serif'
    }
})

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
        <ThemeProvider theme={theme}>
            <SnackbarProvider
                maxSnack={3}
                dense
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}>
                <RouterProvider router={router} />
            </SnackbarProvider>
        </ThemeProvider>
    </React.StrictMode>
)
