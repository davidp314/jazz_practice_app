export const TASK_TYPES = {
  STANDARD: 'standard',
  OTHER_WORK: 'other_work',
  ONE_OFF: 'one_off'
};

export const STANDARD_STEPS = [
  'Play through with staple chords',
  'Learn shell chords',
  'Learn scales for each chord',
  'Learn arpeggios for each chord',
  'Target the 3rds',
  'Comping',
  'Practice improv',
  'Post performance video'
];

// New constants for teacher sessions
export const SESSION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress', 
  COMPLETED: 'completed',
  OVERDUE: 'overdue'
};

export const TEACHER_SESSION_TYPES = {
  ASSIGNED: 'assigned',      // Teacher-assigned
  SELF_CREATED: 'self_created' // Student-created
};

// New constants for teacher session series
export const SERIES_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  NOT_STARTED: 'not_started'
};

export const DEPENDENCY_STATUS = {
  AVAILABLE: 'available',     // Can be started
  LOCKED: 'locked',          // Prerequisites not met
  COMPLETED: 'completed'     // Already finished
}; 