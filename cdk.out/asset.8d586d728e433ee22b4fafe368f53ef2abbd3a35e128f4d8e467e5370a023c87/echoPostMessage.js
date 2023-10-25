exports.handler = async function(event) {
  console.log(`event: ${JSON.stringify(event)}`);

  // the echo message passed via POST
  let message = "Empty message passed to echo";
  if (event.body !== null && event.body !== undefined) {
    let body = JSON.parse(event.body)
    if (body.message) {
      message = body.message;
    }
  }

  // timstamp
  let timestamp = Date.now().toString();

  // return parameter response
  let response = {
    echo: message,
    timestamp: timestamp,
  };
  console.log(`response: ${JSON.stringify(response)}`);

  return {
    statusCode: 200,
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods" : "*"
    },
    body: JSON.stringify(response)
  };
};