import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import '../src/App.css'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Button } from '@mui/material';

const Reactor = () => {
    const { id } = useParams()
    const [data, setData] = useState('')
    const [temp, setTemp] = useState('')
    const [coolant, setCoolant] = useState('')
    const [output, setOutput] = useState('')
    const [rod, setRod] = useState('')

    const apiKey = 'ccb430c9775bba27'

    useEffect(() => {
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

            setData(jsonData)
            setTemp(tempData)
            setCoolant(coolantData)
            setOutput(outputData)
            setRod(rodData)
        }
        getData()
    }, [])

    if (!data) return <p>Loading</p>

    const filtered = data.reactors.filter(obj => {
        return obj.id === id
    })

    const symbol = temp.temperature.unit.charAt(0).toUpperCase()

    let regExp = /\(([^)]+)\)/;
    let matches = regExp.exec(output.output.unit)

    return (
        <div className="dataContainer" style={{ background: '#BFD7EA' }}>
            <h1 className='reactorText'>Name: {filtered[0].name}</h1>
            <h5 className='reactorText'>This Reactor is: <b>Online</b></h5>
            <Row>
                <Col lg={6} sm={12}>
                    <p className='reactorText'><b>Temperature:</b> <br /> {temp.temperature.amount} {symbol}</p>
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
                    <p className='reactorText'><b>Reactor's Output:</b> <br /> {output.output.amount} {matches[1]}</p>
                </Col>
            </Row>
            <p className='reactorText'><b>Rod State:</b> <br /> In: {rod.control_rods.in} Out: {rod.control_rods.out}</p>
            <hr />
            <Row>
                <Col lg={3} sm={12}>
                    <button className='reactorButton'>Refuel</button>
                </Col>
                <Col lg={3} sm={12}>
                    <button className='reactorButton'>Toggle Coolant</button>
                </Col>
                <Col lg={3} sm={12}>
                    <button className='reactorButton'>Controlled Shutdown</button>
                </Col>
                <Col lg={3} sm={12}>
                    <button className='reactorButton' style={{background: '#FF6663'}}>Emergency Shutdown</button>
                </Col>
            </Row>
        </div>
    )
}

export default Reactor