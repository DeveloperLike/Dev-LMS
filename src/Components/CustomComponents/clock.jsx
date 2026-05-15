// // import { useEffect, useState } from 'react';
// // import Clock from 'react-clock';
// // import 'react-clock/dist/Clock.css';

// // function ClockTime() {
// //   const [value, setValue] = useState(new Date());

// //   useEffect(() => {
// //     const interval = setInterval(() => setValue(new Date()), 1000);

// //     return () => {
// //       clearInterval(interval);
// //     };
// //   }, []);

// //   return (
// //     <div>
// //       <p>Current time:</p>
// //       <Clock value={value} />
// //     </div>
// //   );
// // }

// // export default ClockTime;



// import { useState } from 'react';
// import TimePicker from 'react-time-picker';
// import 'react-time-picker/dist/TimePicker.css';
// import 'react-clock/dist/Clock.css';

// function ClockTime() {
//   const [value, onChange] = useState('10:00');

//   return (
//     <div>
//       <TimePicker onChange={onChange} value={value} amPmAriaLabel={"Select AM/PM"} />
//     </div>
//   );
// }

// export default ClockTime;




import React, { useState, useEffect } from 'react';
import './App.css';

function ClockTime() {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [timeString, setTimeString] = useState('00:00:00');

  // Update the time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSecond(prev => {
        if (prev === 59) {
          setMinute(min => (min === 59 ? 0 : min + 1));
          if (minute === 59) setHour(hour => (hour === 23 ? 0 : hour + 1));
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    
    return () => clearInterval(interval); // Clean up on unmount
  }, [minute, hour]);

  // Update the time string
  useEffect(() => {
    setTimeString(`${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`);
  }, [hour, minute, second]);

  // Function to handle custom time setting
  const setCustomTime = () => {
    const newHour = parseInt(prompt('Enter hour (0-23):'), 10);
    const newMinute = parseInt(prompt('Enter minute (0-59):'), 10);
    const newSecond = parseInt(prompt('Enter second (0-59):'), 10);

    if (newHour >= 0 && newHour <= 23 && newMinute >= 0 && newMinute <= 59 && newSecond >= 0 && newSecond <= 59) {
      setHour(newHour);
      setMinute(newMinute);
      setSecond(newSecond);
    } else {
      alert('Invalid time entered!');
    }
  };

  // Calculate the rotation for clock hands
  const hourDeg = (hour % 12) * 30 + minute * 0.5; // 360 / 12 = 30 degrees per hour
  const minuteDeg = minute * 6 + second * 0.1; // 360 / 60 = 6 degrees per minute
  const secondDeg = second * 6; // 360 / 60 = 6 degrees per second

  return (
    <div className="watch-time-picker">
      <div className="watch">
        <div className="watch-face">
          <div className="hour" style={{ transform: `rotate(${90 + hourDeg}deg)` }}></div>
          <div className="minute" style={{ transform: `rotate(${90 + minuteDeg}deg)` }}></div>
          <div className="second" style={{ transform: `rotate(${90 + secondDeg}deg)` }}></div>
          <div className="center"></div>
        </div>
      </div>
      <div className="time-input">
        <input type="text" value={timeString} readOnly />
        <button onClick={setCustomTime}>Set Time</button>
      </div>
    </div>
  );
}

export default ClockTime;
