import { useState, useEffect, useRef } from 'react'
import './App.css'
import ReactorCard from '../components/ReactorCard'
import Logs from '../components/Logs'
import ActionButtons from '../components/ActionButtons'
// import Paper from '@mui/material/Paper'
import { Paper, Card } from '@mui/material';

function App() {
    const [reactorData, setReactorData] = useState('')
    const [temps, setTemps] = useState('')
    const chartRef = useRef(null)
    const apiKey = 'ccb430c9775bba27'
    useEffect(() => {
        const getData = async () => {
            const raw = await fetch('https://nuclear.dacoder.io/reactors?apiKey=' + apiKey)
            const jsonData = await raw.json()
            setReactorData(jsonData)
            // console.log('getData')
            // console.log(jsonData)
            // console.log(jsonData.reactors)
        }
        getData()
    }, [])
    
    // Get average temperature
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
            // console.log('amount: ' + jsonData.temperature.amount)
            // return total + temp of reactor with this id
            return total + jsonData.temperature.amount
        }, 0)
        // }, Promise.resolve())
        // console.log('total temp type: ' + typeof totalTemp)
        // console.dir(totalTemp)
        // console.log('total temp: ' + totalTemp)
        // length
        const numReactors = await reactorData.reactors.length
        // console.log('numReactors: ' + numReactors)
        // calculate average
        // console.log(`totalTemp: ${totalTemp}; numReactore: ${numReactors}`)
        const average = totalTemp / numReactors
        // console.log('average: ' + average)
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

    // create chart
    useEffect(() => {
        const context = chartRef.current

        const dataChart = new Chart(context, {
            type: 'line',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: 'Average Reactor Temperature',
                    data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 1
                }]
            },
            options: {
                animation: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })

        return () => {
            dataChart.destroy()
          }
    }, [])

    // Get reactor messages
    // useEffect(() => {
        // const getMessages = async () => {
        //     const raw = await fetch('https://nuclear.dacoder.io/reactors/logs?apiKey=' + apiKey)
        //     console.log('reactor logs;')
        //     const jsonData = await raw.json()
        //     setLogs(jsonData)
        //     // console.table(raw)
        // }
        // getMessages()
        // console.table(logs)

    // }, [])


    return (
        <div className='appContainer'>
            <h1>{reactorData.plant_name}</h1>
            <Paper elevation={4} className='reactorContainer' sx={{ backgroundColor: 'var(--dark-blue)' }}>
                {reactorData == '' ? 'loading' : reactorData.reactors.map((reactor, index) => {
                        return <ReactorCard key={index} id={reactor.id} name={reactor.name} />
                    })
                }
            </Paper>
            {/* <Container component='div' maxWidth='xl' className='graphAndAction' sx={{backgroundColor: 'var(--dark-blue)', color: 'var(--white)'}}> */}
            {/* Graph */}
            <div className="graphAndAction">
                <Paper className='graphContainer data' elevation={5}>
                    <canvas ref={chartRef} className='graphCanvas'>

                    </canvas>
                </Paper>
                {/* Output + action button */}
                <ActionButtons reactorData={reactorData} apiKey={apiKey} />
            {/* </Container> */}
            </div>
            {/* Messages and Logs */}
            <div className="msgsAndLogsContainer">
                <Card className='msgsContainer' sx={{width: '25rem', height: '20rem', backgroundColor: 'var(--dark-blue)', color: 'var(--white)', padding: '0.8rem'}}>
                    Messages
                </Card>
                <Logs apiKey={apiKey} />
            </div>

            {/* Logs */}
        </div>
    )
}

export default App
