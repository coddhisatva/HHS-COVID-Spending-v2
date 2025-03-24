import React from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography,
  ZoomableGroup
} from 'react-simple-maps';

// US states topojson
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Sample data with funding amounts by state (normalized for the demo)
const stateData = [
  { id: "AL", state: "Alabama", value: 0.2 },
  { id: "AK", state: "Alaska", value: 0.1 },
  { id: "AZ", state: "Arizona", value: 0.4 },
  { id: "AR", state: "Arkansas", value: 0.3 },
  { id: "CA", state: "California", value: 0.9 },
  { id: "CO", state: "Colorado", value: 0.5 },
  { id: "CT", state: "Connecticut", value: 0.2 },
  { id: "DE", state: "Delaware", value: 0.1 },
  { id: "FL", state: "Florida", value: 0.7 },
  { id: "GA", state: "Georgia", value: 0.6 },
  { id: "HI", state: "Hawaii", value: 0.1 },
  { id: "ID", state: "Idaho", value: 0.2 },
  { id: "IL", state: "Illinois", value: 0.6 },
  { id: "IN", state: "Indiana", value: 0.4 },
  { id: "IA", state: "Iowa", value: 0.3 },
  { id: "KS", state: "Kansas", value: 0.2 },
  { id: "KY", state: "Kentucky", value: 0.3 },
  { id: "LA", state: "Louisiana", value: 0.5 },
  { id: "ME", state: "Maine", value: 0.1 },
  { id: "MD", state: "Maryland", value: 0.4 },
  { id: "MA", state: "Massachusetts", value: 0.5 },
  { id: "MI", state: "Michigan", value: 0.6 },
  { id: "MN", state: "Minnesota", value: 0.4 },
  { id: "MS", state: "Mississippi", value: 0.2 },
  { id: "MO", state: "Missouri", value: 0.4 },
  { id: "MT", state: "Montana", value: 0.1 },
  { id: "NE", state: "Nebraska", value: 0.2 },
  { id: "NV", state: "Nevada", value: 0.3 },
  { id: "NH", state: "New Hampshire", value: 0.1 },
  { id: "NJ", state: "New Jersey", value: 0.5 },
  { id: "NM", state: "New Mexico", value: 0.2 },
  { id: "NY", state: "New York", value: 0.8 },
  { id: "NC", state: "North Carolina", value: 0.5 },
  { id: "ND", state: "North Dakota", value: 0.1 },
  { id: "OH", state: "Ohio", value: 0.6 },
  { id: "OK", state: "Oklahoma", value: 0.3 },
  { id: "OR", state: "Oregon", value: 0.4 },
  { id: "PA", state: "Pennsylvania", value: 0.6 },
  { id: "RI", state: "Rhode Island", value: 0.1 },
  { id: "SC", state: "South Carolina", value: 0.3 },
  { id: "SD", state: "South Dakota", value: 0.1 },
  { id: "TN", state: "Tennessee", value: 0.4 },
  { id: "TX", state: "Texas", value: 0.9 },
  { id: "UT", state: "Utah", value: 0.3 },
  { id: "VT", state: "Vermont", value: 0.1 },
  { id: "VA", state: "Virginia", value: 0.5 },
  { id: "WA", state: "Washington", value: 0.6 },
  { id: "WV", state: "West Virginia", value: 0.2 },
  { id: "WI", state: "Wisconsin", value: 0.4 },
  { id: "WY", state: "Wyoming", value: 0.1 },
];

const GeographicDistribution = () => {
  // Color scale for states based on funding value
  const getColor = (value: number) => {
    const blue = Math.round(255 * Math.min(1, value * 2));
    return `rgba(65, 105, 225, ${value})`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Geographic Distribution</h2>
      <div className="h-80">
        <ComposableMap projection="geoAlbersUsa">
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const stateInfo = stateData.find(s => s.id === geo.id);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={stateInfo ? getColor(stateInfo.value) : "#EEE"}
                      stroke="#FFFFFF"
                      style={{
                        hover: {
                          fill: "#A8D1FF",
                          stroke: "#FFFFFF",
                          strokeWidth: 1,
                          outline: "none"
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
};

export default GeographicDistribution; 