require 'test_helper'

class ProjectTest < ActiveSupport::TestCase
  include Devise::Test::IntegrationHelpers

    setup do
      @user = users(:user_one)
      sign_in @user
    end

    test 'should save project with correct params' do
      project = Project.create(name: 'Test', user_id: @user.id)
      assert project.save
    end

    test 'should not save project without name' do
      project = Project.create(user_id: @user.id)
      assert_not project.save
    end

    test 'should not save project without user' do
      project = Project.create(name: 'Test')
      assert_not project.save
    end

    test 'should not save project with long name' do
      project = Project.create(name: 'Verrrrrrrryyyyyyy looonnnnnnggggg naaaaaammmee', user_id: @user.id)
      assert_not project.save
    end

end
