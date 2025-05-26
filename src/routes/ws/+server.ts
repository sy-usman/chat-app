import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import * as dialogflow from '@google-cloud/dialogflow';
import { v4 as uuid } from 'uuid'; // use for unique IDs chat conversation.

dotenv.config();

const app = express();
const server = http.createServer(app); // Build an HTTP server using our web application.
const wss = new WebSocketServer({ server }); // Attach the WebSocket feature to our existing HTTP server.

// Now creating this part tells our server how to connect to Dialogflow, using env file.
const sessionClient = new dialogflow.SessionsClient({
	keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

// build a simple web page that says Server is Live
app.get('/', (_req, res) => {
	res.send('✅ Real-time Chat Server is Live and WebSocket Ready');
});

// Now starting with the core of our chat server!
wss.on('connection', (ws) => {
	console.log('Client connected to WebSocket.'); // a msg to see if someone connects.

	// Giving each new person a unique chat ID.
	// This is super important! It makes sure Dialogflow remembers *their* specific conversation,
	const sessionId = uuid(); ////unique session id
	console.log(`New Dialogflow session created for WebSocket connection: ${sessionId}`);

	// When the server gets a message from the connected person:
	ws.on('message', async (message) => {
		const userMessage = message.toString(); // Take the message and turn it into readable text.
		console.log(`Received message from client: ${userMessage}`); // Log what the user said.

		// Build the full "address" for this specific chat session in Dialogflow.
		const sessionPath = sessionClient.projectAgentSessionPath(
			process.env.DF_PROJECT_ID!,
			sessionId //id for persons chat
		);

		// now the game begins, Prepare the message to send to Dialogflow.
		const request = {
			session: sessionPath, // Which chat session this message belongs to.
			queryInput: {
				text: {
					text: userMessage, // The actual text the user sent.
					languageCode: 'en'
				}
			}
		};
		///build a try catch concept for better error handling
		try {
			// Send the user's message to Dialogflow.
			const responses = await sessionClient.detectIntent(request);
			const result = responses[0].queryResult; // Get the main answer from Dialogflow.

			// If Dialogflow doesn't have a specific answer, we send a default message.
			ws.send(result?.fulfillmentText || 'No response from Dialogflow.');
			console.log(`Sent response to client: ${result?.fulfillmentText}`);
		} catch (error) {
			// If something goes wrong while talking to Dialogflow (e.g., network issue), then we log the problem and tell the user there was an error.
			console.error('WebSocket Dialogflow Error:', error);
			ws.send('Error reaching Dialogflow'); // Tell the user something went wrong.
		}
	});

	// When a person closes their chat window or disconnects:
	ws.on('close', () => {
		console.log('Client disconnected from WebSocket.'); // Log that they left.
	});

	// If there's any technical problem with the WebSocket connection itself:
	ws.on('error', (error) => {
		console.error('WebSocket error:', error); // Log the error.
	});
});

//now start our main server. It will listen for web requests and WebSocket connections on port 3001.
const PORT = 3001;
server.listen(PORT, () => {
	console.log(`🚀 WebSocket Server running on http://localhost:${PORT}`);
});
