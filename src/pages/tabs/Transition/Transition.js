import { useState, useEffect } from 'react';
import { Input, Button, Alert, IconButton } from '@mui/joy';
import { Warning, Close } from '@mui/icons-material';

import './Transition.scss';

const Transition = () => {
  const [QNH, setQNH] = useState('');
  const [transitionAltitude, setTransitionAltitude] = useState('');
  const [transitionLevel, setTransitionLevel] = useState('');
  const [alert, setAlert] = useState('');

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

  const calculateTransitionLevel = () => {
    setTransitionLevel('');
    
    if (QNH === '' || transitionAltitude === '') {
      return sendAlert('Check correctness of QNH and Transition Altitude fields');
    }

    let parsedQNH = parseInt(QNH);
    let parsedTA = parseInt(transitionAltitude);

    if (isNaN(QNH) || isNaN(transitionAltitude)) {
      return sendAlert('Check correctness of QNH and Transition Altitude fields');
    }

    if (QNH < 950 || QNH > 1050) {
      return sendAlert('QNH must be between 950 and 1050');
    }

    if (transitionAltitude < 3000 || transitionAltitude > 15000) {
      return sendAlert('Transition Altitude must be between 3000 and 15000');
    }

    const transitionLevel = Math.ceil(((parsedTA + (1013 - parsedQNH) * 28) + 1000) / 100);
    const truncatedTransitionLevel = Math.ceil(transitionLevel / 10) * 10;
    const formattedTransitionLevel = truncatedTransitionLevel.toString().padStart(3, '0'); 
    
    return setTransitionLevel(formattedTransitionLevel);
  }

  return (
    <div className="Transition">
      <div className="upper">
        <span>Enter the airport's QNH and Transition Altitude to get the Transition Level</span>
      </div>

      <div className="main">
        <Input
          type="number"
          placeholder="QNH"
          variant="outlined"
          color="neutral"
          className="input"
          onChange={(e) => setQNH(e.target.value)}
          onPaste={(e) => setQNH(e)}
        />

        <Input
          type="number"
          placeholder="TA"
          variant="outlined"
          color="neutral"
          className="input"
          onChange={(e) => setTransitionAltitude(e.target.value)}
          onPaste={(e) => setTransitionAltitude(e)}
        />

        <Button
          color="primary"
          onClick={() => calculateTransitionLevel()}
          variant="solid"
          className="button"
        >
          CALCULATE
        </Button>
      </div>

      {transitionLevel !== '' && 
        <div className="lower">
          <span>Transition Level:</span>
          <p>FL{transitionLevel}</p>
        </div>
      }

      {transitionLevel === '' &&
        <div className="footer">
          <p>💡 The Transition Level is the lower limit to use the standard 1013hPa altimeter setting, applicable to all aircraft defined inside the associated TMA (terminal area) where transition altitude is published.</p>
        </div>
      }

      <div className="alert">
        {alert !== '' && alert}
      </div>
    </div>
  )
}

export default Transition;