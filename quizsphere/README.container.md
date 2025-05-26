# QuizSphere Main Container Documentation

The MainContainer component is a foundational layout component for QuizSphere that provides consistent structure, behavior, and styling across all application pages. This document covers the component's features, usage examples, and available customization options.

## Overview

The MainContainer serves as the primary wrapper for page content in QuizSphere, providing:

- Consistent layout structure and padding
- Smooth page transitions with animations
- Loading states and error handling
- Background patterns and visual enhancements
- Specialized modes for different quiz functions (browsing, creation, participation)
- Filter functionality for quiz categories and difficulty levels
- Navigation controls and accessibility features

## Component Location

```
/src/components/layout/MainContainer.js
```

## Basic Usage

Here's a simple example of using the MainContainer:

```jsx
import MainContainer from './components/layout/MainContainer';

function HomePage() {
  return (
    <MainContainer>
      <h1>Welcome to QuizSphere</h1>
      <p>Start exploring quizzes today!</p>
    </MainContainer>
  );
}
```

## Props API

The MainContainer component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | React.ReactNode | Required | Child elements to render within the container |
| `disablePadding` | boolean | `false` | Whether to disable standard padding |
| `maxWidth` | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| false | `'lg'` | Maximum width of container |
| `loading` | boolean | `false` | Whether content is in loading state |
| `error` | string | `null` | Error message to display (if any) |
| `disableAnimations` | boolean | `false` | Whether to disable transition animations |
| `backgroundPattern` | boolean | `false` | Whether to show background pattern |
| `patternType` | 'dots' \| 'grid' \| 'waves' | `'dots'` | Pattern type for background |
| `showNavigation` | boolean | `false` | Whether to show back navigation button |
| `onRefresh` | function | `null` | Function to call when refresh button is clicked |
| `centerContent` | boolean | `false` | Whether to center content vertically |
| `sx` | object | `{}` | Additional custom styles to apply |
| `containerMode` | 'default' \| 'browse' \| 'create' \| 'participate' \| 'results' | `'browse'` | Mode for container display |
| `activeCategory` | string | `null` | Active quiz category filter |
| `activeDifficulty` | string | `null` | Active quiz difficulty filter |
| `showFilters` | boolean | `false` | Whether to show category/difficulty filters |
| `onCategoryChange` | function | `null` | Function to call when category filter changes |
| `onDifficultyChange` | function | `null` | Function to call when difficulty filter changes |
| `quizData` | object | `null` | Current quiz data for participate mode |

## Usage Examples

### Basic Container

```jsx
<MainContainer>
  <h1>Basic Content</h1>
  <p>This is a simple container with default settings.</p>
</MainContainer>
```

### With Background Pattern

```jsx
<MainContainer 
  backgroundPattern={true}
  patternType="waves"
>
  <h1>Styled Container</h1>
  <p>This container has a wave pattern background.</p>
</MainContainer>
```

### Loading State

```jsx
<MainContainer loading={isLoading}>
  <QuizContent />
</MainContainer>
```

### Error Handling

```jsx
<MainContainer error={errorMessage}>
  <QuizContent />
</MainContainer>
```

### Quiz Browser Mode with Filters

```jsx
<MainContainer
  containerMode="browse"
  showFilters={true}
  activeCategory={selectedCategory}
  activeDifficulty={selectedDifficulty}
  onCategoryChange={handleCategoryChange}
  onDifficultyChange={handleDifficultyChange}
>
  <QuizList quizzes={filteredQuizzes} />
</MainContainer>
```

### Quiz Creator Mode

```jsx
<MainContainer
  containerMode="create"
  showNavigation={true}
>
  <QuizCreatorForm 
    currentStep={currentStep} 
    onStepChange={handleStepChange}
  />
</MainContainer>
```

### Quiz Participation Mode

```jsx
<MainContainer
  containerMode="participate"
  showNavigation={false}
  disablePadding={true}
  quizData={currentQuiz}
>
  <QuizQuestionDisplay 
    question={currentQuestion}
    onAnswer={handleAnswerSelection} 
  />
</MainContainer>
```

### Results Display Mode

```jsx
<MainContainer
  containerMode="results"
  centerContent={true}
  showNavigation={true}
>
  <QuizResults 
    score={score}
    totalQuestions={totalQuestions}
    answers={userAnswers}
  />
</MainContainer>
```

## Integration with Other Components

The MainContainer works seamlessly with other QuizSphere components:

