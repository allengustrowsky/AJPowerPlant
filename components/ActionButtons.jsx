import { useState } from 'react'
import { Paper, Typography, Button } from '@mui/material'
import { createTheme, ThemeProvider} from '@mui/material/styles'

const ActionButtons = (props) => {
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

    return (
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
    )
}

export default ActionButtons