# 🚀 Comprehensive DevOps & Cloud Team Bot for Microsoft Teams

A powerful Microsoft Teams chatbot built with Node.js and Microsoft Bot Framework SDK v4 that provides comprehensive DevOps team management, including shift scheduling, incident management, Jira integration, AWS integration, and Microsoft Teams collaboration tools.

## ✨ **What's New - Real-Time Features**

### **1. AWS DynamoDB Integration** 🆕
- **Persistent Storage**: All alerts are now stored in DynamoDB with full CRUD operations
- **Real-Time Updates**: Alert status changes are immediately persisted
- **Scalable Architecture**: Built for production workloads

### **2. AWS Lambda & EventBridge** 🆕
- **Automated Monitoring**: Lambda functions scan for unacknowledged alerts
- **Proactive Reminders**: Automated escalation and reminder system
- **Scheduled Operations**: EventBridge triggers for periodic monitoring

### **3. Real Jira API Integration** 🆕
- **Live Data**: Fetch real-time ticket information from Jira
- **SLA Monitoring**: Track ticket deadlines and SLA breaches
- **Proactive Escalations**: Automatic alerts for overdue tickets

### **4. Enhanced Alert Management** 🆕
- **Quick Reply Options**: Interactive buttons for acknowledging/snoozing alerts
- **Escalation Workflow**: Multi-level escalation with configurable timeouts
- **Status Tracking**: Complete audit trail of alert lifecycle

## 🚀 **Quick Start - Test Real-Time Features**

### **Step 1: Environment Setup**
1. **Create `.env` file** (copy from `env.example`):
   ```bash
   cp env.example .env
   ```

2. **Configure required variables**:
   ```env
   # Bot Framework (Required)
   MICROSOFT_APP_ID=your_bot_app_id_here
   MICROSOFT_APP_PASSWORD=your_bot_app_password_here
   
   # AWS (Required for real-time features)
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=us-east-1
   
   # Jira (Required for Jira integration)
   JIRA_BASE_URL=https://your-domain.atlassian.net
   JIRA_USERNAME=your_jira_email
   JIRA_API_TOKEN=your_jira_api_token
   
   # Teams Webhook (Required for proactive messaging)
   TEAMS_WEBHOOK_URL=https://your-webhook-url.com
   ```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Deploy AWS Infrastructure (Optional but Recommended)**
```bash
# Install AWS CLI
winget install -e --id Amazon.AWSCLI

# Configure AWS credentials
aws configure

# Deploy infrastructure
aws cloudformation deploy \
  --template-file cloudformation-template.yaml \
  --stack-name devops-bot-stack \
  --capabilities CAPABILITY_NAMED_IAM
```

### **Step 4: Start the Bot**
```bash
npm run dev
```

### **Step 5: Test Real-Time Features**
Open Bot Framework Emulator and connect to `http://localhost:3978/api/messages`

#### **🔴 Test Alert Management (Real-Time)**
```
/alert database Connection timeout
/alert monitoring High CPU usage detected
/alert status
```

#### **🔴 Test Jira Integration (Real-Time)**
```
/jira dashboard
/jira tickets open
/jira status PROJ-123
```

#### **🔴 Test Shift Management**
```
/shift today
/my schedule
/team schedule
```

## Features

### 🔄 Shift Management & Scheduling
- **Complete shift scheduling** with 3-shift system (morning, afternoon, night)
- **Team schedule overview** for the entire week with today highlighting
- **Next shift information** to prepare for upcoming coverage
- **User-specific schedules** with upcoming shift predictions

### 🔄 Swap & Leave Management
- **Shift swap requests** between team members with approval workflow
- **Leave request system** for vacation, sick days, and other absences
- **Availability tracking** to check team member status
- **Swap status monitoring** for pending and completed requests

### ⏰ Reminders & Notifications
- **Personal reminders** with custom time and message settings
- **Service alerts** sent directly to on-call engineers
- **Team notifications** for important updates and changes

### 🚨 Incident & Escalation
- **Incident tracking** with status and assignment management
- **Automatic escalation** to next shift engineer
- **Incident assignment** to specific team members
- **Priority management** for urgent issues

### 🔗 Jira Integration
- **Ticket management** with status filtering and assignment
- **Comment system** for team collaboration on tickets
- **Dashboard overview** of all team tickets by status
- **Assignment workflow** for distributing work efficiently

