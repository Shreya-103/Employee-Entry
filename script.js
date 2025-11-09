// Hardcoded admin credentials
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

// Predefined employee list (QR code = employee ID)
const employees = {
  "EMP001": { name: "John Doe", department: "IT" },
  "EMP002": { name: "Priya Sharma", department: "HR" },
  "EMP003": { name: "Ravi Kumar", department: "Finance" }
};

// Employee Details Page Logic
document.addEventListener("DOMContentLoaded", () => {
  const empDetailsDiv = document.getElementById("employee-details");
  if (empDetailsDiv) {
    const empId = localStorage.getItem("currentEmployeeId");
    const emp = employees[empId];
    if (!emp) {
      empDetailsDiv.innerHTML = `<p style='color:red;'>Invalid QR Code!</p>`;
      return;
    }

    const time = new Date().toLocaleString();
    const status = toggleStatus(empId);
    const record = { id: empId, name: emp.name, dept: emp.department, time, status };

    saveRecord(record);

    empDetailsDiv.innerHTML = `
      <h3>${emp.name}</h3>
      <p><b>ID:</b> ${empId}</p>
      <p><b>Department:</b> ${emp.department}</p>
      <p><b>Time:</b> ${time}</p>
      <p><b>Status:</b> ${status}</p>
    `;
  }

  // Admin Login Logic
  const loginForm = document.getElementById("admin-login");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = document.getElementById("username").value;
      const pass = document.getElementById("password").value;
      const msg = document.getElementById("login-msg");

      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        msg.innerText = "Login successful. Downloading records...";
        downloadRecords();
      } else {
        msg.innerText = "Invalid credentials!";
        msg.style.color = "red";
      }
    });
  }
});

// Toggle status: inside/outside
function toggleStatus(empId) {
  const records = JSON.parse(localStorage.getItem("records")) || [];
  const last = records.reverse().find(r => r.id === empId);
  return (last && last.status === "Inside Premises") ? "Outside Premises" : "Inside Premises";
}

// Save new record to localStorage
function saveRecord(record) {
  const records = JSON.parse(localStorage.getItem("records")) || [];
  records.push(record);
  localStorage.setItem("records", JSON.stringify(records));
}

// Download records as CSV
function downloadRecords() {
  const records = JSON.parse(localStorage.getItem("records")) || [];
  if (records.length === 0) {
    alert("No records available!");
    return;
  }
  const csv = [
    ["Employee ID", "Name", "Department", "Time", "Status"],
    ...records.map(r => [r.id, r.name, r.dept, r.time, r.status])
  ].map(e => e.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "employee_records.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
