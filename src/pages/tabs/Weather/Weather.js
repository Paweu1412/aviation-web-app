import { useState, useEffect } from 'react';
import { Input, Button, Alert, IconButton } from '@mui/joy';
import { Warning, Close } from '@mui/icons-material';
import { checkIcaoCodeSyntaxValidity } from '../../../utils/Utils';
import Information from '../../../components/Information/Information';

import canLandIcon from '../../../assets/canLandIcon.png';
import cannotLandIcon from '../../../assets/cannotLandIcon.png';
import needBeSureLandIcon from '../../../assets/needbesureLandIcon.png';

import './Weather.scss';

var AIRPORTDB_API_TOKEN = '184cc8be655c6fa1977310ede1c55100174968096e013fe33eca7ee09582dc81dc31e9e95ea8c748bccf54041210a0b3';
var CHECKWX_API_TOKEN = '3d20b0627efc425f8d12dc5544';

const Weather = () => {
  const [icaoCode, setIcaoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [alert, setAlert] = useState('');

  const [airportData, setAirportData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [dataCollected, setDataCollected] = useState(0);

  useEffect(() => {
    if (dataCollected === 2) {
      setLoading(false);
    }
  }, [dataCollected])

  useEffect(() => {
    if (alert !== '') {
      const timer = setTimeout(() => {
        setAlert('');
      }, 3000);

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
    if (cooldown) {
      return sendAlert('Please wait for cooldown (3 seconds)');
    }

    if (!checkIcaoCodeSyntaxValidity(icaoCode)) {
      return sendAlert('The entered ICAO code is incorrect');
    }

    setAirportData([]);
    setWeatherData([]);
    setDataCollected(0);

    setLoading(true);
    setCooldown(true);

    setTimeout(() => {
      setCooldown(false);
    }, 3000);

    await fetch(`https://airportdb.io/api/v1/airport/${icaoCode}?apiToken=${AIRPORTDB_API_TOKEN}`)
      .then(res => res.json())
      .then(res => {
        if (res.statusCode === 404) {
          setLoading(false);
          return sendAlert('No airport in database');
        }

        setAirportData(res);
        setDataCollected(prevDataCollected => prevDataCollected + 1);
      })


    await fetch(`https://api.checkwx.com/metar/${icaoCode}/decoded?x-api-key=${CHECKWX_API_TOKEN}`)
      .then(res => res.json())
      .then(res => {
        if (res.results === 0 || res.statusCode === 404) {
          setLoading(false);
          return sendAlert('No airport in database')
        }

        setWeatherData(res.data[0]);
        setDataCollected(prevDataCollected => prevDataCollected + 1);
      })
      .catch(err => {
        return sendAlert('No airport in database')
      })
  }

  return (
    <div className="Weather">
      <div className="upper">
        <span>Enter the ICAO number to get airport weather and runways available for use.</span>
      </div>

      <div className="main">
        <Input
          placeholder="ICAO"
          variant="outlined"
          color="neutral"
          className="input"
          onInput={(e) => e.target.value = ("" + e.target.value).toUpperCase()}
          onChange={(e) => {
            if (e.target.value.length > 4) {
              e.target.value = e.target.value.slice(0, 4);
            }

            setIcaoCode(e.target.value);
          }}
          onPaste={(e) => {
            const pastedValue = e.clipboardData.getData('text/plain').slice(0, 4);
            setIcaoCode(pastedValue.toUpperCase());
          }}
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

      {dataCollected !== 2 &&
        <div className="instruction">
          <span>Before you choose an airport 👇</span>

          <div className="explanations">
            <div className="explanation">
              <img src={canLandIcon} alt="can land" />
              <p>• Runway is available for use</p>
            </div>

            <div className="explanation">
              <img src={needBeSureLandIcon} alt="need be sure land" />
              <p>• Runway may be available for use, but you need to make sure</p>
            </div>

            <div className="explanation">
              <img src={cannotLandIcon} alt="cannot land" />
              <p>• Runway is not available for use</p>
            </div>

            <div className="explanation">
              <p className="warning"><b>This tool has been created for virtual aviation only. It should not be used in real flying.</b></p>
            </div>
          </div>
        </div>
      }


      <div className="lower">
        {dataCollected === 2 && <Information airportData={airportData} weatherData={weatherData} />}
      </div>

      <div className="alert">
        {alert !== '' && alert}
      </div>
    </div>
  )
}

export default Weather;