import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectDetailsModal, type ProjectData } from "@/components/ProjectDetailsModal";

const mockProject: ProjectData = {
  id: "test-proj",
  title: "Test Project Title",
  category: "saas",
  categoryLabel: "SaaS",
  description: "Short description",
  fullDescription: "Detailed case study description for test project.",
  tags: ["React", "TypeScript"],
  accent: "from-blue-500/20 to-cyan-500/10",
  accentBorder: "hover:border-blue-500/40",
  accentGlow: "0 0 30px rgba(0,0,0,0.2)",
  image: "https://images.unsplash.com/photo-1?w=800",
  demo: "https://demo.example.com",
  github: "https://github.com/example/test",
  featured: true,
  stats: { year: "2024", type: "Web" },
  metrics: [{ label: "Speed", value: "99/100" }],
  keyFeatures: ["Feature One", "Feature Two"],
  architecture: ["Modular Clean Architecture"],
};

describe("ProjectDetailsModal", () => {
  it("does not render when isOpen is false", () => {
    render(<ProjectDetailsModal project={mockProject} isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText("Test Project Title")).not.toBeInTheDocument();
  });

  it("renders project details when open", () => {
    const onClose = vi.fn();
    render(<ProjectDetailsModal project={mockProject} isOpen={true} onClose={onClose} />);
    expect(screen.getByText("Test Project Title")).toBeInTheDocument();
    expect(screen.getByText("Detailed case study description for test project.")).toBeInTheDocument();
    expect(screen.getByText("Feature One")).toBeInTheDocument();
    expect(screen.getByText("99/100")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<ProjectDetailsModal project={mockProject} isOpen={true} onClose={onClose} />);
    const closeBtn = screen.getByLabelText(/Zamknij szczegóły projektu/i);
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
