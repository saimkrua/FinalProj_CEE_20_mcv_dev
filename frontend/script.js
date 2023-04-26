const taskBox = document.querySelector(".task-box"),
    taskInput = document.querySelector(".task-input input"),
    taskDesInput = document.querySelector(".task-des-input"),
    priorOrange = document.querySelector(".orange"),
    priorAmber = document.querySelector(".amber"),
    priorLime = document.querySelector(".lime"),
    courseOption = document.querySelector(".course-option"),
    filters = document.querySelectorAll(".filters span")

let isMenu, editId, isEditTask = false;
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
                                        <li><img class="images" src="/images/pen.svg" onclick='editTask("${todo.task_id}", "${todo.name}")'>edit</li>
                                        <li><img class="images" src="images/trash-alt.svg" onclick='deleteTask("${todo.task_id}", "${filter}")'>delete</li>
                                    </ul>
                                </div>
                            </td>
                        </tr>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    // taskBox.offsetHeight >= 300
    //     ? taskBox.classList.add("overflow")
    //     : taskBox.classList.remove("overflow");
}

document.addEventListener("click", (e) => {
    console.log(e.target.className);
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
});


function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.nextSibling.nextSibling;
    const status = selectedTask.checked ? "completed" : "pending";
    taskName.classList.toggle("checked");
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
