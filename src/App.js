import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [isCity, setIsCity] = useState("");
  const [isData, setIsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCoordinates = async () => {
    const apiKey = "8ae284b7efc84ca8937550f7eb71f067";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${isCity}&key=${apiKey}`;
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      const { lat, lng } = response.data.results[0].geometry;
      console.log("getCoordinates ===> ", lat, lng);
      getReport(lat, lng);
    } catch (error) {
      console.error("Error fetching the coordinates:", error);
    }
  };

  const getReport = async (lat, lng) => {
    console.log("getCoordinates in report ===> ", lat, lng);

    const reportApiKey = "1635890035cbba097fd5c26c8ea672a1";
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${reportApiKey}`;

    try {
      const response = await axios.get(url);
      console.log("getReport ===> ", response.data.list.slice(0, 5));
      setIsData(response.data.list.slice(0, 5));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching the Data:", error);
    }
  };

  const formatDate = (date) => {
    const getDate = new Date(date * 1000);
    const formattedDate = getDate.toLocaleDateString();
    return formattedDate;
  };

  return (
    <div className="flex w-full h-screen flex-col">
      {/* Header part */}
      <div className="flex flex-col md:flex-row py-10 px-2 md:px-6">
        <h1 className="text-2xl md:text-3xl text-center font-medium text-orange-400">
          Weather in your city{" "}
        </h1>
        <div className="flex flex-col items-center justify-center md:flex-row">
          <input
            className="w-60 border-2 border-orange-400 rounded bg-transparent p-2 ml-0 md:ml-32 my-4 md:my-0"
            placeholder="Enter city"
            value={isCity}
            onChange={(e) => setIsCity(e.target.value)}
          />


            <button
              onClick={getCoordinates}
              className="bg-orange-400 w-40 text-white text-base font-bold py-2 rounded mx-2  disabled:bg-slate-200"
              disabled={!isCity}
            >
              Search
            </button>

          {isLoading && <p className="text-sm text-slate-600">Loading...</p>}
        </div>
      </div>

      {/* Data report */}
      {isData.length === 0 ? (
        <div className="flex items-center justify-center text-sm text-slate-300">
          {" "}
          Please enter city name to get report...
        </div>
      ) : (
        <div className="grid grid-row-5 md:grid-cols-5 gap-4 flex items-center justify-center py-10 md:px-10">
          {isData.map((report, index) => {
            return (
              <table class="w-40 table-fixed">
                <thead>
                  <tr className="border border-slate-400">
                    <th>Date: {formatDate(report.dt)}</th>
                  </tr>
                  <tr className="border border-slate-400">
                    <th>Temperature</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400">Min</td>
                    <td className="border border-slate-400">Max</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400">
                      {report.main.temp_min}
                    </td>
                    <td className="border border-slate-400">
                      {report?.main?.temp_max}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400">Pressure</td>
                    <td className="border border-slate-400">
                      {report.main.pressure}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400">Humidity</td>
                    <td className="border border-slate-400">
                      {report.main.humidity}
                    </td>
                  </tr>
                </tbody>
              </table>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default App;
