import requests
import random
import json

HOST = 'http://localhost:8080/api'
S = requests.Session()

with open("names.txt") as f:
    NAMES = f.readlines()
    NAMES = [name.strip() for name in NAMES]

FARMS = ["WH", "HC", "SW"]
SEXES = ["m", "f", "c"]

schemas = S.get(f'{HOST}/schemas').json()
animals = S.get(f'{HOST}/animals').json()
events = S.get(f'{HOST}/events/non_instanced').json()


def generate_boolean():
    return random.choice([True, False])

def generate_integer():
    return random.randint(0, 100)

def generate_float():
    return random.random() * 100

def generate_string():
    return ''.join(random.choices('abcdefghijklmnopqrstuvwxyz', k=random.randint(1, 10)))

def generate_event():
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
            fields[fieldName] = generate_event()

    animal = {"name": name, "mother": mother, "father": father, "farm": random.choice(FARMS), "sex": random.choice(SEXES), "type": schema.get('_name'), "fields": fields}

    return animal

for i in range(900):
    animal = generate_animal()
    print(animal)
    id = S.post(f'{HOST}/animals/create', json=animal).text
    animal["_id"] = id
    animals.append(animal)
    print(f"Created animal with id {id}")
