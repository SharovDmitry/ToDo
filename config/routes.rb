Rails.application.routes.draw do

  root to: 'site#index'

  devise_for :users, only:[]
  as :user do
    get '/sign_in',       to: 'devise/sessions#new',             as: 'new_user_session'
    post '/sign_in',      to: 'devise/sessions#create',          as: 'user_session'
    delete '/sign_out',   to: 'devise/sessions#destroy',         as: 'destroy_user_session'
    get '/sign_up',       to: 'devise/registrations#new',        as: 'new_user_registration'
    post '/sign_up',      to: 'devise/registrations#create',     as: 'user_registration'
  end

  namespace :api do
    namespace :v1 do
      resources :projects, only: [:index, :create, :update, :destroy] do
        resources :tasks,  only: [:index, :create, :update, :destroy]
        put 'sort_tasks',  to: 'tasks#sort'
      end
    end
  end
end
