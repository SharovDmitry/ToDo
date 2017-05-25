var AllProjects = React.createClass({

    getInitialState() {
        return {projects: []}
    },

    componentDidMount() {
        $.getJSON('/api/v1/projects.json', (response) => { this.setState({projects: response}) });
    },

    handleSubmitProject(project) {
        var newState = [project, ...this.state.projects];
        this.setState({projects: newState})
    },

    handleEditProject(project){
        var self = this;
        $.ajax({
                url: `/api/v1/projects/${project.id}`,
                type: 'PUT',
                data: {project: {name: project.name}},
                success(){
                    self.updateProjectClient(project);
                },
                error(err) {
                    alert($.parseJSON(err.responseText)[0]);
                }
            }
        )},

    handleDeleteProject(id) {
        var self = this;
        $.ajax({
            url: `/api/v1/projects/${id}`,
            type: 'DELETE',
            success() {
                self.removeProjectClient(id);
            },
            error(err) {
                alert($.parseJSON(err.responseText)[0]);
            }
        });
    },

    updateProjectClient(project){
        var newState = this.state.projects.map((i) => {
            if(i.id == project.id){
                i.name = project.name
            }
            return i
        });
        this.setState({projects: newState});
    },

    removeProjectClient(id){
        var newState = this.state.projects.filter((project) => {
            return project.id != id;
        });
        this.setState({projects: newState});
    },

    render() {
        var projects = this.state.projects.map((project) => {
            return (
                <div data-project-id={project.id} key={project.id}>
                    <Project project={project}
                             handleDeleteProject={this.handleDeleteProject.bind(this, project.id)}
                             handleEditProject={this.handleEditProject}
                    />
                </div>
            )
        });

        return(
            <div>
                {projects}
                <NewProject handleSubmitProject={this.handleSubmitProject} />
            </div>
        )
    }
});