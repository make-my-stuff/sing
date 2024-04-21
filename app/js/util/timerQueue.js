
const TimerQueue = (function() {
    function TimerQueue() {
        this.queue = [];
        this.isRunning = false;
        this.done = false;
        this.currentTaskTimeoutId = null;
        this.timeRemaining = null;
        this.currentTask = null;
    }

    TimerQueue.prototype.add = function(task, duration) {
        this.queue.push({ task, duration, done: false });
    };

    TimerQueue.prototype.start = function(n = 0) {
        if (!this.isRunning && this.queue.length > n) {
            this.isRunning = true;
            this.queue = this.queue.slice(n);
            this.next();
        }
    };

    TimerQueue.prototype.next = function() {
        if (this.queue.length > 0 && !this.timeRemaining) {
            this.currentTask = this.queue.shift();
            this.executeTask(this.currentTask);
        } else if (this.timeRemaining) {
            this.executeTask(this.currentTask, this.timeRemaining);
            this.timeRemaining = null;
        }
    };

    TimerQueue.prototype.executeTask = function(task, durationOverride) {
        var duration = durationOverride || task.duration;
        this.currentTaskTimeoutId = setTimeout(function() {
            task.task();
            console.log(task);
            task.done = true;
            this.isRunning = false;
            if (this.queue.length === 0) {
                this.done = true;
            }
            this.next();
        }.bind(this), duration);
    };

    TimerQueue.prototype.pause = function() {
        if (this.isRunning && this.currentTaskTimeoutId) {
            clearTimeout(this.currentTaskTimeoutId); // Clear the current timeout
            this.timeRemaining = this.currentTask.duration - (Date.now() - this.currentTask.startTime);
            this.isRunning = false;
            this.currentTaskTimeoutId = null;
        }
    };

    TimerQueue.prototype.resume = function() {
        if (!this.isRunning && this.currentTask && this.timeRemaining != null) {
            this.isRunning = true;
            this.next();
        }
    };

    TimerQueue.prototype.clear = function() {
        this.queue = [];
        this.isRunning = false;
        this.done = false;
        if (this.currentTaskTimeoutId) {
            clearTimeout(this.currentTaskTimeoutId);
        }
        this.currentTaskTimeoutId = null;
        this.timeRemaining = null;
        this.currentTask = null;
    };

    TimerQueue.prototype.show = function() {
        return this.queue;
    }

    return TimerQueue;
})();