'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GraphData } from '@/types/post';
import { useApp } from '@/context/AppContext';
import { motion } from 'motion/react';
import { StatusLine } from './StatusLine';

interface NeuralGraphProps {
  data: GraphData;
  height?: number;
  title?: string;
  subtitle?: string;
  focusNodeId?: string;
}

export function NeuralGraph({ 
  data, 
  height = 800, 
  title = "Architettura delle Connessioni.",
  subtitle = "Mappatura delle Procedure - Landfall",
  focusNodeId 
}: NeuralGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setActivePostId } = useApp();

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const isMobile = width < 768;
    const currentHeight = isMobile ? 500 : height;

    // Clear previous
    d3.select(containerRef.current).selectAll('*').remove();

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', currentHeight)
      .attr('viewBox', [0, 0, width, currentHeight])
      .attr('style', 'max-width: 100%; height: auto;');

    const simulation = d3.forceSimulation(data.nodes as any)
      .force('link', d3.forceLink(data.links).id((d: any) => d.id).distance(
        focusNodeId ? (isMobile ? 80 : 120) : (isMobile ? 140 : 180)
      ))
      .force('charge', d3.forceManyBody().strength(
        focusNodeId ? (isMobile ? -400 : -800) : (isMobile ? -300 : -500)
      ))
      .force('center', d3.forceCenter(width / 2, currentHeight / 2))
      .force('x', d3.forceX(width / 2).strength(isMobile ? 0.3 : 0.05))
      .force('y', d3.forceY(currentHeight / 2).strength(isMobile ? 0.3 : 0.05))
      .force('jitter', () => {
        data.nodes.forEach((d: any) => {
          d.vx += (Math.random() - 0.5) * 0.05;
          d.vy += (Math.random() - 0.5) * 0.05;
        });
      });

    const link = svg.append('g')
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.05)
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke-width', 1);

    // Neural Pulses (moving particles)
    const pulses = svg.append('g')
      .selectAll('circle')
      .data(data.links)
      .join('circle')
      .attr('r', 1.5)
      .attr('fill', '#10B981')
      .attr('fill-opacity', 0.6)
      .attr('filter', 'blur(1px)');

    function animatePulses() {
      pulses.each(function(d: any) {
        const pulse = d3.select(this);
        const duration = 2000 + Math.random() * 3000;
        const delay = Math.random() * 5000;

        function repeat() {
          pulse
            .transition()
            .duration(duration)
            .attrTween('t', () => (t: number) => {
              const x = d.source.x + (d.target.x - d.source.x) * t;
              const y = d.source.y + (d.target.y - d.source.y) * t;
              pulse.attr('cx', x).attr('cy', y);
              pulse.attr('opacity', Math.sin(t * Math.PI));
              return '';
            })
            .on('end', repeat);
        }
        
        setTimeout(repeat, delay);
      });
    }

    animatePulses();

    const node = svg.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .attr('class', 'cursor-pointer group')
      .on('click', (event, d: any) => {
        setActivePostId(d.id);
      });

    // Node background glow (animated)
    node.append('circle')
      .attr('r', 12)
      .attr('fill', 'rgb(16 185 129)')
      .attr('fill-opacity', 0.05)
      .attr('class', 'animate-pulse');

    // Node dots
    node.append('circle')
      .attr('r', 4)
      .attr('fill', 'currentColor')
      .attr('class', 'text-zinc-300 dark:text-zinc-500');

    // Labels
    node.append('text')
      .text((d: any) => d.title)
      .attr('x', 12)
      .attr('y', 4)
      .attr('font-family', 'var(--font-serif)')
      .attr('font-size', isMobile ? '8px' : '10px')
      .attr('font-style', 'italic')
      .attr('fill', 'currentColor')
      .attr('class', 'opacity-40 group-hover:opacity-100 transition-opacity uppercase tracking-widest');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [data, setActivePostId, height, focusNodeId]);

  return (
    <div className="relative w-full py-12 md:py-20 px-6 md:px-12 border-y border-zinc-50 dark:border-zinc-950 bg-zinc-50/30 dark:bg-zinc-950/30 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="mb-4">
            <StatusLine label={subtitle === "Neural Network Active" ? "Rete Neurale Attiva" : subtitle} />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif italic">{title}</h2>
        </header>
        
        <div 
          ref={containerRef} 
          className="w-full bg-white dark:bg-zinc-900/50 rounded-sm border border-zinc-100 dark:border-zinc-800"
          style={{ minHeight: `${height}px` }}
        />
        
        <footer className="mt-8 flex justify-between items-center font-mono text-[8px] uppercase tracking-[0.3em] text-zinc-300 dark:text-zinc-500">
          <span>Sincronia Neurale: 100%</span>
          <span>Interattività: On</span>
        </footer>
      </div>
    </div>
  );
}
