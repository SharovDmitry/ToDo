class Api::V1::BaseController < ApplicationController
  before_action :authenticate_user!
  respond_to :json
end