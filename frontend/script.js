const taskBox = document.querySelector(".task-box"),
    submitBtn = document.querySelector(".add-btn");
    filters = document.querySelectorAll(".filter span");

const taskInput = document.querySelector("#task-topic-input"),
    taskDesInput = document.querySelector("#task-des-input"),
    priorOrange = document.querySelector("#orange"),
    priorAmber = document.querySelector("#amber"),
    priorLime = document.querySelector("#lime"),
    courseOption = document.querySelector("#course-option");
let user = "";
let student_id = "";
let isMenu, isEditTask = false;
let editTaskStatus = "pending";
let editId, currentFilter = "";
filters.forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

const getUser = async () => {
    user = await getUserProfile();
    student_id = user.student.id;
}

const showCourseList = async () => {
    const course_option = document.getElementById("course-option");
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
    currentFilter = filter;
    let todos = await getAllTask(); //GET
    let liTag = "";
    if (todos) {
        todos.forEach((todo) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                liTag += `<tr class="task">
                            <td>
                                <table>
                                <tr>
                                    <td><input onclick='updateStatus(this)' type="checkbox" id="${todo.task_id}" ${completed}> </td>
                                    <td id="title" class="${completed}">${todo.title}</td>
                                </tr> 
                                <tr>  
                                    <td></td>
                                    <td><p>${todo.course}</p></td>
                                </tr>
                                </table>
                            </td>
                            <td>
                                <p>${todo.detail}</p>
                            </td>
                            <td>
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
submitBtn.addEventListener("click", (e) => {
    console.log(e.target.className);
    handleSubmit(e);
    
});
taskBox.addEventListener("click", (e) => {
    console.log(e.target.className);
    
    handleMenu(e);
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

function handleSubmit(e) {
    
        if (isValidateInput()) {
            if (!isEditTask) {
                let data = {
                    title: taskInput.value.trim(),
                    detail: taskDesInput.value.trim(),
                    course: courseOption.value.trim(),
                    status: "pending",
                    priority: "fix"
                };
                createTask(data, student_id);
            } else {
                let data = {
                    title: taskInput.value.trim(),
                    detail: taskDesInput.value.trim(),
                    course: courseOption.value.trim(),
                    status: editTaskStatus,
                    priority: "fix"
                };
                updateTask(data, editId, student_id);
                isEditTask = false;
            }
            clearInput();
            showTodo(currentFilter);       //GET
        } else {
            alert("Please Fill In All Required Fields");
        }
    
}

function isValidateInput() {
    let a = taskInput.value.trim(),
        b = taskDesInput.value.trim(),
        c = priorOrange.value.trim(),
        d = priorAmber.value.trim(),
        e = priorLime.value.trim(),
        f = courseOption.value.trim();
    // console.log("a:", (a == null || a == ""));
    // console.log("b:", b);
    // console.log("c:", c);
    // console.log("d:", d);
    // console.log("e:", e);
    // console.log("f:", f);
    if ((a == null || a == "")
        || (b == null || b == "")
        || ((c == null || c == "") && (d == null || d == "") && (e == null || e == "")) //need fixing
        || (f == null || f == "" || f == "Select Course")) { return false; }
    return true;
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

function clearInput(){
    taskInput.value = "";
    taskDesInput.value = "";
    courseOption.value = "Select Course";
    submitBtn.innerHTML = `Add`;
}

getUser();
showUserProfile();
showCourseList();
showTodo("all");
