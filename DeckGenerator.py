import random
import json

path = "/Users/amichailevy/Documents/spikes/crosswords/all_clues.txt"

lines = open(path, "r").readlines()


day_to_clues = {}
current_day = None
for line in lines:
  if '----' in line:
    day = line.split('----')[2]
    current_day = day
    if not day in day_to_clues:
      day_to_clues[day] = []
  else:
    day_to_clues[day].append(line)


sunday_questions = day_to_clues['Sunday']

taken = []


for i in range(100000):
  choice = random.choice(sunday_questions)
  parts = choice.split(' || ')
  clue = parts[0]
  if "See " in clue:
    continue

  solution = parts[1]
  if len(solution) > 7 and len(solution) < 13 and not choice in taken:
    taken.append(choice)

  if len(taken) == 12:
    break

to_print = []
id = 1
for card in taken:
  parts = card.split(' || ')
  to_print.append({
    "id": id,
    "clue": parts[0],
    "answer": parts[1].strip(),
  })
  id += 1

print(json.dumps(to_print))