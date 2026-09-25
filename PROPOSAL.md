# Secured REST API: Stage 0

- One of the main video games that I play is a game on Roblox called “Eternal Towers of Hell” that revolves around tower-structured obstacle courses without any checkpoints. 

- In this game, there is a difficulty chart to represent the difficulty of any said obstacle course in that game, and in that chart, a category of the game’s hardest towers – called “Soul-Crushing” towers – lie at the top of that chart. I want to make an API that returns only data about those towers. 

- The schema for this would include information about the towers, such as their acronym, difficulty, creators of the tower, the type of tower that it is, the area the tower is located in, picture links, etc.

### REQUIREMENTS:

1 - Anyone can view and read tower data. Logged-in users can also create, edit, or delete their own tower pages.
2 - Every tower page is tagged with the username of the person who created it, so the app knows who owns it.
3 - There are three specific roles: Builders (regular users), Curators (game testers), and Staff (the admins).
4 - Only Curators can officially verify a tower and lock its difficulty rating. Even the Staff admins can't do this, because admins aren't the ones playtesting the game.
5 - Only Staff have a delete button to completely wipe a bad or rule-breaking tower from the system.
