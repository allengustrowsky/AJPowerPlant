import { useEffect, useState } from 'react'
import { Paper, Typography, Button } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const ActionButtons = (props) => {
    const { reactorData, apiKey, enqueueSnackbar, closeSnackbar, action, totalOutput } = props
    // const [totalOutput, setTotalOutput] = useState('')

    // /**
    //  * Calculates the total output of all reactors in gigawatts
    //  */
    // const calcOutput = () => {
    //     console.dir(reactorData)
    //     const output = reactorData.reactors.reduce((total, reactor => {
    //         return total + reactor.output.amount
    //     }), 0)

    //     return (output / 1000)
    // }

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
        // console.log(`value: ${value}`)
        let success = true
        for (let reactor of reactorData.reactors) {
            // fetch current state
            // const rawB = await fetch('https://nuclear.dacoder.io/reactors/coolant/' + reactor.id + '?apiKey=' + apiKey)
            // const jsonDataB = await rawB.json()
            // console.log('------------------------------')
            // console.log('before state:')
            // console.log(jsonDataB)
            // update current state
            const raw = await fetch('https://nuclear.dacoder.io/reactors/coolant/' + reactor.id + '?apiKey=' + apiKey, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ 'coolant': value })
            })
            const jsonResponse = await raw.json()
            // console.dir(jsonResponse)
            // console.log('raw.status: ')
            // console.log(raw.status)

            // set success to false if there is a failure
            if (raw.status !== 201) {
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

            // console.log('result: ')
            // console.log(raw)
            // display udpated state to make sure it changed
            // const rawA = await fetch('https://nuclear.dacoder.io/reactors/coolant/' + reactor.id + '?apiKey=' + apiKey)
            // const jsonDataA = await rawA.json()
            // console.log('after state:')
            // console.log(jsonDataA)
        }

        // notify user in snackbar
        if (success) {
            enqueueSnackbar(`${value === 'on' ? 'Enable ' : 'Disable '} coolant for all reactors: ${raw.statusText}`, {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })
        }
    }



    // DELETE ME and the below useESffect
    const temp = async () => {
        for (let reactor of reactorData.reactors) {
            const rawB = await fetch('https://nuclear.dacoder.io/reactors/coolant/' + reactor.id + '?apiKey=' + apiKey)
            const jsonDataB = await rawB.json()
            console.log(jsonDataB)
        }
        console.log('----------------------------------')
    }


    // useEffect(() => {
    //     const output = calcOutput
    //     setTotalOutput(output)
    //     // temp()
    //     // const id = setInterval(temp, 900)

    //     // return () => {
    //         // clearInterval(id)
    //     // }
    // }, [])

    return (
        <Paper className='actionBtnContainer data' elevation={5} >
            <Typography className='totalOutputContainer' variant='h5' component='h2'>
                Total Output: <p className='totalOutputData'>{(totalOutput === '') ? 'Loading...' : `${totalOutput} Gw`}</p>
            </Typography>
            <div className="btnGroup">
                <ThemeProvider theme={btnTheme}>
                    <div className="coolantContainer btnCol">
                        {/* <ButtonGroup className='coolantBtnGroup' orientation='vertical' size='large' variant='outlined'> */}
                        <Button className='actionBtn' variant='contained' color='yellow' onClick={() => toggleCoolant('on')}>Enable Coolant</Button>
                        <Button className='actionBtn' variant='contained' color='yellow' onClick={() => toggleCoolant('off')}>Disable Coolant</Button>
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
    )
}

export default ActionButtons