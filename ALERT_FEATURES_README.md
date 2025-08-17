# 🚨 Advanced Alert Management Features

This document describes the enhanced alert management capabilities added to your DevOps Bot.

## 🔍 **Overview**

Your bot now includes a comprehensive alert tracking system with:
- **Automatic timeout detection** for unacknowledged alerts
- **Multi-level escalation** with configurable attempts
- **Quick reply options** for immediate response
- **Team lead notifications** for critical issues
- **Enhanced Jira integration** for critical ticket monitoring

## 📋 **New Commands**

### **Alert Management**
- `/alert <service> <message>` - Send alert with tracking
- `/alert status` - View your alert status and escalation levels

### **Enhanced Jira Dashboard**
- `/jira dashboard` - Now shows critical issues, overdue tickets, and SLA breaches

## ⚙️ **Configuration**

### **Alert Settings** (`alert-config.js`)
```javascript
module.exports = {
    ALERT_TIMEOUT_MINUTES: 15,           // Time before escalation
    ESCALATION_ATTEMPTS: 3,              // Max escalation attempts
    ESCALATION_DELAY_MINUTES: 30,        // Delay between escalations
    // ... more settings
};
```

### **Environment Variables**
```env
# Teams Integration
TEAMS_WEBHOOK_URL=https://your-webhook-url.com
TEAMS_APP_ID=your_app_id
TEAMS_APP_PASSWORD=your_app_password

# Jira Integration
JIRA_API_BASE_URL=https://yourcompany.atlassian.net
JIRA_API_TOKEN=your_api_token
JIRA_USERNAME=your_username
```

## 🔄 **Alert Lifecycle**

### **1. Alert Creation**
```
/alert database Connection timeout detected
```
- Creates alert with unique ID
- Assigns to current on-call engineer
- Starts 15-minute timeout timer
- Provides quick reply options

### **2. Quick Reply Options**
Users can respond with:
- **✅ Acknowledge** - Marks alert as resolved
- **⏰ Snooze 15m** - Delays escalation by 15 minutes
- **⏰ Snooze 30m** - Delays escalation by 30 minutes
- **❌ Ignore** - Marks alert as ignored

### **3. Escalation Process**
If no response within timeout:
1. **Level 1**: Escalates to same engineer with warning
2. **Level 2**: Escalates again with stronger warning
3. **Level 3**: Escalates to team leads
4. **Final**: Sends to emergency escalation groups

## 📊 **Enhanced Jira Dashboard**

The `/jira dashboard` command now provides:

### **Critical & High Priority Tickets**
- Shows all Critical and Highest priority tickets
- Includes due dates and assignees
- Highlights SLA breaches

### **Overdue Tickets**
- Identifies tickets past due date
- Shows SLA breach status
- Prioritizes by severity

### **Pending High Priority**
- Lists open high-priority tickets
- Shows assignment status
- Helps identify bottlenecks

### **Overall Statistics**
- Total ticket count
- Open vs. In Progress breakdown
- Critical/High priority counts
- Overdue ticket summary

## 🧪 **Testing the New Features**

### **Test Alert Creation**
```
/alert database Connection timeout detected
```

### **Test Quick Replies**
```
✅ Acknowledge
⏰ Snooze 15m
⏰ Snooze 30m
❌ Ignore
```

### **Test Alert Status**
```
/alert status
```

### **Test Enhanced Dashboard**
```
/jira dashboard
```

## 🔧 **Technical Implementation**

### **Alert Tracking System**
- Uses in-memory Maps for immediate access
- Includes comprehensive status tracking
- Supports timeout management with setTimeout
- Implements escalation state machine

### **Quick Reply Handler**
- Detects quick reply keywords in messages
- Maps responses to alert actions
- Updates alert status in real-time
- Manages timeout timers

### **Escalation Engine**
- Configurable escalation levels
- Automatic timeout scheduling
- Team lead notification system
- Emergency group escalation

## 📈 **Monitoring & Analytics**

### **Alert Metrics**
- Response time tracking
- Escalation frequency
- Resolution rates
- User acknowledgment patterns

### **Jira Integration Metrics**
- Critical ticket counts
- SLA breach detection
- Overdue ticket trends
- Assignment efficiency

## 🚀 **Future Enhancements**

### **Planned Features**
- [ ] AWS Lambda integration for persistent storage
- [ ] DynamoDB integration for alert persistence
- [ ] Real-time Teams notifications
- [ ] Advanced escalation workflows
- [ ] Integration with PagerDuty/OpsGenie
- [ ] Custom escalation rules per service

### **Integration Possibilities**
- [ ] Microsoft Graph API for Teams messaging
- [ ] Azure Functions for serverless processing
- [ ] Power BI dashboards for analytics
- [ ] Slack integration for cross-platform support

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **Alerts not escalating**
   - Check timeout configuration
   - Verify escalation logic
   - Check console logs for errors

2. **Quick replies not working**
   - Ensure exact keyword matching
   - Check alert ID extraction
   - Verify context handling

3. **Jira dashboard errors**
   - Check Jira API credentials
   - Verify ticket data structure
   - Check network connectivity

### **Debug Mode**
Enable debug logging by setting:
```env
NODE_ENV=development
LOG_LEVEL=debug
```

## 📚 **API Reference**

### **Alert Object Structure**
```javascript
{
    id: 'alert_1234567890',
    service: 'database',
    message: 'Connection timeout detected',
    sentTo: 'Alice',
    sentToEmail: 'alice@company.com',
    sentToPhone: '+1-555-0101',
    status: 'sent', // sent, acknowledged, escalated, escalated_to_leads
    timestamp: '2024-12-20T10:30:00.000Z',
    attempts: 1,
    escalationLevel: 0,
    acknowledged: false,
    acknowledgedAt: null,
    acknowledgedBy: null,
    snoozedUntil: null,
    ignored: false,
    ignoredAt: null,
    ignoredBy: null
}
```

### **Jira Ticket Structure**
```javascript
{
    id: 'PROJ-126',
    title: 'Critical security vulnerability in auth module',
    status: 'Open',
    assignee: 'Alice',
    priority: 'Critical',
    dueDate: '2024-12-20',
    slaBreach: true
}
```

## 🤝 **Support & Contributing**

For questions or issues:
1. Check the troubleshooting section
2. Review console logs and error messages
3. Test with simple alert scenarios
4. Open an issue in the repository

---

**Note**: This alert system is designed to work with your existing Teams bot infrastructure. For production deployment, consider implementing persistent storage and real-time notifications.
