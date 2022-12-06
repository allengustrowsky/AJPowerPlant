import { Card, Typography, Button } from '@mui/material'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSnackbar } from 'notistack'

const Logs = (props) => {
    const { apiKey } = props
    const [logs, setLogs] = useState('')
    const [messages, setMessages] = useState('')
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleClick = () => {
        console.log('handleClick')
        enqueueSnackbar('my snackbar')
    }

    useEffect(() => {
        // Get messages
        const getMessages = async () => {
            const raw = await fetch('https://nuclear.dacoder.io/reactors/logs?apiKey=' + apiKey)
            const jsonData = await raw.json()
            setLogs(jsonData)
        }
        getMessages()
    }, [])

    const getMessages = () => {
        if (logs !== '') {
            const msgs = logs.reduce((reactorMessages, reactorLog) => { // log object from list of logs
                for (const reactorId in reactorLog) { // id of reactor in log object
                    reactorLog[reactorId].forEach(message => { // record each message inside individual log object
                        reactorMessages.push(message)
                    })
                }
                console.log('reduce')
                return reactorMessages
            }, [])
            if (msgs !== messages) {
                console.log('new messages!')
                console.log('old: ' + messages)
                console.log('new: ' + msgs)
                setMessages(msgs)
                // Update snackbar
                msgs.forEach(message => {
                    enqueueSnackbar(message, { 
                        action, 
                        persist: true, 
                        preventDuplicate: true,
                        style: {
                            width: '350px',
                            textAlign: 'left',
                        },
                    })
                })

            } else {
                console.log('same old msgs')
            }

        }
    }

    // Extract individual messages after logs have been retrieved
    useEffect(() => {
        // const fetchMessages
        getMessages()
        // const msgIntervalId = setInterval(getMessages, 10000)

        // delete interval to prevent memory leak on component unmount
        // return () => {
            // clearInterval(msgIntervalId)
        // }

    }, [logs])  

    // Dismiss snackbars
    const action = (snackbarId) => (
        <>
            <Button onClick={() => closeSnackbar(snackbarId)} sx={{float: 'right', display: 'inline-block'}}>Dismiss</Button>
        </>
    )

    return (
        <Card className='logsContainer' sx={{width: '40rem', height: '20rem', backgroundColor: 'var(--dark-blue)', color: 'var(--white)', overflow: 'scroll'}}>
            <Button onClick={handleClick}>Click me</Button>
            <Typography variant='h4' component='h2'>Reactor Logs</Typography>
            {messages === '' ? 'Loading...' : messages.map(message => {
                console.log('rerender')
                return <Card className='message'>{message}</Card>
            })
    }
        </Card>
    )
}

export default Logs