import { Paper, Typography, Button } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const ActionButtons = (props) => {
    const { reactorData, apiKey, enqueueSnackbar, totalOutput, averageTemp, unit } = props

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

    // Event handlers
    const toggleCoolant = async (value) => { // value -> 'on' or 'off'
        let success = true
        for (let reactor of reactorData.reactors) {
            // update current state
            const raw = await fetch('https://nuclear.dacoder.io/reactors/coolant/' + reactor.id + '?apiKey=' + apiKey, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ 'coolant': value })
            })

            // set success to false if there is a failure
            if (raw.status !== 201) {
                const jsonResponse = await raw.json()
                success = false
                // notify user of failed coolant toggle for this reactor
                enqueueSnackbar(`${value === 'on' ? 'Enable ' : 'Disable '} coolant for  reactor ${reactor.id}: ${jsonResponse.message}`, {
                    preventDuplicate: false,
                    style: {
                        width: '350px',
                        textAlign: 'left',
                    },
                })
            }
        }

        // notify user in snackbar
        if (success) {
            enqueueSnackbar(`${value === 'on' ? 'Enable ' : 'Disable '} coolant for all reactors was successful.`, {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })
        }
    }

    const controlledShutdown = async () => {
        let success = true

        for (let reactor of reactorData.reactors) {
            console.log('reactor')
            const raw = await fetch('https://nuclear.dacoder.io/reactors/controlled-shutdown/' + reactor.id + '?apiKey=' + apiKey, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })

            if (raw.status !== 201) {
                success = false
                const jsonResponse = await raw.json()
                console.dir(jsonResponse)
                // notify user of failed controlled shutdown for this reactor
                enqueueSnackbar(`Failed controlled shutdown for  reactor ${reactor.id}: ${jsonResponse.message}`, {
                    preventDuplicate: false,
                    style: {
                        width: '350px',
                        textAlign: 'left',
                    },
                })
            }
        }

        if (success) {
            enqueueSnackbar('Controlled shutdown for all reactors successful.', {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })
        }

    }

    const emergencyShutdown = async () => {
        let success = true

        for (let reactor of reactorData.reactors) {
            console.log('reactor')
            const raw = await fetch('https://nuclear.dacoder.io/reactors/emergency-shutdown/' + reactor.id + '?apiKey=' + apiKey, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })

            if (raw.status !== 201) {
                success = false
                const jsonResponse = await raw.json()
                // notify user of failed controlled shutdown for this reactor
                console.log('fail')
                enqueueSnackbar(`Failed emergency shutdown for  reactor ${reactor.id}: ${jsonResponse.message}`, {
                    preventDuplicate: false,
                    style: {
                        width: '350px',
                        textAlign: 'left',
                    },
                })
            }
        }

        if (success) {
            console.log('success all')
            enqueueSnackbar('Emergency shutdown for all reactors successful.', {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })

        }

    }

    const resetReactors = async () => {
        console.log('reset')
        const raw = await fetch('https://nuclear.dacoder.io/reactors/reset?apiKey=' + apiKey, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        location.reload()

        if (raw.status !== 201) { // failed reset
            enqueueSnackbar('Failed to reset reactors.', {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })
        } else {
            enqueueSnackbar('Global reset successful.', {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })
        }
    }

    return (
        <Paper className='actionBtnContainer data' elevation={5} 
            sx={{height: 'max-content', backgroundColor: 'var(--light-blue)'}}
        >
            <div className="totals">
                <Typography className='totalOutputContainer' variant='h5' component='h2'>
                    Total Output: <p className='totalOutputData'>{(totalOutput === '') ? 'Loading...' : `${totalOutput} Gw`}</p>
                </Typography>
                <Typography className='totalOutputContainer' variant='h5' component='h2'>
                    Average Temperature: <p className='totalOutputData'>{(averageTemp === 0) ? 'Loading...' : `${averageTemp.toPrecision(5)}`}&deg; {unit !== '' && unit[0].toUpperCase()}</p>
                </Typography>
            </div>
            <div className="btnGroup">
                <ThemeProvider theme={btnTheme}>
                    <div className="coolantContainer btnCol">
                        <Button 
                            className='actionBtn' 
                            variant='contained' 
                            color='yellow' 
                            onClick={() => toggleCoolant('on')}
                        >
                            Enable Coolant
                        </Button>
                        <Button 
                            className='actionBtn' 
                            variant='contained' 
                            color='yellow' 
                            onClick={() => toggleCoolant('off')}
                        >
                            Disable Coolant
                        </Button>
                    </div>
                    <div className="btnCol">
                        <Button 
                            className='actionBtn' 
                            variant='contained' 
                            color='yellow' 
                            onClick={resetReactors}
                        >
                            Global Reset
                        </Button>
                        <Button 
                            className='actionBtn' 
                            variant='contained' 
                            color='yellow' 
                            onClick={controlledShutdown}
                        >
                            Controlled Shutdown
                        </Button>
                    </div>
                    <Button 
                        className='actionBtn emergencyBtn' 
                        variant='contained' 
                        color='lightRed' 
                        onClick={emergencyShutdown}
                    >
                        Emergency Shutdown
                    </Button>
                </ThemeProvider>
            </div>

        </Paper>
    )
}

export default ActionButtons