import BottomCorners from '../../../components/BottomCorners/BottomCorners';

import './Main.scss';

const Main = () => {
  return (
    <div className="Main">
      <BottomCorners />
      
      <div className="upper">
        <span>Hey! Thanks for using my tool 😀</span>

        <p>
          <b>Essential Flight Tools</b> is a collection of a few of the most useful tools for the virtual aviation:<br></br><br></br>
          <b>• Weather Tool</b> - allows you to get full weather information at the airport for the given ICAO code, together with a prediction of the runway available for use based on the current winds at the airport.<br></br><br></br>
          <b>• Transition Level Tool</b> - is a calculator that allows you to calculate the Transition Level based on the airport's given QNH and Transition Altitude.
        </p>
      </div>
    </div>
  )
}

export default Main;