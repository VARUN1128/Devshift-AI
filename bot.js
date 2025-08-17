const { ActivityTypes, StatePropertyAccessor } = require('botbuilder');
const { ComponentDialog, TextPrompt, WaterfallDialog, DialogSet } = require('botbuilder-dialogs');

// Import AWS and Jira services
// Mock data for demonstration purposes

// Shift schedule data (hardcoded for demo)
const SHIFT_SCHEDULE = {
    'monday': { name: 'Alice', contact: 'alice@company.com', phone: '+1-555-0101' },
    'tuesday': { name: 'Bob', contact: 'bob@company.com', phone: '+1-555-0102' },
    'wednesday': { name: 'Charlie', contact: 'charlie@company.com', phone: '+1-555-0103' },
    'thursday': { name: 'Alice', contact: 'alice@company.com', phone: '+1-555-0101' },
    'friday': { name: 'Bob', contact: 'bob@company.com', phone: '+1-555-0102' },
    'saturday': { name: 'Charlie', contact: 'charlie@company.com', phone: '+1-555-0103' },
    'sunday': { name: 'Alice', contact: 'alice@company.com', phone: '+1-555-0101' }
};

// User shift assignments (repeating pattern)
const USER_SHIFTS = {
    'Alice': ['Monday', 'Thursday', 'Sunday', 'Wednesday', 'Saturday', 'Tuesday', 'Friday'],
    'Bob': ['Tuesday', 'Friday', 'Monday', 'Thursday', 'Sunday', 'Wednesday', 'Saturday'],
    'Charlie': ['Wednesday', 'Saturday', 'Tuesday', 'Friday', 'Monday', 'Thursday', 'Sunday']
};

// Mock data for additional features
const SWAP_REQUESTS = new Map();
const LEAVE_REQUESTS = new Map();
const REMINDERS = new Map();
const INCIDENTS = new Map();
const JIRA_TICKETS = new Map();

// Advanced Alert Tracking System
const ALERTS = new Map();
const ALERT_TIMEOUTS = new Map();
const ESCALATION_GROUPS = {
    'devops-leads': ['alice@company.com', 'bob@company.com'],
    'emergency': ['charlie@company.com', 'david@company.com']
};

// Alert Configuration
const ALERT_CONFIG = {
    TIMEOUT_MINUTES: 15,
    ESCALATION_ATTEMPTS: 3,
    ESCALATION_DELAY_MINUTES: 30
};

// Initialize some mock data
SWAP_REQUESTS.set('swap001', {
    id: 'swap001',
    user1: 'Alice',
    user2: 'Bob',
    date: '2024-12-25',
    status: 'pending',
    timestamp: new Date()
});

LEAVE_REQUESTS.set('Alice', [
    { type: 'vacation', startDate: '2024-12-20', endDate: '2024-12-22', status: 'approved' }
]);

INCIDENTS.set('INC001', {
    id: 'INC001',
    title: 'Database connection timeout',
    status: 'open',
    assignedTo: 'Alice',
    priority: 'high',
    timestamp: new Date()
});

JIRA_TICKETS.set('PROJ-123', {
    id: 'PROJ-123',
    title: 'Fix authentication bug',
    status: 'In Progress',
    assignee: 'Bob',
    priority: 'Medium'
});

JIRA_TICKETS.set('PROJ-124', {
    id: 'PROJ-124',
    title: 'Database performance optimization',
    status: 'Open',
    assignee: 'Alice',
    priority: 'High'
});

JIRA_TICKETS.set('PROJ-125', {
    id: 'PROJ-125',
    title: 'Update deployment scripts',
    status: 'In Progress',
    assignee: 'Charlie',
    priority: 'Low'
});

// Add more critical Jira tickets for testing
JIRA_TICKETS.set('PROJ-126', {
    id: 'PROJ-126',
    title: 'Critical security vulnerability in auth module',
    status: 'Open',
    assignee: 'Alice',
    priority: 'Critical',
    dueDate: '2024-12-20',
    slaBreach: true
});

JIRA_TICKETS.set('PROJ-127', {
    id: 'PROJ-127',
    title: 'Production database performance degradation',
    status: 'In Progress',
    assignee: 'Bob',
    priority: 'High',
    dueDate: '2024-12-22',
    slaBreach: false
});

JIRA_TICKETS.set('PROJ-128', {
    id: 'PROJ-128',
    title: 'Load balancer configuration issue',
    status: 'Open',
    assignee: 'Charlie',
    priority: 'High',
    dueDate: '2024-12-19',
    slaBreach: true
});

// Enhanced incidents with escalation tracking
INCIDENTS.set('INC002', {
    id: 'INC002',
    title: 'API Gateway timeout errors',
    status: 'open',
    assignedTo: 'Bob',
    priority: 'critical',
    timestamp: new Date(),
    escalationLevel: 0,
    lastEscalationAt: null
});

INCIDENTS.set('INC003', {
    id: 'INC003',
    title: 'Monitoring system offline',
    status: 'open',
    assignedTo: 'Charlie',
    priority: 'high',
    timestamp: new Date(),
    escalationLevel: 0,
    lastEscalationAt: null
});

// Mock calendar data
const CALENDAR_EVENTS = new Map();
CALENDAR_EVENTS.set('Alice', [
    { title: 'Daily Standup', time: '9:00 AM', duration: '15m' },
    { title: 'Code Review', time: '2:00 PM', duration: '1h' }
]);

CALENDAR_EVENTS.set('Bob', [
    { title: 'Team Meeting', time: '10:00 AM', duration: '1h' },
    { title: 'Incident Review', time: '4:00 PM', duration: '30m' }
]);

CALENDAR_EVENTS.set('Charlie', [
    { title: 'Sprint Planning', time: '11:00 AM', duration: '2h' }
]);

// Shift swap dialog
class ShiftSwapDialog extends ComponentDialog {
    constructor() {
        super('shiftSwapDialog');
        
        this.addDialog(new TextPrompt('usernamePrompt'));
        this.addDialog(new TextPrompt('datePrompt'));
        this.addDialog(new TextPrompt('approvalPrompt'));
        
        this.addDialog(new WaterfallDialog('shiftSwapWaterfall', [
            this.askUsername.bind(this),
            this.askDate.bind(this),
            this.processSwapRequest.bind(this),
            this.waitForApproval.bind(this)
        ]));
        
        this.initialDialogId = 'shiftSwapWaterfall';
    }
    
    async askUsername(stepContext) {
        return await stepContext.prompt('usernamePrompt', 'Who would you like to swap shifts with?');
    }
    
    async askDate(stepContext) {
        stepContext.values.username = stepContext.result;
        return await stepContext.prompt('datePrompt', 'What date would you like to swap? (MM/DD/YYYY)');
    }
    
    async processSwapRequest(stepContext) {
        stepContext.values.date = stepContext.result;
        
        const requestingUser = stepContext.context.activity.from.name || 'Unknown User';
        const targetUser = stepContext.values.username;
        const swapDate = stepContext.values.date;
        
        // Store swap request for approval
        stepContext.values.swapRequest = {
            requestingUser,
            targetUser,
            swapDate,
            status: 'pending'
        };
        
        await stepContext.context.sendActivity(
            `🔄 Shift swap request sent to ${targetUser}!\n\n` +
            `**Request Details:**\n` +
            `- From: ${requestingUser}\n` +
            `- Date: ${swapDate}\n` +
            `- Status: Pending approval\n\n` +
            `Please wait for ${targetUser} to respond with "yes" to approve or any other message to deny.`
        );
        
        return await stepContext.prompt('approvalPrompt', 
            `${targetUser}, do you approve this shift swap request? Type "yes" to approve or any other message to deny.`);
    }
    
