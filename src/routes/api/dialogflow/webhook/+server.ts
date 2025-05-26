import type { RequestHandler } from '@sveltejs/kit';
// making function that runs every time Dialogflow sends a POST request to webhook URL.
export const POST: RequestHandler = async ({ request }) => {
	try {
		// Get the data like what the user said, what intent was matched that Dialogflow sent us.
		const body = await request.json();
		// Print out the whole message we got from Dialogflow. This is super useful for checking things!
		console.log('Webhook Request Body:', JSON.stringify(body, null, 2));

		// Pulling out key pieces of information from Dialogflow's message.
		const intentName = body.queryResult?.intent?.displayName; // The name of the "topic" (intent) Dialogflow figured out.
		const parameters = body.queryResult?.parameters; // Any specific details (like city names, passenger count) Dialogflow found.
		const activeContexts = body.queryResult?.outputContexts || []; // The current "memory" or context of the conversation.

		let responseText = 'Sorry, I did not understand that from the webhook.'; // Our default reply if nothing else matches.
		let outputContextsToSet: any[] = []; // We'll use this to tell Dialogflow which "memories" to keep or clear.
		let resetContexts = false; // A flag to decide if we need to clear all conversation memory.

		let responseJson: any = {
			fulfillmentText: responseText, // The main text response.
			fulfillmentMessages: [{ text: { text: [responseText] } }], // Another way to send the text response.
			source: 'webhook' // Tells Dialogflow this answer came from our server.
		};

		// Now, let's handle different intents

		// If Dialogflow recognized the "Book-flight" topic:
		if (intentName === 'Book-flight') {
			// Get all the flight details that Dialogflow extracted from the user's message.
			const departureCity = parameters?.['departure-city'];
			const destinationCity = parameters?.['destination-city'];
			const passengerCount = parameters?.['passengers-count'];
			const flightClass = parameters?.['flight-class'];
			const confirmation = parameters?.['confirmation'];

			// Print these details for debugging. Helps us see if Dialogflow got them right.
			console.log({ departureCity, destinationCity, passengerCount, flightClass, confirmation });

			// Scenario 1: We have all the flight details, but the user hasn't confirmed yet.
			// So, we ask them to confirm.
			if (departureCity && destinationCity && passengerCount && flightClass && !confirmation) {
				responseText = `Let me confirm, a flight from ${departureCity} to ${destinationCity}, for ${passengerCount} passenger(s) in ${flightClass} class. Is that correct?`;
				// Keep the current conversation "memory" so Dialogflow remembers these flight details for the next "yes/no" answer.
				outputContextsToSet = activeContexts;
			} else if (confirmation === 'yes') {
				// Scenario 2: The user said "yes", so the booking is confirmed!
				responseText = `✅ Great! Your flight from ${departureCity} to ${destinationCity} for ${passengerCount} passenger(s) in ${flightClass} class has been booked.`;
				resetContexts = true; // Booking is done, so we'll clear the conversation memory.
			} else if (confirmation === 'no') {
				// Scenario 3: The user said "no", so we need to start over.
				responseText = `❌ Got it. Let’s start over. Where would you like to go?`;
				resetContexts = true; // Clear the memory to begin a new booking process.
			}

			// If `resetContexts` is true, we tell Dialogflow to forget all the current conversation "memories".
			// This is like starting a fresh conversation or ending a specific task.
			if (resetContexts) {
				outputContextsToSet = activeContexts.map((context: { name: string }) => ({
					name: context.name,
					lifespanCount: 0 // Setting lifespan to 0 makes Dialogflow forget this specific memory.
				}));
			}

			// Update our response to Dialogflow with the correct text and any changes to the conversation memory.
			responseJson = {
				fulfillmentText: responseText,
				fulfillmentMessages: [{ text: { text: [responseText] } }],
				outputContexts: outputContextsToSet, // Send back the updated "memories" (contexts).
				source: 'webhook'
			};
		} else if (intentName === 'Default Welcome Intent') {
			// If the user just said "hello" or started the chat.
			responseText = 'Hello! How can I assist you today?';
			responseJson = {
				fulfillmentText: responseText,
				fulfillmentMessages: [{ text: { text: [responseText] } }],
				source: 'webhook'
			};
		} else if (intentName === 'Default Fallback Intent') {
			// If Dialogflow didn't understand what the user said at all.
			responseText = 'I am sorry, I did not understand. Can you please rephrase?';
			responseJson = {
				fulfillmentText: responseText,
				fulfillmentMessages: [{ text: { text: [responseText] } }],
				source: 'webhook'
			};
		}

		return new Response(JSON.stringify(responseJson), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		//for better error handling, we catch any problems that happen while processing the request.
		console.error('Webhook caught an error:', error); // Log the problem for us to see.
		// Send a generic error message back to Dialogflow.
		return new Response(
			JSON.stringify({
				fulfillmentText: '❌ An internal server error occurred while processing your request.'
			}),
			{
				status: 500, // This means "something went wrong on our server" to Dialogflow.
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
};
 