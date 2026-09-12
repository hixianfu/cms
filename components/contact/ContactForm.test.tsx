import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
  it("shows success after the submission succeeds", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: {} }), { status: 200 })));
    const user = userEvent.setup();
    render(<ContactForm locale="zh" />);
    await user.type(screen.getByLabelText("姓名"), "测试用户");
    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("留言"), "测试留言");
    await user.click(screen.getByRole("button", { name: "发送留言" }));
    expect(await screen.findByRole("status")).toHaveTextContent("留言已提交");
    expect(screen.queryByText("提交失败")).not.toBeInTheDocument();
  });
});
