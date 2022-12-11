import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import '../src/App.css'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Button, TextField, Typography, Paper} from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSnackbar } from 'notistack'

const Reactor = (props) => {
    const { id } = useParams()
    const [data, setData] = useState('')
    const [temp, setTemp] = useState('')
    const [coolant, setCoolant] = useState('')
    const [output, setOutput] = useState('')
    const [rod, setRod] = useState('')
    const [reactorState, setReactorState] = useState('')
    const [fuel, setFuel] = useState('')
    const [name, setName] = useState({ name: '' })
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const apiKey = 'ccb430c9775bba27'

    const getData = async () => {
        const raw = await fetch('https://nuclear.dacoder.io/reactors?apiKey=' + apiKey)
        const jsonData = await raw.json()

        const rawTemp = await fetch('https://nuclear.dacoder.io/reactors/temperature/' + id + '?apiKey=' + apiKey)
        const tempData = await rawTemp.json()

        const rawCoolant = await fetch('https://nuclear.dacoder.io/reactors/coolant/' + id + '?apiKey=' + apiKey)
        const coolantData = await rawCoolant.json()

        const rawOutput = await fetch('https://nuclear.dacoder.io/reactors/output/' + id + '?apiKey=' + apiKey)
        const outputData = await rawOutput.json()

        const rawRod = await fetch('https://nuclear.dacoder.io/reactors/rod-state/' + id + '?apiKey=' + apiKey)
        const rodData = await rawRod.json()

        const rawState = await fetch('https://nuclear.dacoder.io/reactors/reactor-state/' + id + '?apiKey=' + apiKey)
        const stateData = await rawState.json()

        const rawFuel = await fetch('https://nuclear.dacoder.io/reactors/fuel-level/' + id + '?apiKey=' + apiKey)
        const fuelData = await rawFuel.json()

        setData(jsonData)
        setTemp(tempData)
        setCoolant(coolantData)
        setOutput(outputData)
        setRod(rodData)
        setReactorState(stateData)
        setFuel(fuelData)
    }

    useEffect(() => {
        getData()

        const id = setInterval(getData, 200)

        return () => {
            clearInterval(id)
        }

    }, [])

    if (!data) return <p>Loading</p>

    const filtered = data.reactors.filter(obj => {
        return obj.id === id
    })

    const symbol = temp.temperature.unit.charAt(0).toUpperCase()

    let regExp = /\(([^)]+)\)/;
    let matches = regExp.exec(output.output.unit)

    const handleClick = async () => {
        const raw = await fetch('https://nuclear.dacoder.io/reactors/set-reactor-name/' + id + '?apiKey=' + apiKey, {
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
        setName({ name: '' })
    }

    const handleChange = (event) => {
        const { value, id } = event.target
        setName({
            [id]: value,
        })
    }

    const emergencyShutdown = async () => {
        let success = true
        const raw = await fetch('https://nuclear.dacoder.io/reactors/emergency-shutdown/' + id + '?apiKey=' + apiKey, {
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
            enqueueSnackbar(`Failed emergency shutdown for reactor ${id}: ${jsonResponse.message}`, {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })
        }

        if (success) {
            enqueueSnackbar('Emergency shutdown successful.', {
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
        const raw = await fetch('https://nuclear.dacoder.io/reactors/controlled-shutdown/' + id + '?apiKey=' + apiKey, {
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
            enqueueSnackbar(`Failed controlled shutdown for reactor ${id}: ${jsonResponse.message}`, {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })
        }

        if (success) {
            enqueueSnackbar('Controlled shutdown successful.', {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })
        }

    }

    const powerOn = async () => {
        let success = true
        const raw = await fetch('https://nuclear.dacoder.io/reactors/start-reactor/' + id + '?apiKey=' + apiKey, {
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
            enqueueSnackbar(`Failed controlled shutdown for reactor ${id}: ${jsonResponse.message}`, {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })
        }

        if (success) {
            enqueueSnackbar('Powered On Successful.', {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })
        }

    }

    const toggleChange = async (value) => { // value -> 'on' or 'off'
        let success = true
        // update current state
        const raw = await fetch('https://nuclear.dacoder.io/reactors/coolant/' + id + '?apiKey=' + apiKey, {
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
            enqueueSnackbar(`coolant for reactor ${id}: ${jsonResponse.message}`, {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })
        }

        // notify user in snackbar
        if (success) {
            enqueueSnackbar(`coolant was successful.`, {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })
        }
    }

    const maintenance = async () => {
        const raw = await fetch('https://nuclear.dacoder.io/reactors/maintenance/' + id + '?apiKey=' + apiKey, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
    }

    const refuel = async () => {
        maintenance()
        let success = true
        const raw = await fetch('https://nuclear.dacoder.io/reactors/refuel/' + id + '?apiKey=' + apiKey, {
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
            enqueueSnackbar(`Failed Refuel for ${id}: ${jsonResponse.message}`, {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })
        }

        if (success) {
            enqueueSnackbar('Refuel Successful.', {
                preventDuplicate: false,
                style: {
                    width: '350px',
                    textAlign: 'left',
                },
            })
        }

    }

    const raiseRod = async () => {
        let success = true
        const raw = await fetch('https://nuclear.dacoder.io/reactors/raise-rod/' + id + '?apiKey=' + apiKey, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
    }

    const dropRod = async () => {
        let success = true
        const raw = await fetch('https://nuclear.dacoder.io/reactors/drop-rod/' + id + '?apiKey=' + apiKey, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
    }


    return (
        <div className="dataContainer" style={{ background: '#BFD7EA' }}>
            <Row className='backButton'><button className='buttonBack'><a className='link' href='/'><ArrowBackIcon /></a></button></Row>
            <div className="setPlantName">
                <Typography
                    variant='h5'
                    component='p'
                    color='text.primary'
                >
                    Set Reactor Name
                </Typography>
                <TextField
                    id='name'
                    value={name.name}
                    onChange={handleChange}
                    sx={{ border: '1px solid white', borderRadius: '4px' }}
                />
                {name.name !== '' && <Button variant='contained' onClick={handleClick}>Enter</Button>}
                <Button onClick={powerOn} variant="contained" color="success"><PowerSettingsNewIcon /></Button>{' '}
            </div>
            <h1 className='reactorText'>Name: {filtered[0].name}</h1>
            <h5 className='reactorText'>This Reactor is: <b>{reactorState.state}</b></h5>
            <Row>
                <Col lg={6} sm={12}>
                    <p className='reactorText'><b>Temperature:</b> <br /> {temp.temperature.amount.toPrecision(5)} {symbol}</p>
                </Col>
                <Col lg={6} sm={12}>
                    <p className='reactorText'><b>Status:</b> <br /> {temp.temperature.status}</p>
                </Col>
            </Row>
            <Row>
                <Col lg={6} sm={12}>
                    <p className='reactorText'><b>Coolant is</b> <br /> {coolant.coolant.toUpperCase()}</p>
                </Col>
                <Col lg={6} sm={12}>
                    <p className='reactorText'><b>Reactor's Output:</b> <br /> {output.output.amount.toPrecision(5)} {matches[1]}</p>
                </Col>
            </Row>
            <Row>
                <Col lg={6} sm={12}>
                    <p className='reactorText'><b>Rod State:</b> <br /> In: {rod.control_rods.in} Out: {rod.control_rods.out}</p>
                </Col>
                <Col lg={6} sm={12}>
                    <p className='reactorText'><b>Fuel Level:</b> <br /> {fuel.fuel.percentage.toPrecision(5)}%</p>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col lg={3} sm={12}>
                    <button onClick={refuel} className='reactorButton'>Refuel</button>
                </Col>
                <Col lg={3} sm={12}>
                        <button className='coolantButton' onClick={() => toggleChange('on')}>On</button>
                        <button className='coolantButton' onClick={() => toggleChange('off')}>Off</button>
                </Col>
                <Col lg={3} sm={12}>
                    <button onClick={controlledShutdown} className='reactorButton'>Controlled Shutdown</button>
                </Col>
                <Col lg={3} sm={12}>
                    <button onClick={emergencyShutdown} className='reactorButton' style={{ background: '#FF6663' }}>Emergency Shutdown</button>
                </Col>
            </Row>
            <Row>
                <Col lg={6} sm={12}>
                <button className='reactorButton' onClick={raiseRod}>Raise Rods</button>
                </Col>
                <Col lg={6} sm={12}>
                <button className='reactorButton' onClick={dropRod}>Drop Rods</button>
                </Col>
            </Row>
            
        </div>
    )
}

export default Reactor