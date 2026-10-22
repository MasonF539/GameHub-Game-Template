# [Game Name] Design

Replace each whole square-bracketed placeholder, including the brackets, with
your own text. For example, replace [Game Name] with your intended game name.
Longer bracketed prompts describe what to explain; replace the entire prompt
with your description. Standalone prompts become normal paragraphs when filled
in. Italic notes introduce groups of prompts and can be
deleted after completing them. Use "Not needed" where a section does not apply.
Duplicate setting, action, and rule blocks when you need more than one.

[Game Name] is a versioned game plugin made for GameHub. The package owns the
game-specific server and browser behavior, while GameHub provides the room,
transport, lobby, spectator, and hosting services required to run it.

Source locations, internal state, API integration, and technical verification
belong in [implementation notes](implementation.md).

## Game overview

[Describe what players do, what makes the game interesting, and how they try
to win. Keep this understandable to someone who has never played it.]

- Game name: [Game Name]
- Number of players: [Minimum and maximum player counts.]
- Typical game length: [Expected match duration, or state that it has not been measured.]
- Player objective: [What players are trying to achieve during play.]
- Winning condition: [What must happen for a player or team to win.]

## Intended player experience

[Describe what players should feel and which moments create those feelings.
Explain what should keep them involved and make them want to play again.]

## Design priorities

*Write a few specific principles that guide decisions about rules and features.
For each priority, explain what it means for this game.*

1. **[Priority]** [Explain which rules or feature decisions this priority should guide.]

## Game mechanics

### Starting a game

[Describe setup, starting resources, cards or pieces, randomization, player
roles or teams, and how the first player or starting phase is chosen.]

### Turns and rounds

[Explain what players do in order, or how simultaneous play works. Describe
how one turn, round, or phase leads to the next and what carries over.]

### Rules and player actions

*Write the rules in language a player could follow. For each action, explain
who may use it, what they choose, what happens, and what makes it invalid.
Include any penalties or exceptions.*

#### Action or rule: [Action or rule name]

[Describe eligible players and the turns or situations in which this action is
allowed.]

[Describe the choice or input the player makes.]

[Explain how the action changes the game and what happens next.]

[Explain illegal attempts, their consequences, and special cases.]

### Winning, losing, and elimination

[Explain when a round or match ends, how ties are resolved, whether eliminated
players can return, and what happens after the result is shown.]

### Example of play

[Use named players to show a short sequence from a starting situation through
their decisions to the result. Include a special case if it helps explain a rule.]

## Hidden information and spectators

*Describe what each player can see, what remains secret, and when information
is revealed. Include what spectators and eliminated players can see or do,
and what late joiners are allowed to do.*

[Describe the information all players can see throughout play.]

[Describe private information and who is allowed to see it.]

[Describe information hidden from players until a later event.]

[Explain the events that reveal information and who receives it.]

[Describe what these viewers can see and whether they can participate.]

[Explain whether late joiners play, spectate, or wait for the next match.]

## Settings reference

*List the shared rules the host can configure. Give each setting's default,
choices or limits, and effect on play. Include when changes take effect.*

### Setting: [Setting name]

[The setting value used unless the host changes it.]

[Available choices, or minimum, maximum, and step size.]

[Explain how changing this setting affects the rules or player experience.]

[State when a new value starts affecting play.]

### Personal preferences and presets

Rule configurations can be saved using GameHub's presets.

*Describe this game's personal display options, such as card styles or board
colors. Name the choices and defaults. Include any game-specific preference
that should be remembered; shared platform procedures belong in GameHub's guide.*

[Describe the personal styles, colors, or other options players can select.]

[Name or describe the presentation used initially.]

[Describe personal choices that should persist and for how long.]

## Offline players and host ownership

*Describe the effects on the match when a player disconnects, returns, leaves,
or is removed. Explain what happens to their resources and any running timers.
For host changes, describe only the effect on this game.*

[Explain what happens immediately and how long the game waits.]

[Describe how the missing player is handled after the wait ends.]

