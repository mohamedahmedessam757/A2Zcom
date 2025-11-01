# A2Z API Reference

This document provides a quick reference for all backend service methods.

## Authentication Service (`services/authService.ts`)

### Sign Up
```typescript
authService.signUp(email, password, userData)
```
Creates a new user account and profile.

### Sign In
```typescript
authService.signIn(email, password)
```
Authenticates user and returns session.

### Sign Out
```typescript
authService.signOut()
```
Logs out current user.

### Get Current User
```typescript
authService.getCurrentUser()
```
Returns the authenticated user object.

### Get User Profile
```typescript
authService.getUserProfile(userId)
```
Fetches user profile data.

### Auth State Change
```typescript
authService.onAuthStateChange(callback)
```
Listens for authentication state changes.

---

## Post Service (`services/postService.ts`)

### Get All Posts
```typescript
postService.getAllPosts()
```
Retrieves all posts with authors and comments.

### Create Post
```typescript
postService.createPost({
  author_id,
  course_name,
  review,
  rating,
  image_urls,
  link_url,
  field,
  is_community_post,
  repost_of_id
})
```
Creates a new post.

### Update Post
```typescript
postService.updatePost(postId, {
  course_name,
  review,
  rating
})
```
Updates an existing post.

### Delete Post
```typescript
postService.deletePost(postId)
```
Deletes a post.

### Like Post
```typescript
postService.likePost(postId, userId, currentLikes, likedBy)
```
Toggles like on a post.

### Add Comment
```typescript
postService.addComment({
  post_id,
  author_id,
  text
})
```
Adds a comment to a post.

### Like Comment
```typescript
postService.likeComment(commentId, userId, currentLikes, likedBy)
```
Toggles like on a comment.

---

## User Service (`services/userService.ts`)

### Get All Users
```typescript
userService.getAllUsers()
```
Retrieves all user profiles.

### Get User By ID
```typescript
userService.getUserById(userId)
```
Fetches a specific user profile.

### Update User
```typescript
userService.updateUser(userId, {
  name,
  specialization,
  study_year,
  avatar_url,
  followers,
  following,
  following_ids,
  blocked_user_ids,
  joined_communities,
  is_active
})
```
Updates user profile.

### Follow User
```typescript
userService.followUser(currentUserId, targetUserId, isFollowing)
```
Follows or unfollows a user.

### Join Community
```typescript
userService.joinCommunity(userId, field, isJoined)
```
Joins or leaves a community.

---

## Course Service (`services/courseService.ts`)

### Get All Courses
```typescript
courseService.getAllCourses()
```
Retrieves all courses/communities.

### Create Course
```typescript
courseService.createCourse({
  title,
  field,
  description,
  image_url,
  platform,
  owner_id
})
```
Creates a new course/community.

### Update Course
```typescript
courseService.updateCourse(courseId, {
  title,
  description,
  image_url
})
```
Updates a course/community.

### Delete Course
```typescript
courseService.deleteCourse(courseId)
```
Deletes a course/community.

---

## Roadmap Service (`services/roadmapService.ts`)

### Get User Roadmaps
```typescript
roadmapService.getUserRoadmaps(userId)
```
Retrieves all roadmaps for a user.

### Get Roadmap By Key
```typescript
roadmapService.getRoadmapByKey(userId, key)
```
Fetches a specific roadmap.

### Save Roadmap
```typescript
roadmapService.saveRoadmap(userId, key, roadmap)
```
Creates or updates a roadmap.

### Delete Roadmap
```typescript
roadmapService.deleteRoadmap(userId, key)
```
Deletes a roadmap.

---

## Notification Service (`services/notificationService.ts`)

### Get User Notifications
```typescript
notificationService.getUserNotifications(userId)
```
Retrieves notifications for a user.

### Mark As Read
```typescript
notificationService.markAsRead(notificationId)
```
Marks a notification as read.

### Mark All As Read
```typescript
notificationService.markAllAsRead(userId)
```
Marks all notifications as read.

### Create Notification
```typescript
notificationService.createNotification({
  user_id,
  type,
  from_user_id,
  post_id
})
```
Creates a new notification.

---

## Data Transformation

The app automatically transforms database objects to match the frontend types:

### User Transformation
- Converts UUID to numeric ID
- Maps snake_case to camelCase
- Handles arrays and booleans

### Post Transformation
- Includes nested author and comments
- Handles reposts recursively
- Formats timestamps

### Timestamp Formatting
- "Just now" for < 1 minute
- "Xm ago" for < 1 hour
- "Xh ago" for < 24 hours
- "Xd ago" for < 7 days
- Date string for older

---

## Error Handling

All service methods throw errors that should be caught:

```typescript
try {
  await postService.createPost(postData);
  await refreshData();
} catch (error) {
  console.error('Error creating post:', error);
  alert('Failed to create post. Please try again.');
}
```

---

## Real-time Updates

The app context automatically refreshes data:
- On auth state change
- After mutations
- Manual refresh via `refreshData()`

---

## Security Notes

1. All operations respect RLS policies
2. Users can only modify their own data
3. Auth state is validated on every request
4. Sensitive operations require authentication

---

## Example Usage

### Creating a Post
```typescript
const handleCreatePost = async (postData) => {
  if (!currentUser) return;

  try {
    await postService.createPost({
      author_id: currentUser.id.toString(),
      course_name: postData.courseName,
      review: postData.review,
      rating: postData.rating,
      field: currentUser.specialization,
      is_community_post: false,
    });

    await refreshData();
  } catch (error) {
    alert('Failed to create post');
  }
};
```

### Following a User
```typescript
const handleFollow = async (targetUserId) => {
  if (!currentUser) return;

  try {
    const isFollowing = currentUser.followingIds.includes(targetUserId);
    await userService.followUser(
      currentUser.id.toString(),
      targetUserId.toString(),
      isFollowing
    );

    await refreshData();
  } catch (error) {
    console.error('Follow failed:', error);
  }
};
```
