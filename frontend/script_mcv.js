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
            console.log(data.data);
            document.getElementById(
                "eng-name-info"
            ).innerHTML = `${data.data.student.title_en} ${data.data.student.firstname_en} ${data.data.student.lastname_en}`;
            document.getElementById(
                "thai-name-info"
            ).innerHTML = `${data.data.student.title_th} ${data.data.student.firstname_th} ${data.data.student.lastname_th}`;
            document.getElementById(
                "id-info"
            ).innerHTML = `${data.data.student.id}`;
        })
        .catch((error) => console.error(error));
};

const logout = async () => {
    window.location.href = `http://${backendIPAddress}/courseville/logout`;
};


