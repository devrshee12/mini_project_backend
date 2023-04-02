module.exports = ({email, name, taskType, status}) => {
    return `
        <!doctype html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width">
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <title>Optask</title>
               
            </head>
            <body>
                <h3>${email} assigned you a task</h3>
                <h4>task is : ${name}</h4>
                <h4>task Type : ${taskType}</h4>
                <h4>task status : ${status}</h4>
            </body>
        </html>
    `;
}