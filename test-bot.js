// Simple test script for DevOps Bot functionality
// This helps verify the bot logic without needing Teams integration

const { DevOpsBot } = require('./bot');

// Mock context for testing
class MockContext {
    constructor(userName = 'TestUser') {
        this.activity = {
            type: 'message',
            text: '',
            from: { name: userName },
            recipient: { id: 'bot' }
        };
        this.responses = [];
    }
    
    async sendActivity(message) {
        this.responses.push(message);
        console.log(`Bot: ${message}`);
        return { id: Date.now() };
    }
    
    async sendTraceActivity() {
        // Mock trace activity
        return { id: Date.now() };
    }
}

// Test the bot functionality
async function testBot() {
    console.log('🧪 Testing DevOps Bot Functionality\n');
    
    // Create mock state objects for testing
    const mockUserState = {
        createProperty: () => ({ get: () => null, set: () => null })
    };
    const mockConversationState = {
        createProperty: () => ({ get: () => null, set: () => null })
    };
    
    // Create mock bot instance with mock state
    const bot = new DevOpsBot(mockUserState, mockConversationState);
    
    // Test 1: Shift Today
    console.log('📅 Test 1: /shift today');
    const context1 = new MockContext();
    context1.activity.text = '/shift today';
    await bot.onMessage(context1);
    console.log('');
    
    // Test 2: My Schedule
    console.log('📋 Test 2: /my schedule');
    const context2 = new MockContext('Alice');
    context2.activity.text = '/my schedule';
    await bot.onMessage(context2);
    console.log('');
    
    // Test 3: Help
    console.log('❓ Test 3: help');
    const context3 = new MockContext();
    context3.activity.text = 'help';
    await bot.onMessage(context3);
    console.log('');
    
    // Test 4: Invalid Command
    console.log('❌ Test 4: Invalid command');
    const context4 = new MockContext();
    context4.activity.text = 'invalid command';
    await bot.onMessage(context4);
    console.log('');
    
    console.log('✅ Bot testing completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
    testBot().catch(console.error);
}

module.exports = { testBot };
