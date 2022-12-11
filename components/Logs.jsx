import { Card, Typography, Button } from '@mui/material'
import { useEffect } from 'react'
import { useState } from 'react'

const Logs = (props) => {
    const { apiKey, enqueueSnackbar, closeSnackbar, action } = props
    const [logs, setLogs] = useState('')
    const [messages, setMessages] = useState('')

    const handleClick = () => {
        console.log('handleClick')
        enqueueSnackbar('my snackbar')
    }

    const getLogs = async () => {
        const raw = await fetch('https://nuclear.dacoder.io/reactors/logs?apiKey=' + apiKey)
        const jsonData = await raw.json()
        setLogs(jsonData)
        const msgs = jsonData.reduce((reactorMessages, reactorLog) => { // log object from list of logs
            for (const reactorId in reactorLog) { // id of reactor in log object
                reactorLog[reactorId].forEach(message => { // record each message inside individual log object
                    reactorMessages.push(message)
                })
            }
            return reactorMessages
        }, [])
        setMessages(msgs)
    }

    useEffect(() => {
        // Get messages
        getLogs()
        const id = setInterval(getLogs, 200)

        return () => {
            clearInterval(id)
        }
    }, [])

    // const getMessages = () => {
    //     if (logs !== '') {
    //         const msgs = logs.reduce((reactorMessages, reactorLog) => { // log object from list of logs
    //             for (const reactorId in reactorLog) { // id of reactor in log object
    //                 reactorLog[reactorId].forEach(message => { // record each message inside individual log object
    //                     reactorMessages.push(message)
    //                 })
    //             }
    //             console.log('reduce')
    //             return reactorMessages
    //         }, [])
    //         if (msgs !== messages) {
    //             console.log('new messages!')
    //             console.log('old: ' + messages)
    //             console.log('new: ' + msgs)
    //             setMessages(msgs)
    //             // Update snackbar
    //             // msgs.forEach(message => {
    //             //     enqueueSnackbar(message, { 
    //             //         action, 
    //             //         persist: true, 
    //             //         preventDuplicate: true,
    //             //         style: {
    //             //             width: '350px',
    //             //             textAlign: 'left',
    //             //         },
    //             //     })
    //             // })

    //         } else {
    //             console.log('same old msgs')
    //         }

    //     }
    // }

    // Extract individual messages after logs have been retrieved
    // useEffect(() => {
        // const fetchMessages
        // getMessages()
        // const msgIntervalId = setInterval(getMessages, 10000)

        // delete interval to prevent memory leak on component unmount
        // return () => {
            // clearInterval(msgIntervalId)
        // }

    // }, [logs])  

    return (
        <Card className='logsContainer' sx={{width: '40rem', height: '20rem', overflow: 'scroll'}}>
            <Typography variant='h4' component='h2'>System Logs</Typography>
            {messages === '' ? 'Loading...' : messages.map((message, index) => {
                return <Typography key={index} variant='subtitle1' component='p'>{message}</Typography>
            })
    }
        </Card>
    )
}

export default Logs