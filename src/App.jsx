import { useState } from 'react'
import './App.css'
import ReactorCard from '../components/ReactorCard'
import Paper from '@mui/material/Paper'
function App() {


    return (
        <div className='appContainer'>
            <Paper elevation={4} className='reactorContainer' sx={{ backgroundColor: 'var(--dark-blue)' }}>
                {[...new Array(5)].map((_, index) => {
                    return <ReactorCard key={index} />
                })}
            </Paper>
        </div>
    )
}

export default App
