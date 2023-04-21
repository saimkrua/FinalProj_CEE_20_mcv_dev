// Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIPAddress = "127.0.0.1:3000";

const authorizeApplication = () => {
    window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};

// Send Get user profile ("GET") request to backend server and show the response on the webpage
const getUserProfile = async () => {
    const options = {
        method: "GET",
        credentials: "include",
    };
    await fetch(
        `http://${backendIPAddress}/courseville/get_profile_info`,
        options
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            document.getElementById(
                "eng-name-info"
            ).innerHTML = `${data.student.title_en} ${data.student.firstname_en} ${data.student.lastname_en}`;
            document.getElementById(
                "thai-name-info"
            ).innerHTML = `${data.student.title_th} ${data.student.firstname_th} ${data.student.lastname_th}`;
            document.getElementById(
                "id-info"
            ).innerHTML = data.student.id;
        })
        .catch((error) => console.error(error));
};

// Send Get all courses ("GET") request to backend server and 
const getAllCourseName = async function () {
    try {
        const response = await fetch(`http://${backendIPAddress}/courseville/get_all_course`, {
            method: "GET",
            credentials: "include",
        })
        const data = await response.json();
        const allCoursePromises = data.student.map(async (course) => {
            const courseName = await getCourseName(course.cv_cid);
            return courseName;
        });
        const allCourse = await Promise.all(allCoursePromises);
        console.log(allCourse);
        return allCourse;
    } catch (error) {
        console.error(error);
    }
}

const getCourseName = async (cv_cid) => {
    try {
        const response = await fetch(
            `http://${backendIPAddress}/courseville/get_course_info/${cv_cid}`,
            {
                method: "GET",
                credentials: "include",
            }
        );
        const data = await response.json();
        return data.title;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const logout = async () => {
    window.location.href = `http://${backendIPAddress}/courseville/logout`;
};


