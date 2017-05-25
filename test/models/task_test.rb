require 'test_helper'

class TaskTest < ActiveSupport::TestCase
  include Devise::Test::IntegrationHelpers

  setup do
    @user = users(:user_one)
    @project = projects(:project_one)
    sign_in @user
  end

  test 'should save task with correct params' do
    task = Task.create(name: 'Do something', project_id: @project.id, position: 0)
    assert task.save
  end

  test 'should not save task without name' do
    task = Task.create(project_id: @project.id, position: 0)
    assert_not task.save
  end

  test 'should not save task without project' do
    task = Task.create(name: 'Do something', position: 0)
    assert_not task.save
  end

  test 'should not save task without position' do
    task = Task.create(name: 'Do something', project_id: @project.id)
    assert_not task.save
  end

  test 'should not save task with long name' do
    task = Task.create(name: 'Verrrrrrrryyyyyyy looonnnnnnggggg naaaaaammmee', project_id: @project.id, position: 0)
    assert_not task.save
  end

  test 'should save task with correct deadlines' do
    task = Task.create(name: 'Do something', project_id: @project.id, position: 0, deadline: '31.12.2017')
    assert task.save
    task2 = Task.create(name: 'Do something', project_id: @project.id, position: 0, deadline:'')
    assert task2.save
  end

  test 'should not save task with wrong deadlines' do
    task = Task.create(name: 'Do something', project_id: @project.id, position: 0, deadline: '31/12/2017')
    assert_not task.save
    task2 = Task.create(name: 'Do something', project_id: @project.id, position: 0, deadline: '2017.31.12')
    assert_not task2.save
    task3 = Task.create(name: 'Do something', project_id: @project.id, position: 0, deadline: '31-12-2017')
    assert_not task3.save
    task4 = Task.create(name: 'Do something', project_id: @project.id, position: 0, deadline: 'Text')
    assert_not task4.save
    task5 = Task.create(name: 'Do something', project_id: @project.id, position: 0, deadline: '131.12.Text')
    assert_not task5.save
    task6 = Task.create(name: 'Do something', project_id: @project.id, position: 0, deadline: 99)
    assert_not task6.save
    task7 = Task.create(name: 'Do something', project_id: @project.id, position: 0, deadline: '@!#$/,{+')
    assert_not task7.save
  end

end
