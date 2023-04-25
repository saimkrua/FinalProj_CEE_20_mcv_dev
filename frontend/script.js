const taskBox = document.querySelector(".task-box");
taskInput = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span")

let editId, isEditTask = false
filters.forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

const showCourseList = async () => {
    const course_option = document.getElementById("course-option");
    course_option.innerHTML = "";
    const course_list = await getAllCourseName();
    course_list.forEach(course => {
        course_option.innerHTML += `<option>${course}</option>`;
    });
    course_option.innerHTML += `<option>etc</option>`;
}

const showUserProfile = async () => {
    const data = await getUserProfile();
    document.getElementById("eng-name-info").innerHTML = `${data.student.title_en} ${data.student.firstname_en} ${data.student.lastname_en}`;
    document.getElementById("thai-name-info").innerHTML = `${data.student.title_th} ${data.student.firstname_th} ${data.student.lastname_th}`;
    document.getElementById("id-info").innerHTML = data.student.id;
}

const showTodo = async (filter) => {
    let todos = await getAllTask(); //GET
    let liTag = "";
    if (todos) {
        todos.forEach((todo) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                liTag += `<li class="task">
                            <label for="${todo.task_id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${todo.task_id}" ${completed}>
                                <p class="${completed}">${todo.title}</p>
                            </label>
                            <div class="settings">
                                <img onclick="showMenu(this)" class="images" id="ellipsis-h" src="images/ellipsis-h.svg"></img>
                                <ul class="task-menu">
                                    <li><img class="images" src="/images/pen.svg" onclick='editTask("${todo.task_id}", "${todo.name}")'></img></i>edit</li>
                                    <li><img class="images" src="images/trash-alt.svg" onclick='deleteTask("${todo.task_id}", "${filter}")'></img></i>delete</li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    taskBox.offsetHeight >= 300
        ? taskBox.classList.add("overflow")
        : taskBox.classList.remove("overflow");
}

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", (e) => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    let status = "";
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        status = "completed";
    } else {
        taskName.classList.remove("checked");
        status = "pending";
    }
    updateStatusTask(status, selectedTask.id);    //PATCH
}

function deleteTask(deleteId, filter) {
    isEditTask = false;
    removeTask(deleteId);
    showTodo(filter);
}

// function editTask(taskId, textName) {
//     editId = taskId;
//     isEditTask = true;

//     taskInput.value = textName;
//     taskInput.focus();
//     taskInput.classList.add("active");
// }

// taskInput.addEventListener("keyup", (e) => {
//     let userTask = taskInput.value.trim();
//     if (e.key == "Enter" && userTask) {
//         if (!isEditTask) {
//             todos = !todos ? [] : todos;
//             let taskInfo = { name: userTask, status: "pending" };
//             todos.push(taskInfo);
//         } else {
//             isEditTask = false;
//             todos[editId].name = userTask;
//         }
//         taskInput.value = "";
//         localStorage.setItem("todo-list", JSON.stringify(todos));
//         showTodo(document.querySelector("span.active").id);
//     }
// });

showUserProfile();
showCourseList();
showTodo("all");
