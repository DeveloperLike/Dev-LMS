import { Card } from 'antd'
import React from 'react'

function Widget() {
  return (
    <div>
        <div className="form-container">
        <h2>Lead Form</h2>
        <form id="leadForm">
            <div className="form-group" id="testing-form"></div>
            <div className="form-group" id="services" ></div>
            <div className="form-group" id="countries_do_you_prefer"></div>
            <div className="form-group" id="testing-form" ></div>
            <div className="form-group" id="Choose_the_mode_of_consultation"></div>
            <button type="submit" id="submitButton" className="btn-submit">Submit</button>
        </form>
    </div>
    <script src='https://su.classifyr.in/static/app.js'></script>
    </div>
  )
}

export default Widget