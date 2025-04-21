import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface TaskStatus {
    status: string
    count: number
    color: string
}

interface TaskDonutChartProps {
    data: TaskStatus[]
    width?: number
    height?: number
}

export default function TaskDonutChart({
    data,
    width = 300,
    height = 300
}: TaskDonutChartProps) {
    const svgRef = useRef<SVGSVGElement>(null)

    useEffect(() => {
        if (!svgRef.current) return

        // Clear previous chart
        d3.select(svgRef.current).selectAll('*').remove()

        // Create SVG
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)

        // Create group for the chart
        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`)

        // Create pie layout
        const pie = d3.pie<TaskStatus>()
            .value(d => d.count)
            .sort(null)

        // Create arc generator
        const arc = d3.arc<d3.PieArcDatum<TaskStatus>>()
            .innerRadius(width / 4)
            .outerRadius(width / 2 - 10)

        // Create arcs
        const arcs = g.selectAll('.arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc')

        // Add paths
        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => d.data.color)
            .attr('stroke', 'white')
            .attr('stroke-width', 2)

        // Add labels
        arcs.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('dy', '.35em')
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', 'white')
            .text(d => d.data.count)

        // Add legend
        const legend = svg.append('g')
            .attr('transform', `translate(${width / 2 + 20}, 20)`)

        const legendItems = legend.selectAll('.legend-item')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 25})`)

        legendItems.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', d => d.color)

        legendItems.append('text')
            .attr('x', 25)
            .attr('y', 12)
            .style('font-size', '12px')
            .text(d => `${d.status}: ${d.count}`)

    }, [data, width, height])

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Distribución de Tareas</h3>
            <svg ref={svgRef}></svg>
        </div>
    )
} 