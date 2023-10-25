exports.handler = async function(event) {
  console.log(`event: ${JSON.stringify(event)}`);

  return {
    statusCode: 200,
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: "Welcome!!! API is up and running."
  };
};