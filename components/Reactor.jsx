import { useState } from 'react'
import { useParams } from 'react-router-dom'

const Reactor = () => {
    const { id } = useParams()

    return (
        <div>
            <p style={{color: 'black'}}>Reactor component: {id}</p>
        </div>
    )
}

export default Reactor