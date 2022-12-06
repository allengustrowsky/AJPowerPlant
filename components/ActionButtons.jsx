import { useEffect, useState } from 'react'
import { Paper, Typography, Button } from '@mui/material'
import { createTheme, ThemeProvider} from '@mui/material/styles'

const ActionButtons = (props) => {
    const { reactorData, apiKey, enqueueSnackbar, closeSnackbar, action } = props
    const [totalOutput, setTotalOutput] = useState('')

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
    const toggleCoolant = (value) => { // value -> 'on' or 'off'
        let success = true;

        reactorData.reactors.forEach(async (reactor) => {
            // fetch current state
            const rawB = await fetch('https://nuclear.dacoder.io/reactors/coolant/' + reactor.id + '?apiKey=' + apiKey)
            const jsonDataB = await rawB.json()
            console.log('before state:')
            console.log(jsonDataB)
            // update current state
            const raw = await fetch('https://nuclear.dacoder.io/reactors/coolant/' + reactor.id + '?apiKey=' + apiKey, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify( {'coolant': value} )
            })
            console.log(raw.status)

            // set success to false if there is a failure
            (raw.status === 201) && (success = false)

            console.log('result: ')
            console.log(raw)
            // display udpated state to make sure it changed
            const rawA = await fetch('https://nuclear.dacoder.io/reactors/coolant/' + reactor.id + '?apiKey=' + apiKey)
            const jsonDataA = await rawA.json()
            console.log('after state:')
            console.log(jsonDataA)
        })
        // notify user in snackbar
        if (success) {
            enqueueSnackbar(`Coolant successfully ${value === 'on' ? 'enabled' : 'disabled'} for all reactors.`, {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })
        }
    }



    // DELETE ME and the below useESffect
    // const temp = async () => {
    //     reactorData.reactors.forEach(async (reactor) => {
    //         const rawB = await fetch('https://nuclear.dacoder.io/reactors/coolant/' + reactor.id + '?apiKey=' + apiKey)
    //         const jsonDataB = await rawB.json()
    //         console.log(jsonDataB) 
    //     })
    //     console.log('----------------------------------')

    // }
    // DELETE ME
    // useEffect(() => {
    //     // temp()
    //     // const id = setInterval(temp, 200)

    //     // return () => {
    //         // clearInterval(id)
    //     // }
    // })

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