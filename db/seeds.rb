# NOTE: Comment out this line in Poll Model to use this seed file
  # validates :responses, length: {in: 2..6}

# This seed needs to be changed to submit responses w/ the question.


questions = Poll.create([
  {question: "Which of these are considered art?", select_multiple: true, user_id: 1 }, 
  {question: "How does art make you feel?", user_id: 1},
  {question: "Where do you view art?", select_multiple: true, user_id: 1},
  {question: "Have you heard of Ai Wei Wei?", user_id: 1},
  {question: "Which era was more influential?", user_id: 1},
  {question: "What should we get for lunch?", user_id: 1},
  {question: "Are we having fun yet?", user_id: 1},
  {question: "Which show is better ?", limit_to_survey: true, user_id: 1},
  {question: "Which character is better?", limit_to_survey: true, user_id: 1},
  {question: "Should I cut my hair?", user_id: 1},
  {question: "Does Anderson Paak sound like Kendrick Lamar?", user_id: 1}
])

questions[0].responses.create([
  {text: 'paintings', selected: Random.rand(51)}, 
  {text: 'music', selected: Random.rand(51)}, 
  {text: 'crafts', selected: Random.rand(51)}, 
  {text: 'statues', selected: Random.rand(51)}, 
  {text: 'films', selected: Random.rand(51)}, 
  {text: 'video games', selected: Random.rand(51)}
])

questions[1].responses.create([
  {text: 'happy', selected: Random.rand(51)}, 
  {text: 'sad', selected: Random.rand(51)}, 
  {text: 'emotional', selected: Random.rand(51)}, 
  {text: 'apathetic', selected: Random.rand(51)}, 
  {text: 'euphoric', selected: Random.rand(51)}, 
  {text: 'stupid', selected: Random.rand(51)}
])

questions[2].responses.create([
  {text: 'museum', selected: Random.rand(51)}, 
  {text: 'at home', selected: Random.rand(51)}, 
  {text: 'in public', selected: Random.rand(51)}, 
  {text: 'at the theater', selected: Random.rand(51)}, 
  {text: 'in nature', selected: Random.rand(51)}, 
  {text: 'in my secret place', selected: Random.rand(51)}
])

questions[3].responses.create([
  {text: 'yes', selected: Random.rand(51)}, 
  {text: 'no', selected: Random.rand(51)}
])

questions[4].responses.create([
  {text: 'Impressionism', selected: Random.rand(51)}, 
  {text: 'Neoclassical', selected: Random.rand(51)}, 
  {text: 'Mesopotamian', selected: Random.rand(51)}, 
  {text: 'Abstract Expressionism', selected: Random.rand(51)}, 
  {text: 'Surrealism', selected: Random.rand(51)}, 
  {text: 'Byzantine and Islamic', selected: Random.rand(51)},
])

questions[5].responses.create([
  {text: 'chinese', selected: Random.rand(51)}, 
  {text: 'mexican', selected: Random.rand(51)}, 
  {text: 'burgers', selected: Random.rand(51)}, 
  {text: 'that sketchy pasta place', selected: Random.rand(51)}
])

questions[6].responses.create([
  {text: 'yes', selected: Random.rand(51)}, 
  {text: 'no', selected: Random.rand(51)}
])

questions[7].responses.create([
  {text: 'Futurama', selected: Random.rand(51)}, 
  {text: 'The Simpsons', selected: Random.rand(51)}
])

questions[8].responses.create([
  {text: 'Homer', selected: Random.rand(51)}, 
  {text: 'Fry', selected: Random.rand(51)}
])

questions[9].responses.create([
  {text: 'yes', selected: Random.rand(51)}, 
  {text: 'no', selected: Random.rand(51)}
])

questions[10].responses.create([
  {text: 'yes', selected: Random.rand(51)}, 
  {text: 'no', selected: Random.rand(51)}
])