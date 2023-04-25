const showCourseList = async () => {
    const course_option = document.getElementById("course-option");
    course_option.innerHTML = "";
    const course_list = await getAllCourseName();
    course_list.forEach(course => {
        course_option.innerHTML += `<option>${course}</option>`;
    });
    course_option.innerHTML += `<option>etc</option>`;
}