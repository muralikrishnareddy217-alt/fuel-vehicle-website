const brandSuggestions = [
  "Toyota", "Honda", "Hyundai", "BMW", "Audi", "Mercedes-Benz",
  "Kia", "Ford", "Tesla", "Nissan", "Volvo", "Chevrolet", "Mazda",
  "Subaru", "Jeep", "Renault", "Peugeot", "Volkswagen", "Porsche",
  "Lexus", "Jaguar", "Mini", "Acura", "Ferrari", "Maserati", "Land Rover"
];

const modelSuggestions = {
  Toyota: ["Corolla", "Camry", "Prius", "RAV4", "Fortuner", "Hilux", "Yaris"],
  Honda: ["Civic", "Accord", "City", "CR-V", "HR-V", "Pilot"],
  Hyundai: ["Elantra", "Creta", "Tucson", "Verna", "Ioniq", "Santa Fe"],
  BMW: ["3 Series", "5 Series", "7 Series", "X5", "M3", "M5", "i8"],
  Audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7", "R8"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "AMG GT"],
  Kia: ["Seltos", "Sportage", "Carnival", "Sonet", "Cerato", "Carens"],
  Ford: ["Focus", "Mustang", "Explorer", "F-150", "Escape", "Bronco"],
  Tesla: ["Model S", "Model 3", "Model X", "Model Y"],
  Nissan: ["Altima", "Sentra", "Patrol", "Rogue", "GT-R", "X-Trail"],
  Volvo: ["S60", "V60", "XC60", "XC90", "S90"],
  Chevrolet: ["Malibu", "Cruze", "Camaro", "Silverado", "Tahoe"],
  Mazda: ["Mazda3", "Mazda6", "CX-5", "CX-9", "MX-5"],
  Subaru: ["Impreza", "Outback", "Forester", "WRX", "Crosstrek"],
  Jeep: ["Wrangler", "Cherokee", "Compass", "Grand Cherokee", "Renegade"],
  Renault: ["Clio", "Megane", "Captur", "Duster", "Kwid"],
  Peugeot: ["208", "308", "508", "3008", "5008"],
  "Volkswagen": ["Golf", "Polo", "Passat", "Jetta", "Tiguan", "Touareg"]
};

const state = {
  page: "menu",
  step: 1,
  brand: "",
  model: ""
};

function showPage(page) {
  state.page = page;

  const panels = document.querySelectorAll(".panel");
  panels.forEach(panel => panel.classList.remove("active"));

  if (page === "add") {
    document.getElementById("addPanel").classList.add("active");
  } else if (page === "search") {
    document.getElementById("searchPanel").classList.add("active");
  } else if (page === "all") {
    loadReport();
    document.getElementById("allPanel").classList.add("active");
  }

  document.getElementById("menu").style.display = page === "menu" ? "grid" : "none";
}

function renderBrandSuggestions() {
  const query = document.getElementById("brandSearch").value.trim().toLowerCase();
  const results = document.getElementById("brandResults");
  results.innerHTML = "";

  const matches = brandSuggestions.filter(item =>
    item.toLowerCase().includes(query)
  ).slice(0, 10);

  if (!query && !matches.length) {
    return;
  }

  if (!matches.length) {
    const custom = document.createElement("div");
    custom.className = "custom-item";
    custom.textContent = `Use brand: "${document.getElementById("brandSearch").value.trim()}"`;
    custom.onclick = () => {
      state.brand = document.getElementById("brandSearch").value.trim();
      updateSummary();
      renderBrandSuggestions();
    };
    results.appendChild(custom);
    return;
  }

  matches.forEach(item => {
    const div = document.createElement("div");
    div.className = `result-item ${state.brand === item ? "selected" : ""}`;
    div.textContent = item;
    div.addEventListener("click", () => {
      state.brand = item;
      document.getElementById("brandSearch").value = item;
      renderBrandSuggestions();
      updateSummary();
    });
    results.appendChild(div);
  });

  const custom = document.createElement("div");
  custom.className = "custom-item";
  custom.textContent = `Use brand: "${document.getElementById("brandSearch").value.trim()}"`;
  custom.onclick = () => {
    state.brand = document.getElementById("brandSearch").value.trim();
    updateSummary();
    renderBrandSuggestions();
  };
  results.appendChild(custom);
}

