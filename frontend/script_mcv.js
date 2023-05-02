// Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const authorizeApplication = () => {
    window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};
const loginout = async() => {
    const loginbutton = document.querySelector(".login-button");
    if (document.getElementById("id-info").innerHTML == ""){
        loginbutton.outerHTML=`<button class="login-button" onclick=authorizeApplication()>Login</button>`;
    }else{
        loginbutton.outerHTML=`<button class="logout-button" onclick=logout()>Logout</button>`;
    }
}

const logout = () => {
    window.location.href = `http://${backendIPAddress}/courseville/logout`;
};

// Send Get user profile ("GET") request to backend server and show the response on the webpage
const getUserProfile = async () => {
    const options = {
        method: "GET",
        credentials: "include",
    };
    try {
        const response = await fetch(`http://${backendIPAddress}/courseville/get_profile_info`, options);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
};

// Send Get all courses ("GET") request to backend server and 
const getAllCourseName = async function () {
    try {
        const response = await fetch(`http://${backendIPAddress}/courseville/get_all_course`, {
            method: "GET",
            credentials: "include",
        })
        const data = await response.json();
        let allCourse = data.student.filter((course) => course.year == year & course.semester == semester);
        allCourse = allCourse.map((course) => { return course.title });
        console.log(allCourse);
        return allCourse;
    } catch (error) {
        console.error(error);
    }
}





