import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import ChatbotWidget from "../onlineChatBotWidget";

it("does not inject any remote script in the public portfolio", () => {
  const count = document.scripts.length;
  const { container } = render(<ChatbotWidget />);
  expect(container).toBeEmptyDOMElement();
  expect(document.scripts.length).toBe(count);
});
