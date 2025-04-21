import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useThemeStore } from "@/lib/store";

const TaskDonutChart = ({ data, width = 400, height = 300 }) => {
    const svgRef = useRef();
    const { theme } = useThemeStore();

    useEffect(() => {
        if (!svgRef.current) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll('*').remove();

        // Create SVG
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Add margins
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Create group for the chart
        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Create pie chart
        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(60)
            .outerRadius(Math.min(innerWidth, innerHeight) / 2 - 1);

        const arcs = pie(data);

        // Add arcs
        g.selectAll('path')
            .data(arcs)
            .enter()
            .append('path')
            .attr('fill', d => d.data.color)
            .attr('d', arc)
            .attr('stroke', theme === 'dark' ? '#1f2937' : 'white')
            .attr('stroke-width', 2);

        // Add labels
        g.selectAll('text')
            .data(arcs)
            .enter()
            .append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .text(d => d.data.value)
            .style('fill', theme === 'dark' ? 'white' : 'black')
            .style('font-size', '12px');

        // Add legend
        const legend = svg.append('g')
            .attr('transform', `translate(${width - 150}, 20)`);

        data.forEach((d, i) => {
            const legendRow = legend.append('g')
                .attr('transform', `translate(0, ${i * 20})`);

            legendRow.append('rect')
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', d.color);

            legendRow.append('text')
                .attr('x', 20)
                .attr('y', 10)
                .attr('text-anchor', 'start')
                .style('font-size', '12px')
                .style('fill', theme === 'dark' ? 'white' : 'black')
                .text(d.status);
        });

    }, [data, width, height, theme]);

    return (
        <div className={`rounded-lg shadow p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Estado de Tareas
            </h3>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default TaskDonutChart; 