require 'test_helper'

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @user = users(:user_one)
    sign_in @user
  end

  test 'should get all projects' do
    get api_v1_projects_path
    assert_equal(Project.all.to_json, @response.body)
  end

  test 'should create project' do
    assert_difference('Project.count', +1) do
      post api_v1_projects_path, params: {project:{name: 'New Project'}}
    end
    assert_equal Project.find_by(name: 'New Project').to_json, @response.body
  end

  test 'should update project' do
    put api_v1_project_path(1), params: {project:{name: 'New Name'}}
    assert_equal Project.first.name, JSON.parse(@response.body)['name']
  end

  test 'should delete project' do
    assert_difference('Project.count', -1) do
      delete api_v1_project_path(1)
    end
    assert_response :success
  end

end