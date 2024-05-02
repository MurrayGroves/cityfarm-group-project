# Supported Functionality #

The project in its current state allows for CRUD operations on Animals, Enclosures, and Calendar Events.

Animal types can be created by the user supporting custom properties of thefollowing types:
- Boolean (Yes / No)
- String
- Integer
- Decimal
- Calendar Event

Calendar events can be created that are associated with any number of existing farms, animals and enclosures.
Events can either be one-time or recurring, with a repeat offset given in days, weeks, months and years.

Enclosures can hold animals up to their capacity, and are assigned to a farm.

# Future Plans #

- Automatic scheduling of events when modifying attributes
    - e.g. a sheep gets their 'Pregnant' attribute changed to 'Yes'
    - so an event should be made in 150 days called 'Lambing' with that animal attached

- Enable support for more farms
    - Only Windmill Hill, Hartcliffe, and St. Werburghs are currently supported
    - This would not be a difficult change on the developer's side, but is not something the user can currently do themselves
    - Possible implementation: a settings page where the user can specify the farms they wish to manage

- Synchronising with Outlook Calendar
    - This allows users to view events created in CityFarm Manager alongside their existing Outlook tasks and events
    - albeit without the full details of linked livestock and enclosures
    - This makes CityFarm Manager easier to integrate into a user's existing workflow

- Ability to upload pictures of livestock to their 'notes' section in ordet to more easily recognise them

- Functionality to more intuitively move livestock between farms / enclosures
    - This is easier for the user than a mess of buttons