### 🔗 Microsoft Teams Integration
- **Calendar management** for personal and team schedules
- **Meeting scheduling** with participant management
- **Teams collaboration** tools for seamless communication

### 📊 Interactive Dialogs
- **Multi-step conversations** for complex operations
- **User-friendly workflows** for shift swaps and approvals
- **Context-aware interactions** based on user roles and permissions

### 👥 Team Collaboration
- **User management** with availability and schedule tracking
- **Team coordination** tools for effective shift coverage
- **Communication channels** for team updates and notifications

### 🆕 **Real-Time AWS Integration**
- **DynamoDB Storage**: Persistent alert and ticket storage
- **Lambda Functions**: Automated alert monitoring and escalation
- **EventBridge**: Scheduled operations and triggers
- **CloudWatch**: Comprehensive logging and monitoring

## Commands

### 🔄 Shift Management & Scheduling
| Command | Description | Example |
|---------|-------------|---------|
| `/shift today` | Shows today's on-call engineer and contact info | `/shift today` |
| `/my schedule` | Displays your upcoming 3 assigned shifts | `/my schedule` |
| `/team schedule` | Shows full team shift schedule for the week | `/team schedule` |
| `/next shift` | Shows who is on shift next | `/next shift` |
| `/user` | Shows current user and available users | `/user` |
| `/morning` | Shows morning shift (6:00 AM - 2:00 PM) | `/morning` |
| `/afternoon` | Shows afternoon shift (2:00 PM - 10:00 PM) | `/afternoon` |
| `/night` | Shows night shift (10:00 PM - 6:00 AM) | `/night` |

### 🔄 Swap & Leave Management
| Command | Description | Example |
|---------|-------------|---------|
| `/swap blw <user1> <user2> <date>` | Swap shifts between two users | `/swap blw Alice Bob 12/25/2024` |
| `/swap shift with <username> <date>` | Request a shift swap | `/swap shift with Bob 12/25/2024` |
| `/swap status` | Shows status of pending swap requests | `/swap status` |
| `/cancel swap <swapID>` | Cancels a swap request | `/cancel swap swap001` |
| `/leave <reason>` | Submits a leave request | `/leave vacation` |
| `/availability <user>` | Checks user availability status | `/availability Alice` |

### ⏰ Reminders & Notifications
| Command | Description | Example |
|---------|-------------|---------|
| `/remind me <time> <message>` | Sets a personal reminder | `/remind me 15m Check alerts` |
| `/alert <service> <message>` | Sends alert to on-call engineer | `/alert database Connection timeout` |

### 🚨 Incident & Escalation
| Command | Description | Example |
|---------|-------------|---------|
| `/escalate <incidentID>` | Escalates incident to next shift | `/escalate INC001` |
| `/incident status <incidentID>` | Checks incident status | `/incident status INC001` |
| `/incident assign <incidentID> <user>` | Assigns incident to team member | `/incident assign INC001 Bob` |

### 🔗 Jira Integration
| Command | Description | Example |
|---------|-------------|---------|
| `/jira tickets [<status>]` | Lists your Jira tickets (optional status filter) | `/jira tickets open` |
| `/jira status <ticketID>` | Checks Jira ticket status | `/jira status PROJ-123` |
| `/jira assign <ticketID> <user>` | Assigns Jira ticket to team member | `/jira assign PROJ-123 Alice` |
| `/jira comment <ticketID> <comment>` | Adds comment to Jira ticket | `/jira comment PROJ-123 Updated config` |
| `/jira dashboard` | Shows team Jira tickets overview | `/jira dashboard` |

### 🔗 Microsoft Teams Integration
| Command | Description | Example |
|---------|-------------|---------|
| `/calendar today` | Shows your calendar events for today | `/calendar today` |
| `/calendar schedule <user>` | Shows calendar events for specified user | `/calendar schedule Bob` |
| `/meeting schedule <time> <title> <participants>` | Schedules Teams meeting | `/meeting schedule 2pm "Sprint Review" Alice,Bob,Charlie` |

### 📅 Help & Information
| Command | Description | Example |
|---------|-------------|---------|
| `help` or `/help` | Shows comprehensive help information | `help` |

## 🧪 **Complete Testing Guide**

### **Testing Real-Time Features**

