var NewProject = React.createClass({

    getInitialState() {
        return {showInput: false}
    },

    handleSubmitProject(e) {
        e.preventDefault();
        var self = this;
        var name = this.refs.name.value;
        if(name.trim() == ""){
            var input = $("#newProjectInput");
            input.addClass('td-empty-field-error');
            input.tooltip({placement:'bottom', title:"Can't be blank."}).tooltip('show');
            return;
        }
        $.ajax({
            url: '/api/v1/projects',
            type: 'POST',
            data: {project: {name: name}},
            success(project){
                self.props.handleSubmitProject(project);
                self.handleAddProjectButton();
            },
            error(err) {
                alert($.parseJSON(err.responseText)[0]);
            }
        });
    },

    handleAddProjectButton(){
        this.setState({showInput: !this.state.showInput})
    },

    render() {
        return (
            <div className="col-sm-8 col-sm-offset-2">
                { this.state.showInput ?
                    <form onSubmit={this.handleSubmitProject}>
                        <div className="input-group">
                            <input id="newProjectInput" className="form-control" ref='name' placeholder='Add a new TODO list...' maxLength="40"/>
                            <div className="input-group-btn">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </form>
                :
                    <div className="text-center">
                        <button className="btn btn-primary"
                                onClick={this.handleAddProjectButton}>
                            <i className="glyphicon glyphicon-plus td-add-project-icon"/>
                            Add TODO List
                        </button>
                    </div>
                }
            </div>
        )
    }
});