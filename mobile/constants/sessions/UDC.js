const arrayOfLengthN = (n => ( Array.apply(null, { length: 100 }).map(Function.call, Number)).sort((a, b) => a < b))

export const GeneralInfo = {
  'dropdown': {
    Location: [
      'Training Room',
      'Woods/Field',
      'Vehicle Interior',
      'Vehicle Exterior',
      'Building Interior',
      'Building Exterior',
    ],
    Temperature: arrayOfLengthN(100),
    Humidity: arrayOfLengthN(100),
    Wind: arrayOfLengthN(100)
  }
}

export const InitialValues = {
  Location: GeneralInfo['dropdown'].Location[0],
  Temperature: 70,
  Humidity: 70,
  Wind: 70,
}