#### **1. Alert Management Testing**
```
/alert database Connection timeout
/alert monitoring High CPU usage detected
/alert status
```

**Expected Results:**
- Alert stored in DynamoDB (if AWS configured)
- Quick reply buttons appear
- Alert status tracked in real-time

#### **2. Jira Integration Testing**
```
/jira dashboard
/jira tickets open
/jira status PROJ-123
```

**Expected Results:**
- Real-time data from Jira API
- SLA breach detection
- Proactive escalation alerts

#### **3. Shift Management Testing**
```
/shift today
/my schedule
/team schedule
/next shift
```

**Expected Results:**
- Current shift information
- Upcoming schedule details
- Team coordination data

#### **4. User & Greeting Testing**
```
/user
/morning
/afternoon
/night
```

**Expected Results:**
- User identification
- Shift-specific greetings
- Current on-call information

#### **5. Swap & Leave Testing**
```
/swap blw Alice Bob 12/25/2024
/swap status
/leave vacation
/leave sick 12/20/2024 12/22/2024
/leave status
/team leaves
```

**Expected Results:**
- Swap request workflow
- Leave request processing
- Status tracking

#### **6. Reminder & Incident Testing**
```
/remind me 15m Check alerts
/escalate INC-001
/incident status INC-001
```

**Expected Results:**
- Reminder creation
- Incident escalation
- Status updates

### **Testing with Bot Framework Emulator**

