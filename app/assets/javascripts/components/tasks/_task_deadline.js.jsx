var TaskDeadline = React.createClass({

    componentDidMount(){
      this.datepickerOptions();
    },

    datepickerOptions(){
        var datepicker = $("[data-task-id='" + this.props.taskId + "']").find('.td-datepicker');
        datepicker.datepicker({
            format: "dd.mm.yyyy",
            weekStart: 1,
            clearBtn: true,
            autoclose: true
        }).on('hide', this.saveDeadline);
    },

    saveDeadline(){
        var val = $("[data-task-id='" + this.props.taskId + "']").find('.td-datepicker').val();
        $.ajax({
            url: `/api/v1/projects/${this.props.projectId}/tasks/${this.props.taskId}`,
            type: 'PUT',
            data: {task: {deadline: val}},
            error(err) {
                alert($.parseJSON(err.responseText)[0]);
            }
        });
    },

    render() {
        return (
            <input type="text" placeholder="Add deadline" defaultValue={this.props.deadline} className="td-datepicker form-control text-center"/>
        )
    }

});