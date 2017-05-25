var NewTask = React.createClass({

    handleSubmitTask(e) {
        e.preventDefault();
        var self = this;
        var name = this.refs.name.value;
        if(name.trim() == ""){
            var input = $("[data-project-id='" + this.props.projectId + "']").find('#newTaskInput');
            input.addClass('td-empty-field-error');
            input.tooltip({placement:'bottom', title:"Can't be blank."}).tooltip('show');
            return;
        }
        $.ajax({
            url: `/api/v1/projects/${this.props.projectId}/tasks`,
            type: 'POST',
            data: {task: {name: name, position: 0}},
            success(task){
                var input = $("[data-project-id='" + self.props.projectId + "']").find('#newTaskInput');
                input.removeClass('td-empty-field-error');
                input.tooltip('destroy');
                self.refs.name.value = "";
                self.props.handleSubmitTask(task);
            },
            error(err) {
                alert($.parseJSON(err.responseText)[0]);
            }
        });
    },

    render() {
        return (
            <form onSubmit={this.handleSubmitTask}>
                <div className="input-group input-group-sm td-new-task">
                    <input id="newTaskInput" className="form-control" ref='name' placeholder='Start typing here to create a task...' maxLength="40" />
                    <div className="input-group-btn">
                        <button type="submit" className="btn btn-success">Submit Task</button>
                    </div>
                </div>
            </form>
        )
    }
});