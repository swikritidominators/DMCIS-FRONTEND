/********************************
 * GLOBAL DATA
 ********************************/
let wards = [];

/********************************
 * FETCH DATA FROM BACKEND
 ********************************/
fetch("https://dcims-backend-1.onrender.com/api/wards")
  .then(res => res.json())
  .then(data => {
    wards = data;
    loadAll();
  })
  .catch(err => {
    console.error("Error fetching wards:", err);
    alert("Failed to load backend data");
  });

/********************************
 * WARD STATUS TABLE
 ********************************/
function loadTable() {
  const table = document.getElementById("wardTable");
  table.innerHTML = "";
  let highRisk = 0;

  wards.forEach(w => {
    if (w.risk === "High") highRisk++;

    table.innerHTML += `
      <tr>
        <td>${w.name}</td>
        <td>${w.zone}</td>
        <td>${w.mpi}</td>
        <td class="${w.risk.toLowerCase()}">${w.risk}</td>
      </tr>
    `;
  });

  const highRiskEl = document.getElementById("highRiskCount");
highRiskEl.innerText = highRisk;

if (highRisk > 0) {
  highRiskEl.classList.add("zero");
} else {
  highRiskEl.classList.remove("zero");
}

}

/********************************
 * AI-BASED DRAIN CHOKING TABLE
 ********************************/
function loadDrainAI() {
  const table = document.getElementById("drainTable");
  table.innerHTML = "";

  wards.forEach(w => {
    const tree = w.treeDensity;
    const market = w.marketDensity;

    const score = tree + market;
    const risk =
      score > 12 ? "High" :
      score > 8 ? "Medium" : "Low";

    table.innerHTML += `
      <tr>
        <td>${w.name}</td>
        <td>${tree}</td>
        <td>${market}</td>
        <td class="${risk.toLowerCase()}">${risk}</td>
      </tr>
    `;
  });
}

/********************************
 * RED ZONE LIST
 ********************************/
function loadRedZones() {
  const list = document.getElementById("redZoneList");
  list.innerHTML = "";

  wards
    .filter(w => w.risk === "High")
    .forEach(w => {
      list.innerHTML += `<li>🚨 ${w.name} (${w.zone})</li>`;
    });
}

/********************************
 * RAIN SIMULATION
 ********************************/
function simulateRain() {
  const rainEl = document.getElementById("rainStatus");
  rainEl.innerText = "Heavy Rain Alert";
  rainEl.className = "value zero"; // red alert

  wards.forEach(w => {
    w.mpi -= Math.floor(Math.random() * 8);

    if (w.mpi < 45) w.risk = "High";
    else if (w.mpi < 60) w.risk = "Medium";
    else w.risk = "Low";
  });

  loadAll();
  alert("Extreme rainfall simulated. AI risk updated.");
}

  wards.forEach(w => {
    w.mpi -= Math.floor(Math.random() * 8);

    if (w.mpi < 45) w.risk = "High";
    else if (w.mpi < 60) w.risk = "Medium";
    else w.risk = "Low";
  });

  loadAll();
  alert("Extreme rainfall simulated. AI risk updated.");

/********************************
 * COMPLAINT SYSTEM
 ********************************/
function submitComplaint() {
  alert("Citizen report logged successfully.");
}

/********************************
 * MAP (LEAFLET)
 ********************************/
const map = L.map("map").setView([28.6139, 77.2090], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

function loadMap() {
  wards.forEach(w => {
    L.circle(
      [28.6 + Math.random() / 10, 77.2 + Math.random() / 10],
      {
        radius: 1200,
        color:
          w.risk === "High"
            ? "red"
            : w.risk === "Medium"
            ? "orange"
            : "blue",
        fillOpacity: 0.4
      }
    )
      .addTo(map)
      .bindPopup(`${w.name} – ${w.risk} Risk`);
  });
}

/********************************
 * LOAD EVERYTHING
 ********************************/
function loadAll() {
  loadTable();
  loadDrainAI();
  loadRedZones();
  loadMap();
}
