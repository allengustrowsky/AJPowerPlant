import { useState, useEffect } from 'react'
import './App.css'
import ReactorCard from '../components/ReactorCard'
import Paper from '@mui/material/Paper'

function App() {
    const [reactorData, setReactorData] = useState('')
    const apiKey = 'ccb430c9775bba27'

    useEffect(() => {
        const getData = async () => {
            const raw = await fetch('https://nuclear.dacoder.io/reactors?apiKey=' + apiKey)
            const jsonData = await raw.json()
            setReactorData(jsonData)
            console.log(jsonData)
            console.log(jsonData.reactors)
        }
        getData()
    }, [])

    return (
        <div className='appContainer'>
            <h1>{reactorData.plant_name}</h1>
            <Paper elevation={4} className='reactorContainer' sx={{ backgroundColor: 'var(--dark-blue)' }}>
                {reactorData == '' ? 'loading' : reactorData.reactors.map((reactor, index) => {
                        return <ReactorCard key={index} id={reactor.id} name={reactor.name} />
                    })
                }
            </Paper>
        </div>
    )
}

export default App
