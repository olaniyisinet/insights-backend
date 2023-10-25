exports.handler = async function(event) {
  console.log(`event: ${JSON.stringify(event)}`);

  // the echo message passed via GET
  let message = "Empty message passed to echo";
  if(event.queryStringParameters?.message) {
    message = event.queryStringParameters?.message;
  }

  // timsetamp
  let timestamp = Date.now().toString();

  // return parameter response
  let response = {
    echo: message,
    timestamp: timestamp,
  };
  console.log(`response: ${JSON.stringify(response)}`);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response)
  };
};