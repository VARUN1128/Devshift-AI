const express = require('express');
const cors = require('cors');
const { BotFrameworkAdapter, MemoryStorage, UserState, ConversationState } = require('botbuilder');
const { DevOpsBot } = require('./bot');
require('dotenv').config();

// Create Express server
const app = express();
const PORT = process.env.PORT || 3978;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create adapter for Bot Framework
const adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Error handling for the adapter
adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${error}`);
    
    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${error}`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

// Create storage and state management
const memoryStorage = new MemoryStorage();
const userState = new UserState(memoryStorage);
const conversationState = new ConversationState(memoryStorage);

// Create the bot instance
const bot = new DevOpsBot(userState, conversationState);

// Bot endpoint
app.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'DevOps Bot is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 DevOps Bot server is running on port ${PORT}`);
    console.log(`📱 Bot endpoint: http://localhost:${PORT}/api/messages`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = { app, adapter };
