import { useState, useEffect, useRef } from 'react'
import './App.css'
import ReactorCard from '../components/ReactorCard'
// import Paper from '@mui/material/Paper'
import { Paper, Typography, ButtonGroup, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles'

function App() {
    const [reactorData, setReactorData] = useState('')
    const [temps, setTemps] = useState('')
    const [totalOutput, setTotalOutput] = useState('')
    const chartRef = useRef(null)
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

    // Theme override for actions button
    const btnTheme = createTheme({
        palette: {
            yellow: {
                main: '#E0FF4F',
            },
            lightRed: {
                main: '#FF6663',
            },
        },
    })


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
                <Paper className='actionBtnContainer data' elevation={5} >
                    <Typography className='totalOutputContainer' variant='h5' component='h2'>
                        Total Output: <p className='totalOutputData'>{(totalOutput === '') ? 'Loading...' : `${totalOutput} Gw`}</p>
                    </Typography>
                    <div className="btnGroup">
                        <ThemeProvider theme={btnTheme}>
                            <div className="coolantContainer btnCol">
                                {/* <ButtonGroup className='coolantBtnGroup' orientation='vertical' size='large' variant='outlined'> */}
                                <Button className='actionBtn' variant='contained' color='yellow'>Enable Coolant</Button>
                                <Button className='actionBtn' variant='contained' color='yellow'>Disable Coolant</Button>
                                {/* </ButtonGroup> */}
                            </div>
                            <div className="btnCol">
                                <Button className='actionBtn' variant='contained' color='yellow'>Global Reset</Button>
                                <Button className='actionBtn' variant='contained' color='yellow'>Controller Shutdown</Button>
                            </div>
                            <Button className='actionBtn emergencyBtn' variant='contained' color='lightRed'>Emergency Shutdown</Button>
                        </ThemeProvider>
                    </div>

                </Paper>
            {/* </Container> */}
            

            </div>
        </div>
    )
}

export default App
