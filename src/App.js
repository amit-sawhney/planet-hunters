import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Divider, Drawer } from '@material-ui/core';
import { Bar } from 'react-chartjs-2';
import noPlanet from './assets/noplanet.jpg'
import planet from './assets/planet.jpg'

const drawerWidth = 340;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#475C7A'
  },
  drawerContent: {
    color: 'white',
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
    textAlign: 'center',
    padding: '5px'
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
  },
  generateDataBtn: {
    backgroundColor: '#5395F8',
    color: 'white',
    padding: "0 24px 0 24px",
    marginTop: '10px',
    height: '38px',
    width: 'auto',
    fontSize: '12px',
    fontWeight: 'bold',
    transition: "all 0.2s",
    borderRadius: "2px",
    boxShadow: "0 2px 5px 0 rgba(0,0,0,.15)",
    "&:hover": {
      backgroundColor: '#84b3fa'
    }
  },
  chart: {
    width: '70%',
    margin: 'auto'
  },
  predictPlanet: {
    textAlign: 'center'
  }
}));

const App = () => {
  const classes = useStyles();

  const [values, setValues] = useState([]);
  const [labels, setLabels] = useState([]);
  const [isPlanet, setIsPlanet] = useState(true);

  useEffect(() => {
    fetch("/light-flux-values").then(res => res.json()).then(data => setValues(data.values));

    fetch("/light-flux-labels").then(res => res.json()).then(data => setLabels(data.labels));
  }, []);

  const generateValues = () => {
    fetch("/light-flux-values").then(res => res.json()).then(data => setValues(data.values));

    fetch('/predict-values', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ values: values })
    }).then(res => res.json()).then(data => {
      setIsPlanet(data.predict)
    });
  }

  const state = {
    labels: labels,
    datasets: [
      {
        backgroundColor: 'rgba(75,192,192,1)',
        data: values
      }
    ]
  }

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.drawerContent}>
          <h1>Planet Hunters</h1>
          <p>This is Group 27's dashboard that visualizes the data and prediction of exoplanets through a developed neural network.</p>
          <p>This project utilized AWS SageMaker and S3 Buckets to store exoplanet training data, test data, and the development of the models.</p>
          <p>Over the course of this year, we learned to utilize various features of AWS, tensorflow, and various packages such as pandas and sklearn</p>
          <Divider style={{ background: 'white', marginTop: '25px', padding: '2px' }} />
          <h1>Generating the Data</h1>
          <p>This web app utilizes a traditional Tech Stack of React JS and Flask. The Backend is responsible for randomly generating 1598
          test values, communicating these values to the front end, and storing the model that is used to predict
            whether an exoplanet exists or not.</p>
          <Divider style={{ background: 'white', marginTop: '25px', padding: '2px' }} />
          <h1>Try it out!</h1>
          <p>Press the button below to generate a new set of data and see if you get lucky enought to find an arbitray exoplanet</p>
          <div className="generateValues">

            <Button onClick={generateValues} className={classes.generateDataBtn}>Generate Data</Button>
          </div>
        </div>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.chart}>
          <Bar
            data={state}
            options={{
              title: {
                display: true,
                text: 'Exoplanet data',
                fontSize: 50,
              },
              responsive: true,
              maintainAspectRatio: true,
              legend: {
                display: false,
              }
            }}
          />
        </div>

        {isPlanet ? (
          <div className={classes.predictPlanet}>
            <h2>Congrats! You found an exoplanet!!!</h2>
            <img alt="planet" src={planet} width="300px" />
          </div>
        ) : (
            <div className={classes.predictPlanet}>
              <h2>Hm...there doesn't appear to be anything there!</h2>
              <img alt="no planet" src={noPlanet} width="400px" />
            </div>
          )}
      </main>
    </div>
  );
}

export default App;


