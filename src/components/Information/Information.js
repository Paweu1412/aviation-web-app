import React from 'react';

import needBeSureLandIcon from '../../assets/needbesureLandIcon.png';
import canLandIcon from '../../assets/canLandIcon.png';
import cannotLandIcon from '../../assets/cannotLandIcon.png';

import './Information.scss';

const Information = (query) => {
  const airportData = query.airportData;
  const weatherData = query.weatherData;

  const getRunwaysWeather = (weatherData, airportData) => {
    const toRad = (degrees) => {
      const pi = Math.PI;
    
      return degrees * (pi / 180);
    }
  
    const windDirection = weatherData.wind ? weatherData.wind.degrees : 0;
  
    // if (windDirection === 0) { return null; }
  
    const windSpeed = weatherData.wind ? weatherData.wind.speed_kts : 0;
  
    // if (windSpeed === 0) { return null; }
  
    const result = {};
  
    for (const runway of airportData.runways) {
        const he_heading = runway.he_heading_degT - 180;
  
        const le_heading = runway.he_heading_degT;
  
        const he_headtailwind = Math.round(windSpeed * Math.cos(toRad(windDirection - he_heading)) * 100)/100;
  
        const he_crosswind = Math.round(windSpeed * Math.sin(toRad(windDirection - he_heading)) * 100)/100;
  
        const he_crosswind_side = he_crosswind > 0 ? "left" : "right";
  
        // const he_status = he_headtailwind > 0 ? "tailwind" : Math.abs(he_crosswind) > Math.abs(he_headtailwind) ? "crosswind" : "headwind";
  
        const he_status = {
            "headtailwind": he_headtailwind,
            "crosswind": Math.abs(he_crosswind),
            "mainWind": he_headtailwind > 0 ? "tailwind" : Math.abs(he_crosswind) > Math.abs(he_headtailwind) ? "crosswind" : "headwind"
        }
        
        const le_headtailwind = Math.round(windSpeed * Math.cos(toRad(windDirection - le_heading)));
  
        const le_crosswind = Math.round(windSpeed * Math.sin(toRad(windDirection - le_heading)) * 100)/100;
  
        const le_crosswind_side = le_crosswind < 0 ? "right" : "left";
  
        // const le_status = le_headtailwind > 0 ? "tailwind" : Math.abs(le_crosswind) > Math.abs(le_headtailwind) ? "crosswind" : "headwind";
  
        const le_status = {
            "headtailwind": he_headtailwind,
            "crosswind": Math.abs(he_crosswind),
            "mainWind": le_headtailwind > 0 ? "tailwind" : Math.abs(le_crosswind) > Math.abs(le_headtailwind) ? "crosswind" : "headwind"
        }
  
        result[runway.le_ident] = {
            status: le_status,
            crosswind: Math.abs(le_crosswind),
            crosswindSide: le_crosswind_side,
            headtailwind: le_headtailwind,
            headtailwindType: le_headtailwind > 0 ? "tailwind" : "headwind",
        };
  
        result[runway.he_ident] = {
            status: he_status,
            crosswind: Math.abs(he_crosswind),
            crosswindSide: he_crosswind_side,
            headtailwind: he_headtailwind,
            headtailwindType: he_headtailwind > 0 ? "tailwind" : "headwind",
        };
    }
  
    return result;
  }

  const getCloudsInformation = () => {
    if (!weatherData.clouds) { return 'n/a' }

    let callbackInformation = '';

    for (let i = 0; i < weatherData.clouds.length; i++) {
        let returnString = '';

        if (weatherData.clouds[i]) {
            if (weatherData.clouds[i].code && weatherData.clouds[i].feet) {
                returnString = `${weatherData.clouds[i].code} / ${weatherData.clouds[i].feet}ft`;
            }

            if (weatherData.clouds[i].code && (!weatherData.clouds[i].feet)) {
                returnString = `${weatherData.clouds[i].code} / -`;
            }

            if ((!weatherData.clouds[i].code) && weatherData.clouds[i].feet) {
                returnString = `- / ${weatherData.clouds[i].feet}`;
            }
        }

        callbackInformation += `${returnString}\n`
    }

    return callbackInformation !== '' ? callbackInformation : 'n/a';
  }

  const runwaysInfo = getRunwaysWeather(weatherData, airportData);

  return (
    <div className="information">
      <div className="header">
        <span>{airportData.name}</span>
      </div>

      <div className="airport">
        <div className="airport__left">
          <b>IATA..</b> {airportData.iata_code ? airportData.iata_code : 'n/a'}
        </div> 

        <div className="airport__center">
          <b>Elevation..</b> {airportData.elevation_ft ? `${airportData.elevation_ft}ft` : 'n/a'}
        </div>

        <div className="airport__right">
          <b>Runways..</b> {airportData.runways ? (airportData.runways.length * 2) : 'n/a'}
        </div>
      </div>

      <div className="weather">
        <div className="weather__upper">
          <b>{weatherData.raw_text ? weatherData.raw_text : 'n/a'}</b>
        </div>

        <div className="weather__lower">
          <div className="element">
            <b>Pressure..</b><br></br> {weatherData.barometer ? `${weatherData.barometer.hpa}hPa` : 'n/a'}
          </div> 

          <div className="element">
            <b>Humidity..</b><br></br> {weatherData.humidity ? `${weatherData.humidity.percent}%` : 'n/a'}
          </div>

          <div className="element">
            <b>Temperature..</b><br></br> {weatherData.temperature ? `${weatherData.temperature.celsius}*C` : 'n/a'}
          </div>

          <div className="element">
            <b>Dew point..</b><br></br> {weatherData.dewpoint ? `${weatherData.dewpoint.celsius}*C` : 'n/a'}
          </div> 

          <div className="element">
            <b>Visibility..</b><br></br> {weatherData.visibility ? `${weatherData.visibility.meters} m` : 'n/a'}
          </div>

          <div className="element">
            <b>Wind..</b><br/>
            {weatherData.wind ? (
              weatherData.wind.degrees === 0 ? (
                `VRB / ${weatherData.wind.speed_kts}kts`
              ) : (
                `${weatherData.wind.degrees}* / ${weatherData.wind.speed_kts}kts`
              )
            ) : (
              'n/a'
            )}
          </div>

          <div className="element">
            <b>Flight category..</b><br></br> {weatherData.flight_category ? weatherData.flight_category : 'n/a'}
          </div>

          <div className="element">
            <b>Clouds..</b><br></br> {getCloudsInformation()}
          </div>

          <div className="element">
            <b>Observed..</b><br></br> {weatherData.observed ? weatherData.observed : 'n/a'}
          </div>
        </div>
      </div>

      <div className="runways">
          {airportData.runways.map((runway, index) => {
            const leKey = `runway-${runway.le_ident}`;
            const heKey = `runway-${runway.he_ident}`;

            const getRunwayAvailabilityStatus = (runway) => {
              if (runwaysInfo[runway].status.mainWind === 'headwind') {
                return (
                  <div className="runway__status">
                    <img src={canLandIcon} alt="can land" />
                  </div>
                );
              }

              if (runwaysInfo[runway].status.mainWind === 'crosswind') {
                if (runwaysInfo[runway].crosswind <= 10) {
                  return (
                    <div className="runway__status">
                      <img src={canLandIcon} alt="can land" />
                    </div>
                  );
                }

                return (
                  <div className="runway__status">
                    <img src={needBeSureLandIcon} alt="can land" />
                  </div>
                );
              }

              if (runwaysInfo[runway].status.mainWind === 'tailwind') {
                if (runwaysInfo[runway].headtailwind <= 5) {
                  return (
                    <div className="runway__status">
                      <img src={needBeSureLandIcon} alt="need be sure to land" />
                    </div>
                  );
                }

                return (
                    <div className="runway__status">
                      <img src={cannotLandIcon} alt="cannot land" />
                    </div>
                  );
              }

              return null;
            }

            const getRunwayWinds = (runway) => {
              let crosswindSide = `from the ${runwaysInfo[runway].crosswindSide}`;

              let results = {
                "headwind": Math.round(runwaysInfo[runway].headtailwind) < 0 ? `${Math.round(Math.abs(runwaysInfo[runway].headtailwind))}kts` : undefined,
                "tailwind": Math.round(runwaysInfo[runway].headtailwind) > 0 ? `${Math.round(Math.abs(runwaysInfo[runway].headtailwind))}kts` : undefined,
                "crosswind": Math.round(runwaysInfo[runway].crosswind) > 0 ? `${Math.round(Math.abs(runwaysInfo[runway].crosswind))}kts ${crosswindSide}` : undefined
              };

              let callback = '';

              if (results.headwind) {
                callback += `\n• Headwind ${results.headwind}`
              }

              if (results.tailwind) {
                callback += `\n• Tailwind ${results.tailwind}`
              }

              if (results.crosswind) {
                callback += `\n• Crosswind ${results.crosswind}`
              }

              return callback;
            }

            return (
              <React.Fragment key={leKey + heKey}>
                <div className="runway" key={leKey}>
                  <span><b>RWY {runway.le_ident}</b> {getRunwayAvailabilityStatus(runway.le_ident)}</span>
                  <p>Winds:{getRunwayWinds(runway.le_ident)}<br></br><br></br></p>
                  <p>Elevation: {runway.le_elevation_ft ? `${runway.le_elevation_ft}ft` : 'n/a'}</p>
                  <p>ILS/LOC: {runway.le_ils !== undefined ? `${runway.le_ils.freq}ft / ${runway.le_ils.course}*` : 'n/a'}</p>
                </div>

                <div className="runway" key={heKey}>
                  <span><b>RWY {runway.he_ident}</b> {getRunwayAvailabilityStatus(runway.he_ident)}</span>
                  <p>Winds:{getRunwayWinds(runway.he_ident)}<br></br><br></br></p>
                  <p>Elevation: {runway.he_elevation_ft ? `${runway.he_elevation_ft}ft` : 'n/a'}</p>
                  <p>ILS/LOC: {runway.he_ils !== undefined ? `${runway.he_ils.freq}ft / ${runway.he_ils.course}*` : 'n/a'}</p>
                </div>
              </React.Fragment>
            )
        })}
      </div>
    </div>
  )
}

export default Information;