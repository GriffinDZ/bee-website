import React, { useState } from 'react';
import GeoMap from "./components/geomap.js";
import data from "./geography_data/us.geo.json";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  var currYear = new Date('2022-01-01T00:00:00Z');
  currYear.setFullYear(currYear.getFullYear() - 1);
  const finalYearData = currYear.getFullYear();
  const [year, setYear] = useState(finalYearData);

  return (
    <React.Fragment>
      <div id="app-container" className="container-fluid d-flex flex-column justify-content-end">
        <div className="pt-2 mb-2 row">
          <div className="col justify-content-center text-center">
            <h1>Honey Bee Colonies in the United States</h1>
          </div>
        </div>
        <GeoMap className="mb-auto" data={data} year={year} />
        <div className="row mt-2 justify-content-center">
          <div className="col text-center">
            <h3>Select a year to highlight. Current year: <u>{year}</u></h3>
          </div>
        </div>
        <div className="row mt-2 justify-content-center mb-2">
          <div className="col-sm-8 col-auto-12 justify-content-center d-flex flex-row">
            <span><i>1987</i></span>
            <input
              type="range"
              className="form-range mx-3"
              min="1987"
              max={finalYearData}
              step="1"
              value={year}
              onChange={event => setYear(event.target.value)}>
            </input>
            <span><i>{finalYearData}</i></span>
          </div>
        </div>
        <div id="footer" className="row bg-dark justify-content-end py-2">
          <div id="footer-col-1" className="col-sm-6">
            <small id="credits">Developed by <a id="personalLink"
              href="https://griffinzody.com/" rel="noopener noreferrer" target="_blank">Griffin Zody</a>. Github <a id="personalLink"
                href="https://github.com/GriffinDZ/bee-website" rel="noopener noreferrer" target="_blank">here</a>.</small>
          </div>
          <div id="footer-col-2" className="col-sm-6">
            <small id="NASS-Disclaimer"><i>This product uses the <a rel="noopener noreferrer" target="_blank" id="NASS-Link" href="https://quickstats.nass.usda.gov/api">
              NASS API</a> but is not endorsed or certified by NASS.</i></small>
          </div>
        </div>
      </div>
    </React.Fragment >
  );
}

export default App;
