import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material'
import reactorImage from '../src/assets/reactor.png'
import { useNavigate } from 'react-router-dom'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import HeatPumpIcon from '@mui/icons-material/HeatPump';
import UpdateIcon from '@mui/icons-material/Update';

const ReactorCart = (props) => {
    const { id, name, temperature, unit, state, status } = props
    const navigate = useNavigate()

    const handleRoute = () => {
        console.log('handleRoute')
        navigate(`/${id}`)
    }

    return (
        <Card className='reactorCard' sx={{ minWidth: 275, backgroundColor: 'var(--light-blue)' }}>
            <CardMedia
                component="img"
                height="140"
                image={reactorImage}
                alt="nuclear reactor"
            />
            <CardContent>
                <Typography variant="h5" component="div">
                    {name}
                </Typography>
                <div className="dataRow rowFirst">
                    <Typography><UpdateIcon />{state}</Typography>
                </div>

                <div className="dataRow">
                    <Typography><DeviceThermostatIcon />{temperature.toPrecision(5)} &deg;{unit[0].toUpperCase()}</Typography>
                    <Typography><HeatPumpIcon />{status}</Typography>
                </div>
            </CardContent>
            <CardActions>
                <div onClick={handleRoute}>
                    <Button size="small" variant='outlined' sx={{color: 'var(--dark-blue)'}}>View Data</Button>
                </div>
            </CardActions>
        </Card>
    )
}

export default ReactorCart