[Explain which choices the host has and their effects on the match.]

[Explain which timers and automatic actions stay stopped until resumed.]

[Describe what the returning player keeps and how they resume play.]

[Explain how overlapping waiting periods affect the remaining players.]

[Explain what happens to the departing player and their cards, pieces, or points.]

[Explain whether the match ends, waits, or changes its rules.]

[Describe the effect on the current match and available host controls.]

## Room scoreboard and social panel

*Describe the scores players see and what makes each score change. Separate
current-match points from totals accumulated across matches in one room.
Describe the panel layout and who can communicate with whom.*

[Describe each match score and the events that increase or decrease it.]

[Describe totals carried across matches and exactly what they count.]

[Explain ranking order and what happens when values are equal.]

[Explain when totals clear and what resetting affects.]

[Describe where and when players can view the scores.]

[Explain who can talk to whom and any restrictions during play.]

[Describe the spectator details players need to see.]

[Describe panel positions, open/minimized modes, and what should be remembered.]

## Current layout and controls

### Board and player areas

[Describe the main playing area, player seats or panels, and where pieces,
cards, status messages, timers, and buttons sit. Add a sketch or reference
if it helps. Choose a layout that suits this game's mechanics.]

### Buttons and keybinds

*List the controls players use, preferred keyboard shortcuts, and when each
control is available. Explain how touch users perform the same actions.*

[List button labels and the actions they perform.]

[List each action and its initial keyboard binding.]

[Explain when controls should be disabled or hidden and why.]

[Describe the updates players need and where they appear.]

[Explain how phone and tablet players perform the same actions.]

### Screen sizes and accessibility

[Explain how the playing area adapts to portrait phones, landscape phones,
short laptops, and larger screens. Include readable text, focus, announcements,
overflow, color cues, and reduced-motion behavior where they affect play.]

### Art, animation, and audio

[Describe the intended visual style, animations, music, and sound effects.
State what each effect communicates. Asset paths and implementation details
can be filled in separately during development.]

## Action timing and pacing

*Describe time limits and what happens on timeout. Explain what a pause stops,
how competing actions are decided, and when animations prevent further input.
State the desired behavior even if its implementation has not been chosen.*

[List the durations, limits, and when each timer starts.]

[Explain what happens when each timer expires.]

[Explain what stops, what is preserved, and how play resumes.]

[Explain how overlapping actions should be compared and resolved.]

[Describe how delayed, duplicate, or outdated input should be handled.]

[Describe the intended pacing and when players may act during animations.]

## Implementation status

Checked items describe implemented game behavior. The template's starter
example is separate from the game defined here. Leave items unchecked until
the corresponding behavior exists.

### Game availability

*List this game's playable modes, supported player counts, and participation
features that have been implemented.*

- [ ] [Describe an implemented game mode, supported player count, or participation feature.]

### Existing configuration

*List the game-specific settings and preferences that have been implemented.*

- [ ] [Describe a game setting or personal preference that has been implemented.]

### Server-authoritative gameplay

*List the rules, actions, timing, and recovery behavior that have been implemented.*

- [ ] [Describe a rule, action, timing behavior, or recovery feature that has been implemented.]

### Client gameplay

*List the game information, controls, and feedback that have been implemented.*

- [ ] [Describe game information, a control, or player feedback that has been implemented.]

### Table presentation

*List the board, player areas, responsive layouts, and visual effects that have
been implemented. Rename this heading if the game does not use a table.*

- [ ] [Describe a board element, responsive layout, or visual effect that has been implemented.]

## Open questions and later additions (optional)

*List undecided rules, questions for the viability review, and features that can
wait until after the first playable version.*

[List unresolved decisions or questions that need a viability review.]

[Describe the features essential for the first playable version.]

[Describe features that can wait until after the first playable version.]

## Playtest questions (optional)

*Keep a few questions about whether the game achieves its intended experience.
Explain briefly why each matters. Put detailed test instructions, observations,
and results in separate playtest notes.*

- **[Question being answered]** [Why this matters to the game's design.]
