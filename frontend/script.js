const taskBox = document.querySelector(".task-box"),
    submitBtn = document.querySelector(".add-btn"),
    form = document.querySelector("#frm"),
    bgPrior = document.querySelector(".tri-state-toggle");

let isMenu, isEditTask = false;
let editTaskStatus = "pending";
let editId, currentFilter = "";

// style toggle
var priors = document.getElementsByClassName("prior");
var arrprior = [...priors];
arrprior.forEach((element) => {
    element.addEventListener("click", () => {
        setBgPrior(element);
        element.checked = true; //for value
        element.classList.toggle("checked"); //for css
    });
});

function setBgPrior(prior){
    arrprior.forEach((element) => {element.classList.remove("checked");});
    if (prior == form["green"]){ //green
        bgPrior.style.backgroundColor = "#a5c97f";
    }else if (prior == form["yellow"]){ //yellow
        bgPrior.style.backgroundColor = "#fad67c";
    }else{ //red
        bgPrior.style.backgroundColor = "#e36c6c";
    }
}

//get user
let user = "";
let student_id = "";
const getUser = async () => {
    user = await getUserProfile();
    console.log("user:", user);
    student_id = user.student.id;
}

//filter for all pending complete
const filters = document.querySelectorAll(".filter span");
filters.forEach((btn) => {
    btn.addEventListener("click", () => {
        console.log(btn);
        // for each filters set default
        let nodes = document.querySelectorAll(".filter span.checked");
        nodes.forEach((node) => node.classList.toggle("checked"));
        btn.classList.toggle("checked");
        showTodo(btn.id);
    });
});

// arrprior.forEach((element) => {
//     element.addEventListener("click", () => {
//         setBgPrior(element);
//         element.checked = true; //for value
//         element.classList.toggle("checked"); //for css
//     });
// });

const showCourseList = async () => {
    const course_option = document.getElementById("course-option");
    const course_list = await getAllCourseName();
    course_list.innerHTML += `<option value="" selected disabled hidden>Select Course</option>`
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
        for (var i=0;i<3;i++){
            todos.forEach((todo) => {
                if (todo.priority == i.toString()){
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
                                                <li><img class="images" src="/images/pen.svg" onclick='editTask("${todo.title}","${todo.detail}","${todo.status}","${todo.course}","${todo.priority}","${todo.task_id}", "${filter}")'>edit</li>
                                                <li><img class="images" src="images/trash-alt.svg" onclick='deleteTask("${todo.task_id}", "${filter}")'>delete</li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>`;
                    }
                }
            });
            
        }
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
}

document.addEventListener("click", (e) => { //pls don't change this line
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

function editTask(title, detail, status, course, priority, task_id, filter) {
    editTaskStatus = status;
    editId = task_id;
    currentFilter = filter;
    isEditTask = true;
    submitBtn.innerHTML = `Edit`;

    form["task-topic-input"].value = title;
    form["task-des-input"].value = detail;
    form["course-option"].value = course;
    
    let priorNode = "";
    if (priority == 0) priorNode = form["red"];
    else if (priority == 1) priorNode = form["yellow"];
    else priorNode = form["green"];
    setBgPrior(priorNode);
    priorNode.classList.toggle("checked");
    form["priority"].value = priority; //for value

    form["task-topic-input"].focus();
}

function clearInput() {
    form["task-topic-input"].value = "";
    form["task-des-input"].value = "";
    form["course-option"].value = "Select Course";
    setBgPrior(form["green"]);
    form["priority"].value = "2";
    form["green"].classList.toggle("checked");
    submitBtn.innerHTML = `Add`;
}

const init = async () => {
    clearInput();
    await getUser();
    await showUserProfile();
    await showCourseList();
    await showTodo("all");
    await loginout();
}

init();

