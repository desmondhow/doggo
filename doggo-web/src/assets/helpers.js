export const request = (url, body, method = "POST") =>
  fetch(url, {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: body
  });

  export const isSignedIn = () => {
    if (sessionStorage.getItem("userId")) {
      return true;
    }
    return false;
  }

  export const sessionTypeToName = {
    "UDC": "UDC",
    "LHS": "Live Human Search",
    "OBD": "Obedience"
  }