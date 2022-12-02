import { useState } from 'react'
import * as React from 'react';
import ReactorCard from './ReactorCard'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper' 

const Gallery = (props) => {


    return (
        <div className="gallery">
            {[...new Array(5)].map((_, index) => {
                return <ReactorCard key={index}/>
            })}
        </div>
    )
}

export default Gallery