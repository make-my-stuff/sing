const TaskRunner = (() => {
    const taskStatus = (() => {
        let status = 'stopped';
        const setStatus = (newStatus) => {
            status = newStatus;
            $('#task_status').removeClass('stopped stopping processing').addClass(status);
        };
        return { get: () => status, set: setStatus };
    })();

    function runProcess(taskURL, data = {}) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: taskURL,
                type: 'POST',
                data: data,
                success: (response) => {
                    try {
                        const data = JSON.parse(response);
                        resolve(data);
                    } catch(e) {
                        console.error(e);
                        reject(response);
                    }
                },
                error: (xhr) => reject(xhr.responseText)
            });
        });
    }

    function updateTaskInfoUI(data) {
        const { taskInfo, taskData } = data;
        const totalProcessed = Number(taskInfo.done) + Number(taskInfo.error.notFound);
        const progressPercentage = ((totalProcessed / taskInfo.total) * 100).toFixed(2);
        let taskInfoHtml = `
            <p>Done: ${taskInfo.done}</p>
            <p>Remaining: ${taskInfo.pending}</p>
            <p>Total: ${taskInfo.total}</p>
            <p>Unaccounted: ${taskInfo.unaccounted}</p>
            <p>Progress: ${progressPercentage}%</p>
            ${Object.keys(taskInfo.error).map(errorType => `<p>Error ${errorType}: ${taskInfo.error[errorType]}</p>`).join('')}
            ${taskData && taskData.length ? `<p>Site ID: ${taskData[0].SiteID}</p>` : ''}
        `;
        $('#task_info').html(taskInfoHtml);
    }

    function TaskRunner(taskURL, params, taskInterval = 1000) {
        let paramStr = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        this.taskURL = taskURL + '?' + paramStr;
        this.taskInterval = taskInterval;
        this.timer = null;
        this.isRunning = false;

        const process = async () => {
            if (!this.isRunning) return;

            try {
                const data = await runProcess(this.taskURL + '&action=run');
                updateTaskInfoUI(data);
                if (!this.isRunning || data.taskInfo.pending === 0 || data.taskData.length === 0) {
                    clearTimeout(this.timer);
                    this.isRunning = false;
                    taskStatus.set('stopped');
                    return;
                }
                this.timer = setTimeout(process, this.taskInterval);
            } catch (error) {
                this.stop();
                taskStatus.set('stopped');
            }
        };

        this.start = function() {
            if (this.isRunning) return;
            $("#start_process").attr("disabled", true).siblings("#stop_process").attr("disabled", false);
            this.isRunning = true;
            taskStatus.set('processing');
            process();
        };

        this.stop = function() {
            clearTimeout(this.timer);
            this.isRunning = false;
            $("#stop_process").attr("disabled", true).siblings("#start_process").attr("disabled", false);
            taskStatus.set('stopping');
        };

        this.info = function() {
            return runProcess(this.taskURL + '&action=info').then(data => updateTaskInfoUI(data));
        }

        this.run = function (action, cb = null) {
            return runProcess(this.taskURL + `&action=${action}`).then(data => {
                updateTaskInfoUI(data);
                if(cb && (typeof cb === 'function')) cb(data);
            });
        }
    }

    return TaskRunner;
})();


/*
const taskHandlerURL = '/sandbox/task-runner/index.php';
let params = {
    'order' : "ASC",
    'skip' : 0,
    'limit' : 10,
    'task' : 'migrate-images-to-cloudflare-images'
};
let taskRunner = new TaskRunner(taskHandlerURL, params);

document.querySelector('#info_process').addEventListener('click', () => {
    taskRunner.info();
});

document.querySelector('#start_process').addEventListener('click', () => {
    taskRunner.start();
});

document.querySelector('#stop_process').addEventListener('click', () => {
    taskRunner.stop();
});

const populateErrorDetails = (data) => {
    let errorDetailsHtml = '';
    Object.keys(data).forEach(errorType => {
        if(errorType === 'cfError') {
            console.log(data[errorType])
        }
    });
    $('body').append(errorDetailsHtml);
};

taskRunner.run('error_details', populateErrorDetails);
*/