1. **Download Bot Framework Emulator**
   - [Download Link](https://github.com/Microsoft/BotFramework-Emulator/releases)
   - Choose the latest version for your OS

2. **Connect to Bot**
   - Open Bot Framework Emulator
   - Enter endpoint: `http://localhost:3978/api/messages`
   - Click "Connect"

3. **Test Commands**
   - Type commands in the chat interface
   - Verify responses and interactive elements
   - Test error handling with invalid commands

### **Testing with Microsoft Teams**

1. **Install ngrok**
   ```bash
   npm install -g ngrok
   ```

2. **Create tunnel**
   ```bash
   ngrok http 3978
   ```

3. **Update your Bot Framework configuration** with the ngrok HTTPS URL:
   - Go to Azure Portal → Your Bot → Configuration
   - Update "Messaging endpoint" with: `https://your-ngrok-url.ngrok.io/api/messages`

4. **Create a Teams app manifest** and upload to Teams for testing

## Shift Schedule

The bot uses a comprehensive 3-shift system for demonstration:

### **Primary On-Call Schedule**
- **Monday**: Alice
- **Tuesday**: Bob  
- **Wednesday**: Charlie
- **Thursday**: Alice
- **Friday**: Bob
- **Saturday**: Charlie
- **Sunday**: Alice

### **3-Shift System**
- **🌅 Morning Shift**: 6:00 AM - 2:00 PM
- **🌤️ Afternoon Shift**: 2:00 PM - 10:00 PM  
- **🌙 Night Shift**: 10:00 PM - 6:00 AM

Each shift has dedicated engineers with rotating schedules for comprehensive coverage.

## Prerequisites

- Node.js 16.0.0 or higher
- Microsoft Azure account (for Bot Framework registration)
- Microsoft Teams (for testing)
- ngrok (for local development)
- AWS account (for real-time features)
- Jira account (for Jira integration)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd teams-devops-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your credentials:
   ```env
   # Bot Framework
   MICROSOFT_APP_ID=your_app_id_here
   MICROSOFT_APP_PASSWORD=your_app_password_here
   
   # AWS (for real-time features)
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=us-east-1
   
   # Jira
   JIRA_BASE_URL=https://your-domain.atlassian.net
   JIRA_USERNAME=your_jira_email
   JIRA_API_TOKEN=your_jira_api_token
   
   # Teams Webhook
   TEAMS_WEBHOOK_URL=https://your-webhook-url.com
   ```

## Bot Framework Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new "Bot Channels Registration" resource
3. Note down the **App ID** and **App Password**
4. Update your `.env` file with these credentials

## Local Development

### Running the Bot

1. **Start the bot server**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

2. **The bot will be available at:**
   - Bot endpoint: `http://localhost:3978/api/messages`
   - Health check: `http://localhost:3978/health`

### Testing with Bot Framework Emulator

1. **Download and install** [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases)
2. **Open the emulator** and enter your bot endpoint:
   ```
   http://localhost:3978/api/messages
   ```
3. **Test the bot commands** directly in the emulator

### Testing with Microsoft Teams

1. **Install ngrok** for tunneling:
   ```bash
   npm install -g ngrok
   ```

2. **Start ngrok tunnel**:
   ```bash
   ngrok http 3978
   ```

3. **Update your Bot Framework configuration** with the ngrok HTTPS URL:
   - Go to Azure Portal → Your Bot → Configuration
   - Update "Messaging endpoint" with: `https://your-ngrok-url.ngrok.io/api/messages`

4. **Create a Teams app manifest** and upload to Teams for testing

## Project Structure

```
teams-devops-bot/
├── index.js                    # Main server file with Express and Bot Framework adapter
├── bot.js                      # Main bot logic and comprehensive command handlers
├── aws-services.js             # AWS DynamoDB, Lambda, and EventBridge operations
├── jira-api.js                 # Jira API integration and operations
├── alert-config.js             # Alert management configuration
├── package.json                # Node.js dependencies and scripts
├── .env                        # Environment variables (create this)
├── README.md                   # This comprehensive documentation
├── quick-start.md              # Quick setup guide
├── test-bot.js                 # Testing script for bot functionality
├── lambda/
│   └── alert-monitor.js        # AWS Lambda function for alert monitoring
├── cloudformation-template.yaml # AWS infrastructure deployment
├── dynamodb-schema.json        # DynamoDB table schema definition
├── DEPLOYMENT_GUIDE.md         # AWS deployment instructions
├── REALTIME_IMPLEMENTATION_SUMMARY.md # Real-time features overview
└── ALERT_FEATURES_README.md    # Alert management documentation
```

## Code Architecture

### Main Components

1. **Express Server** (`index.js`)
   - Sets up HTTP server and middleware
   - Configures Bot Framework adapter with error handling
   - Handles bot endpoint routing and health checks

2. **DevOps Bot** (`bot.js`)
   - Main bot class with comprehensive command handlers
   - Advanced shift schedule management with 3-shift system
   - User interaction logic and team coordination
   - Real-time AWS and Jira integration

3. **AWS Services** (`aws-services.js`)
   - DynamoDB operations for persistent storage
   - Lambda function invocation for alert monitoring
   - EventBridge scheduling for automated operations

4. **Jira API Integration** (`jira-api.js`)
   - Real-time Jira ticket management
   - SLA monitoring and breach detection
   - Proactive escalation alerts

5. **Shift Swap Dialog** (`bot.js`)
   - Multi-step conversation flow for complex operations
   - Handles shift swap requests and approvals
   - Uses Bot Framework dialogs for interactive experiences

### Key Features

- **State Management**: Uses Bot Framework's built-in state management (UserState, ConversationState)
- **Error Handling**: Comprehensive error handling for all bot operations
- **Command Parsing**: Robust command parsing with regex patterns for complex commands
- **Dialog Flow**: Interactive multi-step conversations for complex operations
- **Real-Time Integration**: AWS DynamoDB, Lambda, EventBridge, and Jira API
- **Extensible Architecture**: Easy to add new commands and integrate with external services

## Mock Data & Testing

The bot includes comprehensive mock data for testing all features:

### 📊 Available Mock Data
- **Jira Tickets**: PROJ-123, PROJ-124, PROJ-125 with various statuses
- **Incidents**: INC001 (Database connection timeout)
- **Swap Requests**: swap001 (Alice ↔ Bob for 12/25/2024)
- **Leave Requests**: Alice's approved vacation (12/20-12/22)
- **Calendar Events**: Sample events for Alice, Bob, and Charlie
- **Reminders**: Personal reminder system with timestamp tracking

### 🧪 Testing Commands

#### 🔄 Basic Shift Commands
```
/shift today
/my schedule
/team schedule
/next shift
/user
/morning
/afternoon
/night
help
```

### 🔄 Advanced Management Commands
```
/swap blw Alice Bob 12/25/2024
/swap status
/availability Alice
/leave vacation
/remind me 15m Check alerts
```

### 🚨 Incident Management
```
/escalate INC001
/incident status INC001
/incident assign INC001 Bob
/alert database Connection timeout
```

### 🔗 Jira Integration
```
/jira tickets
/jira tickets open
/jira status PROJ-123
/jira assign PROJ-123 Alice
/jira comment PROJ-123 Updated configuration
/jira dashboard
```

### 🔗 Teams Integration
```
/calendar today
/calendar schedule Bob
/meeting schedule 2pm "Sprint Review" Alice,Bob,Charlie
```

### Shift Swap Flow
```
/swap shift with Bob 12/25/2024
```
Then follow the interactive dialog to complete the swap request.

## 🚀 **AWS Deployment**

### **Prerequisites**
- AWS account with appropriate permissions
- AWS CLI installed and configured
- IAM user with CloudFormation, Lambda, DynamoDB, and EventBridge permissions

### **Deployment Steps**

1. **Deploy Infrastructure**
   ```bash
   aws cloudformation deploy \
     --template-file cloudformation-template.yaml \
     --stack-name devops-bot-stack \
     --capabilities CAPABILITY_NAMED_IAM
   ```

2. **Deploy Lambda Function**
   ```bash
   cd lambda
   zip -r alert-monitor.zip alert-monitor.js
   aws lambda update-function-code \
     --function-name devops-bot-alert-monitor \
     --zip-file fileb://alert-monitor.zip
   ```

3. **Verify Deployment**
   ```bash
   aws cloudformation describe-stacks --stack-name devops-bot-stack
   ```

### **Monitoring & Troubleshooting**

1. **Check CloudWatch Logs**
   ```bash
   aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/devops-bot"
   ```

2. **Verify DynamoDB Table**
   ```bash
   aws dynamodb scan --table-name devops-alerts
   ```

3. **Check EventBridge Rules**
   ```bash
   aws events list-rules --name-prefix "devops-bot"
   ```

## Deployment

### Azure App Service
1. Deploy to Azure App Service
2. Update Bot Framework endpoint URL
3. Configure environment variables in Azure

### Docker
1. Create Dockerfile
2. Build and push to container registry
3. Deploy to Kubernetes or other container platform

### AWS Deployment
1. Use CloudFormation template for infrastructure
2. Deploy Lambda functions
3. Configure environment variables
4. Set up monitoring and alerting

## Troubleshooting

### Common Issues

1. **Bot not responding**
   - Check if server is running on correct port
   - Verify Bot Framework credentials in `.env`
   - Check ngrok tunnel is active (if testing with Teams)

2. **Commands not working**
   - Ensure commands start with `/` (forward slash)
   - Check command syntax matches examples
   - Verify user is in the conversation

3. **Shift swap dialog issues**
   - Check if dialog state is properly managed
   - Verify conversation state is being saved

4. **AWS integration issues**
   - Verify AWS credentials are correct
   - Check if DynamoDB table exists
   - Ensure Lambda function is deployed

5. **Jira API issues**
   - Verify Jira credentials are correct
   - Check if your Jira instance allows API access
   - Ensure your project key is correct

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=botbuilder:*
npm start
```

### Port Conflicts

If port 3978 is already in use:
```bash
# Find process using the port
netstat -ano | findstr :3978

# Kill the process
taskkill /PID <process_id> /F

# Or change port in .env file
PORT=3979
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the troubleshooting section
- Review Bot Framework documentation
- Open an issue in the repository

## Roadmap

### 🚀 Completed Features
- [x] Comprehensive shift management with 3-shift system
- [x] Advanced Jira integration for ticket management
- [x] Microsoft Teams calendar and meeting integration
- [x] Incident management and escalation system
- [x] Personal reminders and alert system
- [x] Team collaboration and user management tools
- [x] **Real-time AWS integration with DynamoDB, Lambda, and EventBridge**
- [x] **Live Jira API integration with SLA monitoring**
- [x] **Enhanced alert management with quick replies and escalation**

### 🔮 Upcoming Features
- [ ] Microsoft Graph API integration for real calendar sync
- [ ] Admin panel for managing shifts and team members
- [ ] Shift coverage analytics and reporting
- [ ] Integration with PagerDuty, OpsGenie, and other alerting systems
- [ ] Slack integration for cross-platform support
- [ ] Custom workflow automation and approval processes
- [ ] Mobile app for on-the-go management
- [ ] Advanced reporting and analytics dashboard
- [ ] Multi-tenant support for multiple teams
- [ ] Advanced AI-powered incident routing and recommendations
