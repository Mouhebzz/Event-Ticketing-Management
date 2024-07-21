import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChart = ({ attendees, checkedInAttendees }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartData = {
      labels: ['Attendees', 'Checked-in Attendees'],
      datasets: [
        {
          data: [attendees, checkedInAttendees],
          backgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    };

    const chartOptions = {
      responsive: true,
    };

    const ctx = chartRef.current.getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: chartOptions,
    });
  }, [attendees, checkedInAttendees]);

  return <canvas ref={chartRef} />;
};

export default PieChart;
