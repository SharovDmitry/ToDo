require 'test_helper'

class SitesControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test 'should redirect unauthorized user' do
    get root_path
    assert_response :redirect
    assert_redirected_to new_user_registration_path
  end

  test 'should not redirect authorized user' do
    sign_in users(:user_one)
    get root_path
    assert_response :success
  end

end