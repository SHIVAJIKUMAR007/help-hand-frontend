import React, { useEffect, useState } from "react";
import axios from "../../axios";

function Profibited() {
  const [banned, setbanned] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      const d = await (await axios.get("/api/ban/allBanned")).data;
      setbanned(d);
    };
    fetchdata();
  });
  return (
    <div>
      <div className="container">
        <h1 className="my-5">Prohibited Item List</h1>
        <ul>
          {banned.map((ban) => (
            <li className="my-2">{ban}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Profibited;