    async waitForApproval(stepContext) {
        const approval = stepContext.result.toLowerCase();
        const swapRequest = stepContext.values.swapRequest;
        
        if (approval === 'yes') {
            swapRequest.status = 'approved';
            await stepContext.context.sendActivity(
                `✅ **Shift swap approved!**\n\n` +
                `The shift swap between ${swapRequest.requestingUser} and ${swapRequest.targetUser} ` +
                `for ${swapRequest.swapDate} has been confirmed.`
            );
        } else {
            swapRequest.status = 'denied';
            await stepContext.context.sendActivity(
                `❌ **Shift swap denied**\n\n` +
                `The shift swap request from ${swapRequest.requestingUser} has been denied.`
            );
        }
        
        return await stepContext.endDialog();
    }
}

// Main DevOps Bot class
class DevOpsBot {
    constructor(userState, conversationState) {
        this.userState = userState;
        this.conversationState = conversationState;
        
        // Create dialog set for shift swap functionality
        this.dialogState = this.conversationState.createProperty('dialogState');
        this.dialogs = new DialogSet(this.dialogState);
        this.dialogs.add(new ShiftSwapDialog());
    }
    
    async run(context) {
        // Handle different activity types
        if (context.activity.type === ActivityTypes.Message) {
            await this.onMessage(context);
        } else if (context.activity.type === ActivityTypes.ConversationUpdate) {
            await this.onConversationUpdate(context);
        }
        
        // Save state changes
        await this.conversationState.saveChanges(context);
        await this.userState.saveChanges(context);
    }
    
