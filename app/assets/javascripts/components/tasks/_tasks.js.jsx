var Tasks = React.createClass({

    getInitialState() {
        return {tasks: []}
    },

    componentDidMount() {
        $.getJSON(`/api/v1/projects/${this.props.projectId}/tasks.json`, (response) => {
            this.setState({tasks: response})
        });
        this.sortTaskOptions();
    },

    handleSubmitTask(task) {
        var newState = [task, ...this.state.tasks];
        this.setState({tasks: newState})
    },

    handleEditTask(id, name) {
        $("[data-edit-task-icon='" + id + "']").addClass('hidden');
        $("[data-save-task-icon='" + id + "']").removeClass('hidden');
        var element = $("[data-task-name='" + id + "']");
        var input = $('<input>', {type: 'text', value: name, class: 'form-control td-edit-input', 'data-edit-task-input': id, maxlength: 40});
        element.replaceWith(input);
        this.addEnterListener(input, id);
    },

    updateTask(id) {
        var self = this;
        var input = $("[data-edit-task-input='" + id + "']");
        var val = input.val();
        if(val.trim() == ""){
            input.addClass('td-empty-field-error');
            input.tooltip({placement:'bottom', title:"Can't be blank."}).tooltip('show');
            return;
        }
        $.ajax({
                url: `/api/v1/projects/${this.props.projectId}/tasks/${id}`,
                type: 'PUT',
                data: {task: {name: val}},
                success(task){
                    input.tooltip('destroy');
                    var element = $('<div>', {text: task.name, 'data-task-name': task.id, class: 'td-name'});
                    task.completed ? element.addClass('td-completed-task') : null;
                    input.replaceWith(element);
                    $("[data-save-task-icon='" + task.id + "']").addClass('hidden');
                    $("[data-edit-task-icon='" + task.id + "']").removeClass('hidden');
                    self.updateTaskClient(task);
                },
                error(err) {
                    alert($.parseJSON(err.responseText)[0]);
                }
            }
        )
    },

    handleCompleteTask(id, val) {
        var self = this;
        $.ajax({
            url: `/api/v1/projects/${this.props.projectId}/tasks/${id}`,
            type: 'PUT',
            data: {task: {completed: val}},
            success(task) {
                val ? $("[data-task-name='" + task.id + "']").addClass('td-completed-task')
                    : $("[data-task-name='" + task.id + "']").removeClass('td-completed-task');
                self.updateTaskClient(task);
            },
            error(err) {
                alert($.parseJSON(err.responseText)[0]);
            }
        });
    },

    handleDeleteTask(id) {
        var self = this;
        $.ajax({
            url: `/api/v1/projects/${this.props.projectId}/tasks/${id}`,
            type: 'DELETE',
            success() {
                self.removeTaskClient(id);
            },
            error(err) {
                alert($.parseJSON(err.responseText)[0]);
            }
        });
    },

    updateTaskClient(task) {
        var tasks = this.state.tasks.map((i) => {
            if(i.id == task.id){
                i.name = task.name;
                i.completed = task.completed
            }
            return i
        });
        this.setState({tasks: tasks });
    },

    removeTaskClient(id) {
        var newState = this.state.tasks.filter((task) => {
            return task.id != id;
        });
        this.setState({ tasks: newState });
    },

    sortTaskOptions(){
        var project = $("[data-project-id='" + this.props.projectId + "']");
        project.find('.sortable').sortable({
            axis: 'y',
            containment: project,
            handle: '.glyphicon-resize-vertical',
            placeholder: "td-sort-placeholder",
            cursor: 'move',
            update: this.saveSort}).disableSelection();
    },

    saveSort(){
        var updated_order = {};
        var tasks = $("[data-project-id='" + this.props.projectId + "']").find('tr');
        tasks.each(function(i){
            updated_order[$(this).data("task-id")] = i+1;
        });
        $.ajax({
            url: `/api/v1/projects/${this.props.projectId}/sort_tasks`,
            type: 'PUT',
            data: {order: updated_order},
        });
    },

    addEnterListener(input, id){
        var self = this;
        input.keypress(function(e) {
            if(e.which == 13){
                self.updateTask(id);
            }
        });
    },

    render() {
        var tasks = this.state.tasks.map((task) => {
            return (
                <tr data-task-id={task.id} key={task.id}>
                    <td className="col-xs-1 td-task-done text-center">
                        <input type="checkbox"
                               defaultChecked={task.completed}
                               onChange={this.handleCompleteTask.bind(this, task.id, !task.completed)}
                        />
                    </td>
                    <td className="col-xs-5 col-md-7 td-task-name">
                        <div data-task-name={task.id} className={task.completed ? "td-name td-completed-task" : "td-name"}>
                            {task.name}
                        </div>
                    </td>
                    <td className="col-xs-3 col-md-2 td-task-deadline">
                        <TaskDeadline projectId={this.props.projectId}
                                      taskId={task.id}
                                      deadline={task.deadline}
                        />
                    </td>
                    <td className="col-xs-3 col-md-2 text-center">
                        <div className="td-options">
                            <span className="glyphicon glyphicon-resize-vertical"/>
                            <span data-save-task-icon={task.id} className="glyphicon glyphicon-floppy-disk hidden"
                                  onClick={this.updateTask.bind(this, task.id)}>
                            </span>
                            <span data-edit-task-icon={task.id} className="glyphicon glyphicon-pencil"
                                  onClick={this.handleEditTask.bind(this, task.id, task.name)}>
                            </span>
                            <span className="glyphicon glyphicon-trash"
                                  onClick={this.handleDeleteTask.bind(this, task.id)}>
                            </span>
                        </div>
                    </td>
                </tr>
            )
        });

        return(
            <div className="panel-body">
                <NewTask projectId={this.props.projectId}
                         handleSubmitTask={this.handleSubmitTask}
                />
                <table className="table td-tasks-table">
                    <tbody className="sortable">
                        {tasks}
                    </tbody>
                </table>
            </div>
        )
    }
});