import './AirportInformation.scss';

const AirportInformation = (airportInfo, weatherInfo) => {
  console.log(airportInfo, weatherInfo);

  return (
    <div className="airport-information">
      <div className="airport">
        <div className="airport__left">
        </div> 

        <div className="airport__center">
        </div>

        <div className="airport__right">
        </div>
      </div>

      <div className="weather">
        test2
      </div>
    </div>
  )
}

export default AirportInformation;