from faker import Faker
import requests
import random
import json
import time
from datetime import datetime, timezone

HOST = 'http://localhost:8080/api'
S = requests.Session()

with open("names.txt") as f:
    NAMES = f.readlines()
    NAMES = [name.strip() for name in NAMES]

FARMS = ["WH", "HC", "SW"]
SEXES = ["m", "f", "c"]
NOW = time.time()

schemas = S.get(f'{HOST}/schemas').json()
animals = S.get(f'{HOST}/animals').json()
events = S.get(f'{HOST}/events/non_instanced').json()
enclosures = S.get(f'{HOST}/enclosures').json()

fake = Faker("en_GB")


def generate_boolean():
    return random.choice([True, False])

def generate_integer():
    return random.randint(0, 100)

def generate_float():
    return round(random.random() * 100, 2)

def generate_string():
    return ''.join(random.sample('abcdefghijklmnopqrstuvwxyz', k=random.randint(1, 10)))

def generate_event_ref():
    return random.choice(events).get('_id')

def generate_animal():
    schema = random.choice(schemas)

    name = random.choice(NAMES)
    if next((x for x in animals if x.get('sex') == 'f' and x.get('type') == schema.get('_name')), None) is None:
        mother = None
    
    else:
        mother = random.choice(animals)
        while mother.get('type') != schema.get("_name") or mother.get("sex") != "f":
            mother = random.choice(animals)
        mother = mother.get('_id')

    if next((x for x in animals if x.get('sex') == 'm' and x.get('type') == schema.get('_name')), None) is None:
        father = None
    
    else:
        father = random.choice(animals)
        while father.get('type') != schema.get("_name") or father.get("sex") != "m":
            father = random.choice(animals)
        father = father.get('_id')

    fields = {}
    for (fieldName, field) in schema['_fields'].items():
        if field['_type'] == 'java.lang.Boolean':
            fields[fieldName] = generate_boolean()
        elif field['_type'] == 'java.lang.Integer':
            fields[fieldName] = generate_integer()
        elif field['_type'] == 'java.lang.Double':
            fields[fieldName] = generate_float()
        elif field['_type'] == 'java.lang.String':
            fields[fieldName] = generate_string()
        elif field['_type'] == 'cityfarm.api.calendar.EventRef':
            fields[fieldName] = generate_event_ref()

    animal = {"name": name, "mother": mother, "father": father, "farm": random.choice(FARMS), "sex": random.choice(SEXES), "type": schema.get('_name'), "fields": fields}

    return animal


def generate_event():
    attachedAnimals = random.sample(animals, k=min(random.randint(0, 10), len(animals)))
    attachedAnimals = [animal.get('_id') for animal in attachedAnimals]

    attachedEnclosures = random.sample(enclosures, k=min(random.randint(0, 10), len(enclosures)))
    attachedEnclosures = [enclosure.get('_id') for enclosure in attachedEnclosures]

    farms = random.sample(FARMS, k=random.randint(0, 3))

    description = fake.paragraph(nb_sentences=3)
    name = fake.sentence(nb_words=3)

    allDay = generate_boolean()

    type = "recurring" if random.random() < 0.1 else "once"
    if type == "recurring":
        months = random.randint(0, 2)
        days = random.randint(1, 30)

        delay = f"P0Y{months}M{days}D"
        # First start is 60-120 days ago
        firstStart = NOW - random.randint(3600 * 24 * 60, 3600 * 24 * 120)
        # Event lasts up to 4 days
        firstEnd = firstStart + random.randint(3600, 3600 * 24 * 4)
        lastEnd = firstEnd + random.randint(3600 * 24 * 60, 3600 * 24 * 720)

        firstStart = datetime.fromtimestamp(firstStart, timezone.utc).isoformat()
        firstEnd = datetime.fromtimestamp(firstEnd, timezone.utc).isoformat()
        lastEnd = datetime.fromtimestamp(lastEnd, timezone.utc).isoformat()

        return {"animals": attachedAnimals, "enclosures": attachedEnclosures, "farms": farms, "description": description, "title": name, "allDay": allDay, "delay": delay, "firstStart": firstStart, "firstEnd": firstEnd, "lastEnd": lastEnd}

    else:
        start = NOW + random.randint(-3600 * 24 * 120, 3600 * 24 * 120)
        end = start + random.randint(3600, 3600 * 24 * 4)

        start = datetime.fromtimestamp(start, timezone.utc).isoformat()
        end = datetime.fromtimestamp(end, timezone.utc).isoformat()

        return {"animals": attachedAnimals, "enclosures": attachedEnclosures, "farms": farms, "description": description, "title": name, "allDay": allDay, "start": start, "end": end}


quantity = int(input("How many objects do you want to create? "))

def create_animal():
    animal = generate_animal()
    print(animal)
    id = S.post(f'{HOST}/animals/create', json=animal).text
    animal["_id"] = id
    animals.append(animal)
    print(f"Created animal with id {id}")
    enclosure = random.choice(enclosures)
    S.patch(f'{HOST}/api/enclosures/moveanimal', json=[id, enclosure.get('_id')])

def create_event():
    event = generate_event()
    print(event)
    if event.get("firstStart") is not None:
        id = S.post(f'{HOST}/events/create/recurring', json=event).text
    else:
        id = S.post(f'{HOST}/events/create/once', json=event).text

    event["_id"] = id
    events.append(event)
    print(f"Created event with id {id}")


if (answer := input("Animal/Event? (a/e): ")) == "a":
    for i in range(quantity):
        create_animal()

elif answer == "e":
    for i in range(quantity):
        create_event()

elif answer == "ae":
    for i in range(quantity):
        create_animal()
        create_event()