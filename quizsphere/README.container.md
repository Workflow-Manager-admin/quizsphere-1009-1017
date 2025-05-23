# QuizSphere Container Components

This document provides an overview of the enhanced container structure for QuizSphere, including the main container component, animations, and UI utilities.

## Core Components

### MainContainer

The primary container for QuizSphere application that provides consistent layout structure, proper spacing, animations, and loading/error states.

**Key features:**
- Responsive design for both mobile and web platforms
- Built-in loading state visualization
- Error handling with visual feedback
- Smooth page transitions and animations
- Background pattern options
- Accessibility enhancements

**Usage:**
```jsx
<MainContainer 
  loading={isLoading} 
  error={errorMessage} 
  backgroundPattern={true}
>
  {/* Your page content */}
</MainContainer>
```

### PageContainer

A container specifically for pages that provides consistent page structure with title, subtitle, animations, and proper spacing.

**Key features:**
- Consistent page layouts across the application
- Automatic animations with fade-in effects
- Proper spacing and typography
- Support for header actions

**Usage:**
```jsx
<PageContainer
  title="Page Title"
  subtitle="Page description text"
  headerActions={<Button>Action</Button>}
>
  {/* Page content */}
</PageContainer>
```

## Animation Components

### FadeInSection

Component that animates its children when they enter the viewport, adding a more engaging user experience.

**Key features:**
- Multiple animation types (fade, slide, scale)
- Customizable animation duration
- Intersection observer-based triggers

**Usage:**
```jsx
<FadeInSection animation="slide" duration={0.5}>
  <YourComponent />
</FadeInSection>
```

### ContainerTransition

Handles animated transitions between route changes within the MainContainer.

**Key features:**
- Smooth transitions when navigating between pages
- Multiple animation types
- Performance optimized with framer-motion

**Usage:**
```jsx
<ContainerTransition locationKey={locationKey} type="fade">
  {children}
</ContainerTransition>
```

## UI Utilities

### LoadingOverlay

Displays a loading spinner with customizable appearance and message.

**Key features:**
- Multiple display types (fullscreen, container, inline)
- Customizable message
- Transparent background option

**Usage:**
```jsx
<LoadingOverlay loading={isLoading} message="Loading content..." />
```

### ScrollToTopButton

Floating action button that appears when scrolling down, allowing users to quickly return to the top of the page.

**Key features:**
- Customizable position and appearance
- Smooth scrolling behavior
- Transition effects when showing/hiding

**Usage:**
Simply include it in your app:
```jsx
<ScrollToTopButton position="right" threshold={300} />
```

### ErrorBoundary

Catches JavaScript errors anywhere in the component tree and displays a fallback UI.

**Key features:**
- Error capture and logging
- User-friendly error messages
- Option to try again or navigate away

**Usage:**
```jsx
<ErrorBoundary onError={handleError}>
  <YourComponent />
</ErrorBoundary>
```

## Container Utilities

The `containerUtils.js` file provides utility functions for animations and transitions:

- `getAnimationVariant()`: Generate animation variants for framer-motion
- `getStaggeredAnimationVariants()`: Create staggered animations for lists
- `formatErrorMessage()`: Format error messages for display
- `generateAnimationKey()`: Generate unique keys for animations

## Demo Component

A demo component is included to showcase various container features:

- Visit `/demo` to see different animation types
- Toggle loading and error states
- Enable/disable animations
- Try different background patterns

Access this demo by navigating to: `http://localhost:3000/demo`

## Best Practices

1. Use `PageContainer` for all page components to maintain consistent layout
2. Implement `FadeInSection` for content sections that should animate on scroll
3. Leverage `ErrorBoundary` to provide graceful error handling
4. Use the `LoadingOverlay` component for asynchronous operations
5. Include `ScrollToTopButton` for pages with long content
