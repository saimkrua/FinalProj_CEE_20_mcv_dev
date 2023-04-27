const taskBox = document.querySelector(".task-box"),
    submitBtn = document.querySelector(".add-btn"),
    form = document.querySelector("#frm");
    
let isMenu, isEditTask = false;
let editTaskStatus = "pending";
let editId, currentFilter = "";

// style toggle
var priors = document.getElementsByClassName("prior");
var arrprior = [...priors];
arrprior.forEach((element, index) => {
    element.addEventListener("click", () => {
        element.style.opacity = "1";
        if (index == 0) { //value 2
            element.parentElement.style.backgroundColor = "#a5c97f";
        } else if (index == 1) { //value 1
            element.parentElement.style.backgroundColor = "#fad67c";
        } else { //value 0
            element.parentElement.style.backgroundColor = "#e36c6c";
        }
        arrprior
            .filter(function (item) {
                return item != element;
            })
            .forEach((item) => {
                item.style.opacity = "0";
            });
    });
});

//get user
let user = "";
let student_id = "";
const getUser = async () => {
    user = await getUserProfile();
    console.log("user:", user);
    student_id = user.student.id;
}

//filter for all pending complete
const filters = document.querySelectorAll(".filters span");
filters.forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

const showCourseList = async () => {
    const course_option = document.getElementById("course-option");
    const course_list = await getAllCourseName();
    course_list.forEach(course => {
        course_option.innerHTML += `<option>${course}</option>`;
    });
    course_option.innerHTML += `<option>etc</option>`;
}

const showUserProfile = async () => {
    document.getElementById("eng-name-info").innerHTML += `${user.student.firstname_en} ${user.student.lastname_en}`;
    document.getElementById("id-info").innerHTML += student_id;
}

const showTodo = async (filter) => {
    currentFilter = filter;
    let todos = await getAllTask(); //GET
    let liTag = "";
    if (todos) {
        todos.forEach((todo) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                liTag += `<tr class="task">
                            <td class="task-first-column">
                                <table>
                                <tr>
                                    <td><input onclick='updateStatus(this)' type="checkbox" id="${todo.task_id}" ${completed}> </td>
                                    <td id="title" class="${completed}">${todo.title}</td>
                                </tr> 
                                <tr>  
                                    <td></td>
                                    <td class="task-course"><span class="dot-prior" id="d${todo.priority}"></span><span id="course">${todo.course}</span></td>
                                </tr>
                                </table>
                            </td>
                            <td>
                                <p>${todo.detail}</p>
                            </td>
                            <td class="task-last-column">
                                <div class="settings">
                                    <img class="threedot" id="ellipsis-h" src="images/ellipsis-h.svg">
                                    <ul class="task-menu">
                                        <li><img class="images" src="/images/pen.svg" onclick='editTask("${todo.title}","${todo.detail}","${todo.status}","${todo.course}","${todo.task_id}", "${filter}")'>edit</li>
                                        <li><img class="images" src="images/trash-alt.svg" onclick='deleteTask("${todo.task_id}", "${filter}")'>delete</li>
                                    </ul>
                                </div>
                            </td>
                        </tr>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
}

document.addEventListener("click", (e) => {
    console.log(e.target.className);
    handleMenu(e);
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const recievedata = new FormData(form);
    const formJSON = Object.fromEntries(recievedata.entries());
    if (!isEditTask) {
        let data = {
            title: formJSON.title.trim(),
            detail: formJSON.detail.trim(),
            course: formJSON.course.trim(),
            status: "pending",
            priority: formJSON.priority.trim()
        };
        createTask(data, student_id);
    } else {
        let data = {
            title: formJSON.title.trim(),
            detail: formJSON.detail.trim(),
            course: formJSON.course.trim(),
            status: editTaskStatus,
            priority: formJSON.priority.trim()
        };
        updateTask(data, editId, student_id);
        isEditTask = false;
    }
    clearInput();
    showTodo(currentFilter);       //GET
});

function handleMenu(e) {
    if (isMenu) {
        if (e.target.className == "threedot" && !e.target.parentElement.lastElementChild.classList.contains("show")) {
            let nodes = document.querySelectorAll(".task-menu.show");
            nodes.forEach((node) => node.classList.toggle("show"));
            e.target.parentElement.lastElementChild.classList.toggle("show");
        } else {
            let nodes = document.querySelectorAll(".task-menu.show");
            nodes.forEach((node) => node.classList.toggle("show"));
            isMenu = false;
        }
    } else {
        if (e.target.className == "threedot") {
            isMenu = true;
            e.target.parentElement.lastElementChild.classList.toggle("show");
        }
    }
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.nextSibling.nextSibling;
    const status = selectedTask.checked ? "completed" : "pending";
    taskName.classList.toggle("checked");
    updateStatusTask(status, selectedTask.id, student_id);    //PATCH
}


function deleteTask(deleteId, filter) {
    removeTask(deleteId, student_id);   //DELETE
    showTodo(filter);       //GET
}

function editTask(title, detail, status, course, task_id, filter) {
    editTaskStatus = status;
    editId = task_id;
    currentFilter = filter;
    isEditTask = true;
    submitBtn.innerHTML = `Edit`;

    taskInput.value = title;
    taskDesInput.value = detail;
    courseOption.value = course;
    taskInput.focus();
}

function clearInput() {
    taskInput.value = "";
    taskDesInput.value = "";
    courseOption.value = "Select Course";
    submitBtn.innerHTML = `Add`;
}

const init = async () => {
    await getUser();
    await showUserProfile();
    await showCourseList();
    await showTodo("all");
}

init();

