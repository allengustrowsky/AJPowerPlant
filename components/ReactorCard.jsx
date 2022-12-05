import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material'
import reactorImage from '../src/assets/reactor.png'
// import { redirect } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const ReactorCart = (props) => {
    const { id, name } = props
    const navigate = useNavigate()

    const handleRoute = () => {
        console.log('handleRoute')
        navigate(`/${id}`)
    }

    return (
        <Card sx={{ minWidth: 275 }}>
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
                {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom> */}
                {/* Word of the Day */}
                {/* </Typography> */}
                
                {/* <Typography sx={{ mb: 1.5 }} color="text.secondary"> */}
                {/* adjective */}
                {/* </Typography> */}
                {/* <Typography variant="body2"> */}
                {/* well meaning and kindly. */}
                {/* <br /> */}
                {/* {'"a benevolent smile"'} */}
                {/* </Typography> */}
            </CardContent>
            <CardActions>
                <div onClick={handleRoute}>
                    <Button size="small" sx={{color: 'var(--dark-blue)'}}>View Data</Button>
                </div>
            </CardActions>
        </Card>
    )
}

export default ReactorCart