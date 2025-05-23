// Mock quiz data for development purposes
const mockQuizData = [
  {
    id: '1',
    title: 'General Knowledge Quiz',
    description: 'Test your knowledge on various general topics',
    category: 'General Knowledge',
    difficulty: 'Medium',
    createdBy: 'Admin',
    timeLimit: 600, // in seconds
    questions: [
      {
        id: '1-1',
        text: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 'Paris'
      },
      {
        id: '1-2',
        text: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 'Mars'
      },
      {
        id: '1-3',
        text: 'Who wrote "Romeo and Juliet"?',
        options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
        correctAnswer: 'William Shakespeare'
      },
      {
        id: '1-4',
        text: 'What is the largest ocean on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        correctAnswer: 'Pacific Ocean'
      },
      {
        id: '1-5',
        text: 'In what year did World War II end?',
        options: ['1943', '1945', '1947', '1950'],
        correctAnswer: '1945'
      }
    ]
  },
  {
    id: '2',
    title: 'Science Quiz',
    description: 'Test your knowledge of scientific concepts and discoveries',
    category: 'Science',
    difficulty: 'Hard',
    createdBy: 'Admin',
    timeLimit: 600,
    questions: [
      {
        id: '2-1',
        text: 'What is the chemical symbol for gold?',
        options: ['Go', 'Gd', 'Au', 'Ag'],
        correctAnswer: 'Au'
      },
      {
        id: '2-2',
        text: 'What is the hardest natural substance on Earth?',
        options: ['Platinum', 'Diamond', 'Titanium', 'Quartz'],
        correctAnswer: 'Diamond'
      },
      {
        id: '2-3',
        text: 'What is the process by which plants make their food called?',
        options: ['Photosynthesis', 'Respiration', 'Fermentation', 'Transpiration'],
        correctAnswer: 'Photosynthesis'
      },
      {
        id: '2-4',
        text: 'Which of these is NOT a primary color of light?',
        options: ['Red', 'Green', 'Blue', 'Yellow'],
        correctAnswer: 'Yellow'
      },
      {
        id: '2-5',
        text: 'What is the speed of light in vacuum?',
        options: ['300,000 km/s', '150,000 km/s', '200,000 km/s', '250,000 km/s'],
        correctAnswer: '300,000 km/s'
      }
    ]
  },
  {
    id: '3',
    title: 'Technology Trivia',
    description: 'How well do you know your tech?',
    category: 'Technology',
    difficulty: 'Easy',
    createdBy: 'Admin',
    timeLimit: 300,
    questions: [
      {
        id: '3-1',
        text: 'Who founded Apple Computer?',
        options: ['Bill Gates', 'Steve Jobs', 'Elon Musk', 'Mark Zuckerberg'],
        correctAnswer: 'Steve Jobs'
      },
      {
        id: '3-2',
        text: 'HTML is what type of language?',
        options: ['Programming', 'Markup', 'Machine', 'Scripting'],
        correctAnswer: 'Markup'
      },
      {
        id: '3-3',
        text: 'What year was the first iPhone released?',
        options: ['2005', '2007', '2009', '2010'],
        correctAnswer: '2007'
      },
      {
        id: '3-4',
        text: 'What does CPU stand for?',
        options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Process User', 'Central Processor Unit'],
        correctAnswer: 'Central Processing Unit'
      },
      {
        id: '3-5',
        text: 'What does "HTTP" stand for?',
        options: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'HyperText Transmission Protocol', 'High Technical Transfer Protocol'],
        correctAnswer: 'HyperText Transfer Protocol'
      }
    ]
  }
];

export default mockQuizData;
