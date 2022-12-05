import { useState, useEffect } from 'react'
import './App.css'
import ReactorCard from '../components/ReactorCard'
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

function App() {
    const [reactorData, setReactorData] = useState('')
    const [temps, setTemps] = useState('')
    const apiKey = 'ccb430c9775bba27'

    useEffect(() => {
        const getData = async () => {
            const raw = await fetch('https://nuclear.dacoder.io/reactors?apiKey=' + apiKey)
            const jsonData = await raw.json()
            setReactorData(jsonData)
            console.log('getData')
            console.log(jsonData)
            console.log(jsonData.reactors)
        }
        getData()
    }, [])

    const getAverage = async () => {
        // reactorData.foreach(async (reactor) => {
        //     const raw = await fetch('https://nuclear.dacoder.io/reactors/temperature/' + reactor.id + '?apiKey=' + apiKey)
        //     const jsonData = await raw.json()
        // })
        // console.table(reactorData)
        const totalTemp = await reactorData.reactors.reduce(async (total, reactor) => {
        // const totalTemp = await reactorData.reactors.reduce(async (prevPromise, reactor) => {
            const raw = await fetch('https://nuclear.dacoder.io/reactors/temperature/' + reactor.id + '?apiKey=' + apiKey)
            const jsonData = await raw.json()
            console.log('amount: ' + jsonData.temperature.amount)
            // return total + temp of reactor with this id
            return total + jsonData.temperature.amount
        }, 0)
        // }, Promise.resolve())
        console.log('total temp type: ' + typeof totalTemp)
        console.dir(totalTemp)
        console.log('total temp: ' + totalTemp)
        // length
        const numReactors = await reactorData.reactors.length
        console.log('numReactors: ' + numReactors)
        // calculate average
        console.log(`totalTemp: ${totalTemp}; numReactore: ${numReactors}`)
        const average = totalTemp / numReactors
        console.log('average: ' + average)
    }
    getAverage()

    const getTemps = async () => {
        await reactorData.reactors.reduce(async (total, reactor) => {
            // const totalTemp = await reactorData.reactors.reduce(async (prevPromise, reactor) => {
            const raw = await fetch('https://nuclear.dacoder.io/reactors/temperature/' + reactor.id + '?apiKey=' + apiKey)
            const jsonData = await raw.json()
            // return total + temp of reactor with this id
            return total + jsonData.temperature.amount
        }, 0)
    }

    return (
        <div className='appContainer'>
            <h1>{reactorData.plant_name}</h1>
            <Paper elevation={4} className='reactorContainer' sx={{ backgroundColor: 'var(--dark-blue)' }}>
                {reactorData == '' ? 'loading' : reactorData.reactors.map((reactor, index) => {
                        return <ReactorCard key={index} id={reactor.id} name={reactor.name} />
                    })
                }
            </Paper>
            <Container component='div' maxWidth='xl' className='graphAndAction' sx={{backgroundColor: 'var(--dark-blue)', color: 'var(--white)'}}>
                <Box className='graphContainer data'>
                    the graph
                </Box>
                <Box className='actionBtnContainer data'>
                    action buttons
                </Box>
            </Container>
            <div className="graphAndAction">

            </div>
        </div>
    )
}

export default App
