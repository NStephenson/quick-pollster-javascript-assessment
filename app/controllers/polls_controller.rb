class PollsController < ApplicationController
  before_action :authenticate_user!, only: [ :index, :edit, :update, :destroy ]
  before_action :find_poll, only: [:results, :edit, :update, :add_results, :destroy]

  def index
    if params[:user_id]
      @polls = User.find(params[:user_id]).polls.published_polls
      respond_to do |format|
        format.json {render json: @polls}
        format.html {render :index}
      end
    else
      @polls = Poll.published_polls
      respond_to do |format|
        format.json {render json: @polls}
        format.html {render :index}
      end
    end
  end

  def show
    if params[:user_id]
      @user = User.find_by(id: params[:user_id])
      @poll = @user.polls.find_by(id: params[:id])
      if @poll.nil?
        redirect_to user_polls_path(@user), alert: "Poll not found"
      end
    else
      @poll = Poll.find(params[:id])
    end

    if signed_in?
      redirect_to poll_results_path(@poll) if current_user.polls_responded.include?(@poll)
    end

    # redirect_to survey_path(@poll.survey) if @poll.limit_to_survey 
  end

  def results
  end

  def new
    @poll = Poll.new
    6.times { @poll.responses.build }
  end

  def create
    @poll = Poll.new(new_poll_params)
    @poll.user = current_user if signed_in?
    if @poll.save
      flash[:notice] = "New poll successfully created!"
      render json: @poll
    else
      render plain: @poll.errors.messages
    end
  end

  def edit
    if current_user != @poll.user 
      redirect_to poll_path(@poll)
    end
  end

  def update
    @poll.update(edit_poll_params)
    if @poll.save
      flash[:notice] = "Poll options updated!"
      respond_to do |format|
        format.json {render json: @polls}
        format.html {redirect_to poll_path(@poll)}
      end
    else
      flash[:error] = "Somehow, you managed to fuck up. Congrats."
      render action: 'edit'
    end
  end

  def add_results
    params.require('response')[:id].each do |response_id|
      response = Response.find(response_id.to_i)
      if response.poll == @poll #put this logic in a validate response method?
        response.selected += 1
        response.save
        if signed_in? 
          current_user.responses << response 
        else
          #cookies[:polls_responded] = []
          #cookies[:polls_responded] << @poll.id #need working code to stop users not signed in from casting multiple votes
        end 
      end
    end
    # redirect_to poll_results_path(@poll)
    render json: @poll
  end

  def destroy
    if @poll.user.id == current_user.id
      poll_id = @poll.id
      @poll.votes.each { |vote| vote.delete }
      @poll.responses.each { |response| response.delete }
      @poll.delete
      render json: poll_id
    else
      #authentication error
    end
  end


  private
  def new_poll_params
    params.require(:poll).permit(:question, :select_multiple, :public_results, :published, responses_attributes: [:text])
  end

  def edit_poll_params
    params.require(:poll).permit(:limit_to_survey, :select_multiple, :open, :public_results, :published)
  end

  def find_poll
    @poll = Poll.find(params[:id])
  end
end
