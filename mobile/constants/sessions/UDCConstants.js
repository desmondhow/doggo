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