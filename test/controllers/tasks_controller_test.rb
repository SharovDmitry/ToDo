require 'test_helper'

class TasksControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @user = users(:user_one)
    @project = projects(:project_one)
    sign_in @user
  end

  test 'should get all project tasks' do
    get api_v1_project_tasks_path(1)
    assert_equal(@project.tasks.to_json, @response.body)
  end

  test 'should create task' do
    assert_difference('Task.count', +1) do
      post api_v1_project_tasks_path(1), params: {task:{name: 'New Task', position: 0}}
    end
    assert_equal @project.tasks.find_by(name: 'New Task').to_json, @response.body
  end

  test 'should update task' do
    put api_v1_project_task_path(1,1), params: {task:{name: 'New Name'}}
    assert_equal @project.tasks.first.name, JSON.parse(@response.body)['name']
  end

  test 'should delete task' do
    assert_difference('Task.count', -1) do
      delete api_v1_project_task_path(1,1)
    end
    assert_response :success
  end

  test 'should complete task' do
    put api_v1_project_task_path(1,1), params: {task:{completed: true}}
    assert_equal @project.tasks.first.completed, true
    put api_v1_project_task_path(1,1), params: {task:{completed: false}}
    assert_equal @project.tasks.first.completed, false
  end

  test 'should sort tasks' do
    new_order = {'1':'4', '2':'3', '3':'2', '4':'1'}
    put api_v1_project_sort_tasks_path(1), params: {order: new_order}
    assert_response :success
    assert_equal Task.find(1).position, 4
    assert_equal Task.find(2).position, 3
    assert_equal Task.find(3).position, 2
    assert_equal Task.find(4).position, 1
  end

  test 'should set deadline' do
    put api_v1_project_task_path(1,1), params: {task:{deadline: '31.12.2017'}}
    assert_equal @project.tasks.first.deadline, JSON.parse(@response.body)['deadline']
  end

end