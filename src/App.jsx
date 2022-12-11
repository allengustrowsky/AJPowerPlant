import { useState, useEffect, useRef } from 'react'
import './App.css'
import ReactorCard from '../components/ReactorCard'
import Logs from '../components/Logs'
import ActionButtons from '../components/ActionButtons'
import { Paper, Card, Button, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack'

function App() {
    const [reactorData, setReactorData] = useState('')
    const [averageTemps, setAverageTemps] = useState([])
    const [averageTemp, setAverageTemp] = useState(0)
    const [totalOutput, setTotalOutput] = useState(0)
    const [unit, setUnit] = useState('')
    const [name, setName] = useState({name: ''})
    const chartRef = useRef(null)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const apiKey = 'ccb430c9775bba27'

    const getData = async () => {
        const raw = await fetch('https://nuclear.dacoder.io/reactors?apiKey=' + apiKey)
        const jsonData = await raw.json()

        const singleTemps = []

        for (let reactor of jsonData.reactors) {
            console.log(reactor.id)
            // get temperature data (value, unit, and level)
            const rawTemp = await fetch('https://nuclear.dacoder.io/reactors/temperature/' + reactor.id + '?apiKey=' + apiKey)
            const jsonTempData = await rawTemp.json()
            reactor.temperature = jsonTempData.temperature
            singleTemps.push(jsonTempData.temperature)
            console.log('getTemps')

            // get reactor state data
            const rawState = await fetch('https://nuclear.dacoder.io/reactors/reactor-state/' + reactor.id + '?apiKey=' + apiKey)
            const jsonStateData = await rawState.json() 
            reactor.state = jsonStateData.state
            console.log('getstate')

            // get output data
            const rawOutput = await fetch('https://nuclear.dacoder.io/reactors/output/' + reactor.id + '?apiKey=' + apiKey)
            const jsonOutputData = await rawOutput.json() 
            reactor.output = jsonOutputData.output
            // logs/messages are fetched in Logs.jsx
            console.log('getoutput')
        }
        setReactorData(jsonData)

        // get average temps
        const average = calculateAverage(singleTemps)
        setAverageTemp(average)
        setAverageTemps(prevAverage => {
            return [...prevAverage, average].splice(-1500) // 1500 ensures the last 5 mintues since API calls are every 0.2 seconds
        })

        // get total output
        const output = calcOutput(jsonData)
        setTotalOutput(output)
    }

    /**
     * Takes an array of reactor temperature objects from the API and calculates 
     * the average
     */
    const calculateAverage = (tempObjs) => {
        if (tempObjs.length > 0) {
            setUnit(tempObjs[0].unit)

            const sum = tempObjs.reduce((total, current) => {
                // return current ? total + current.amount : total
                return total + current.amount
            }, 0)
            
            return sum / tempObjs.length
        } else {
            return -1
        }
    }

    /**
     * Calculates the total output of all reactors in gigawatts given 
     * the reactor data
     */
    const calcOutput = (data) => {
        const output = data.reactors.reduce((total, reactor) => {
            // return reactor.output ? total + reactor.output.amount : total
            return reactor.output ? total + reactor.output.amount : total
        }, 0)

        return (output / 1000).toPrecision(3)
    }

    useEffect(() => {
        getData()
        const id = setInterval(getData, 200)

        return () => {
            clearInterval(id)
        }
    }, [])

    // Create chart
    useEffect(() => {
        const context = chartRef.current

        const dataChart = new Chart(context, {
            type: 'line',
            data: {
                labels: averageTemps.map((_, idx) => idx),
                datasets: [{
                    label: `Average Reactor Temperature`,
                    data: averageTemps,
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

    }, [averageTemps])

    // Dismiss snackbars
    const action = (snackbarId) => (
        <>
            <Button onClick={() => closeSnackbar(snackbarId)} sx={{float: 'right', display: 'inline-block'}}>Dismiss</Button>
        </>
    )

    const handleChange = (event) => {
        const { value, id } = event.target
        setName({
            [id]: value,
        })
    }

    const handleClick = async () => {
        const raw = await fetch('https://nuclear.dacoder.io/reactors/plant-name?apiKey=' + apiKey, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify(name)
        })

        // notify user if there's an error
        if (raw.status !== 200) {
            const jsonData = await raw.json()
            enqueueSnackbar(`Failed to reset plant name: ${jsonData.message}`, {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })
        }

        // reset name input
        setName({name: ''})
    }

    return (
        <div className='appContainer'>
            <h1 className='plantName'>{reactorData.plant_name}</h1>
            <div className="setPlantName">
                <Typography 
                    variant='h5' 
                    component='p' 
                    color='text.secondary' 
                    sx={{color: 'white'}}
                >
                    Set Plant Name
                </Typography>
                <TextField 
                    id='name'
                    value={name.name}
                    onChange={handleChange}
                    sx={{border: '1px solid white', borderRadius: '4px'}}
                />
                {name.name !== '' && <Button variant='contained' onClick={handleClick}>Enter</Button>}
            </div>
            <Paper className='reactorContainer' sx={{ 
                backgroundColor: 'var(--dark-blue)',
            }}>
                {reactorData == '' ? 'loading' : reactorData.reactors.map((reactor, index) => {
                    // return reactorData.reactors.temperature ?
                        // <ReactorCard 
                        return <ReactorCard
                                    key={index} 
                                    id={reactor.id} 
                                    name={reactor.name} 
                                    // temperature={reactor.temperature ? reactor.temperature.amount : 0} 
                                    temperature={reactor.temperature.amount}
                                    // unit={reactor.temperature ? reactor.temperature.unit : ''} 
                                    unit={reactor.temperature.unit}
                                    state={reactor.state}
                                    status={reactor.temperature.status}
                            // /> : ''
                                />
                    })
                }
            </Paper>
            {/* Graph */}
            <div className="graphAndAction">
                <Paper className='graphContainer data' elevation={5} 
                    sx={{backgroundColor: 'var(--light-blue)'}}
                >
                    <canvas ref={chartRef} className='graphCanvas'>

                    </canvas>
                </Paper>
                {/* Output + action button */}
                <ActionButtons 
                    reactorData={reactorData} 
                    apiKey={apiKey} 
                    enqueueSnackbar={enqueueSnackbar} 
                    closeSnackbar={closeSnackbar}
                    action={action}
                    totalOutput={totalOutput}
                    averageTemp={averageTemp}
                    unit={unit}
                />
            </div>
            {/* Messages and Logs */}
            <div className="msgsAndLogsContainer">
                <Logs apiKey={apiKey} enqueueSnackbar={enqueueSnackbar} closeSnackbar={closeSnackbar} action={action} />
            </div>
        </div>
    )
}

export default App
