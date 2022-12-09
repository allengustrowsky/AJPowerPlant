import { useState, useEffect, useRef } from 'react'
import './App.css'
import ReactorCard from '../components/ReactorCard'
import Logs from '../components/Logs'
import ActionButtons from '../components/ActionButtons'
import { Paper, Card, Button } from '@mui/material';
import { useSnackbar } from 'notistack'

function App() {
    const [reactorData, setReactorData] = useState('')
    const [temps, setTemps] = useState('')
    const chartRef = useRef(null)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const apiKey = 'ccb430c9775bba27'

    const getData = async () => {
        const raw = await fetch('https://nuclear.dacoder.io/reactors?apiKey=' + apiKey)
        const jsonData = await raw.json()
        setReactorData(jsonData)

        // for obj in jsonData.reactors as reactor, 
        // get temperature data of reactor.id
        // set reactor.temperate to that
        for (let reactor of jsonData.reactors) {
            // get temperature data (value, unit, and level)
            const rawTemp = await fetch('https://nuclear.dacoder.io/reactors/temperature/' + reactor.id + '?apiKey=' + apiKey)
            const jsonTempData = await rawTemp.json()
            reactor.temperature = jsonTempData.temperature

            // get reactor state data
            const rawState = await fetch('https://nuclear.dacoder.io/reactors/reactor-state/' + reactor.id + '?apiKey=' + apiKey)
            const jsonStateData = await rawState.json() 
            reactor.state = jsonStateData.state
            
            // logs/messages are fetched in Logs.jsx
        }

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

    /**
     * Takes an array of reactor temperature objects from the API and
     */
    const calculateAverage = (tempObjs) => {
        // tempObjs.forEach(tempObj => {
        //     // convert to same unit
        //     return
        //     // average on that unit

        // })
        return 
        // return average
    }

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

        // getTemps()

        return () => {
            dataChart.destroy()
        }

    }, [])

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
                <ActionButtons reactorData={reactorData} apiKey={apiKey} enqueueSnackbar={enqueueSnackbar} closeSnackbar={closeSnackbar} action={action} />
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
