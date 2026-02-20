import { useState } from "react";
import Login from "./component/Login";
import Register from "./component/Register";
import Dashboard from "./component/Dashboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');

  return (
    <div>
      {user ? (
        <Dashboard user={user} setUser={setUser} />
      ) : (
        view === 'login' ? (
          <Login setUser={setUser} setView={setView} />
        ) : (
          <Register setUser={setUser} setView={setView} />
        )
      )}
    </div>
  );
}

export default App;
