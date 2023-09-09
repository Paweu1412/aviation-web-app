import { Input, Button, Alert, IconButton } from '@mui/joy';
import { Warning, Close } from '@mui/icons-material';
import { useState, useEffect } from 'react';

import { checkIcaoCodeSyntaxValidity } from '../../../utils/Utils';

import './Weather.scss';

var AIRPORTDB_API_TOKEN = '184cc8be655c6fa1977310ede1c55100174968096e013fe33eca7ee09582dc81dc31e9e95ea8c748bccf54041210a0b3';
var CHECKWX_API_TOKEN = '3d20b0627efc425f8d12dc5544';

const Weather = () => {
  const [icaoCode, setIcaoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [alert, setAlert] = useState('');

  const [airportInfo, setAirportInfo] = useState([]);
  const [weatherInfo, setWeatherInfo] = useState([]);
  const [dataCollected, setDataCollected] = useState(0);

  useEffect(() => {
    if (dataCollected === 2) {
      console.log('Got it!');
    }
  }, [dataCollected])

  useEffect(() => {
    if (airportInfo.length !== 0) {
      console.log(airportInfo);
    }
  }, [airportInfo]);

  useEffect(() => {
    if (weatherInfo.length !== 0) {
      console.log(weatherInfo);
    }
  }, [weatherInfo]);
  
  useEffect(() => {
    if (alert !== '') {
      const timer = setTimeout(() => {
        setAlert('');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const sendAlert = (message) => {
    setAlert(
      <Alert
        variant="soft"
        color="primary"
        startDecorator={<Warning />}
        endDecorator={
          <IconButton 
            variant="plain" 
            size="sm" 
            color="neutral"
            onClick={() => setAlert('')}
          >
            <Close />
          </IconButton>
        }
      >
        {message}
      </Alert>
    )
  }

  const fetchWeatherData = async () => {
    if (!checkIcaoCodeSyntaxValidity(icaoCode)) {
      return sendAlert('The entered ICAO code is incorrect');
    }

    if (cooldown) {
      return sendAlert('Please wait for cooldown (5 seconds)');
    }

    setLoading(true);
    setCooldown(true);

    setTimeout(() => {
      setCooldown(false);
    }, 5000);

    await fetch(`https://airportdb.io/api/v1/airport/${icaoCode}?apiToken=${AIRPORTDB_API_TOKEN}`)
      .then(res => res.json())
      .then(res => {
        if (res.statusCode === 404) {
          setLoading(false);
          return sendAlert('No airport in our database');
        }

        setAirportInfo(res);
        setDataCollected(prevDataCollected => prevDataCollected + 1);
      })
    

    await fetch(`https://api.checkwx.com/metar/${icaoCode}/decoded?x-api-key=${CHECKWX_API_TOKEN}`)
      .then(res => res.json())
      .then(res => {
        if (res.results === 0 || res.statusCode === 404) {
          setLoading(false);
          return sendAlert('No airport in our database')
        }

        setWeatherInfo(res.data[0]);
        setDataCollected(prevDataCollected => prevDataCollected + 1);
      })
      .catch(err => {
        return sendAlert('No airport in our database')
      })
  }

  return (
    <div className="Weather">
      <div className="upper">
        <span>Enter the ICAO airport to get airport weather and runways available for use.</span>
      </div>

      <div className="main">
        <Input
          placeholder="ICAO"
          variant="outlined"
          color="neutral"
          className="input"
          onChange={(e) => setIcaoCode(e.target.value)}
          onPaste={(e) => setIcaoCode(e.target.value)}
        />

        {loading ? 
          <Button loading
            style={{ backgroundColor: '#0b6bcb' }}
            color="primary"
            className="button"
          ></Button>
          :
          <Button
            color="primary"
            onClick={() => fetchWeatherData()}
            variant="solid"
            className="button"
          >
            CHECK
          </Button>
        }
      </div>

      <div className="lower">
        
      </div>

      <div className="footer">
        {alert !== '' && alert}
      </div>
    </div> 
  )
}

export default Weather;