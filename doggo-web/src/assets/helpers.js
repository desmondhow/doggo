export const request = (url, body, method = "POST") =>
  fetch(url, {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: body
  });