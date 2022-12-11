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
        // console.log(singleTemps)
        const average = calculateAverage(singleTemps)
        // console.log(average)
        setAverageTemp(average)
        setAverageTemps(prevAverage => {
            return [...prevAverage, average].splice(-10)
        })
        // console.log(averageTemps)

        // get total output
        const output = calcOutput(jsonData)
        // console.log('output:')
        // console.log(output)
        setTotalOutput(output)

          
 
        // console.log('final json')
        // console.log(jsonData)

        // get temperature data
        // const tempResponses = await Promise.all(jsonData.reactors.map(async (reactor) => {
        //     return await fetch('https://nuclear.dacoder.io/reactors/temperature/' + reactor.id + '?apiKey=' + apiKey)
        // }))
        // const tempData = await Promise.all(tempResponses.map(response => {
        //     return response.json()
        // }))
        // console.log(tempData)

        // console.log(promises)


        // console.log('getData')
        // console.log(jsonData)
        // console.log(jsonData.reactors)
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
    
    // Get average temperature
    // const getAverage = async () => {
    //     // reactorData.foreach(async (reactor) => {
    //     //     const raw = await fetch('https://nuclear.dacoder.io/reactors/temperature/' + reactor.id + '?apiKey=' + apiKey)
    //     //     const jsonData = await raw.json()
    //     // })
    //     // console.table(reactorData)
    //     const totalTemp = await reactorData.reactors.reduce(async (total, reactor) => {
    //     // const totalTemp = await reactorData.reactors.reduce(async (prevPromise, reactor) => {
    //         const raw = await fetch('https://nuclear.dacoder.io/reactors/temperature/' + reactor.id + '?apiKey=' + apiKey)
    //         const jsonData = await raw.json()
    //         // console.log('amount: ' + jsonData.temperature.amount)
    //         // return total + temp of reactor with this id
    //         return total + jsonData.temperature.amount
    //     }, 0)
    //     // }, Promise.resolve())
    //     // console.log('total temp type: ' + typeof totalTemp)
    //     // console.dir(totalTemp)
    //     // console.log('total temp: ' + totalTemp)
    //     // length
    //     const numReactors = await reactorData.reactors.length
    //     // console.log('numReactors: ' + numReactors)
    //     // calculate average
    //     // console.log(`totalTemp: ${totalTemp}; numReactore: ${numReactors}`)
    //     const average = totalTemp / numReactors
    //     // console.log('average: ' + average)
    // }
    // getAverage()

    // const getTemps = async () => {
    //     // await reactorData.reactors.reduce(async (total, reactor) => {
    //     //     // const totalTemp = await reactorData.reactors.reduce(async (prevPromise, reactor) => {
    //     //     const raw = await fetch('https://nuclear.dacoder.io/reactors/temperature/' + reactor.id + '?apiKey=' + apiKey)
    //     //     const jsonData = await raw.json()
    //     //     // return total + temp of reactor with this id
    //     //     return total + jsonData.temperature.amount
    //     // }, 0)
    //     if (reactorData !== '') {
    //         const promises = reactorData.reactors.map(reactor => {
    //             return fetch('https://nuclear.dacoder.io/reactors/temperature/' + reactor.id + '?apiKey=' + apiKey)
    //         })
    //         // promises.forEach(prom => {
    //         //     console.log(typeof prom) 
    //         // })
            
    //         const reactorTempObjs = await Promise.all(promises)

    //         const reactorTempObjsJson = await Promise.all(reactorTempObjs.map(async (obj) => { 
    //             console.log('jsonfunc')
    //             const values = await obj.json()
    //             console.log('temperature:')
    //             console.log(values.temperature) 
    //             return values.temperature 
    //         }))

    //         console.log('after map()')
    //         console.log(await reactorTempObjsJson)

             
    //         // const reactorTempObjsJson = await reactorTempObjs.json()
    //         // console.log(reactorTempObjsJson)
    //         calculateAverage()
    //         // Promise.all(promises)
    //     }
    // }

    // reporting errors if reactors aren't in right state for action (what are those conditions?)


    // create chart
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

        // getTemps()

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
                <Typography variant='h5' component='p' color='text.secondary' sx={{color: 'white'}}>Set Plant Name</Typography>
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
                // display: 'flex',
                // flexWrap: 'wrap',

            }}>
                {reactorData == '' ? 'loading' : reactorData.reactors.map((reactor, index) => {
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
                                />
                    })
                }
            </Paper>
            {/* <Container component='div' maxWidth='xl' className='graphAndAction' sx={{backgroundColor: 'var(--dark-blue)', color: 'var(--white)'}}> */}
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
            {/* </Container> */}
            </div>
            {/* Messages and Logs */}
            <div className="msgsAndLogsContainer">
                {/* <Card className='msgsContainer' sx={{width: '25rem', height: '20rem', backgroundColor: 'var(--dark-blue)', color: 'var(--white)', padding: '0.8rem'}}>
                    Messages
                </Card> */}
                <Logs apiKey={apiKey} enqueueSnackbar={enqueueSnackbar} closeSnackbar={closeSnackbar} action={action} />
            </div>

            {/* Logs */}
        </div>
    )
}

export default App
