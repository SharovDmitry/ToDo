class CreateTasks < ActiveRecord::Migration[5.0]
  def change
    create_table :tasks do |t|
      t.string  :name
      t.integer :project_id, null: false
      t.boolean :completed, default: false
      t.string  :deadline, default: ''
      t.integer :position, null: false

      t.timestamps
    end
  end
end
