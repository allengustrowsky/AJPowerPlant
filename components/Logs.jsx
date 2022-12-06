import { Card } from '@mui/material'
import { useEffect } from 'react'
import { useState } from 'react'


const Logs = (props) => {
    const { apiKey } = props
    const [logs, setLogs] = useState('')
    const [messages, setMessages] = useState('')

    useEffect(() => {
        // Get messages
        const getMessages = async () => {
            const raw = await fetch('https://nuclear.dacoder.io/reactors/logs?apiKey=' + apiKey)
            const jsonData = await raw.json()
            setLogs(jsonData)
        }
        getMessages()
    }, [])

    // Extract individual messages after logs have been retrieved
    useEffect(() => {
        if (logs !== '') {
            setMessages(logs.reduce((reactorMessages, reactorLog) => { // log object from list of logs
                for (const reactorId in reactorLog) { // id of reactor in log object
                    reactorLog[reactorId].forEach(message => { // record each message inside individual log object
                        reactorMessages.push(message)
                    })
                }
                return reactorMessages
            }, []))
        }
    }, [logs])  

    return (
        <Card className='logsContainer' sx={{width: '40rem', height: '20rem', backgroundColor: 'var(--dark-blue)', color: 'var(--white)'}}>
            {messages === '' ? 'Loading...' : messages.map(message => {
                return <p>{message}</p>
            })
    }
        </Card>
    )
}

export default Logs