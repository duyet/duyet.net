// Credit: https://github.com/DennisRutjes/Fresh-Apache-ECharts

import { useEffect, useRef } from "preact/hooks";
import { JSX } from "preact";
import type {
  ECharts,
  EChartsOption,
  SetOptionOpts,
} from "https://esm.sh/echarts@5.5.1/dist/echarts.min.js?target=es2022";
import {
  getInstanceByDom,
  init,
} from "https://esm.sh/echarts@5.5.1/dist/echarts.min.js?target=es2022";
import { initThemes } from "./theme.ts";

export type CSSProperties = { [key: string]: string | number };

export interface ReactEChartsProps {
  option: EChartsOption;
  className?: string;
  style?: CSSProperties;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: "light" | "dark" | "macarons" | "vintage";
}

export function EChart({
  option,
  className,
  style,
  settings,
  loading,
  theme,
}: ReactEChartsProps): JSX.Element {
  initThemes();

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef?.current !== null) {
      chart = init(chartRef.current, theme, {
        renderer: "svg",
      });
    }

    // Add chart resize listener
    // ResizeObserver is leading to a bit janky UX
    function resizeChart() {
      chart?.resize();
    }

    globalThis.addEventListener("resize", resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      globalThis.removeEventListener("resize", resizeChart);
    };
  }, [theme]);

  useEffect(() => {
    if (chartRef.current !== null) {
      const echartInstance = getInstanceByDom(chartRef.current);
      echartInstance?.setOption(option, settings);
    }
  }, [option, settings, theme]);

  useEffect(() => {
    if (chartRef.current !== null) {
      const echartInstance = getInstanceByDom(chartRef.current);
      loading === true
        ? echartInstance?.showLoading()
        : echartInstance?.hideLoading();
    }
  }, [loading, theme]);

  return (
    <div
      ref={chartRef}
      className={className}
      style={style}
    />
  );
}
