# LearnQuest Studio - User Guide

## 🎮 Complete Game-Based Learning Platform

Welcome to LearnQuest Studio! This guide will help you create engaging, interactive learning experiences.

---

## Table of Contents

1. [Player Experience](#player-experience)
2. [Admin Dashboard](#admin-dashboard)
3. [Creating Your First Game](#creating-your-first-game)
4. [AI Question Generation](#ai-question-generation)
5. [Mini-Games](#mini-games)
6. [Analytics & Leaderboards](#analytics--leaderboards)

---

## Player Experience

### 🏠 Home Page

Players can:
- Browse available games
- View game difficulty, duration, and levels
- See learning objectives
- Start games with one click
- View rankings and profile

### 🎯 Game Flow

**1. Introduction Screen**
- Game title and description
- Learning objectives
- Estimated duration and difficulty
- "Start Learning Journey" button

**2. Gameplay**
- Progress bar showing overall completion
- Level-by-level progression
- Multiple challenge types:
  - **Text/Image/Video Content**: Educational material
  - **Quizzes**: Multiple choice questions with explanations
  - **True/False**: Quick knowledge checks
  - **Mini-Games**: Interactive Phaser.js games (Endless Run, etc.)

**3. End Screen**
- Final score and accuracy
- Badges earned
- Option to retry or go home
- View leaderboard

### 🏆 Features for Players

- **Real-time scoring** with combo bonuses
- **Leaderboard rankings** with top players
- **Profile page** with stats and badges
- **Smooth animations** and transitions
- **Responsive design** - works on desktop and mobile

---

## Admin Dashboard

### 📊 Dashboard Overview

Access at: `/admin/login`

Features:
- View all games (draft, published, archived)
- Create, edit, duplicate, and delete games
- Quick actions for publishing
- Analytics overview

### 🎮 Game Management

**Creating a Game:**
1. Click "New Game"
2. Fill in:
   - Title
   - Description
   - Difficulty (Easy/Medium/Hard)
   - Estimated duration
   - Learning objectives
3. Save as draft or publish immediately

**Game Actions:**
- **Edit**: Modify game details
- **Duplicate**: Create a copy
- **Preview**: Test as a player
- **Delete**: Remove permanently
- **Publish**: Make available to players

---

## Creating Your First Game

### Step-by-Step Tutorial

#### 1. Create the Game

```
Admin Dashboard → New Game
```

Fill in:
- **Title**: "Introduction to Photosynthesis"
- **Description**: "Learn how plants convert sunlight into energy"
- **Difficulty**: Medium
- **Duration**: 15 minutes
- **Learning Objectives**:
  - Understand the photosynthesis process
  - Identify key components
  - Apply knowledge in scenarios

#### 2. Add Levels

```
Game Details → Levels → Add Level
```

Create 3-5 levels, for example:
- Level 1: Introduction to Photosynthesis
- Level 2: Key Components
- Level 3: The Process
- Level 4: Test Your Knowledge
- Level 5: Mini-Game Challenge

#### 3. Add Challenges to Each Level

For each level, add challenges:

**Text Content:**
```
Type: Text
Content: Photosynthesis is the process by which plants...
Points: 0 (informational)
```

**Quiz Challenge:**
```
Type: Quiz
Question: What is the primary pigment in photosynthesis?
Options:
  A. Carotene
  B. Chlorophyll ✓
  C. Melanin
  D. Hemoglobin
Explanation: Chlorophyll is the green pigment that captures light energy
Points: 100
```

**Mini-Game:**
```
Type: Mini-Game
Game: Endless Run
Points: 200
```

#### 4. Preview & Publish

1. Click "Preview" to test as a player
2. Make adjustments if needed
3. Click "Publish" when ready

---

## AI Question Generation

### 🤖 Automated Question Creation

The AI Question Generator uses OpenAI GPT-4 to create high-quality questions automatically.

### How to Use

1. **From Level Builder** → Add Challenge → Quiz
2. Click **"AI Generate"** button
3. Choose input method:

#### Option A: Text-Based Generation

```
Topic: "Renewable Energy Sources"
Difficulty: Medium
Number of Questions: 5
```

AI will generate:
- Multiple choice questions
- Correct answers
- Explanations
- Difficulty ratings
- Relevant tags

#### Option B: Image-Based Generation

```
Upload Image URL: https://example.com/solar-panel.jpg
Difficulty: Easy
Number of Questions: 3
```

AI will analyze the image and create observation-based questions.

### Review & Edit

1. Review generated questions
2. Edit any question inline
3. **Accept All** or select individual questions
4. Questions are added to your challenge

### Best Practices

✅ **Do:**
- Use specific topics ("Mitosis" vs "Biology")
- Specify target audience in description
- Review AI-generated content before publishing
- Mix AI and manual questions

❌ **Avoid:**
- Vague topics
- Generating too many questions at once (max 10)
- Publishing without review

---

## Mini-Games

### 🎮 Endless Run Game

An interactive runner game integrated with learning.

**Features:**
- Three lanes for movement
- Dodge red obstacles
- Collect gold coins (+50 points)
- Answer questions mid-game (pauses automatically)
- Progressive difficulty
- Combo bonuses

**How to Add:**

1. Add Challenge → Mini-Game
2. Select "Endless Run"
3. Set points (recommend 200-300)
4. Optionally add custom questions

**Gameplay:**
- Use ↑↓ arrow keys to switch lanes
- Avoid obstacles (game over on collision)
- Collect coins for bonus points
- Answer popup questions correctly for +100 points
- Game difficulty increases over time

**Scoring:**
- Base score from distance traveled
- +50 per coin collected
- +100 per correct answer
- +20% combo bonus
- Final score converted to challenge points

### 🎯 Future Mini-Games (Coming Soon)

- **Match3**: Match learning concepts
- **Memory Flip**: Pair matching cards
- **Puzzle Grid**: Logic-based challenges

---

## Analytics & Leaderboards

### 📈 Game Analytics

Access: `Admin → Analytics`

**Metrics Available:**
- Total attempts
- Completion rate
- Average score
- Average duration
- Drop-off by level
- Top performing players

**Use Cases:**
- Identify difficult levels (high drop-off)
- Optimize game length (duration data)
- Improve content (completion rates)
- Recognize top learners

### 🏆 Leaderboards

**For Players:**
- View top 10 players per game
- See personal rank
- Compare scores and accuracy
- Badge display

**Ranking Factors:**
1. Total score (primary)
2. Accuracy percentage
3. Completion time (tiebreaker)

---

## Tips & Best Practices

### For Admins

**Content Design:**
- Start with text/image content
- Follow with quiz questions
- End levels with mini-games
- Balance difficulty progression

**Question Writing:**
- Clear, concise questions
- 4 options for MCQ
- Always include explanations
- Mix difficulty levels

**Game Structure:**
- 3-7 levels per game
- 3-5 challenges per level
- Vary challenge types
- Include at least one mini-game

**AI Usage:**
- Generate initial questions
- Human review required
- Edit for context
- Test with real users

### For Players

**Maximize Score:**
- Answer all questions correctly
- Collect coins in mini-games
- Avoid mistakes (accuracy bonus)
- Complete quickly (time bonus)

**Learning Tips:**
- Read explanations carefully
- Retry challenging games
- Track progress in profile
- Compete on leaderboards

---

## Keyboard Shortcuts

### Player
- `↑` / `↓` - Move in mini-games
- `Enter` - Submit answers
- `Esc` - Pause (future feature)

### Admin
- `Ctrl+S` - Quick save (future feature)
- `Ctrl+P` - Preview game (future feature)

---

## Troubleshooting

### Common Issues

**Q: Game won't start**
- Check if game is published
- Verify all levels have challenges
- Ensure browser supports WebGL (for mini-games)

**Q: Mini-game not loading**
- Check internet connection
- Clear browser cache
- Try different browser (Chrome recommended)

**Q: AI generation failed**
- Check OpenAI API key
- Verify API quota
- Try simpler prompts
- Check image URL accessibility

**Q: Questions not saving**
- Ensure all fields are filled
- Check for duplicate questions
- Verify database connection

---

## Advanced Features

### Custom Theming (Coming Soon)
- Brand colors
- Custom fonts
- Logo upload

### Multiplayer (Roadmap)
- Real-time competition
- Team challenges
- Live leaderboards

### Certification (Roadmap)
- Completion certificates
- Skill badges
- Export to PDF

### Marketplace (Future)
- Share games publicly
- Browse community games
- Import/export games

---

## Support & Resources

### Documentation
- API Documentation: `/docs/api`
- Component Guide: `/docs/components`
- Database Schema: `/docs/database`

### Getting Help
- GitHub Issues: [Report bugs](https://github.com/your-repo/issues)
- Email Support: support@learnquest.studio

### Community
- Discord: [Join community](#)
- Forums: [discussions.learnquest.studio](#)

---

## Version History

### v1.0.0 (Current)
- Player app with game launcher
- Admin CMS with game builder
- AI question generation (OpenAI GPT-4)
- Endless Run mini-game (Phaser.js)
- Analytics and leaderboards
- Firebase authentication
- PostgreSQL database

### Coming in v1.1.0
- Match3 mini-game
- Advanced question editor
- Bulk import/export
- Enhanced analytics

---

## Quick Reference

### Game Creation Checklist

- [ ] Create game with title and description
- [ ] Set difficulty and duration
- [ ] Add learning objectives
- [ ] Create 3-5 levels
- [ ] Add text/image content
- [ ] Generate AI questions
- [ ] Add mini-game challenge
- [ ] Preview entire game
- [ ] Test all paths
- [ ] Publish to players

### Best Score Distribution

- Informational content: 0 points
- Simple questions: 50-100 points
- Complex questions: 100-150 points
- Mini-games: 200-300 points
- Total per level: 400-600 points

---

**Happy Creating! 🚀**

For more help, visit our [documentation](#) or contact [support](#).
