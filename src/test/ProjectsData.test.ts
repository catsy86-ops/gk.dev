import { describe, it, expect } from "vitest";
import { allProjectsData, projectsById, getProjectById } from "@/lib/projects-data";
import { jsCourseLessons } from "@/lib/js-course-data";
import { triggerConfetti } from "@/lib/confetti";

describe("Projects Data & JS Course Integrity Suite", () => {
  it("contains valid project definitions with required fields", () => {
    expect(allProjectsData.length).toBeGreaterThanOrEqual(10);

    for (const project of allProjectsData) {
      expect(project.id).toBeTruthy();
      expect(project.title).toBeTruthy();
      expect(project.description).toBeTruthy();
      expect(Array.isArray(project.tags)).toBe(true);
      expect(project.tags.length).toBeGreaterThan(0);
    }
  });

  it("contains valid JS course lessons with modules, quizzes, and code snippets", () => {
    expect(jsCourseLessons.length).toBeGreaterThanOrEqual(5);

    for (const lesson of jsCourseLessons) {
      expect(lesson.id).toBeTruthy();
      expect(lesson.title).toBeTruthy();
      expect(lesson.quiz.question).toBeTruthy();
      expect(lesson.quiz.options.length).toBe(4);
      expect(lesson.quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(lesson.quiz.correctIndex).toBeLessThan(4);
      expect(lesson.codeSnippet).toBeTruthy();
    }
  });

  it("provides O(1) indexed lookup via projectsById and getProjectById", () => {
    expect(Object.keys(projectsById).length).toBe(allProjectsData.length);
    const firstProject = allProjectsData[0];
    expect(getProjectById(firstProject.id)).toEqual(firstProject);
    expect(getProjectById("non-existent-id-999")).toBeUndefined();
  });

  it("fires confetti without runtime exceptions", () => {
    expect(() => triggerConfetti()).not.toThrow();
  });
});
