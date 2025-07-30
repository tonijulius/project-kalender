const monthYearEl = document.getElementById("monthYear");
    const calendarDaysEl = document.getElementById("calendarDays");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    const taskListEl = document.getElementById("taskList");
    const newTaskInput = document.getElementById("newTaskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");

    let currentDate = new Date();
    let storedTasks = JSON.parse(localStorage.getItem("calendarTasks")) || {};

    function saveTasks() {
      localStorage.setItem("calendarTasks", JSON.stringify(storedTasks));
    }

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

      const formatDate = (y, m, d) =>
        `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        calendarDaysEl.appendChild(empty);
      }

      for (let i = 1; i <= lastDate; i++) {
        const dateKey = formatDate(year, month + 1, i);
        const dayEl = document.createElement("div");
        dayEl.classList.add("day");
        dayEl.dataset.date = dateKey;
        dayEl.innerHTML = `<span class="date">${i}</span>`;

        if (storedTasks[dateKey] && storedTasks[dateKey].length > 0) {
          dayEl.classList.add("has-task");
          const taskList = storedTasks[dateKey].join("\n");
          dayEl.setAttribute("data-tasks", taskList);
        }

        dayEl.ondragover = (e) => e.preventDefault();
        dayEl.ondrop = (e) => {
          const taskId = e.dataTransfer.getData("text");
          const task = document.getElementById(taskId);
          const taskText = task.textContent;

          if (!storedTasks[dateKey]) storedTasks[dateKey] = [];
          storedTasks[dateKey].push(taskText);
          saveTasks();
          renderCalendar(currentDate);
        };

        calendarDaysEl.appendChild(dayEl);
      }
    }

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

    prevMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar(currentDate);
    });

    nextMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar(currentDate);
    });

    renderCalendar(currentDate);
  