function renderModelSuggestions() {
  const query = document.getElementById("modelSearch").value.trim().toLowerCase();
  const results = document.getElementById("modelResults");
  results.innerHTML = "";

  const baseModels = modelSuggestions[state.brand] || [];
  const matches = baseModels.filter(item => item.toLowerCase().includes(query)).slice(0, 10);

  if (!state.brand) {
    results.innerHTML = "<div class='custom-item'>Choose a brand first</div>";
    return;
  }

  if (!query && !matches.length) {
    const custom = document.createElement("div");
    custom.className = "custom-item";
    custom.textContent = `Use model: "${document.getElementById("modelSearch").value.trim() || "Custom Model"}"`;
    custom.onclick = () => {
      state.model = document.getElementById("modelSearch").value.trim() || "Custom Model";
      updateSummary();
      renderModelSuggestions();
    };
    results.appendChild(custom);
    return;
  }

  if (!matches.length) {
    const custom = document.createElement("div");
    custom.className = "custom-item";
    custom.textContent = `Use model: "${document.getElementById("modelSearch").value.trim()}"`;
    custom.onclick = () => {
      state.model = document.getElementById("modelSearch").value.trim();
      updateSummary();
      renderModelSuggestions();
    };
    results.appendChild(custom);
    return;
  }

  matches.forEach(item => {
    const div = document.createElement("div");
    div.className = `result-item ${state.model === item ? "selected" : ""}`;
    div.textContent = item;
    div.addEventListener("click", () => {
      state.model = item;
      document.getElementById("modelSearch").value = item;
      renderModelSuggestions();
      updateSummary();
    });
    results.appendChild(div);
  });

  const custom = document.createElement("div");
  custom.className = "custom-item";
  custom.textContent = `Use model: "${document.getElementById("modelSearch").value.trim()}"`;
  custom.onclick = () => {
    state.model = document.getElementById("modelSearch").value.trim();
    updateSummary();
    renderModelSuggestions();
  };
  results.appendChild(custom);
}

function updateAddProgress() {
  const pills = document.querySelectorAll(".step-pill");
  pills.forEach((pill, index) => {
    pill.classList.remove("active", "done");
    const stepNum = index + 1;

    if (stepNum < state.step) {
      pill.classList.add("done");
    } else if (stepNum === state.step) {
      pill.classList.add("active");
    }
  });
}

function showAddStep(step) {
  state.step = step;

  const steps = document.querySelectorAll(".step");
  steps.forEach(s => {
    s.style.display = Number(s.dataset.step) === step ? "block" : "none";
  });

  const backBtn = document.getElementById("backBtn");
  const nextBtn = document.getElementById("nextBtn");

  backBtn.style.visibility = step === 1 ? "hidden" : "visible";

  if (step === 4) {
    nextBtn.textContent = "Save";
  } else {
    nextBtn.textContent = "Next";
  }

  updateAddProgress();
  updateSummary();
}

function updateSummary() {
  const year = document.getElementById("year")?.value || "-";
  const fuelType = document.getElementById("fuelType")?.value || "-";
  const mileage = document.getElementById("mileage")?.value || "-";
  const color = document.getElementById("color")?.value || "-";

  document.getElementById("summaryBrand").textContent = state.brand || "-";
  document.getElementById("summaryModel").textContent = state.model || "-";
  document.getElementById("summaryYear").textContent = year;
  document.getElementById("summaryFuel").textContent = fuelType;
  document.getElementById("summaryMileage").textContent = mileage + " km/l";
  document.getElementById("summaryColor").textContent = color;

  document.getElementById("finalVehicleName").textContent = `${state.brand || "Your"} ${state.model || "Vehicle"}`;
  document.getElementById("finalVehicleMeta").textContent = `${year} • ${fuelType} • ${color} • ${mileage} km/l`;
}

function validateAddStep() {
  if (state.step === 1 && !state.brand) {
    alert("Please select or type a valid brand.");
    return false;
  }

  if (state.step === 2 && !state.model) {
    alert("Please select or type a valid model.");
    return false;
  }

  if (state.step === 3) {
    const year = document.getElementById("year").value.trim();
    const mileage = document.getElementById("mileage").value.trim();
    const color = document.getElementById("color").value.trim();

    if (!year || !mileage || !color) {
      alert("Please fill all fields.");
      return false;
    }
  }

  return true;
}

