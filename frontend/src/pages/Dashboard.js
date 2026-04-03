import { useLocation } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const username = location.state;

  return (
    <div>
      <h1>Hello, Welcome {username} 👋</h1>
    </div>
  );
}

export default Dashboard;