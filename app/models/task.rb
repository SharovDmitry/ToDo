class Task < ApplicationRecord
  belongs_to :project

  validates :name, presence: true, length: {maximum: 40}
  validates :position, presence: true
  validates :deadline, format: { with: /\A(\d{2}[.]\d{2}[.]\d{4}|^$)\z/, message: 'Invalid format' }
end
