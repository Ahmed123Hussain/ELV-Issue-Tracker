import { useState, useCallback, useEffect } from 'react';
import { Issue } from '../types/index';

const STORAGE_KEY = 'elv_issues';

export const useIssueStorage = () => {
  const [issues, setIssues] = useState<Issue[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Persist to localStorage whenever issues change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
  }, [issues]);

  const addIssue = useCallback((newIssue: Omit<Issue, 'id' | 'issueNumber'>) => {
    const issueNumber = issues.length > 0 ? Math.max(...issues.map(i => i.issueNumber)) + 1 : 1;
    const issue: Issue = {
      ...newIssue,
      id: crypto.randomUUID(),
      issueNumber,
    };
    setIssues(prev => [issue, ...prev]);
    return issue;
  }, [issues]);

  const updateIssue = useCallback((issueId: string, updates: Partial<Issue>) => {
    setIssues(prev =>
      prev.map(issue =>
        issue.id === issueId
          ? { ...issue, ...updates, updatedAt: new Date().toISOString() }
          : issue
      )
    );
  }, []);

  const deleteIssue = useCallback((issueId: string) => {
    setIssues(prev => prev.filter(issue => issue.id !== issueId));
  }, []);

  return {
    issues,
    addIssue,
    updateIssue,
    deleteIssue,
  };
};
