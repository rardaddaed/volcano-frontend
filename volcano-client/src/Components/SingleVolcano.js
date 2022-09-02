import React from 'react'
import { useEffect, useState } from 'react';
import { Map, Marker } from "pigeon-maps"
import { useParams } from 'react-router-dom'
import Grid from '@mui/material/Grid';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function SingleVolcano() {

  const [rowData, setRowData] = useState(null);

  const { id } = useParams();
  const url = `http://sefdb02.qut.edu.au:3001/volcano/${id}`;

  const [hue, setHue] = useState(0)
  const markerColor = `hsl(${hue % 360}deg 100% 70%)`

  // If logged in, JWT token is parsed in the header
  const token = localStorage.getItem("token");
  const headers = {
    "accept": 'application/json',
    "Content-Type": 'application/json'
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Fetches a single volcano's data
  useEffect(() => {
    fetch(url, { headers })
      .then(res => res.json())
      .then(data => {
        setRowData(data)
      })
  }, [url]);

  // If data exists and user is logged in, population density bar chart is created
  const BarChart = () => {
    if (rowData) {
      if (token) {
        const chartState = {
          labels: ['Population_5km', 'Population_10km', 'Population_30km', 'Population_100km'],
          datasets: [
            {
              label: 'Poplulation Density',
              data: [rowData.population_5km, rowData.population_10km, rowData.population_30km, rowData.population_100km],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)'
              ],
              borderWidth: 2
            }
          ]
        };

        return (
          <Bar
            data={chartState}
            options={{
              title: {
                display: true,
                fontSize: 20
              },
              legend: {
                display: true,
                position: 'right'
              }
            }}
          />
        )
      }
    }

    return <></>
  }

  // Return volcano info, location map and population density bar chart
  const Content = () => {
    return (
      <>{rowData && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h1>{rowData.name}</h1>
          </Grid>
          <Grid item xs={3}>
            Country: {rowData.country}
          </Grid>
          <Grid item xs={3}>
            Region: {rowData.region}
          </Grid>
          <Grid item xs={3}>
            Subregion: {rowData.subregion}
          </Grid>
          <Grid item xs={3}>
            Last Eruption: {rowData.last_eruption}
          </Grid>
          <Grid item xs={3}>
            Summit: {rowData.summit} m
          </Grid>
          <Grid item xs={3}>
            Elevation: {rowData.elevation} ft
          </Grid>
          <Grid item xs={3}>
            Latitude: {rowData.latitude}
          </Grid>
          <Grid item xs={3}>
            Longitude: {rowData.longitude}
          </Grid>

          <Grid item xs={12}>
            <Map
              height={300}
              defaultCenter={[parseFloat(rowData.latitude), parseFloat(rowData.longitude)]}
              defaultZoom={4}
            >
              <Marker
                width={50}
                anchor={[parseFloat(rowData.latitude), parseFloat(rowData.longitude)]}
                color={markerColor}
                onClick={() => setHue(hue)}
              />
            </Map>
          </Grid>
          <BarChart />
        </Grid>)}
      </>
    )
  }

  return (
    <Content />
  )
}

export default SingleVolcano