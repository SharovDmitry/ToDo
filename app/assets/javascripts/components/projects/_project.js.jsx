var Project = React.createClass({

    getInitialState() {
        return {editable: false}
    },

    handleEditProject() {
        var id = this.props.project.id;
        if(this.state.editable) {
            var name = this.refs.name.value;
            var input = $("[data-project-id='" + id + "']").find('#editProjectInput');
            if(name.trim() == ""){
                input.addClass('td-empty-field-error');
                input.tooltip({placement:'bottom', title:"Can't be blank."}).tooltip('show');
                return;
            }
            var project = {id: id, name: name};
            this.props.handleEditProject(project);
            input.tooltip('destroy');
            $("[data-edit-project='" + id + "']").removeClass('glyphicon-floppy-disk').addClass('glyphicon-pencil');
        }
        else{
            $("[data-edit-project='" + id + "']").removeClass('glyphicon-pencil').addClass('glyphicon-floppy-disk');
        }
        this.setState({editable: !this.state.editable})
    },

    handleEnter(e){
        if(e.which == 13){
            this.handleEditProject();
        }
    },

    render() {
        return (
            <div>
                <div className="panel panel-primary">
                    <div className="panel-heading">
                        <div className="panel-title">
                            <span className="glyphicon glyphicon-calendar" />
                            { this.state.editable ?
                                <input type='text'  ref='name' id="editProjectInput" className="form-control td-edit-input" defaultValue={this.props.project.name} onKeyPress={this.handleEnter} maxLength="40"/>
                            :
                                <span className="td-name">{this.props.project.name}</span>
                            }
                            <span className="pull-right td-options">
                                <span data-edit-project={this.props.project.id} className="glyphicon glyphicon-pencil"
                                      onClick={this.handleEditProject}>
                                </span>
                                <span className="glyphicon glyphicon-trash"
                                      onClick={this.props.handleDeleteProject}>
                                </span>
                            </span>
                        </div>
                    </div>
                    <Tasks projectId={this.props.project.id}/>
                </div>
            </div>
        )
    }
});