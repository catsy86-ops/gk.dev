import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectCard } from "@/components/ProjectCard";
import { allProjectsData } from "@/lib/projects-data";
import { I18nProvider } from "@/components/I18nProvider";

describe("ProjectCard Component Suite", () => {
  const sampleProject = allProjectsData[0];

  it("renders project title, description, and metric tags", () => {
    const handleOpen = vi.fn();
    render(
      <I18nProvider>
        <ProjectCard project={sampleProject} index={0} onOpenDetails={handleOpen} />
      </I18nProvider>
    );

    expect(screen.getByText(sampleProject.title)).toBeInTheDocument();
    expect(screen.getByText(sampleProject.description)).toBeInTheDocument();

    // Check tags
    sampleProject.tags.slice(0, 3).forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it("triggers onOpenDetails when Case Study button is clicked", () => {
    const handleOpen = vi.fn();
    render(
      <I18nProvider>
        <ProjectCard project={sampleProject} index={0} onOpenDetails={handleOpen} />
      </I18nProvider>
    );

    const button = screen.getByRole("button", { name: /case study/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleOpen).toHaveBeenCalledWith(sampleProject);
  });
});