    async onConversationUpdate(context) {
        // Welcome message when bot is added to conversation
        if (context.activity.membersAdded && context.activity.membersAdded.length > 0) {
            for (let member of context.activity.membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(
                        `👋 **Welcome to DevOps On-Call Bot!**\n\n` +
                        `I can help you manage on-call shifts. Here are the available commands:\n\n` +
                        `• **/shift today** - Show today's on-call engineer\n` +
                        `• **/my schedule** - Show your upcoming shifts\n` +
                        `• **/swap shift with <username> <date>** - Request a shift swap\n\n` +
                        `Just type any command to get started!`
                    );
                }
            }
        }
    }
    
    async onMessage(context) {
        const text = context.activity.text.toLowerCase().trim();
        
        // Handle slash commands
        if (text.startsWith('/shift today')) {
            await this.handleShiftToday(context);
        } else if (text.startsWith('/my schedule')) {
            await this.handleMySchedule(context);
        } else if (text.startsWith('/user')) {
            await this.handleUser(context);
        } else if (text.startsWith('/morning')) {
            await this.handleMorningShift(context);
        } else if (text.startsWith('/afternoon')) {
            await this.handleAfternoonShift(context);
        } else if (text.startsWith('/night')) {
            await this.handleNightShift(context);
        } else if (text.startsWith('/swap blw')) {
            await this.handleSwapBetween(context);
        } else if (text.startsWith('/leave')) {
            await this.handleLeave(context);
        } else if (text.startsWith('/team schedule')) {
            await this.handleTeamSchedule(context);
        } else if (text.startsWith('/next shift')) {
            await this.handleNextShift(context);
        } else if (text.startsWith('/availability')) {
            await this.handleAvailability(context);
        } else if (text.startsWith('/swap status')) {
            await this.handleSwapStatus(context);
        } else if (text.startsWith('/cancel swap')) {
            await this.handleCancelSwap(context);
        } else if (text.startsWith('/remind me')) {
            await this.handleReminder(context);
        } else if (text.startsWith('/alert')) {
            await this.handleAlert(context);
        } else if (text.startsWith('/alert status')) {
            await this.handleAlertStatus(context);
        } else if (text.startsWith('/escalate')) {
            await this.handleEscalate(context);
        } else if (text.includes('acknowledge') || text.includes('snooze') || text.includes('ignore')) {
            await this.handleQuickReply(context);
        } else if (text.startsWith('/incident status')) {
            await this.handleIncidentStatus(context);
        } else if (text.startsWith('/incident assign')) {
            await this.handleIncidentAssign(context);
        } else if (text.startsWith('/jira tickets')) {
            await this.handleJiraTickets(context);
        } else if (text.startsWith('/jira status')) {
            await this.handleJiraStatus(context);
        } else if (text.startsWith('/jira assign')) {
            await this.handleJiraAssign(context);
        } else if (text.startsWith('/jira comment')) {
            await this.handleJiraComment(context);
        } else if (text.startsWith('/jira dashboard')) {
            await this.handleJiraDashboard(context);
        } else if (text.startsWith('/calendar today')) {
            await this.handleCalendarToday(context);
        } else if (text.startsWith('/calendar schedule')) {
            await this.handleCalendarSchedule(context);
        } else if (text.startsWith('/meeting schedule')) {
            await this.handleMeetingSchedule(context);
        } else if (text.startsWith('/swap shift with')) {
            await this.handleSwapShift(context);
        } else if (text === 'help' || text === '/help') {
            await this.showHelp(context);
        } else {
            await this.showHelp(context);
        }
    }
    
    async handleShiftToday(context) {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const shift = SHIFT_SCHEDULE[today];
        
        if (shift) {
            await context.sendActivity(
                `📅 **Today's On-Call Engineer**\n\n` +
                `**Day:** ${today.charAt(0).toUpperCase() + today.slice(1)}\n` +
                `**Engineer:** ${shift.name}\n` +
                `**Email:** ${shift.contact}\n` +
                `**Phone:** ${shift.phone}\n\n` +
                `🚨 Please contact ${shift.name} for any urgent DevOps issues.`
            );
        } else {
            await context.sendActivity('❌ Unable to determine today\'s shift. Please try again later.');
        }
    }
    
    async handleMySchedule(context) {
        const userName = context.activity.from.name || 'Unknown User';
        
        // Find user in shift assignments
        const userKey = Object.keys(USER_SHIFTS).find(key => 
            key.toLowerCase() === userName.toLowerCase()
        );
        
        if (userKey) {
            const shifts = USER_SHIFTS[userKey];
            const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            
            // Get next 3 shifts starting from today
            const upcomingShifts = [];
            let currentDay = today;
            
            for (let i = 0; upcomingShifts.length < 3 && i < 14; i++) {
                const dayName = dayNames[currentDay];
                if (shifts.includes(dayName)) {
                    upcomingShifts.push(dayName);
                }
                currentDay = (currentDay + 1) % 7;
            }
            
            let scheduleText = `📋 **Your Upcoming Shifts**\n\n`;
            scheduleText += `**User:** ${userKey}\n\n`;
            
            if (upcomingShifts.length > 0) {
                scheduleText += `**Next 3 shifts:**\n`;
                upcomingShifts.forEach((shift, index) => {
                    scheduleText += `${index + 1}. ${shift}\n`;
                });
            } else {
                scheduleText += `No upcoming shifts found.`;
            }
            
            await context.sendActivity(scheduleText);
        } else {
            await context.sendActivity(
                `❌ User "${userName}" not found in shift assignments.\n\n` +
                `Available users: ${Object.keys(USER_SHIFTS).join(', ')}`
            );
        }
    }
    
    async handleSwapShift(context) {
        // Extract username and date from command
        const text = context.activity.text;
        const match = text.match(/\/swap shift with (\w+) (.+)/i);
        
        if (match) {
            const targetUser = match[1];
            const swapDate = match[2];
            
            // Validate target user exists
            if (!Object.keys(USER_SHIFTS).includes(targetUser)) {
                await context.sendActivity(
                    `❌ User "${targetUser}" not found.\n\n` +
                    `Available users: ${Object.keys(USER_SHIFTS).join(', ')}`
                );
                return;
            }
            
            // For now, just acknowledge the request (dialog functionality will be added back later)
            await context.sendActivity(
                `🔄 Shift swap request received!\n\n` +
                `**Request Details:**\n` +
                `- From: ${context.activity.from.name || 'Unknown User'}\n` +
                `- To: ${targetUser}\n` +
                `- Date: ${swapDate}\n` +
                `- Status: Request received (dialog functionality coming soon)`
            );
        } else {
            await context.sendActivity(
                `❌ Invalid format. Please use: **/swap shift with <username> <date>**\n\n` +
                `Example: \`/swap shift with Bob 12/25/2024\``
            );
        }
    }
    
    async handleUser(context) {
        const userName = context.activity.from.name || 'Unknown User';
        await context.sendActivity(
            `👤 **User Information**\n\n` +
            `**Current User:** ${userName}\n` +
            `**Available Users:** ${Object.keys(USER_SHIFTS).join(', ')}\n\n` +
            `Use \`/my schedule\` to see your specific shifts.`
        );
    }
    
    async handleMorningShift(context) {
        const morningShifts = {
            'monday': { name: 'Alice', time: '6:00 AM - 2:00 PM' },
            'tuesday': { name: 'Bob', time: '6:00 AM - 2:00 PM' },
            'wednesday': { name: 'Charlie', time: '6:00 AM - 2:00 PM' },
            'thursday': { name: 'Alice', time: '6:00 AM - 2:00 PM' },
            'friday': { name: 'Bob', time: '6:00 AM - 2:00 PM' },
            'saturday': { name: 'Charlie', time: '6:00 AM - 2:00 PM' },
            'sunday': { name: 'Alice', time: '6:00 AM - 2:00 PM' }
        };
        
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const shift = morningShifts[today];
        
        if (shift) {
            await context.sendActivity(
                `🌅 **Morning Shift (6:00 AM - 2:00 PM)**\n\n` +
                `**Day:** ${today.charAt(0).toUpperCase() + today.slice(1)}\n` +
                `**Engineer:** ${shift.name}\n` +
                `**Time:** ${shift.time}\n\n` +
                `☀️ Good morning! ${shift.name} is on morning shift today.`
            );
        } else {
            await context.sendActivity('❌ Unable to determine morning shift. Please try again later.');
        }
    }
    
    async handleAfternoonShift(context) {
        const afternoonShifts = {
            'monday': { name: 'Bob', time: '2:00 PM - 10:00 PM' },
            'tuesday': { name: 'Charlie', time: '2:00 PM - 10:00 PM' },
            'wednesday': { name: 'Alice', time: '2:00 PM - 10:00 PM' },
            'thursday': { name: 'Bob', time: '2:00 PM - 10:00 PM' },
            'friday': { name: 'Charlie', time: '2:00 PM - 10:00 PM' },
            'saturday': { name: 'Alice', time: '2:00 PM - 10:00 PM' },
            'sunday': { name: 'Bob', time: '2:00 PM - 10:00 PM' }
        };
        
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const shift = afternoonShifts[today];
        
        if (shift) {
            await context.sendActivity(
                `🌤️ **Afternoon Shift (2:00 PM - 10:00 PM)**\n\n` +
                `**Day:** ${today.charAt(0).toUpperCase() + today.slice(1)}\n` +
                `**Engineer:** ${shift.name}\n` +
                `**Time:** ${shift.time}\n\n` +
                `🌤️ Good afternoon! ${shift.name} is on afternoon shift today.`
            );
        } else {
            await context.sendActivity('❌ Unable to determine afternoon shift. Please try again later.');
        }
    }
    
    async handleNightShift(context) {
        const nightShifts = {
            'monday': { name: 'Charlie', time: '10:00 PM - 6:00 AM' },
            'tuesday': { name: 'Alice', time: '10:00 PM - 6:00 AM' },
            'wednesday': { name: 'Bob', time: '10:00 PM - 6:00 AM' },
            'thursday': { name: 'Charlie', time: '10:00 PM - 6:00 AM' },
            'friday': { name: 'Alice', time: '10:00 PM - 6:00 AM' },
            'saturday': { name: 'Bob', time: '10:00 PM - 6:00 AM' },
            'sunday': { name: 'Charlie', time: '10:00 PM - 6:00 AM' }
        };
        
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const shift = nightShifts[today];
        
        if (shift) {
            await context.sendActivity(
                `🌙 **Night Shift (10:00 PM - 6:00 AM)**\n\n` +
                `**Day:** ${today.charAt(0).toUpperCase() + today.slice(1)}\n` +
                `**Engineer:** ${shift.name}\n` +
                `**Time:** ${shift.time}\n\n` +
                `🌙 Good night! ${shift.name} is on night shift today.`
            );
        } else {
            await context.sendActivity('❌ Unable to determine night shift. Please try again later.');
        }
    }
    
    async handleSwapBetween(context) {
        const text = context.activity.text;
        const match = text.match(/\/swap blw (\w+) (\w+) (.+)/i);
        
        if (match) {
            const user1 = match[1];
            const user2 = match[2];
            const swapDate = match[3];
            
            // Validate both users exist
            if (!Object.keys(USER_SHIFTS).includes(user1) || !Object.keys(USER_SHIFTS).includes(user2)) {
                await context.sendActivity(
                    `❌ One or both users not found.\n\n` +
                    `Available users: ${Object.keys(USER_SHIFTS).join(', ')}`
                );
                return;
            }
            
            await context.sendActivity(
                `🔄 **Shift Swap Between Users**\n\n` +
                `**User 1:** ${user1}\n` +
                `**User 2:** ${user2}\n` +
                `**Date:** ${swapDate}\n` +
                `**Status:** Swap request received\n\n` +
                `Both users will be notified of this swap request.`
            );
        } else {
            await context.sendActivity(
                `❌ Invalid format. Please use: **/swap blw <user1> <user2> <date>**\n\n` +
                `Example: \`/swap blw Alice Bob 12/25/2024\``
            );
        }
    }
    
    async handleLeave(context) {
        const userName = context.activity.from.name || 'Unknown User';
        const text = context.activity.text;
        const match = text.match(/\/leave (.+)/i);
        
        if (match) {
            const leaveReason = match[1];
            await context.sendActivity(
                `📝 **Leave Request Submitted**\n\n` +
                `**User:** ${userName}\n` +
                `**Reason:** ${leaveReason}\n` +
                `**Status:** Pending approval\n\n` +
                `Your leave request has been submitted and will be reviewed by your manager.`
            );
        } else {
            await context.sendActivity(
                `❌ Invalid format. Please use: **/leave <reason>**\n\n` +
                `Example: \`/leave sick day\` or \`/leave vacation\``
            );
        }
    }
    
    async handleTeamSchedule(context) {
        const today = new Date();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        let scheduleText = `📅 **Team Schedule - This Week**\n\n`;
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - today.getDay() + i);
            const dayName = dayNames[date.getDay()];
            const dayKey = dayName.toLowerCase();
            
            if (SHIFT_SCHEDULE[dayKey]) {
                const shift = SHIFT_SCHEDULE[dayKey];
                const isToday = i === today.getDay();
                const todayMarker = isToday ? ' (Today)' : '';
                
                scheduleText += `**${dayName}${todayMarker}:** ${shift.name}\n`;
                scheduleText += `  🌅 Morning: ${shift.name === 'Alice' ? 'Alice' : shift.name === 'Bob' ? 'Bob' : 'Charlie'}\n`;
                scheduleText += `  🌤️ Afternoon: ${shift.name === 'Alice' ? 'Bob' : shift.name === 'Bob' ? 'Charlie' : 'Alice'}\n`;
                scheduleText += `  🌙 Night: ${shift.name === 'Alice' ? 'Charlie' : shift.name === 'Bob' ? 'Alice' : 'Bob'}\n\n`;
            }
        }
        
        await context.sendActivity(scheduleText);
    }
    
    async handleNextShift(context) {
        const today = new Date().getDay();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const tomorrow = (today + 1) % 7;
        const tomorrowName = dayNames[tomorrow];
        const tomorrowKey = tomorrowName.toLowerCase();
        
        if (SHIFT_SCHEDULE[tomorrowKey]) {
            const shift = SHIFT_SCHEDULE[tomorrowKey];
            await context.sendActivity(
                `⏭️ **Next Shift - ${tomorrowName}**\n\n` +
                `**On-Call Engineer:** ${shift.name}\n` +
                `**Email:** ${shift.contact}\n` +
                `**Phone:** ${shift.phone}\n\n` +
                `🔄 ${shift.name} will be on call tomorrow.`
            );
        } else {
            await context.sendActivity('❌ Unable to determine next shift. Please try again later.');
        }
    }
    
    async handleAvailability(context) {
        const text = context.activity.text;
        const match = text.match(/\/availability (\w+)/i);
        
        if (match) {
            const userName = match[1];
            
            if (Object.keys(USER_SHIFTS).includes(userName)) {
                const leaves = LEAVE_REQUESTS.get(userName) || [];
                const today = new Date();
                
                let availabilityText = `👤 **Availability Status - ${userName}**\n\n`;
                availabilityText += `**Current Status:** Available\n`;
                availabilityText += `**Next Shift:** `;
                
                // Find next shift
                const shifts = USER_SHIFTS[userName];
                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                let currentDay = today.getDay();
                let nextShift = null;
                
                for (let i = 0; i < 14; i++) {
                    const dayName = dayNames[currentDay];
                    if (shifts.includes(dayName)) {
                        nextShift = dayName;
                        break;
                    }
                    currentDay = (currentDay + 1) % 7;
                }
                
                availabilityText += nextShift || 'No upcoming shifts';
                availabilityText += `\n\n`;
                
                if (leaves.length > 0) {
                    availabilityText += `**Leave Requests:**\n`;
                    leaves.forEach(leave => {
                        availabilityText += `• ${leave.type}: ${leave.startDate} to ${leave.endDate} (${leave.status})\n`;
                    });
                } else {
                    availabilityText += `**Leave Requests:** None\n`;
                }
                
                await context.sendActivity(availabilityText);
            } else {
                await context.sendActivity(
                    `❌ User "${userName}" not found.\n\n` +
                    `Available users: ${Object.keys(USER_SHIFTS).join(', ')}`
                );
            }
        } else {
            await context.sendActivity(
                `❌ Invalid format. Please use: **/availability <username>**\n\n` +
                `Example: \`/availability Alice\``
            );
        }
    }
    
    async handleSwapStatus(context) {
        const userName = context.activity.from.name || 'Unknown User';
        let statusText = `🔄 **Swap Request Status**\n\n`;
        
        let hasRequests = false;
        for (let [id, request] of SWAP_REQUESTS) {
            if (request.user1 === userName || request.user2 === userName) {
                hasRequests = true;
                statusText += `**ID:** ${id}\n`;
                statusText += `**Users:** ${request.user1} ↔ ${request.user2}\n`;
                statusText += `**Date:** ${request.date}\n`;
                statusText += `**Status:** ${request.status}\n`;
                statusText += `**Timestamp:** ${request.timestamp.toLocaleString()}\n\n`;
            }
        }
        
        if (!hasRequests) {
            statusText += `No pending swap requests found.`;
        }
        
        await context.sendActivity(statusText);
    }
    
    async handleCancelSwap(context) {
        const text = context.activity.text;
        const match = text.match(/\/cancel swap (\w+)/i);
        
        if (match) {
            const swapId = match[1];
            const swap = SWAP_REQUESTS.get(swapId);
            
            if (swap) {
                if (swap.status === 'pending') {
                    SWAP_REQUESTS.delete(swapId);
                    await context.sendActivity(
                        `❌ **Swap Request Cancelled**\n\n` +
                        `**ID:** ${swapId}\n` +
                        `**Users:** ${swap.user1} ↔ ${swap.user2}\n` +
                        `**Date:** ${swap.date}\n\n` +
                        `The swap request has been cancelled successfully.`
                    );
                } else {
                    await context.sendActivity(
                        `❌ **Cannot Cancel**\n\n` +
                        `Swap request ${swapId} is already ${swap.status} and cannot be cancelled.`
                    );
                }
            } else {
                await context.sendActivity(
                    `❌ Swap request ${swapId} not found.`
                );
            }
        } else {
            await context.sendActivity(
                `❌ Invalid format. Please use: **/cancel swap <swapID>**\n\n` +
                `Example: \`/cancel swap swap001\``
            );
        }
    }
    
    async handleReminder(context) {
        const text = context.activity.text;
        const match = text.match(/\/remind me (\w+) (.+)/i);
        
        if (match) {
            const time = match[1];
            const message = match[2];
            const userName = context.activity.from.name || 'Unknown User';
            
            // Generate reminder ID
            const reminderId = `reminder_${Date.now()}`;
            const reminder = {
                id: reminderId,
                user: userName,
                time: time,
                message: message,
                timestamp: new Date(),
                status: 'active'
            };
            
            REMINDERS.set(reminderId, reminder);
            
            await context.sendActivity(
                `⏰ **Reminder Set**\n\n` +
                `**Time:** ${time}\n` +
                `**Message:** ${message}\n` +
                `**Status:** Active\n\n` +
                `I'll remind you about: ${message}`
            );
        } else {
            await context.sendActivity(
                `❌ Invalid format. Please use: **/remind me <time> <message>**\n\n` +
                `Example: \`/remind me 15m Check alerts\` or \`/remind me 2h Review logs\``
            );
        }
    }
    
    async handleEscalate(context) {
        const text = context.activity.text;
        const match = text.match(/\/escalate (\w+)/i);
        
        if (match) {
            const incidentId = match[1];
            const incident = INCIDENTS.get(incidentId);
            
            if (incident) {
                // Find next engineer on shift
                const today = new Date().getDay();
                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const tomorrow = (today + 1) % 7;
                const tomorrowName = dayNames[tomorrow];
                const tomorrowKey = tomorrowName.toLowerCase();
                const nextEngineer = SHIFT_SCHEDULE[tomorrowKey];
                
                incident.status = 'escalated';
                incident.escalatedTo = nextEngineer.name;
                incident.escalationTime = new Date();
                
                await context.sendActivity(
                    `🚨 **Incident Escalated**\n\n` +
                    `**Incident ID:** ${incidentId}\n` +
                    `**Title:** ${incident.title}\n` +
                    `**Status:** Escalated\n` +
                    `**Escalated To:** ${nextEngineer.name}\n` +
                    `**Escalation Time:** ${incident.escalationTime.toLocaleString()}\n\n` +
                    `Incident has been escalated to the next shift engineer.`
                );
            } else {
                await context.sendActivity(
                    `❌ Incident ${incidentId} not found.`
                );
            }
        } else {
            await context.sendActivity(
                `❌ Invalid format. Please use: **/escalate <incidentID>**\n\n` +
                `Example: \`/escalate INC001\``
            );
        }
    }
    
    async handleIncidentStatus(context) {
        const text = context.activity.text;
        const match = text.match(/\/incident status (\w+)/i);
        
        if (match) {
            const incidentId = match[1];
            const incident = INCIDENTS.get(incidentId);
            
            if (incident) {
                await context.sendActivity(
                    `🚨 **Incident Status**\n\n` +
                    `**ID:** ${incident.id}\n` +
                    `**Title:** ${incident.title}\n` +
                    `**Status:** ${incident.status}\n` +
                    `**Assigned To:** ${incident.assignedTo}\n` +
                    `**Priority:** ${incident.priority}\n` +
                    `**Reported:** ${incident.timestamp.toLocaleString()}\n` +
                    `${incident.escalatedTo ? `**Escalated To:** ${incident.escalatedTo}\n` : ''}` +
                    `${incident.escalationTime ? `**Escalation Time:** ${incident.escalationTime.toLocaleString()}\n` : ''}`
                );
            } else {
                await context.sendActivity(
                    `❌ Incident ${incidentId} not found.`
                );
            }
        } else {
            await context.sendActivity(
                `❌ Invalid format. Please use: **/incident status <incidentID>**\n\n` +
                `Example: \`/incident status INC001\``
            );
        }
    }
    
    async handleJiraStatus(context) {
        const text = context.activity.text;
        const match = text.match(/\/jira status (\w+)/i);
        
        if (match) {
            const ticketId = match[1];
            const ticket = JIRA_TICKETS.get(ticketId);
            
            if (ticket) {
                await context.sendActivity(
                    `🎫 **Jira Ticket Status**\n\n` +
                    `**Ticket ID:** ${ticket.id}\n` +
                    `**Title:** ${ticket.title}\n` +
                    `**Status:** ${ticket.status}\n` +
                    `**Assignee:** ${ticket.assignee}\n` +
                    `**Priority:** ${ticket.priority}\n\n` +
                    `📊 Track progress in Jira: https://yourcompany.atlassian.net/browse/${ticket.id}`
                );
            } else {
                await context.sendActivity(
                    `❌ Jira ticket ${ticketId} not found.`
                );
            }
        } else {
            await context.sendActivity(
                `❌ Invalid format. Please use: **/jira status <ticketID>**\n\n` +
                `Example: \`/jira status PROJ-123\``
            );
        }
    }
    
    async handleAlert(context) {
        const text = context.activity.text;
        const match = text.match(/\/alert (\w+) (.+)/i);
        
        if (match) {
            const service = match[1];
            const message = match[2];
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            const shift = SHIFT_SCHEDULE[today];
            
            // Create comprehensive alert record
            const alertId = `alert_${Date.now()}`;
            const alert = {
                alertId,
                service: service,
                message: message,
                assignedTo: shift.name,
                status: 'sent',
                createdAt: new Date().toISOString(),
                priority: 'medium',
                category: 'monitoring',
                tags: [service, 'alert'],
                quickReplyOptions: ['✅ Acknowledge', '⏰ Snooze 15m', '⏰ Snooze 30m', '❌ Ignore'],
                timeoutAt: new Date(Date.now() + (15 * 60 * 1000)).toISOString() // 15 minutes from now
            };

            // Store alert in memory (mock)
            ALERTS.set(alertId, alert);
            
            // Set timeout for alert escalation
            const timeoutId = setTimeout(() => {
                this.handleAlertTimeout(alertId);
            }, 15 * 60000); // 15 minutes

            ALERT_TIMEOUTS.set(alertId, timeoutId);
            
            // Send alert with quick reply options
            await context.sendActivity(
                `🚨 **Alert Sent to On-Call Engineer**\n\n` +
                `**Service:** ${service}\n` +
                `**Message:** ${message}\n` +
                `**Sent To:** ${shift.name} (${shift.contact})\n` +
                `**Phone:** ${shift.phone}\n` +
                `**Alert ID:** ${alertId}\n\n` +
                `⚠️ Alert has been sent to the current on-call engineer.\n\n` +
                `**Quick Actions Available:**\n` +
                alert.quickReplyOptions.map(reply => `• ${reply}`).join('\n') + `\n\n` +
                `**Note:** Alert will auto-escalate if not acknowledged within 15 minutes.`
            );
            
            console.log(`Alert ${alertId} created and stored in memory`);
        } else {
            await context.sendActivity(
                `❌ Invalid format. Please use: **/alert <service> <message>**\n\n` +
                `Example: \`/alert database Connection timeout detected\``
            );
        }
    }
    
    async handleIncidentAssign(context) {
        const text = context.activity.text;
        const match = text.match(/\/incident assign (\w+) (\w+)/i);
        
        if (match) {
            const incidentId = match[1];
            const userName = match[2];
            const incident = INCIDENTS.get(incidentId);
            
            if (incident) {
                if (Object.keys(USER_SHIFTS).includes(userName)) {
                    incident.assignedTo = userName;
                    incident.assignmentTime = new Date();
                    
                    await context.sendActivity(
                        `✅ **Incident Assigned**\n\n` +
                        `**Incident ID:** ${incidentId}\n` +
                        `**Title:** ${incident.title}\n` +
                        `**Assigned To:** ${userName}\n` +
                        `**Assignment Time:** ${incident.assignmentTime.toLocaleString()}\n\n` +
                        `Incident has been successfully assigned to ${userName}.`
                    );
                } else {
                    await context.sendActivity(
                        `❌ User "${userName}" not found.\n\n` +
                        `Available users: ${Object.keys(USER_SHIFTS).join(', ')}`
                    );
                }
            } else {
                await context.sendActivity(
                    `❌ Incident ${incidentId} not found.`
                );
            }
        } else {
            await context.sendActivity(
                `❌ Invalid format. Please use: **/incident assign <incidentID> <username>**\n\n` +
                `Example: \`/incident assign INC001 Alice\``
            );
        }
    }

    // Alert Management Methods
    async scheduleAlertTimeoutCheck(alertId) {
        const timeoutId = setTimeout(() => {
            this.checkAlertTimeout(alertId);
        }, ALERT_CONFIG.TIMEOUT_MINUTES * 60 * 1000);
        
        ALERT_TIMEOUTS.set(alertId, timeoutId);
    }

    async checkAlertTimeout(alertId) {
        const alert = ALERTS.get(alertId);
        if (alert && !alert.acknowledged && !alert.ignored && !alert.snoozedUntil) {
            if (alert.escalationLevel < ALERT_CONFIG.ESCALATION_ATTEMPTS) {
                await this.escalateAlert(alertId);
            } else {
                await this.escalateToLeads(alertId);
            }
        }
    }

    async escalateAlert(alertId) {
        const alert = ALERTS.get(alertId);
        if (alert) {
            alert.escalationLevel++;
            alert.status = 'escalated';
            alert.lastEscalationAt = new Date().toISOString();
            
            // Send escalation message
            await this.sendEscalationMessage(alert);
            
            // Schedule next escalation check
            setTimeout(() => {
                this.checkAlertTimeout(alertId);
            }, ALERT_CONFIG.ESCALATION_DELAY_MINUTES * 60 * 1000);
        }
    }

    async escalateToLeads(alertId) {
        const alert = ALERTS.get(alertId);
        if (alert) {
            alert.status = 'escalated_to_leads';
            alert.escalatedToLeadsAt = new Date().toISOString();
            
            // Send to escalation groups
            await this.sendToEscalationGroups(alert);
        }
    }

    async sendEscalationMessage(alert) {
        console.log(`🚨 Escalating alert ${alert.id} to ${alert.sentTo} (Level ${alert.escalationLevel})`);
        // In a real implementation, this would send via Bot Framework proactive messaging
    }

    async sendToEscalationGroups(alert) {
        console.log(`🚨 Sending alert ${alert.id} to escalation groups`);
        // In a real implementation, this would send to escalation channels
    }

    // Quick Reply Handler for Alerts
    async handleQuickReply(context) {
        const text = context.activity.text.toLowerCase();
        const alertId = this.extractAlertIdFromContext(context);
        
        if (alertId && ALERTS.has(alertId)) {
            const alert = ALERTS.get(alertId);
            
            if (text.includes('acknowledge')) {
                await this.acknowledgeAlert(alertId, context.activity.from.name);
                await context.sendActivity(`✅ Alert ${alertId} acknowledged by ${context.activity.from.name}`);
            } else if (text.includes('snooze 15')) {
                await this.snoozeAlert(alertId, 15);
                await context.sendActivity(`⏰ Alert ${alertId} snoozed for 15 minutes`);
            } else if (text.includes('snooze 30')) {
                await this.snoozeAlert(alertId, 30);
                await context.sendActivity(`⏰ Alert ${alertId} snoozed for 30 minutes`);
            } else if (text.includes('ignore')) {
                await this.ignoreAlert(alertId, context.activity.from.name);
                await context.sendActivity(`❌ Alert ${alertId} acknowledged by ${context.activity.from.name}`);
            }
        }
    }

    async acknowledgeAlert(alertId, acknowledgedBy) {
        try {
            const alert = ALERTS.get(alertId);
            if (alert) {
                alert.status = 'acknowledged';
                alert.acknowledgedAt = new Date().toISOString();
                alert.acknowledgedBy = acknowledgedBy;
                alert.lastActivityAt = new Date().toISOString();
                
                // Clear timeout
                const timeoutId = ALERT_TIMEOUTS.get(alertId);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    ALERT_TIMEOUTS.delete(alertId);
                }
                
                console.log(`Alert ${alertId} acknowledged by ${acknowledgedBy}`);
                return true;
            }
        } catch (error) {
            console.error(`Error acknowledging alert ${alertId}:`, error);
        }
        return false;
    }

    async snoozeAlert(alertId, minutes) {
        try {
            const alert = ALERTS.get(alertId);
            if (alert) {
                alert.status = 'snoozed';
                alert.snoozeUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();
                alert.snoozedBy = 'user'; // In real implementation, get from context
                alert.lastActivityAt = new Date().toISOString();
                
                // Clear existing timeout and set new one
                const existingTimeout = ALERT_TIMEOUTS.get(alertId);
                if (existingTimeout) {
                    clearTimeout(existingTimeout);
                }
                
                const newTimeoutId = setTimeout(() => {
                    this.handleAlertTimeout(alertId);
                }, minutes * 60000);
                
                ALERT_TIMEOUTS.set(alertId, newTimeoutId);
                
                console.log(`Alert ${alertId} snoozed for ${minutes} minutes`);
                return true;
            }
        } catch (error) {
            console.error(`Error snoozing alert ${alertId}:`, error);
        }
        return false;
    }

    async ignoreAlert(alertId, ignoredBy) {
        try {
            const alert = ALERTS.get(alertId);
            if (alert) {
                alert.status = 'ignored';
                alert.ignoredAt = new Date().toISOString();
                alert.ignoredBy = ignoredBy;
                alert.lastActivityAt = new Date().toISOString();
                
                // Clear timeout
                const timeoutId = ALERT_TIMEOUTS.get(alertId);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    ALERT_TIMEOUTS.delete(alertId);
                }
                
                console.log(`Alert ${alertId} ignored by ${ignoredBy}`);
                return true;
            }
        } catch (error) {
            console.error(`Error ignoring alert ${alertId}:`, error);
        }
        return false;
    }

    extractAlertIdFromContext(context) {
        // Extract alert ID from context - this would need to be implemented based on your Teams integration
        // For now, we'll use a simple approach
        const text = context.activity.text;
        const alertMatch = text.match(/alert_(\d+)/);
        return alertMatch ? `alert_${alertMatch[1]}` : null;
    }

    // Alert Status Command
    async handleAlertStatus(context) {
        const userName = context.activity.from.name || 'Unknown User';
        let statusText = `🚨 **Alert Status - ${userName}**\n\n`;
        
        let hasAlerts = false;
        for (let [id, alert] of ALERTS) {
            if (alert.sentTo === userName || alert.acknowledgedBy === userName) {
                hasAlerts = true;
                statusText += `**ID:** ${id}\n`;
                statusText += `**Service:** ${alert.service}\n`;
                statusText += `**Status:** ${alert.status}\n`;
                statusText += `**Escalation Level:** ${alert.escalationLevel}/${ALERT_CONFIG.ESCALATION_ATTEMPTS}\n`;
                statusText += `**Timestamp:** ${new Date(alert.timestamp).toLocaleString()}\n`;
                
                if (alert.acknowledged) {
                    statusText += `**Acknowledged:** ${alert.acknowledgedAt ? new Date(alert.acknowledgedAt).toLocaleString() : 'N/A'}\n`;
                }
                if (alert.snoozedUntil) {
                    statusText += `**Snoozed Until:** ${alert.snoozedUntil ? new Date(alert.snoozedUntil).toLocaleString() : 'N/A'}\n`;
                }
                statusText += `\n`;
            }
        }
        
        if (!hasAlerts) {
            statusText += `No alerts found for this user.`;
        }
        
        await context.sendActivity(statusText);
    }
    
    async handleJiraTickets(context) {
        const text = context.activity.text;
        const match = text.match(/\/jira tickets(?: (\w+))?/i);
        const status = match ? match[1] : null;
        const userName = context.activity.from.name || 'Unknown User';
        
        let ticketsText = `🎫 **Jira Tickets - ${userName}**\n\n`;
        
        let hasTickets = false;
        for (let [id, ticket] of JIRA_TICKETS) {
            if (ticket.assignee === userName && (!status || ticket.status.toLowerCase() === status.toLowerCase())) {
                hasTickets = true;
                ticketsText += `**${id}** - ${ticket.title}\n`;
                ticketsText += `  Status: ${ticket.status} | Priority: ${ticket.priority}\n\n`;
            }
        }
        
        if (!hasTickets) {
            ticketsText += `No tickets found${status ? ` with status: ${status}` : ''}.`;
        }
        
        ticketsText += `\n📊 **View in Jira:** https://yourcompany.atlassian.net/issues/?assignee=${userName}`;
        
        await context.sendActivity(ticketsText);
    }
    
    async handleJiraAssign(context) {
        const text = context.activity.text;
        const match = text.match(/\/jira assign (\w+) (\w+)/i);
        
        if (match) {
            const ticketId = match[1];
            const userName = match[2];
            const ticket = JIRA_TICKETS.get(ticketId);
            
            if (ticket) {
                if (Object.keys(USER_SHIFTS).includes(userName)) {
                    ticket.assignee = userName;
                    ticket.assignmentTime = new Date();
                    
                    await context.sendActivity(
                        `✅ **Jira Ticket Assigned**\n\n` +
                        `**Ticket ID:** ${ticketId}\n` +
                        `**Title:** ${ticket.title}\n` +
                        `**Assigned To:** ${userName}\n` +
                        `**Assignment Time:** ${ticket.assignmentTime.toLocaleString()}\n\n` +
                        `Ticket has been successfully assigned to ${userName}.`
                    );
                } else {
                    await context.sendActivity(
                        `❌ User "${userName}" not found.\n\n` +
                        `Available users: ${Object.keys(USER_SHIFTS).join(', ')}`
                    );
                }
            } else {
                await context.sendActivity(
                    `❌ Jira ticket ${ticketId} not found.`
                );
            }
        } else {
            await context.sendActivity(
                `❌ Invalid format. Please use: **/jira assign <ticketID> <username>**\n\n` +
                `Example: \`/jira assign PROJ-123 Alice\``
            );
        }
    }
    
    async handleJiraComment(context) {
        const text = context.activity.text;
        const match = text.match(/\/jira comment (\w+) (.+)/i);
        
        if (match) {
            const ticketId = match[1];
            const comment = match[2];
            const ticket = JIRA_TICKETS.get(ticketId);
            
            if (ticket) {
                if (!ticket.comments) {
                    ticket.comments = [];
                }
                
                ticket.comments.push({
                    text: comment,
                    author: context.activity.from.name || 'Unknown User',
                    timestamp: new Date()
                });
                
                await context.sendActivity(
                    `💬 **Comment Added to Jira Ticket**\n\n` +
                    `**Ticket ID:** ${ticketId}\n` +
                    `**Title:** ${ticket.title}\n` +
                    `**Comment:** ${comment}\n` +
                    `**Author:** ${context.activity.from.name || 'Unknown User'}\n` +
                    `**Time:** ${new Date().toLocaleString()}\n\n` +
                    `Comment has been successfully added to the ticket.`
                );
            } else {
                await context.sendActivity(
                    `❌ Jira ticket ${ticketId} not found.`
                );
            }
        } else {
            await context.sendActivity(
                `❌ Invalid format. Please use: **/jira comment <ticketID> <comment>**\n\n` +
                `Example: \`/jira comment PROJ-123 Updated deployment configuration\``
            );
        }
    }
    
    async handleJiraDashboard(context) {
        let dashboardText = `🎫 **Jira Dashboard - Critical Issues Overview**\n\n`;
        
        // Use mock data for demonstration
            
            // Use mock data for demonstration
            const criticalTickets = Array.from(JIRA_TICKETS.values()).filter(ticket => 
                ticket.priority === 'Critical' || ticket.priority === 'High'
            );
            
            // Critical & High Priority Tickets
            dashboardText += `🚨 **Critical & High Priority (${criticalTickets.length}):**\n`;
            if (criticalTickets.length > 0) {
                criticalTickets.forEach(ticket => {
                    dashboardText += `• ${ticket.id} - ${ticket.title}\n`;
                    dashboardText += `  Assignee: ${ticket.assignee} | Priority: ${ticket.priority}\n`;
                    dashboardText += `\n`;
                });
            } else {
                dashboardText += `No critical tickets found.\n\n`;
            }
            
            // Overdue Tickets
            const overdueTickets = Array.from(JIRA_TICKETS.values()).filter(ticket => 
                ticket.status === 'Open' && (ticket.priority === 'Critical' || ticket.priority === 'High')
            );
            
            dashboardText += `⏰ **Overdue Tickets (${overdueTickets.length}):**\n`;
            if (overdueTickets.length > 0) {
                overdueTickets.forEach(ticket => {
                    dashboardText += `• ${ticket.id} - ${ticket.title}\n`;
                    dashboardText += `  Assignee: ${ticket.assignee} | Priority: ${ticket.priority}\n`;
                    dashboardText += `  Status: ${ticket.status}\n\n`;
                });
            } else {
                dashboardText += `No overdue tickets found.\n\n`;
            }
            
            // Overall Statistics
            dashboardText += `📊 **Overall Statistics:**\n`;
            dashboardText += `• Total Tickets: ${JIRA_TICKETS.size}\n`;
            dashboardText += `• Critical/High: ${criticalTickets.length}\n`;
            dashboardText += `• Overdue: ${overdueTickets.length}\n\n`;
            
            dashboardText += `📊 **Mock Data - No Real Jira Integration**\n`;
            
            await context.sendActivity(dashboardText);
    }
    
    // Check for Jira tickets that need escalation
    async checkJiraEscalations(dashboardSummary) {
        try {
            const criticalTickets = dashboardSummary.criticalTickets;
            const overdueTickets = dashboardSummary.overdueTickets;
            
            // Send escalation alerts for critical tickets
            for (const ticket of criticalTickets) {
                if (ticket.slaBreach && ticket.slaBreach > 2) { // More than 2 hours overdue
                    await this.sendJiraEscalationAlert(ticket, 'critical');
                }
            }
            
            // Send escalation alerts for overdue tickets
            for (const ticket of overdueTickets) {
                if (ticket.slaBreach && ticket.slaBreach > 4) { // More than 4 hours overdue
                    await this.sendJiraEscalationAlert(ticket, 'overdue');
                }
            }
        } catch (error) {
            console.error('Error checking Jira escalations:', error);
        }
    }
    
    // Send Jira escalation alert
    async sendJiraEscalationAlert(ticket, type) {
        try {
            const escalationMessage = `🚨 **JIRA ESCALATION ALERT** 🚨\n\n` +
                `**Ticket:** ${ticket.id}\n` +
                `**Type:** ${type.toUpperCase()}\n` +
                `**Summary:** ${ticket.summary}\n` +
                `**Assignee:** ${ticket.assignee}\n` +
                `**Priority:** ${ticket.priority}\n` +
                `**SLA Breach:** ${ticket.slaBreach}h overdue\n\n` +
                `This ticket requires immediate attention and escalation.`;
            
            // In a real implementation, this would send to Teams channels or specific users
            console.log(`Jira escalation alert sent for ticket ${ticket.id}: ${escalationMessage}`);
            
        } catch (error) {
            console.error(`Error sending Jira escalation alert for ticket ${ticket.id}:`, error);
        }
    }
    
    async handleCalendarToday(context) {
        const userName = context.activity.from.name || 'Unknown User';
        const events = CALENDAR_EVENTS.get(userName) || [];
        
        let calendarText = `📅 **Today's Calendar - ${userName}**\n\n`;
        
        if (events.length > 0) {
            events.forEach((event, index) => {
                calendarText += `${index + 1}. **${event.title}**\n`;
                calendarText += `   Time: ${event.time} (${event.duration})\n\n`;
            });
        } else {
            calendarText += `No events scheduled for today.`;
        }
        
        calendarText += `\n📱 **View in Teams Calendar**`;
        
        await context.sendActivity(calendarText);
    }
    
    async handleCalendarSchedule(context) {
        const text = context.activity.text;
        const match = text.match(/\/calendar schedule (\w+)/i);
        
        if (match) {
            const userName = match[1];
            const events = CALENDAR_EVENTS.get(userName) || [];
            
            if (Object.keys(USER_SHIFTS).includes(userName)) {
                let calendarText = `📅 **Calendar Schedule - ${userName}**\n\n`;
                
                if (events.length > 0) {
                    events.forEach((event, index) => {
                        calendarText += `${index + 1}. **${event.title}**\n`;
                        calendarText += `   Time: ${event.time} (${event.duration})\n\n`;
                    });
                } else {
                    calendarText += `No events scheduled.`;
                }
                
                calendarText += `\n📱 **View ${userName}'s Calendar**`;
                
                await context.sendActivity(calendarText);
            } else {
                await context.sendActivity(
                    `❌ User "${userName}" not found.\n\n` +
                    `Available users: ${Object.keys(USER_SHIFTS).join(', ')}`
                );
            }
        } else {
            await context.sendActivity(
                `❌ Invalid format. Please use: **/calendar schedule <username>**\n\n` +
                `Example: \`/calendar schedule Alice\``
            );
        }
    }
    
    async handleMeetingSchedule(context) {
        const text = context.activity.text;
        const match = text.match(/\/meeting schedule (\w+) (.+) (.+)/i);
        
        if (match) {
            const time = match[1];
            const title = match[2];
            const participants = match[3];
            
            // Validate participants
            const participantList = participants.split(',').map(p => p.trim());
            const validParticipants = participantList.filter(p => Object.keys(USER_SHIFTS).includes(p));
            
            if (validParticipants.length > 0) {
                await context.sendActivity(
                    `📅 **Teams Meeting Scheduled**\n\n` +
                    `**Title:** ${title}\n` +
                    `**Time:** ${time}\n` +
                    `**Participants:** ${validParticipants.join(', ')}\n` +
                    `**Status:** Meeting created\n\n` +
                    `✅ Meeting has been scheduled in Teams. All participants will receive calendar invites.`
                );
            } else {
                await context.sendActivity(
                    `❌ No valid participants found.\n\n` +
                    `Available users: ${Object.keys(USER_SHIFTS).join(', ')}`
                );
            }
        } else {
            await context.sendActivity(
                `❌ Invalid format. Please use: **/meeting schedule <time> <title> <participants>**\n\n` +
                `Example: \`/meeting schedule 2pm "Sprint Review" Alice,Bob,Charlie\``
            );
        }
    }
    
    async showHelp(context) {
        await context.sendActivity(
            `🤖 **Comprehensive DevOps & Cloud Team Bot Help**\n\n` +
            `**Available Commands:**\n\n` +
            `**🔄 Shift Management & Scheduling:**\n` +
            `• **/shift today** - Show today's on-call engineer and contact info\n` +
            `• **/my schedule** - Display your upcoming 3 assigned shifts\n` +
            `• **/team schedule** - Show full team's shift schedule for the week\n` +
            `• **/next shift** - Show who is on shift next (after today)\n` +
            `• **/user** - Show current user and available users\n` +
            `• **/morning** - Show morning shift (6:00 AM - 2:00 PM)\n` +
            `• **/afternoon** - Show afternoon shift (2:00 PM - 10:00 PM)\n` +
            `• **/night** - Show night shift (10:00 PM - 6:00 AM)\n\n` +
            `**🔄 Swap & Leave Management:**\n` +
            `• **/swap blw <user1> <user2> <date>** - Swap shifts between two users\n` +
            `• **/swap shift with <username> <date>** - Request a shift swap\n` +
            `• **/swap status** - Show status of pending swap requests\n` +
            `• **/cancel swap <swapID>** - Cancel a swap request\n` +
            `• **/leave <reason>** - Submit a leave request\n` +
            `• **/availability <user>** - Check user availability and leave status\n\n` +
            `**⏰ Reminders & Notifications:**\n` +
            `• **/remind me <time> <message>** - Set personal reminder\n` +
            `• **/alert <service> <message>** - Send alert to on-call engineer\n` +
            `• **/alert status** - Show your alert status and escalation levels\n\n` +
            `**🚨 Incident & Escalation:**\n` +
            `• **/escalate <incidentID>** - Escalate incident to next shift\n` +
            `• **/incident status <incidentID>** - Check incident status\n` +
            `• **/incident assign <incidentID> <user>** - Assign incident to team member\n\n` +
            `**🔗 Jira Integration:**\n` +
            `• **/jira tickets [<status>]** - List your Jira tickets (optional status filter)\n` +
            `• **/jira status <ticketID>** - Check Jira ticket status\n` +
            `• **/jira assign <ticketID> <user>** - Assign Jira ticket to team member\n` +
            `• **/jira comment <ticketID> <comment>** - Add comment to Jira ticket\n` +
            `• **/jira dashboard** - Show critical issues and overdue tickets overview\n\n` +
            `**🔗 Microsoft Teams Integration:**\n` +
            `• **/calendar today** - Show your calendar events for today\n` +
            `• **/calendar schedule <user>** - Show calendar events for specified user\n` +
            `• **/meeting schedule <time> <title> <participants>** - Schedule Teams meeting\n\n` +
            `**📅 Greetings & Info:**\n` +
            `• **/morning** - "Good morning" + today's on-call info\n` +
            `• **/afternoon** - "Good afternoon" + on-call info\n` +
            `• **/night** - "Good night" + night shift reminder\n` +
            `• **help** or **/help** - Show this help message\n\n` +
            `**🚨 Advanced Alert Features:**\n` +
            `• **Auto-escalation** after ${ALERT_CONFIG.TIMEOUT_MINUTES} minutes\n` +
            `• **Quick reply options** for acknowledge/snooze/ignore\n` +
            `• **Escalation levels** with configurable timeouts\n` +
            `• **Team lead notifications** for critical alerts\n\n` +
            `**Shift Schedule:**\n` +
            `Monday: Alice | Tuesday: Bob | Wednesday: Charlie\n` +
            `Thursday: Alice | Friday: Bob | Saturday: Charlie | Sunday: Alice\n\n` +
            `Need assistance? Contact your DevOps team lead.`
        );
    }
}

module.exports = { DevOpsBot };