async function saveVehicle() {
  const formData = new FormData();
  formData.append("brand", state.brand);
  formData.append("model", state.model);
  formData.append("year", document.getElementById("year").value);
  formData.append("fuel_type", document.getElementById("fuelType").value);
  formData.append("mileage", document.getElementById("mileage").value);
  formData.append("color", document.getElementById("color").value);

  try {
    const response = await fetch("/save", {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    if (!response.ok) {
      alert(result.message || "Failed to save vehicle.");
      return;
    }

    alert(result.message);
    resetWizard();
    showPage("menu");
  } catch (error) {
    alert("Something went wrong while saving vehicle.");
  }
}

function resetWizard() {
  state.brand = "";
  state.model = "";
  state.step = 1;

  document.getElementById("brandSearch").value = "";
  document.getElementById("modelSearch").value = "";
  document.getElementById("year").value = "2024";
  document.getElementById("fuelType").value = "Petrol";
  document.getElementById("mileage").value = "18";
  document.getElementById("color").value = "Blue";

  document.getElementById("brandResults").innerHTML = "";
  document.getElementById("modelResults").innerHTML = "";
  updateSummary();
  showAddStep(1);
}

async function loadRecords() {
  try {
    const response = await fetch("/records");
    const data = await response.json();

    if (response.ok) {
      renderTable(data.records, "recordsTableBody");
    }
  } catch (error) {
    console.error("Error loading records:", error);
  }
}

async function loadSearchResults(query) {
  try {
    const url = query ? `/search?q=${encodeURIComponent(query)}` : "/records";
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      renderTable(data.records, "searchTableBody");
    }
  } catch (error) {
    console.error("Error searching:", error);
  }
}

async function loadReport() {
  try {
    const response = await fetch("/report");
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to load report");
    }

    document.getElementById("totalRecords").textContent = data.total_records || 0;
    document.getElementById("avgMileage").textContent = Number(data.avg_mileage || 0).toFixed(2);

    const analysis = document.getElementById("vehicleAnalysis");
    if (!data.by_vehicle || data.by_vehicle.length === 0) {
      analysis.innerHTML = "<p>No data available.</p>";
      return;
    }

    analysis.innerHTML = data.by_vehicle.map(item => `
      <div class="analysis-item">
        <strong>${item.brand} ${item.model}</strong>
        <span>Avg mileage: ${Number(item.avg_mileage).toFixed(2)} km/L</span>
        <span>Count: ${item.count}</span>
      </div>
    `).join("");

    const records = await (await fetch("/records")).json();
    renderTable(records.records, "recordsTableBody");
  } catch (error) {
    console.error("Report error:", error);
  }
}

function renderTable(records, tbodyId) {
  const tbody = document.getElementById(tbodyId);

  if (!records || records.length === 0) {
    tbody.innerHTML = "<tr><td colspan='7'>No records found.</td></tr>";
    return;
  }

  tbody.innerHTML = records.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.brand}</td>
      <td>${item.model}</td>
      <td>${item.year}</td>
      <td>${item.fuel_type}</td>
      <td>${Number(item.mileage).toFixed(2)}</td>
      <td>${item.color}</td>
    </tr>
  `).join("");
}

document.getElementById("menu").addEventListener("click", (event) => {
  const card = event.target.closest(".menu-card");
  if (!card) return;

  const page = card.dataset.page;

  if (page === "add") {
    resetWizard();
    showPage("add");
  } else if (page === "search") {
    showPage("search");
    document.getElementById("searchInput").value = "";
    loadSearchResults("");
  } else if (page === "all") {
    loadReport();
    showPage("all");
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (!validateAddStep()) return;

  if (state.step < 4) {
    state.step += 1;
    showAddStep(state.step);
  } else {
    saveVehicle();
  }
});

document.getElementById("backBtn").addEventListener("click", () => {
  if (state.step > 1) {
    state.step -= 1;
    showAddStep(state.step);
  }
});

document.getElementById("brandSearch").addEventListener("input", renderBrandSuggestions);
document.getElementById("modelSearch").addEventListener("input", renderModelSuggestions);

document.getElementById("searchBtn").addEventListener("click", () => {
  const value = document.getElementById("searchInput").value.trim();
  loadSearchResults(value);
});

document.getElementById("searchInput").addEventListener("input", () => {
  const value = document.getElementById("searchInput").value.trim();
  loadSearchResults(value);
});

document.getElementById("year").addEventListener("input", updateSummary);
document.getElementById("fuelType").addEventListener("change", updateSummary);
document.getElementById("mileage").addEventListener("input", updateSummary);
document.getElementById("color").addEventListener("input", updateSummary);

showPage("menu");
showAddStep(1);
