import React, { useState, useEffect, useRef } from 'react';
import { select, geoPath, geoAlbersUsa, scaleSequential, interpolateRgb } from 'd3';
import axios from 'axios';
import useResizeObserver from "../utils/useResizeObserver.js";
import { throttle } from 'lodash';
import config from '../dev';

function GeoMap({ data, year }) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const labelRef = useRef();
    const isYearDataLoaded = useRef(false);
    const [yearData, setYearData] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const dimensions = useResizeObserver(wrapperRef);

    useEffect(function getYearDataFromAPI() {
        async function fetchYearData() {
            isYearDataLoaded.current = false;
            await axios.get(`http://${config.IP}:5000/${year}`)
                .then(response => {
                    setYearData(response.data[0].state_values);
                })
                .catch(error => {
                    console.error(error);
                });
            isYearDataLoaded.current = true;
        };
        fetchYearData();
    }, [year]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(throttle(function DrawMap() {
        const svg = select(svgRef.current);

        const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();

        const projection = geoAlbersUsa().fitSize([width, height * 0.98], selectedState || data).precision(25);
        const pathGenerator = geoPath().projection(projection);

        svg
            .selectAll(".state")
            .data(data.features)
            .join("path")
            .on("click", function (e, feature) {
                setSelectedState(selectedState === feature ? null : feature);
            })
            .attr("class", "state")
            .transition().duration(1000)
            .attr("d", feature => pathGenerator(feature));

    }, 1000), [data, selectedState, dimensions]);

    useEffect(function colorStates() {
        if (isYearDataLoaded.current) {
            const svg = select(svgRef.current);

            const colorScale = scaleSequential(interpolateRgb("#fff5cc", "#E3AE00")).domain([0, 5]);

            svg
                .selectAll(".state")
                .transition().duration(150)
                .attr("fill", feature => {
                    const currYear = yearData.find(el => el.state === feature.properties["NAME"].toUpperCase());
                    if (currYear !== undefined) {
                        return colorScale(currYear.total_bee_colonies / feature.properties["CENSUSAREA"]);
                    }
                    else {
                        return "#e6e6e6";
                    }
                });
        }
    }, [data, yearData]);

    useEffect(function setLabel() {
        const label = select(labelRef.current);

        label
            .selectAll(".label")
            .data([selectedState])
            .join("text")
            .attr("class", "label")
            .text(
                feature => {
                    if (feature && isYearDataLoaded) {
                        const currYear = yearData.find(el => el.state === feature.properties["NAME"].toUpperCase());
                        if (currYear !== undefined) {
                            return feature.properties["NAME"] + ": " + (currYear.total_bee_colonies
                                / feature.properties["CENSUSAREA"]).toFixed(2) + " colonies per square mile.";
                        }
                        else {
                            return feature.properties["NAME"] + ": Insignificant data this year.";
                        }
                    }
                    else {
                        return "Click a state to see its data.";
                    }
                }
            )
    }, [yearData, selectedState]);

    return (
        <React.Fragment>
            <div id="map-wrapper" ref={wrapperRef}>
                <svg ref={svgRef}></svg>
            </div>
            <div className="text-center">
                <p id="map-label-1" className="m-1" ref={labelRef}></p>
                <p id="map-label-2" className="m-1"><i>(Click the selected state again to zoom out.)</i></p>
            </div>
        </React.Fragment>
    );
}

export default GeoMap;