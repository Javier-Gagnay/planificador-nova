import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useThemeStore } from "@/lib/store";

const TaskAssigneeBarChart = ({ data, width = 400, height = 300 }) => {
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
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Create scales
        const x = d3.scaleBand()
            .domain(data.map(d => d.assignee))
            .range([0, innerWidth])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count) || 0])
            .range([innerHeight, 0]);

        // Add bars
        g.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.assignee) || 0)
            .attr('y', d => y(d.count))
            .attr('width', x.bandwidth())
            .attr('height', d => innerHeight - y(d.count))
            .attr('fill', d => d.color);

        // Add x-axis
        g.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-45)')
            .style('fill', theme === 'dark' ? 'white' : 'black');

        // Add y-axis
        g.append('g')
            .call(d3.axisLeft(y).ticks(5))
            .selectAll('text')
            .style('fill', theme === 'dark' ? 'white' : 'black');

        // Add labels
        g.selectAll('.label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', d => (x(d.assignee) || 0) + x.bandwidth() / 2)
            .attr('y', d => y(d.count) - 5)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', theme === 'dark' ? 'white' : 'black')
            .text(d => d.count);

    }, [data, width, height, theme]);

    return (
        <div className={`rounded-lg shadow p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Tareas por Asignado
            </h3>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default TaskAssigneeBarChart; 