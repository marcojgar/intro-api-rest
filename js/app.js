const API_URL = "https://698a177bc04d974bc6a15352.mockapi.io/api/v1/dispositivos_IoT";

const DIRECCIONES = {
  1: "Adelante",
  2: "Detener",
  3: "Atrás",
  4: "Vuelta derecha adelante",
  5: "Vuelta izquierda adelante",
  6: "Vuelta derecha atrás",
  7: "Vuelta izquierda atrás",
  8: "Giro 90° derecha",
  9: "Giro 90° izquierda"
};

const table = document.getElementById("deviceTable");
const form = document.getElementById("deviceForm");
const formTitle = document.getElementById("formTitle");

document.addEventListener("DOMContentLoaded", getDevices);
form.addEventListener("submit", saveDevice);

/* ================= NUEVO ================= */
function newDevice() {
  form.reset();
  document.getElementById("deviceId").value = "";
  formTitle.textContent = "➕ Nuevo dispositivo";
}

/* ================= GET ================= */
async function getDevices() {
  const res = await fetch(API_URL);
  const data = await res.json();

  table.innerHTML = "";

  data.forEach(device => {
    table.innerHTML += `
      <tr>
        <td>${device.deviceName}</td>
        <td>${DIRECCIONES[device.direccionCode]}</td>
        <td>${device.ipClient || "-"}</td>
        <td>${new Date(device.dateTime).toLocaleString()}</td>
        <td>
          <button
            class="btn btn-warning btn-sm me-1"
            onclick="editDevice(${device.id})"
          >
            ✏️
          </button>
          <button
            class="btn btn-danger btn-sm"
            onclick="deleteDevice(${device.id})"
          >
            🗑️
          </button>
        </td>
      </tr>
    `;
  });
}

/* ================= POST / PUT ================= */
async function saveDevice(e) {
  e.preventDefault();

  const id = document.getElementById("deviceId").value;
  const direccionCode = document.getElementById("direccionCode").value;

  const payload = {
    deviceName: document.getElementById("deviceName").value,
    direccionCode: Number(direccionCode),
    direccionText: DIRECCIONES[direccionCode],
    dateTime: new Date().toISOString()
  };

  if (id) {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  newDevice();
  getDevices();
}

/* ================= EDIT ================= */
async function editDevice(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const device = await res.json();

  document.getElementById("deviceId").value = device.id;
  document.getElementById("deviceName").value = device.deviceName;
  document.getElementById("direccionCode").value = device.direccionCode;

  formTitle.textContent = "✏️ Editar dispositivo";
}

/* ================= DELETE ================= */
async function deleteDevice(id) {
  if (!confirm("¿Eliminar este dispositivo?")) return;

  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  getDevices();
}
