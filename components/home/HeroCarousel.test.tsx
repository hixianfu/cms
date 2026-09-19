import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeroCarousel } from "./HeroCarousel";

const image = { url: "/uploads/hero.jpg", alternativeText: "Packaging line" };
const video = { url: "/uploads/hero.mp4", mime: "video/mp4" };
const videoSlides = [
  { title: "Video one", image, video },
  { title: "Video two", image, video: { url: "/uploads/hero-2.mp4", mime: "video/mp4" } },
];

const slides = [
  { title: "第一张", description: "第一张描述" },
  { title: "第二张", description: "第二张描述" },
];

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("HeroCarousel", () => {
  it("keeps rendering existing image-only slides", () => {
    render(<HeroCarousel locale="en" slides={[{ title: "Image hero", image }]} />);

    expect(screen.getByRole("img", { name: "Packaging line" })).toHaveClass("object-cover");
    expect(screen.queryByTestId("hero-video-0")).not.toBeInTheDocument();
  });

  it("renders an uploaded video before its image poster", () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    render(<HeroCarousel locale="en" slides={[{ title: "Video hero", image, video }]} />);

    const element = screen.getByTestId("hero-video-0") as HTMLVideoElement;
    expect(element).toHaveAttribute("poster", "http://localhost:1337/uploads/hero.jpg");
    expect(element).toHaveAttribute("playsinline");
    expect(element).toHaveProperty("muted", true);
    expect(element).toHaveProperty("loop", true);
    expect(element).not.toHaveAttribute("controls");
  });

  it("falls back to the poster image when video loading fails", () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    render(<HeroCarousel locale="en" slides={[{ title: "Fallback hero", image, video }]} />);

    fireEvent.error(screen.getByTestId("hero-video-0"));

    expect(screen.queryByTestId("hero-video-0")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Packaging line" })).toBeInTheDocument();
  });

  it("plays only the active video and pauses it with the carousel control", async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    const user = userEvent.setup();

    render(<HeroCarousel locale="en" slides={videoSlides} />);

    expect(play).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Pause carousel" }));
    expect(pause).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Play carousel" }));
    expect(play.mock.calls.length).toBeGreaterThan(1);
  });

  it("does not autoplay video when reduced motion is requested", () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<HeroCarousel locale="en" slides={[videoSlides[0]]} />);

    expect(play).not.toHaveBeenCalled();
    expect(pause).toHaveBeenCalled();
  });

  it("supports button and keyboard controls", async () => {
    const user = userEvent.setup();
    render(<HeroCarousel slides={slides} locale="zh" />);

    expect(screen.getByRole("heading", { name: "第一张" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "下一张" }));
    expect(screen.getByRole("heading", { name: "第二张" })).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("heading", { name: "第一张" })).toBeInTheDocument();
  });
});
