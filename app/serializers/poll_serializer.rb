class PollSerializer < ActiveModel::Serializer
  attributes :id, :question, :select_multiple, :public_results, :open, :published

  has_many :responses, only: [:id, :text, :selected]
  has_one :user, serializer: PollUserSerializer 
end