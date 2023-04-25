// Send Get all Task ("GET") request to backend server 
const getAllTask = async () => {
    try {
        let student_id = await getUserProfile();
        student_id = student_id.student.id;
        const response = await fetch(`http://${backendIPAddress}/todolists/${student_id}`, {
            method: "GET",
            credentials: "include",
        })
        const data = await response.json();
        const allTask = data;
        console.log(allTask);
        return allTask;
    } catch (error) {
        console.error(error);
    }
}

const updateTask = async (data, task_id) => {
    try {
        let student_id = await getUserProfile();
        student_id = student_id.student.id;
        const response = await fetch(`http://${backendIPAddress}/todolists/${student_id}/${task_id}`, {
            method: 'PATCH',
            body: data, //should already stringtify
            credentials: "include"
        });
        if (response.ok) {
            // Request succeeded
            const updatedData = await response.json();
            console.log('Updated data:', updatedData);
        } else {
            // Request failed
            console.error('Request failed with status:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const updateStatusTask = async (newstatus, task_id) => {

    try {
        const data = { status: newstatus };
        console.log(data);
        let student_id = await getUserProfile();
        student_id = student_id.student.id;
        const response = await fetch(`http://${backendIPAddress}/todolists/status/${student_id}/${task_id}`, {
            method: 'PATCH',
            body: JSON.stringify(data, { removeUndefinedValues: true }),
            credentials: "include"
        });
        if (response.ok) {
            // Request succeeded
            const updatedData = await response.json();
            console.log('Updated data:', updatedData);
        } else {
            // Request failed
            console.error('Request failed with status:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const removeTask = async (task_id) => {
    try {
        let student_id = await getUserProfile();
        student_id = student_id.student.id;
        const response = await fetch(`http://${backendIPAddress}/todolists/${student_id}/${task_id}`, {
            method: 'DELETE',
            credentials: "include"
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('User deleted successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}



