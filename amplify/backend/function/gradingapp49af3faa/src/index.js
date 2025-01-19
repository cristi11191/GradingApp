
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    // Extract HTTP method and query parameters
    const method = event.httpMethod;
    const params = event.queryStringParameters;

    if (method === 'GET') {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Enable CORS
                "Access-Control-Allow-Headers": "*",
            },
            body: JSON.stringify({ message: 'GET request received', params }),
        };
    }

    return {
        statusCode: 405,
        headers: {
            "Access-Control-Allow-Origin": "*", // Enable CORS
        },
        body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
};
