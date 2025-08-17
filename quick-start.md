# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp env.example .env
```

**For local testing only**, you can use dummy values:
```env
MICROSOFT_APP_ID=dummy_app_id
MICROSOFT_APP_PASSWORD=dummy_password
PORT=3978
TEAMS_APP_ID=dummy_teams_id
```

### 3. Test Bot Logic
```bash
node test-bot.js
```

This will test the bot commands without needing Teams integration.

### 4. Start the Server
```bash
npm start
```

Your bot will be running at `http://localhost:3978`

### 5. Test with Bot Framework Emulator

1. Download [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases)
2. Open emulator and enter: `http://localhost:3978/api/messages`
3. Start chatting with your bot!

## 🧪 Test Commands

Try these commands in the emulator:

- `/shift today` - See today's on-call engineer
- `/my schedule` - View your upcoming shifts (use name: Alice, Bob, or Charlie)
- `help` - Get help information

## 🔧 Next Steps

1. **Register with Bot Framework** (for Teams integration)
2. **Set up ngrok** for external access
3. **Deploy to Teams** for full testing

## 🆘 Troubleshooting

- **Port already in use**: Change PORT in `.env` file
- **Bot not responding**: Check console for error messages
- **Commands not working**: Ensure they start with `/` (forward slash)

## 📱 Teams Integration

Once you have Bot Framework credentials:

1. Update `.env` with real credentials
2. Use ngrok: `ngrok http 3978`
3. Update Bot Framework endpoint with ngrok URL
4. Create Teams app manifest
5. Upload to Teams for testing

---

**Happy Bot Building! 🤖**
