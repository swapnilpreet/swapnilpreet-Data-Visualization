import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js/auto";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDateToDDMMYYYY } from "../utils";
import zoomPlugin from "chartjs-plugin-zoom";
import Cookies from "js-cookie";
import { GetAllRecords } from "../api/data";
import Navbar from "../Components/Navbar";
import ErrorPage from "../Components/ErrorPage";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const Dashboard = () => {
  const [lineChartData, setLineChartData] = useState(null);
  
  const [data, setData] = useState(() => {
    // Retrieve stored data from localStorage on initial load
    const storedData = localStorage.getItem("data");
    return storedData ? JSON.parse(storedData) : [];
  });
  const [datacopy, setdatacopy] = useState([]);

  const [startDate, setStartDate] = useState(
    Cookies.get("startDate")
      ? new Date(Cookies.get("startDate"))
      : new Date()
  );

  const [endDate, setEndDate] = useState(
    Cookies.get("endDate")
      ? new Date(Cookies.get("endDate"))
      : new Date()
  );

  const [selectedAge, setSelectedAge] = useState(
    Cookies.get("selectedAge") || "All"
  );
  const [selectedGender, setSelectedGender] = useState(
    Cookies.get("selectedGender") || "All"
  );
  const [Error, setError] = useState(false);

  useEffect(() => {
    const savedStartDate = Cookies.get("startDate");
    const savedEndDate = Cookies.get("endDate");
    const savedAge = Cookies.get("selectedAge");
    const savedGender = Cookies.get("selectedGender");

    if (savedStartDate) setStartDate(new Date(savedStartDate));
    if (savedEndDate) setEndDate(new Date(savedEndDate));
    if (savedAge) setSelectedAge(savedAge);
    if (savedGender) setSelectedGender(savedGender);
  }, []);

  useEffect(() => {
    Cookies.set("startDate", startDate, { expires: 7 });
    Cookies.set("endDate", endDate, { expires: 7 });
    Cookies.set("selectedAge", selectedAge, { expires: 7 });
    Cookies.set("selectedGender", selectedGender, { expires: 7 });
  }, [startDate, endDate, selectedAge, selectedGender]);

  const handleClearPreferences = () => {
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
    setStartDate(new Date(2022, 9, 4)); // Default start date
    setEndDate(new Date(2022, 9, 4)); // Default end date
    setSelectedAge("All"); // Default age group
    setSelectedGender("All");
    fetchData();
  };

  const fetchData = async () => {
    try {
      const formattedStartDate = formatDateToDDMMYYYY(startDate);
      const formattedEndDate = formatDateToDDMMYYYY(endDate);
      const params = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };
      const response = await GetAllRecords(params);
      console.log(response.data);
      console.log("Start date: " + formattedStartDate , formattedEndDate)
      if (formattedStartDate > formattedEndDate) {
        setError(true);
      } else {
        setError(false);
        const filteredData = response.data.filter((item) => {
          const itemDate = item.Day; 
          console.log("itemDate" , itemDate,formattedStartDate,formattedEndDate)
          console.log("item" , itemDate >= formattedStartDate && itemDate <= formattedEndDate)
          return itemDate >= formattedStartDate && itemDate <= formattedEndDate;
        });
        setData(filteredData);
        setdatacopy(filteredData);
      }
    } catch (error) {
     setError(true);
    } 
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  console.log("data", data);

  useEffect(() => {
    const filteredData = datacopy.filter((item) => {
      const matchesAge =
        selectedAge === "All" ||
        (selectedAge === "15-25" && item.Age === "15-25") ||
        (selectedAge === ">25" && item.Age === ">25");

      const matchesGender =
        selectedGender === "All" || item.Gender === selectedGender;

      return matchesAge && matchesGender;
    });
    setData(filteredData);
  }, [selectedAge, selectedGender, datacopy]);

  const categories = ["A", "B", "C", "D", "E", "F"];

  const chartData = {
    labels: categories,
    datasets: [
      {
        axis: "y",
        label: "Time Spent",
        data: data.reduce(
          (totals, item) => {
            ["A", "B", "C", "D", "E", "F"].forEach((key, index) => {
              totals[index] += item[key] || 0;
            });
            return totals;
          },
          [0, 0, 0, 0, 0, 0]
        ),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleBarClick = (event, elements) => {
    if (!elements.length) return;
    const clickedCategory = categories[elements[0].index];

    const trendData = data.map((item) => item[clickedCategory]);
    const labels = data.map((item) => item.Day);
    setLineChartData({
      labels,
      datasets: [
        {
          label: `Trend for ${clickedCategory}`,
          data: trendData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
        },
      ],
    });
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date", // X-axis title
        },
      },
      y: {
        title: {
          display: true,
          text: "Time Spent (Minutes)", // Y-axis title
        },
        beginAtZero: true, // Start y-axis from 0
      },
    },
  };

  return (
    <>
      <Navbar />
      <section className="main-container">
        <header className="main-container-header">
          <section className="main-container-date">
            <div className="DatePicker">
              <label>Start Date</label>
              <DatePicker
                className="DateSelector"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Start Date"
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div className="DatePicker">
              <label>End Date</label>
              <DatePicker
                className="DateSelector"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="End Date"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </section>

          <section className="main-container-filter">
            <div>
              <label>Age Group: </label>
              <select
                className="DateSelector"
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
              >
                <option value="All">All</option>
                <option value="15-25">15-25</option>
                <option value=">25">{">"} 25</option>
              </select>
            </div>

            <div>
              <label>Gender: </label>
              <select
                className="DateSelector"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <button className="GetUsersData" onClick={fetchData}>
              Get Users Data
            </button>
            <button className="GetUsersData" onClick={handleClearPreferences}>
              Reset Preferences
            </button>
          </section>
        </header>

{Error ? (<>
 <ErrorPage/>
</>): (
  <div>
  {data.length > 0 && (
    <section className="main-container-chart">

      <section className="bar-chart">
        <p>Horizontal Bar Chart</p>
        <Bar
          data={chartData}
          options={{
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
            },
            scales: {
              x: {
                beginAtZero: true,
              },
            },
            onClick: handleBarClick,
          }}
          height={1500}
        />
      </section>

      <section className="line-chart">
        {lineChartData && (
          <div>
            <p>Line Chart</p>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        )}
      </section>

    </section>
  )}
  </div>
)}

      </section>
    </>
  );
};

export default Dashboard;
