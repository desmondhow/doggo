const arrayOfLengthN = (n => ( Array.apply(null, { length: n+1 }).map(Function.call, Number)).sort((a, b) => a < b))

export const GeneralInfo = {
  Temperature: arrayOfLengthN(100),
  Humidity: arrayOfLengthN(100),
  Wind: arrayOfLengthN(10),
  'Wind Direction': [
    'N',
    'NE',
    'E',
    'SE',
    'S',
    'SW',
    'W',
    'NW'
  ]
}

export const BuildingSearchInfo = {
  Hides: [
    'Training Room, Scent Box, Concealed',
    'Vehicle Interior, Package, Concealed',
    'Training Room, Container, Not Concealed',
    'Building Exterior, Scent Box, Concealed',
  ],
  Distractions: [
    'Other K9',
    'Humans, Workers',
    'Toys',
    'Food',
    'Noise/Machines',
    'Live Animals',
    'Human Remains',
    'Deceased Animals',
    'Clothing',
    'Other'
  ],
  FailCodes: [
    'Duration',
    'K9 distracted',
    'Did not respond to verbal command',
    'Did not respond to hand command',
    'Unfamiliar handler',
    'Unmotivated',
    'Not interested in reward',
    'Unable to heel off lead through agility course',
    'Issue with K9 distance from obstacle',
    'Fear of obstacle/environment',
    'Issue with object height',
    'Issue with handler distance (directs)',
    'Does not follow correct direct direction',
    'Does not have automatic HUP',
    'Cannot complete task with handler out of sight',
    'Will not stay at scent source/victim',
    'Does not locate victim',
    'Alert not at scent source',
    'False alert on distraction',
    'Will not enter search area',
    'Will not return handler',
    'Will not out',
    'Will not engage with toy/equipment',
    'Reactivity to other K9',
    'Demonstrates frustration barking',
    'Foot misplacement',
    'Rushed through obstacle',
    'Cannot locate odor',
    'Moves too fast during searching. Need to unwind and restart',
    'Leaves 1st odor to go to 2nd odor before alerting on 1st odor',
    'Handler removes distractions',
    'Handler stabilizes obstacle',
    'Handler moves closer to K9',
    'Handler reduces duration',
    'K9 eliminates (Urination/Defecation)',
    'K9 leaves training area',
    'Distracted by food source',
    'Cannot complete task',
    'Does not sit straight in heel position',
    'Responds incorrectly to verbal command',
    'Responds incorrectly to hand command',
    'Touched scent source',
    'Grabbed scent source',
    'Disrupted scent source'
  ]
}

export const HidesInfo = {
  Hides: [
    {
      Concentrations: [4],
      Sizes: [1, '#09', '#04', '#02']
    },
    {
      Concentrations: [6, 8, 16],
      Sizes: ['#31', '#08', '#04', '#02']
    },
  ],
  Locations: [
    'Training Room',
    'Woods/Field',
    'Vehicle Interior',
    'Vehicle Exterior',
    'Building Interior',
    'Building Exterior',
  ],
  PlacementAreas: [
    'Container',
    'Scent Box',
    'In Room',
    'Package',
    'Other'
  ],
  PlacementHeights: [
    'Low (0-3 ft.)',
    'Med (4-6 ft.)',
    'High (> 6 ft.)'
  ]
}

// TODO: setup Hides initial values
export const InitialValues = {
  General: {
    Temperature: 50,
    Humidity: 70,
    Wind: 7,
    'Wind Direction': 'N'
  },
  Hides: {

  }
}