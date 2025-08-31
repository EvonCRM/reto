import {
  FeedbackCategory,
  Role,
  WebhookTrigger
} from '@prisma/client';

export const roleLabels: Record<Role, string> = {
  [Role.MEMBER]: 'Member',
  [Role.ADMIN]: 'Admin'
};

export const feedbackCategoryLabels: Record<FeedbackCategory, string> = {
  [FeedbackCategory.SUGGESTION]: 'Suggestion',
  [FeedbackCategory.PROBLEM]: 'Problem',
  [FeedbackCategory.QUESTION]: 'Question'
};

export const webhookTriggerLabels: Record<WebhookTrigger, string> = {
  [WebhookTrigger.FORM_SUBMITTED]: 'Form submitted'
};
