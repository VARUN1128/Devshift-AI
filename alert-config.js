// Alert Management Configuration
// This file contains all configurable settings for the alert system

module.exports = {
    // Timeout Settings
    ALERT_TIMEOUT_MINUTES: 15,           // How long to wait before escalating
    ESCALATION_ATTEMPTS: 3,              // Maximum escalation attempts before going to leads
    ESCALATION_DELAY_MINUTES: 30,        // Delay between escalation attempts
    
    // Escalation Groups
    ESCALATION_GROUPS: {
        'devops-leads': ['alice@company.com', 'bob@company.com'],
        'emergency': ['charlie@company.com', 'david@company.com'],
        'management': ['manager@company.com']
    },
    
    // Quick Reply Options
    QUICK_REPLY_OPTIONS: [
        '✅ Acknowledge',
        '⏰ Snooze 15m',
        '⏰ Snooze 30m',
        '❌ Ignore'
    ],
    
    // Jira Integration Settings
    JIRA: {
        CRITICAL_PRIORITIES: ['Critical', 'Highest'],
        HIGH_PRIORITIES: ['High', 'Critical', 'Highest'],
        OVERDUE_THRESHOLD_DAYS: 1,       // Days after due date to consider overdue
        SLA_BREACH_THRESHOLD_HOURS: 2    // Hours after SLA to trigger breach alerts
    },
    
    // Teams Integration
    TEAMS: {
        WEBHOOK_URL: process.env.TEAMS_WEBHOOK_URL || 'https://your-webhook-url.com',
        BOT_APP_ID: process.env.TEAMS_APP_ID,
        BOT_APP_PASSWORD: process.env.TEAMS_APP_PASSWORD
    },
    
    // Logging
    LOGGING: {
        ENABLE_DEBUG: process.env.NODE_ENV === 'development',
        LOG_LEVEL: process.env.LOG_LEVEL || 'info',
        LOG_ALERT_ACTIONS: true,
        LOG_ESCALATIONS: true
    }
};
