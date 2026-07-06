import { Bar, Line, Pie } from "react-chartjs-2";

const palette = [
  "#2563eb",
  "#16a34a",
  "#f97316",
  "#db2777",
  "#0891b2",
  "#7c3aed"
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom"
    }
  }
};

const timeAxisBounds = (values, tickStepSize) => {
  if (!tickStepSize) return {};

  const numericValues = values.map((value) => Number(value) || 0);

  if (!numericValues.length) return {};

  const minValue = Math.min(...numericValues);
  const maxValue = Math.max(...numericValues);

  const min = Math.max(
    0,
    Math.floor(minValue / tickStepSize) * tickStepSize
  );

  const max =
    Math.ceil(maxValue / tickStepSize) * tickStepSize;

  return {
    min,
    max: max === min ? min + tickStepSize : max
  };
};

const withValueFormatter = (
  valueFormatter,
  tickStepSize,
  values = [],
  includeScales = true
) => {

  const options = {
    ...chartOptions,

    plugins: {
      ...chartOptions.plugins,

      tooltip: {
        callbacks: {
          label: (context) => {

            const value =
              context.parsed.y ?? context.parsed;

            return valueFormatter
              ? `${context.dataset.label}: ${valueFormatter(value)}`
              : `${context.dataset.label}: ${value}`;
          }
        }
      }
    }
  };

  // Add Y-axis only for Bar/Line charts
  if (includeScales && valueFormatter) {

    options.scales = {
      y: {
        ...timeAxisBounds(values, tickStepSize),

        ticks: {
          stepSize: tickStepSize,

          callback: (value) =>
            valueFormatter(value)
        }
      }
    };
  }

  return options;
};

export const BarChart = ({
  labels,
  values,
  label
}) => (
  <div className="chart-box">
    <Bar
      options={chartOptions}
      data={{
        labels,

        datasets: [
          {
            label,
            data: values,
            backgroundColor: "#2563eb"
          }
        ]
      }}
    />
  </div>
);

export const PieChart = ({
  labels,
  values,
  label,
  valueFormatter
}) => (
  <div className="chart-box">
    <Pie
      options={withValueFormatter(
        valueFormatter,
        undefined,
        [],
        false
      )}
      data={{
        labels,

        datasets: [
          {
            label,
            data: values,
            backgroundColor: palette
          }
        ]
      }}
    />
  </div>
);

export const LineChart = ({
  labels,
  values,
  label,
  valueFormatter,
  tickStepSize
}) => (
  <div className="chart-box">
    <Line
      options={withValueFormatter(
        valueFormatter,
        tickStepSize,
        values,
        true
      )}
      data={{
        labels,

        datasets: [
          {
            label,
            data: values,
            borderColor: "#16a34a",
            backgroundColor: "#16a34a",
            tension: 0.35
          }
        ]
      }}
    />
  </div>
);