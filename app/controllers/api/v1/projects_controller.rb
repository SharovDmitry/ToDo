class Api::V1::ProjectsController < Api::V1::BaseController
  before_action :find_project, only: [:update, :destroy]

  def index
    @projects = current_user.projects.all.reverse
    render json: @projects
  end

  def create
    @project = current_user.projects.create(project_params)
    if @project.persisted?
      render json: @project
    else
      render json: @project.errors.full_messages, status: 422
    end
  end

  def update
    project_updated = @project.update(project_params)
    if project_updated
      render json: @project
    else
      render json: @project.errors.full_messages, status: 422
    end
  end

  def destroy
    @project.destroy
    render body: nil, status: 200
  end

  private

  def project_params
    params.require(:project).permit(:name)
  end

  def find_project
    @project = current_user.projects.find(params[:id])
  end
end