const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    PutCommand,
    DeleteCommand,
    QueryCommand,
    UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const { getProfileInformation } = require("./coursevilleController");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

// Get ToDoList of student from DynamoDB
exports.getToDoList = async (req, res) => {
    const params = {
        TableName: process.env.aws_items_table_name,
        KeyConditionExpression: 'student_id = :id',
        ExpressionAttributeValues: {
            ':id': req.params.student_id,
        },
    };
    try {
        const response = await docClient.send(new QueryCommand(params));
        console.log(response);
        console.log(req.body);
        res.json(response.Items);
        /*do sth below this to sort data using priority*/


        /*do sth above this to sort data using priority*/
    } catch (err) {
        console.error("Unable to get task: ", err);
        res.status(400).send('Error retrieving tasks from DynamoDB');
    }
};

// Add ToDoList of student to DynamoDB
exports.addToDoList = async (req, res) => {
    const student_id = req.params.student_id;
    const task_id = uuidv4();
    const item = { student_id: student_id, ...req.body, task_id: task_id };
    const params = {
        Item: item,
        TableName: process.env.aws_items_table_name,
    };
    try {
        const response = await docClient.send(new PutCommand(params));
        console.log(response);
        console.log(req.body);
        res.send("Add ToDoList successfully");
    } catch (err) {
        console.error("Unable to add task: ", err);
        res.sendStatus(400).send('Error put task to DynamoDB');
    }
};

// Delete task from DynamoDB
exports.deleteToDoList = async (req, res) => {
    const { student_id, task_id } = req.params;
    const params = {
        TableName: process.env.aws_items_table_name,
        Key: {
            task_id: task_id,
            student_id: student_id,
        },
    };
    try {
        const response = await docClient.send(new DeleteCommand(params));
        console.log(response);
        console.log(req.body);
        res.send("Delete task successfully");
    } catch (err) {
        console.error("Unable to delete task: ", err);
        res.sendStatus(400).send('Error delete task to DynamoDB');
    }
};

// Edit task in DynamoDB
exports.editToDoList = async (req, res) => {
    console.log("=====================");

    const { student_id, task_id } = req.params;
    const params = {
        TableName: process.env.aws_items_table_name,
        Key: {
            task_id: task_id,
            student_id: student_id,
        },
        UpdateExpression: "set #title = :title, #detail = :detail, #priority = :priority, #status = :status, #course = :course",
        ExpressionAttributeNames: {
            "#title": "title",
            "#detail": "detail",
            "#priority": "priority",
            "#status": "status",
            "#course": "course",
        },
        ExpressionAttributeValues: {
            ":title": req.body.title,
            ":detail": req.body.detail,
            ":priority": req.body.priority,
            ":status": req.body.status,
            ":course": req.body.course,
        }
    };
    try {
        const response = await docClient.send(new UpdateCommand(params));
        console.log(response);
        res.send("Update task successfully");
    } catch (err) {
        console.error("Unable to update record: ", err);
        res.status(400).send('Error update task to DynamoDB');
    }
}

// Edit status of task in DynamoDB
exports.editStatusToDoList = async (req, res) => {
    const { student_id, task_id } = req.params;
    const params = {
        TableName: process.env.aws_items_table_name,
        Key: {
            task_id: task_id,
            student_id: student_id,
        },
        UpdateExpression: "set #status = :status",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":status": req.body.status,
        }
    };
    try {
        const response = await docClient.send(new UpdateCommand(params));
        console.log(response);
        res.send("Update task successfully");
    } catch (err) {
        console.error("Unable to update record: ", err);
        console.log(err);
        res.status(400).send(err);
    }
}







