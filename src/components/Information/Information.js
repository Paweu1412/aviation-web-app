import getRunwaysWeather from '../../utils/Utils';
import needBeSureLandIcon from '../../assets/needbesureLandIcon.png';
import canLandIcon from '../../assets/canLandIcon.png';
import cannotLandIcon from '../../assets/cannotLandIcon.png';

import './Information.scss';

const Information = (query) => {
  const airportData = query.airportData;
  const weatherData = query.weatherData;

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
            <b>Temperature..</b><br></br> {weatherData.temperature ? `${weatherData.temperature.celsius}°C` : 'n/a'}
          </div>

          <div className="element">
            <b>Dew point..</b><br></br> {weatherData.dewpoint ? `${weatherData.dewpoint.celsius}°C` : 'n/a'}
          </div> 

          <div className="element">
            <b>Visibility..</b><br></br> {weatherData.visibility ? `${weatherData.visibility.meters} m` : 'n/a'}
          </div>

          <div className="element">
            <b>Wind..</b><br></br> {weatherData.wind ? `${weatherData.wind.degrees}° / ${weatherData.wind.speed_kts}kts` : 'n/a'}
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
              <>
                <div className="runway" key={`runway-${runway.le_ident}`}>
                  <span><b>RWY {runway.le_ident}</b> {getRunwayAvailabilityStatus(runway.le_ident)}</span>
                  <p>Winds:{getRunwayWinds(runway.le_ident)}<br></br><br></br></p>
                  <p>Elevation: {runway.le_elevation_ft ? `${runway.le_elevation_ft}ft` : 'n/a'}</p>
                  <p>ILS: {runway.le_ils !== undefined ? `${runway.le_ils.freq}ft / ${runway.le_ils.course}°` : 'n/a'}</p>
                </div>

                <div className="runway" key={`runway-${runway.he_ident}`}>
                  <span><b>RWY {runway.he_ident}</b> {getRunwayAvailabilityStatus(runway.he_ident)}</span>
                  <p>Winds:{getRunwayWinds(runway.he_ident)}<br></br><br></br></p>
                  <p>Elevation: {runway.he_elevation_ft ? `${runway.he_elevation_ft}ft` : 'n/a'}</p>
                  <p>ILS: {runway.he_ils !== undefined ? `${runway.he_ils.freq}ft / ${runway.he_ils.course}°` : 'n/a'}</p>
                </div>
              </>
            )
        })}
      </div>
    </div>
  )
}

export default Information;