import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const res = await axios.post("https://auth-app-n5yv.onrender.com/api/auth/signup", {
      username,
      email,
      password,
    });

    alert(res.data.message);

    if (res.data.message === "Signup successful") {
      navigate("/");
    }
  };

  return (
    <div>
      <h2>Signup</h2>

      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <br />

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <br />

      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <br />

      <button onClick={handleSignup}>Signup</button>

      <p onClick={() => navigate("/")}>Already have account? Login</p>
    </div>
  );
}

export default Signup;