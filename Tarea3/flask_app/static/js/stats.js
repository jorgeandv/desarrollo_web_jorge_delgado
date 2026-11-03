Highcharts.chart("container-lineas", {
  chart: {
    type: "line",
  },
  title: {
    text: "Avistamientos Registrados por Día",
  },
  xAxis: {
    type: "datetime",
    dateTimeLabelFormats: {
      month: "%b %e, %Y",
    },
    title: {
      text: "Día",
    },
  },
  yAxis: {
    title: {
      text: "Cantidad de Avistamientos",
    },
  },
  legend: {
    align: "left",
    verticalAlign: "top",
    borderWidth: 0,
  },

  tooltip: {
    shared: true,
    crosshairs: true,
  },

  series: [
    {
      name: "Avistamientos",
      data: [],
      lineWidth: 1,
      marker: {
        enabled: true,
        radius: 4,
      },
      color: "#054169",
    },
  ],
});

fetch(`${window.origin}/get-stats-data`)
  .then((response) => response.json())
  .then((data) => {
    let parsedData = data.map((item) => {
      const [year, month, day] = item.date
        .split("-")
        .map((part) => parseInt(part, 10));
      return [
        Date.UTC(year, month - 1, day), // javascript month indices start from 0 !
        item.count,
      ];
    });

    // Get the chart by ID
    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "container-lineas"
    );

    // Update the chart with new data
    chart.update({
      series: [
        {
          data: parsedData,
        },
      ],
    });
  })
  .catch((error) => console.error("Error:", error));


Highcharts.chart("container-torta", {
  chart: {
    type: "pie",
  },
  title: {
    text: "Total de Avistamientos por Ave",
  },
  tooltip: {
    pointFormat: "{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)",
  },
  plotOptions: {
    pie: {
      dataLabels: {
        enabled: true,
        format: "{point.name}: {point.y}",
      },
    },
  },

  series: [
    {
      name: "Avistamientos",
      data: [],
    },
  ],
});

fetch(`${window.origin}/get-stats-aves`)
  .then((response) => response.json())
  .then((data) => {
    let parsedData = data.map((item) => {
      return [
        item.ave, // nombre del ave (cada tajada del grafico)
        item.count, // cantidad de avistamientos de esa ave
      ];
    });

    // Get the chart by ID
    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "container-torta"
    );

    // Update the chart with new data
    chart.update({
      series: [
        {
          data: parsedData,
        },
      ],
    });
  })
  .catch((error) => console.error("Error:", error));


Highcharts.chart("container-barras", {
  chart: {
    type: "column", // en Highcharts "column" son barras verticales ("bar" son horizontales)
  },
  title: {
    text: "Total de Voluntarios por Comuna",
  },
  xAxis: {
    categories: [],
    title: {
      text: "Comuna",
    },
  },
  yAxis: {
    title: {
      text: "Cantidad de Voluntarios",
    },
  },
  legend: {
    align: "left",
    verticalAlign: "top",
    borderWidth: 0,
  },

  series: [
    {
      name: "Voluntarios",
      data: [],
      color: "#054169",
    },
  ],
});

fetch(`${window.origin}/get-stats-comunas`)
  .then((response) => response.json())
  .then((data) => {
    let comunas = data.map((item) => item.comuna); // eje X: nombres de las comunas
    let cantidades = data.map((item) => item.count); // eje Y: cantidad de voluntarios

    // Get the chart by ID
    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "container-barras"
    );

    // Update the chart with new data
    chart.update({
      xAxis: {
        categories: comunas,
      },
      series: [
        {
          data: cantidades,
        },
      ],
    });
  })
  .catch((error) => console.error("Error:", error));
