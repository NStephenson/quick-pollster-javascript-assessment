'use strict';

getCurrentUser();

var authToken = $('meta[name="csrf-token"]').attr('content');
var currentUser;
var allPolls = [];

class Response {
  constructor(id, text, selected){
    this.id = id;
    this.text = text;
    this.selected = selected;
  }
}

class User {
  constructor(id, username) {
    this.id = id;
    this.username = username;
  }
}

class Poll {
  constructor(id, question, published, selectMultiple, publicResults, open, responses, user) {
    this.id = id;
    this.question = question;
    this.published = published;
    this.selectMultiple = selectMultiple;
    this.publicResults = publicResults;
    this.open = open;
    this.responses = responses;
    this.user = user;
  }

  voteTotal(){
    var total = 0;
    this.responses.forEach(function(response){
      total += response.selected;
    });
    return total;
  } 
}

// Object Creation

function createPollObject(poll){
  var user = new User(poll.user.id, poll.user.username);
  var pollObject = new Poll(poll.id, poll.question, poll.published, poll.select_multiple, poll.public_results, poll.open, createResponses(poll.responses), user);
  return pollObject;
}

function createResponses(responses){
  var responseObjects = [];
  responses.forEach(function(response){
    responseObjects.push(new Response(response.id, response.text, response.selected))
  });
  return responseObjects;
}

//html builders, Should these be moved into the prototype?

function buildPollHtml(poll){
  var pollHtml = '<div id="poll_card_'+ poll.id +'">';
  pollHtml += '<a href="/polls/'+ poll.id +'"><h2>' + poll.question + '</h2></a>';

  if (poll.user && poll.user.id != currentUser.id){
    pollHtml += '<h5>by <a href="/users/'+ poll.user.id +'">'+ poll.user.username +'</a></h5>';
  } else if(poll.user && poll.user.id === currentUser.id){
    pollHtml += '<h5><a class="edit-poll-options" data-pollid="'+ poll.id +'" href="">Edit Poll Options</a> - <a rel="nofollow" class="delete-poll" data-pollid="'+ poll.id +'" href="">Delete this Poll</a> - Share link: http://localhost:3000/polls/'+ poll.id +'</h5>';
    pollHtml += buildOptionsHtml(poll);
  }

  if (checkIfPollResponded(poll)) {
    pollHtml += buildPollResponseHtml(poll);
  } else {
    pollHtml += buildPollFormHtml(poll);
  }

  pollHtml += '</div>';
  return pollHtml;
}

function buildPollFormHtml(poll){
  var pollFormHtml = '<form method="POST" action="/polls/'+ poll.id +'/results" class="poll-form" id="poll_'+ poll.id +'" data-pollId="'+ poll.id +'">';
  poll.responses.forEach(function(response){
    pollFormHtml += '<input type=';
    if (poll.selectMultiple) {
      pollFormHtml += '"checkbox"';
    } else {
      pollFormHtml += '"radio"';
    }
    pollFormHtml += ' name="response[id][]" value="'+ response.id +'">';
    pollFormHtml += '<label>'+ response.text +'</label><br>';
  });
  pollFormHtml += '<input name="authenticity_token" value="'+ authToken +'" type="hidden">';
  pollFormHtml += '<input type="submit" name="submit">';
  pollFormHtml += '</form>';
  return pollFormHtml;
}

function buildOptionsHtml(poll){
  var optionsHtml = '<form hidden data-pollid="'+ poll.id +'" class="edit-poll" id="edit-poll-'+ poll.id +'" action="/polls/'+ poll.id +'" accept-charset="UTF-8" method="post">';
  optionsHtml += '<input name="utf8" type="hidden" value="✓">';
  optionsHtml += '<input type="hidden" name="_method" value="patch">';
  optionsHtml += '<input type="hidden" name="authenticity_token" value="'+ authToken +'">';
  optionsHtml += '<label for="poll_Allow multiple responses">Allow multiple responses?</label>';
  optionsHtml += '<input name="poll[select_multiple]" type="hidden" value="0">';
  optionsHtml += '<input type="checkbox" value="1" name="poll[select_multiple]" id="poll_select_multiple" '+ htmlCheckedForOption(poll.selectMultiple) +'><br>';
  optionsHtml += '<label for="poll_Allow Poll results to be public">Allow poll results to be public?</label>';
  optionsHtml += '<input name="poll[public_results]" type="hidden" value="0">';
  optionsHtml += '<input type="checkbox" value="1" name="poll[public_results]" id="poll_public_results" '+ htmlCheckedForOption(poll.publicResults) +'><br>';
  optionsHtml += '<label for="poll_Publish this poll">Publish this poll?</label>';
  optionsHtml += '<input name="poll[published]" type="hidden" value="0">';
  optionsHtml += '<input type="checkbox" value="1" name="poll[published]" id="poll_published" '+ htmlCheckedForOption(poll.published) +'><br>'
  optionsHtml += '<label for="poll_Uncheck to close this poll">Uncheck to close this poll</label>';
  optionsHtml += '<input name="poll[open]" type="hidden" value="0">';
  optionsHtml += '<input type="checkbox" value="1" name="poll[open]" id="poll_open" '+ htmlCheckedForOption(poll.open) +'><br>';
  optionsHtml += '<input type="submit" name="commit" value="Edit Poll Options">';
  optionsHtml += '</form><br>';
  return optionsHtml;
}

