import SideBar from "../Dashboard/SideBar";
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LineController, LinearScale, PointElement, LineElement } from 'chart.js';

Chart.register(CategoryScale, LineController, LinearScale, PointElement, LineElement);

const Dashboard = () => {

  const datos = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Ventas',
      data: [120, 150, 180, 90, 200],
      backgroundColor: 'rgba(0, 123, 255, 0.5)',
      borderColor: 'rgba(0, 123, 255, 1)',
      borderWidth: 1
    }]
  };

  const opciones = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };






    return (
      <div className="grid grid-cols-6">
          <SideBar/>
          <div className="col-span-5 bg-yellow-200 w-100 h-100 " >

          <Line data={datos} options={opciones}  />





          </div>
      </div>
    );
  };
  
  export default Dashboard;