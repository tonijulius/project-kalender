const monthYearEl = document.getElementById("monthYear");
const calendarDaysEl = document.getElementById("calendarDays");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const taskListEl = document.getElementById("taskList");
const newTaskInput = document.getElementById("newTaskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

let currentDate = new Date();

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  monthYearEl.textContent = `${monthNames[month]} ${year}`;
  calendarDaysEl.innerHTML = "";

  // Kosongkan awal minggu
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendarDaysEl.appendChild(empty);
  }

  // Tampilkan tanggal
  for (let i = 1; i <= lastDate; i++) {
    const dayEl = document.createElement("div");
    dayEl.classList.add("day");
    dayEl.dataset.date = `${year}-${month + 1}-${i}`;
    dayEl.innerHTML = `<span class="date">${i}</span>`;
    dayEl.ondragover = (e) => e.preventDefault();
    dayEl.ondrop = (e) => {
      const taskId = e.dataTransfer.getData("text");
      const task = document.getElementById(taskId);
      dayEl.appendChild(task);
    };
    calendarDaysEl.appendChild(dayEl);
  }
}

// Tambah tugas baru
addTaskBtn.addEventListener("click", () => {
  const taskText = newTaskInput.value.trim();
  if (taskText === "") return;

  const taskEl = document.createElement("div");
  taskEl.classList.add("task");
  taskEl.textContent = taskText;
  taskEl.draggable = true;
  taskEl.id = "task-" + Date.now();

  taskEl.ondragstart = (e) => {
    e.dataTransfer.setData("text", taskEl.id);
  };

  taskListEl.appendChild(taskEl);
  newTaskInput.value = "";
});

// Navigasi bulan
prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

// Inisialisasi
renderCalendar(currentDate);
