import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import '../src/App.css'

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

    if(!data) return <p>Loading</p>
    
    const filtered = data.reactors.filter(obj => {
        return obj.id === id
    })
    
    const symbol = temp.temperature.unit.charAt(0).toUpperCase()

    let regExp = /\(([^)]+)\)/;
    let matches = regExp.exec(output.output.unit)

    return (
        <div className="dataContainer" style={{background: '#BFD7EA'}}>
            <p style={{color: 'black'}}>Reactor component: {id}</p>
            <p>Name: {filtered[0].name}</p>
            <p>{temp.temperature.amount} {symbol}</p>
            <p>{temp.temperature.status}</p>
            <p>{coolant.coolant}</p>
            <p>{output.output.amount} {matches[1]}</p>
            <p>In: {rod.control_rods.in} Out: {rod.control_rods.out}</p>
        </div>
    )
}

export default Reactor