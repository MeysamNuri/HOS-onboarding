import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import AjaxLoadingComponent from "../ajaxLoadingComponent"
describe("AjaxLoadingComponent", () => {
  it("renders without crashing", () => {
    const { container } = render(<AjaxLoadingComponent />);
    expect(container).toBeInTheDocument();
  });

  it("renders loader div", () => {
    render(<AjaxLoadingComponent />);
    const loaderElement = document.querySelector(".loader");
    expect(loaderElement).toBeInTheDocument();
  });

  it("applies correct styles to Row container", () => {
    const { container } = render(<AjaxLoadingComponent />);
    
    const rowElement = container.firstChild as HTMLElement;

    expect(rowElement).toHaveStyle({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
      alignContent: "center",
    });
  });
});