### With PageContainer

```jsx
<MainContainer>
  <PageContainer 
    title="Quiz Categories" 
    subtitle="Browse quizzes by category"
  >
    <CategoryList categories={availableCategories} />
  </PageContainer>
</MainContainer>
```

### With Error Boundary

```jsx
<ErrorBoundary onError={handleError}>
  <MainContainer>
    <QuizContent />
  </MainContainer>
</ErrorBoundary>
```

## Container Modes

The MainContainer supports different modes for various quiz functionalities:

### Browse Mode

Shows tabs for "All Quizzes" and "By Category" with appropriate filter options.

### Create Mode

Shows tabs for "Basic Info", "Questions", and "Review" to guide the quiz creation process.

### Participate Mode

Shows tabs for "Questions" and "Progress" during quiz participation.

### Results Mode

Optimized for displaying quiz results and statistics.

## Filter Functionality

When `showFilters={true}`, the MainContainer displays filter chips for categories and difficulty levels:

```jsx
<MainContainer
  showFilters={true}
  activeCategory={selectedCategory}
  activeDifficulty={selectedDifficulty}
  onCategoryChange={(category) => setSelectedCategory(category)}
  onDifficultyChange={(difficulty) => setSelectedDifficulty(difficulty)}
>
  <QuizList />
</MainContainer>
```

## Animation and Transitions

The MainContainer provides smooth transitions between routes using the ContainerTransition component:

```jsx
<MainContainer disableAnimations={false}>
  <PageContent />
</MainContainer>
```

To disable animations:

```jsx
<MainContainer disableAnimations={true}>
  <PageContent />
</MainContainer>
```

## Accessibility Features

The MainContainer includes several accessibility enhancements:

- ARIA live region for dynamic content updates
- Keyboard focus management
- Appropriate ARIA labels and roles
- Screen reader support for loading and error states

## Best Practices

1. Always include error handling when using MainContainer
2. Use the appropriate containerMode for each page type
3. Leverage the built-in loading state for async operations
4. Use background patterns sparingly to avoid visual clutter
5. Ensure child components maintain consistent padding and spacing

## Context Integration

The MainContainer automatically integrates with the QuizContext to access:

- Global loading and error states
- Available quiz categories
- Difficulty levels
- Current quiz session information

## Performance Considerations

- Use disableAnimations for performance-sensitive pages
- Avoid deeply nested components within the MainContainer
- Leverage React.memo for child components that don't need frequent re-renders

## Full Example with Context Integration

```jsx
import React, { useState, useEffect } from 'react';
import MainContainer from './components/layout/MainContainer';
import QuizList from './components/quiz/QuizList';
import { useQuizContext } from './context/QuizContext';
import { fetchQuizzes } from './api/quizService';

function QuizBrowserPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [category, setCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  
  const { categories, difficultyLevels } = useQuizContext();
  
  // Fetch quizzes based on filters
  useEffect(() => {
    const loadQuizzes = async () => {
      setLoading(true);
      try {
        const data = await fetchQuizzes({ category, difficulty });
        setQuizzes(data);
        setError(null);
      } catch (err) {
        setError('Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };
    
    loadQuizzes();
  }, [category, difficulty]);
  
  // Handle refresh button click
  const handleRefresh = () => {
    // Re-fetch quizzes
    fetchQuizzes({ category, difficulty })
      .then(data => {
        setQuizzes(data);
        setError(null);
      })
      .catch(err => {
        setError('Failed to refresh quizzes');
      });
  };
  
  return (
    <MainContainer
      containerMode="browse"
      loading={loading}
      error={error}
      showFilters={true}
      activeCategory={category}
      activeDifficulty={difficulty}
      onCategoryChange={setCategory}
      onDifficultyChange={setDifficulty}
      onRefresh={handleRefresh}
      backgroundPattern={true}
      patternType="dots"
    >
      <QuizList quizzes={quizzes} />
    </MainContainer>
  );
}

export default QuizBrowserPage;
```

## Related Components

- `PageContainer`: For individual page content structure
- `BackgroundPattern`: For visual background patterns
- `ContainerTransition`: For smooth transitions between pages
- `LoadingOverlay`: For loading state visualization

## Testing

The MainContainer has comprehensive test coverage in:

```
/src/components/layout/__tests__/test_MainContainer.js
```

Run tests with:

```
npm test -- --testPathPattern=MainContainer
```
