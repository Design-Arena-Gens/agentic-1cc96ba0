import { useEffect, useRef } from 'react';
import type { EChartsOption, EChartsType } from 'echarts';
import { loadECharts } from '../lib/loadECharts';

type ChartPreviewProps = {
  title: string;
  description: string;
  option: EChartsOption;
  height?: number;
};

export const ChartPreview = ({ title, description, option, height = 400 }: ChartPreviewProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<EChartsType | null>(null);

  useEffect(() => {
    let disposed = false;

    const initChart = async () => {
      const echarts = await loadECharts();
      if (!containerRef.current || disposed) return;

      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
      }

      const chart = echarts.init(containerRef.current, undefined, {
        renderer: 'canvas'
      });
      chart.setOption(option, true);

      const resizeHandler = () => {
        chart.resize();
      };

      window.addEventListener('resize', resizeHandler);
      chartInstanceRef.current = chart;

      return () => {
        window.removeEventListener('resize', resizeHandler);
      };
    };

    const cleanupPromise = initChart();

    return () => {
      disposed = true;
      cleanupPromise.then((cleanup) => {
        cleanup?.();
      });
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, [option]);

  return (
    <section className="chart-card">
      <div className="chart-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div ref={containerRef} className="chart-surface" style={{ minHeight: height }} />
    </section>
  );
};

export type { EChartsOption } from 'echarts';
