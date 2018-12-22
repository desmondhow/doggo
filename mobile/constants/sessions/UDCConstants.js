const arrayOfLengthN = (n => ( Array.apply(null, { length: 100 }).map(Function.call, Number)).sort((a, b) => a > b))

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

export const InitialValues = {
  General: {
    Temperature: 50,
    Humidity: 70,
    Wind: 7,
    'Wind Direction': 'N'
  }
}

export const HideInfo = {
  Location: [
    'Training Room',
    'Woods/Field',
    'Vehicle Interior',
    'Vehicle Exterior',
    'Building Interior',
    'Building Exterior',
  ],
}
