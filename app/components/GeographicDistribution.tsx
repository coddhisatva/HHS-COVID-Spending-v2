'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { useData } from '../contexts/DataContext';

// Types for TopoJSON data
interface Topology {
  type: "Topology";
  objects: {
    states: {
      type: string;
      geometries: Array<any>;
    };
  };
  arcs: Array<any>;
  transform: any;
}

interface StateData {
  state: string;
  stateName: string;
  amount: number;
  count: number;
}

// Define GeoJSON feature types
interface GeoFeature {
  type: string;
  id: string;
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: any;
}

const GeographicDistribution: React.FC = () => {
  const { data, isLoading } = useData();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapData, setMapData] = useState<StateData[]>([]);
  const [topoData, setTopoData] = useState<any>(null);
  const [tooltipState, setTooltipState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: { state: string; amount: number; count: number } | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: null,
  });

  // Format large numbers in compact currency format
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  // Format numbers with commas
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Process geographic data when data changes
  useEffect(() => {
    if (data && data.geographic) {
      console.log("Geographic data loaded:", data.geographic.length, "states");
      setMapData(data.geographic);
    }
  }, [data]);

  // Load TopoJSON data
  useEffect(() => {
    const loadTopoData = async () => {
      try {
        const response = await fetch('/assets/maps/states-10m.json');
        if (!response.ok) {
          throw new Error('Failed to load map data');
        }
        const data = await response.json();
        console.log("TopoJSON data loaded successfully");
        setTopoData(data);
      } catch (error) {
        console.error("Error loading TopoJSON data:", error);
      }
    };

    loadTopoData();
  }, []);

  // Create/update the map when mapData or topoData changes
  useEffect(() => {
    if (!mapRef.current || !mapData.length || !topoData) {
      console.log("Map ref not available, no map data, or no topo data yet");
      return;
    }

    console.log("Rendering map with", mapData.length, "states");
    
    // Clear any existing visualization
    d3.select(mapRef.current).selectAll("*").remove();

    // Set up dimensions and create SVG
    const container = mapRef.current;
    const width = container.clientWidth;
    const height = Math.max(400, width * 0.6); // Maintain aspect ratio
    
    console.log("Map container dimensions:", width, "x", height);

    const svg = d3.select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("style", "max-width: 100%; height: auto;");

    // Create a group for the map
    const g = svg.append("g");

    // Create projection for US map
    const projection = d3.geoAlbersUsa()
      .fitSize([width - 40, height - 80], { type: "Sphere" } as any);

    // Create path generator
    const path = d3.geoPath().projection(projection);

    // Determine color scale based on funding amounts
    const maxAmount = d3.max(mapData, d => d.amount) || 0;
    console.log("Max funding amount:", maxAmount);
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, maxAmount])
      .clamp(true);

    // Convert TopoJSON to GeoJSON
    const states = feature(topoData, topoData.objects.states) as any;

    // Create a map of state names to state codes
    const stateNameToCode: { [name: string]: string } = {};
    mapData.forEach(d => {
      stateNameToCode[d.stateName] = d.state;
    });

    // Draw states
    console.log("Drawing", states.features.length, "states");
    g.selectAll("path")
      .data(states.features)
      .join("path")
      .attr("fill", (d: any) => {
        const stateName = d.properties?.name || '';
        const stateData = mapData.find(d => d.stateName === stateName);
        return stateData?.amount > 0 ? colorScale(stateData.amount) : "#eee";
      })
      .attr("d", path)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .attr("class", "state")
      .on("mouseover", (event: any, d: any) => {
        const stateName = d.properties?.name || '';
        const stateData = mapData.find(d => d.stateName === stateName);
        
        if (stateData) {
          setTooltipState({
            visible: true,
            x: event.pageX,
            y: event.pageY,
            content: {
              state: stateData.stateName,
              amount: stateData.amount,
              count: stateData.count
            }
          });
        }
      })
      .on("mousemove", (event: any) => {
        setTooltipState(prev => ({
          ...prev,
          x: event.pageX,
          y: event.pageY
        }));
      })
      .on("mouseout", () => {
        setTooltipState(prev => ({
          ...prev,
          visible: false
        }));
      });

    // Add legend
    const legendHeight = 20;
    const legendWidth = width * 0.6;
    const legendPosition = {
      x: (width - legendWidth) / 2,
      y: height - 40
    };

    // Create gradient for legend
    const defs = svg.append("defs");
    const linearGradient = defs.append("linearGradient")
      .attr("id", "funding-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    // Add gradient stops
    linearGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", colorScale(0));

    linearGradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", colorScale(maxAmount / 2));

    linearGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", colorScale(maxAmount));

    // Add rectangle with gradient
    svg.append("rect")
      .attr("x", legendPosition.x)
      .attr("y", legendPosition.y)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("fill", "url(#funding-gradient)");

    // Add legend labels
    svg.append("text")
      .attr("x", legendPosition.x)
      .attr("y", legendPosition.y - 5)
      .attr("text-anchor", "start")
      .attr("font-size", "12px")
      .text("Funding Amount");

    svg.append("text")
      .attr("x", legendPosition.x + legendWidth)
      .attr("y", legendPosition.y - 5)
      .attr("text-anchor", "end")
      .attr("font-size", "12px")
      .text(formatCurrency(maxAmount));

  }, [mapData, topoData]);

  // Handle loading or empty data states
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5 h-full">
        <h2 className="text-lg font-semibold mb-3">Geographic Distribution</h2>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-64 bg-gray-200 mb-4 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-2.5"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !mapData.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5 h-full">
        <h2 className="text-lg font-semibold mb-3">Geographic Distribution</h2>
        <div className="h-96 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <p>No geographic data available for the selected filters.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 h-full border border-gray-200">
      <h2 className="text-lg font-semibold mb-3">Geographic Distribution</h2>
      <div ref={mapRef} className="h-96 w-full relative" style={{ minHeight: "400px", border: "2px solid #cbd5e1", borderRadius: "0.375rem" }}>
        {/* Map will be rendered here by D3 */}
        {mapData.length > 0 && (
          <div className="absolute top-0 right-0 bg-white/75 p-2 text-xs z-10">
            {mapData.length} states with data
          </div>
        )}
      </div>
      
      {/* Tooltip */}
      {tooltipState.visible && tooltipState.content && (
        <div 
          className="absolute bg-white p-2 rounded shadow-md border border-gray-200 z-10 text-sm pointer-events-none"
          style={{
            left: `${tooltipState.x + 12}px`,
            top: `${tooltipState.y - 50}px`,
            transform: 'translate(-50%, -100%)',
            minWidth: '150px'
          }}
        >
          <div className="font-medium">{tooltipState.content.state}</div>
          <div>Funding: {formatCurrency(tooltipState.content.amount)}</div>
          <div>Transactions: {formatNumber(tooltipState.content.count)}</div>
        </div>
      )}
    </div>
  );
};

export default GeographicDistribution; 