class Api::V1::TasksController < Api::V1::BaseController
  before_action :find_project
  before_action :find_task, only: [:update, :destroy, :complete]

  def index
    @tasks = @project.tasks.all.order(:position)
    render json: @tasks
  end

  def create
    @task = @project.tasks.create(task_params)
    if @task.persisted?
      @project.tasks.each do |t|
        t.update(position: t.position + 1)
      end
      render json: @task
    else
      render json: @task.errors.full_messages, status: 422
    end
  end

  def update
    task_updated = @task.update(task_params)
    if task_updated
      render json: @task
    else
      render json: @task.errors.full_messages, status: 422
    end
  end

  def destroy
    @task.destroy
    render body: nil, status: 200
  end

  def sort
    params[:order].each do |k,v|
      @project.tasks.find(k).update(position: v)
    end
    render body: nil, status: 200
  end

  private

  def task_params
    params.require(:task).permit(:name, :completed, :position, :deadline)
  end

  def find_project
    @project = current_user.projects.find(params[:project_id])
  end

  def find_task
    @task = @project.tasks.find(params[:id])
  end
end