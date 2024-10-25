import { Chart } from "https://deno.land/x/fresh_charts@0.3.1/island.tsx";
import { ChartJs } from "https://deno.land/x/fresh_charts@0.3.1/deps.ts";
import "npm:chartjs-adapter-date-fns";

type Point = ChartJs.Point;

export { Chart };
export type { Point };
export default Chart;