function buildPollResponseHtml(poll){
  var responseHtml = '<div>';
  responseHtml += '<ul>';
  poll.responses.forEach(function(response){
    responseHtml += '<li>' + response.text + ': ' + response.selected + '  votes'
  });
  responseHtml += '</ul>';
  responseHtml += '<p>Total votes: '+ poll.voteTotal() +'</p>'
  responseHtml += '</div>';
  return responseHtml;
}

// html helper functions

function checkIfPollResponded(poll){
  var pollResponded = false;
  currentUser.votes.forEach(function(vote){
    if (vote.poll.id === poll.id) {
      pollResponded = true;
    }
  }); 
  return pollResponded;
}

function htmlCheckedForOption(option){
  if (option) {
    return 'checked="checked"';
  } 
}

// Poll Editing Functions

function editPollOptionsToggle(){
  $('.edit-poll-options').click(function(e){
    e.preventDefault();
    var pollId = $(this).data().pollid;
    $('#edit-poll-' + pollId ).toggle();
  });
}

function submitPollOptionsEdit(){
  $('.edit-poll').submit(function(e){
    e.preventDefault();
    var pollId = $(this).data().pollid;
    var editedPollOptions = {};
    var poll = {};
    poll.select_multiple = $('#edit-poll-'+ pollId +' > #poll_select_multiple').prop('checked');
    poll.public_results = $('#edit-poll-'+ pollId +' > #poll_public_results').prop('checked');
    poll.published = $('#edit-poll-'+ pollId +' > #poll_published').prop('checked');
    poll.open = $('#edit-poll-'+ pollId +' > #poll_open').prop('checked');
    editedPollOptions.poll = poll;

    $.ajax({
      url: 'polls/' + pollId,
      data: editedPollOptions,
      method: 'PUT',
      success: function(poll){
        var updatedPoll = createPollObject(poll);
        $('#poll_card_' + poll.id ).html(buildPollHtml(updatedPoll));

        attachPollListeners();
      }
    });
  });
}

// Poll Deletion Functions

function deletePoll(){
  $('.delete-poll').click(function(e){
    e.preventDefault();
    var pollId = $(this).data().pollid; 
    $.ajax({
      url: '/polls/' + pollId,
      type: 'DELETE',
      success: function(pollId){
        removePollFromDom(pollId);
      }
    });
  });
}

function removePollFromDom(pollId){
  $('#poll_card_' + pollId).html('<p>This Poll has been deleted.</p>');
}

// New Poll Creation

function submitNewPoll(){
  $('#new_poll').submit(function(e){
    e.preventDefault();

    var newPoll = {};
    newPoll.poll = {};
    newPoll.poll.responses_attributes = [];

    newPoll.poll.question = $('#poll_question').val();

    $.each($('.new-poll-responses'), function(i,response){
      var response = {text: $(response).val()}
      newPoll.poll.responses_attributes.push(response);
    });

    newPoll.poll.select_multiple = !!parseInt($('#poll_select_multiple:checked').val());
    newPoll.poll.public_results = !!parseInt($('#poll_public_results:checked').val());
    newPoll.poll.published = !!parseInt($('#poll_published:checked').val());

    $.post('/polls', newPoll, function(poll){
      var newSavedPoll = createPollObject(poll);
      $('.new-poll-form').html(buildPollHtml(newSavedPoll))
    }).fail(function(error){
      });
  });
}

// Responding To a poll

function respondToPoll(){
  $('.poll-form').submit(function(e){
    e.preventDefault();

    var pollId = $(this).data().pollid;
    var response = {};
    response.response = {};
    response.response.id = [];

    $(':checked').each(function(i,resp){
      response.response.id.push( $(resp).val() );
    });

    $.post('/polls/' + pollId + '/results', response, function(poll){
      var respondedPoll = createPollObject(poll)
      $('#poll_' + pollId).html(buildPollResponseHtml(respondedPoll));  
    }).fail(function(error, b, c){
      alert('This didn\'t work');
    });

  });
}

// Page Population

function addPollsToDom(){
  $('#see-more-polls').click(function(){
    if(maxPollsInDom < allPolls.length){
      maxPollsInDom += 5;
      loadPolls();
      if(maxPollsInDom >= allPolls.length){
        $('#polls-list').append('<p>End of the Line. No More Polls.</p>');
      }
    }
  });
}

function attachPollListeners(){
  respondToPoll();
  editPollOptionsToggle();
  submitPollOptionsEdit();
  deletePoll();
}

function loadPolls(){
  var filteredPolls = allPolls.filter(function(poll, i){
    return i > maxPollsInDom - 6 && i < maxPollsInDom;
  });
  filteredPolls.forEach(function(poll){
    $('#polls-list').append(buildPollHtml(poll));
  });

  attachPollListeners();
}

function getPolls(){
  allPolls = [];
  $.get('/polls', function(polls){
    polls.forEach(function(poll){
      allPolls.push(createPollObject(poll));
    });
  $('#polls-list').html('');
    loadPolls();
  });
}

//Get current User

function getCurrentUser(){
  $.get('/current_user', function(user){
    currentUser = user;
  });
}

// Doc Ready 

$(document).ready(function(){
  submitNewPoll();
  addPollsToDom();
});