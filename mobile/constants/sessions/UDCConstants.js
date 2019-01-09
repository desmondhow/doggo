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
  TempSessions: [ 
    {
      sessionId: 0,
      Hides: [
        {
          hideId: 0,
          Location: 'Training Room',
          Placement: 'Scent Box',
          Concealed: 'Concealed'
        },
        {
          hideId: 1,
          Location: 'Vehicle Interior',
          Placement: 'Package',
          Concealed: 'Concealed'
        },
        {
          hideId: 2,
          Location: 'Training Room',
          Placement: 'Container',
          Concealed: 'Not Concealed'
        },
        {
          hideId: 3,
          Location: 'Building Exterior',
          Placement: 'Scent Box',
          Concealed: 'Concealed'
        }
      ],
    },
  ],
  TempDogs: [
    'Moxy',
    'Roxy',
    'Joe',
  ],
  TempTrainers: [
    'Jamie',
    'Dani',
    'Desmond'
  ],
  HandlerRadius: [
    '0-5ft',
    '6-15ft',
    '>16ft',
    'Out of Sight'
  ],
  Distractions: [
    {
      label: 'Other K9',
      value: '1,'
    },
    {
      label: 'Humans, Workers',
      value: '2'
    },
    {
      label: 'Toys',
      value: '3'
    },
    {
      label: 'Food',
      value: '4'
    },
    {
      label: 'Noise/Machines',
      value: '5'
    },
    {
      label: 'Live Animals',
      value: '6'
    },
    {
      label: 'Human Remains',
      value: '7'
    },
    {
      label: 'Deceased Animals',
      value: '8'
    },
    {
      label: 'Clothing',
      value: '9'
    },
    {
      label: 'Other',
      value: '99'
    },
  ],
  FailCodes: [
    {
      label: 'Duration',
      value: '1'
    },
    {
      label: 'K9 distracted',
      value: '2'
    },
    {
      label: 'Did not respond to verbal command',
      value: '3'
    },
    {
      label: 'Did not respond to hand command',
      value: '4'
    },
    {
      label: 'Unfamiliar handler',
      value: '5'
    },
    {
    label: 'Unmotivated',
      value: '6'
    },
    {
      label: 'Not interested in reward',
      value: '7'
    },
    {
      label: 'Unable to heel off lead through agility course',
      value: '8'    
    },
    {
      label: 'Issue with K9 distance from obstacle',
      value: '9'    
    },
    {
      label: 'Fear of obstacle/environment',
      value: '10'
    },
    {
      label: 'Issue with object height',
      value: '11'
    },
    {
      label: 'Issue with handler distance (directs)',
      value: '12'
    },
    {
      label: 'Does not follow correct direct direction',
      value: '13'
    },
    {
      label: 'Does not have automatic HUP',
      value: '14'
    },
    {
      label: 'Cannot complete task with handler out of sight',
      value: '15'
    },
    {
      label: 'Will not stay at scent source/victim',
      value: '16'
    },
    {
      label: 'Does not locate victim',
      value: '17'
    },
    {
      label: 'Alert not at scent source',
      value: '18'
    },
    {
      label: 'False alert on distraction',
      value: '19'
    },
    {
      label: 'Will not enter search area',
      value: '20'
    },
    {
      label: 'Will not return handler',
      value: '21'
    },
    {
      label: 'Will not out',
      value: '22'
    },
    {
      label: 'Will not engage with toy/equipment',
      value: '23'
    },
    {
      label: 'Reactivity to other K9',
      value: '24'
    },
    {
      label: 'Demonstrates frustration barking',
      value: '25'
    },
    {
      label: 'Foot misplacement',
      value: '26'
    },
    {
      label: 'Rushed through obstacle',
      value: '27'
    },
    {
      label: 'Cannot locate odor',
      value: '28'
    },
    {
      label: 'Moves too fast during searching. Need to unwind and restart',
      value: '29'
    },
    {
      label: 'Leaves 1st odor to go to 2nd odor before alerting on 1st odor',
      value: '30'
    },
    {
      label: 'Handler removes distractions',
      value: '31'
    },
    {
      label: 'Handler stabilizes obstacle',
      value: '32'
    },
    {
      label: 'Handler moves closer to K9',
      value: '33'
    },
    {
      label: 'Handler reduces duration',
      value: '34'
    },
    {
      label: 'K9 eliminates (Urination/Defecation)',
      value: '35'
    },
    {
      label: 'K9 leaves training area',
      value: '36'
    },
    {
      label: 'Distracted by food source',
      value: '37'
    },
    {
      label: 'Cannot complete task',
      value: '38'
    },
    {
      label: 'Does not sit straight in heel position',
      value: '39'
    },
    {
      label: 'Responds incorrectly to verbal command',
      value: '40'
    },
    {
      label: 'Responds incorrectly to hand command',
      value: '41'
    },
    {
      label: 'Touched scent source',
      value: '42'
    },
    {
      label: 'Grabbed scent source',
      value: '43'
    },
    {
      label:'Disrupted scent source',
      value: '44'
    },
  ]
}

export const HidesInfo = {
  Hides: [
    {
      Concentrations: [4],
      Sizes: ['1#', '#09', '#04', '#02']
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