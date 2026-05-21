import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import './dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate();

  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);

  const user = localStorage.getItem("user");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const ownersResponse = await api.get("/owners");
      const petsResponse = await api.get("/pets");

      setOwners(ownersResponse.data);
      setPets(petsResponse.data);
    } catch (error) {
      console.log(error);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Dashboard PetShop</h1>

        <p className="welcome">Bem-vindo, {user}</p>

        <div className="buttons">
          <button onClick={() => navigate("/owners")}>Ver Owners</button>

          <button onClick={() => navigate("/pets")}>Ver Pets</button>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
