# Comprehensive DevOps & Cloud Team Bot for Microsoft Teams

A powerful Microsoft Teams chatbot built with Node.js and Microsoft Bot Framework SDK v4 that provides comprehensive DevOps team management, including shift scheduling, incident management, Jira integration, and Microsoft Teams collaboration tools.

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
   
   Edit `.env` file with your Bot Framework credentials:
   ```env
   MICROSOFT_APP_ID=your_app_id_here
   MICROSOFT_APP_PASSWORD=your_app_password_here
   PORT=3978
   TEAMS_APP_ID=your_teams_app_id_here
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
├── index.js              # Main server file with Express and Bot Framework adapter
├── bot.js                # Main bot logic and comprehensive command handlers
├── package.json          # Node.js dependencies and scripts
├── .env                  # Environment variables template
├── README.md             # This comprehensive documentation
├── quick-start.md        # Quick setup guide
├── test-bot.js           # Testing script for bot functionality
└── .env                  # Your environment variables (create this)
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
   - Mock data management for demonstrations

3. **Shift Swap Dialog** (`bot.js`)
   - Multi-step conversation flow for complex operations
   - Handles shift swap requests and approvals
   - Uses Bot Framework dialogs for interactive experiences

### Key Features

- **State Management**: Uses Bot Framework's built-in state management (UserState, ConversationState)
- **Error Handling**: Comprehensive error handling for all bot operations
- **Command Parsing**: Robust command parsing with regex patterns for complex commands
- **Dialog Flow**: Interactive multi-step conversations for complex operations
- **Mock Data**: Built-in mock data for Jira tickets, incidents, calendar events, and reminders
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

## Deployment

### Azure App Service
1. Deploy to Azure App Service
2. Update Bot Framework endpoint URL
3. Configure environment variables in Azure

### Docker
1. Create Dockerfile
2. Build and push to container registry
3. Deploy to Kubernetes or other container platform

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

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=botbuilder:*
npm start
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

### 🔮 Upcoming Features
- [ ] Microsoft Graph API integration for real calendar sync
- [ ] Database storage (DynamoDB/PostgreSQL) for persistent data
- [ ] Admin panel for managing shifts and team members
- [ ] Real-time notifications and webhook support
- [ ] Shift coverage analytics and reporting
- [ ] Integration with PagerDuty, OpsGenie, and other alerting systems
- [ ] Slack integration for cross-platform support
- [ ] Custom workflow automation and approval processes
- [ ] Mobile app for on-the-go management
- [ ] Advanced reporting and analytics dashboard
