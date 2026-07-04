import { updateTextSize } from "auto-text-size";
import type { ComponentChildren } from "preact";
import { useLayoutEffect, useRef, useState } from "preact/hooks";
import HomeDescription from "./HomeDescription.mdx";

type AutoTextSizeMode = "oneline" | "multiline" | "box" | "boxoneline";

type StableAutoTextSizeProps = {
    children: ComponentChildren;
    mode?: AutoTextSizeMode;
    minFontSizePx?: number;
    maxFontSizePx?: number;
    fontSizePrecisionPx?: number;
};

const StableAutoTextSize = ({
    children,
    mode,
    minFontSizePx,
    maxFontSizePx,
    fontSizePrecisionPx,
}: StableAutoTextSizeProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);

    useLayoutEffect(() => {
        const containerEl = containerRef.current;
        const innerEl = innerRef.current;

        if (!containerEl || !innerEl) return;

        let isActive = true;
        let animationFrameId: number | undefined;

        const fitText = () => {
            updateTextSize({
                innerEl,
                containerEl,
                mode,
                minFontSizePx,
                maxFontSizePx,
                fontSizePrecisionPx,
            });

            if (isActive) {
                setIsReady(true);
            }
        };

        const scheduleFitText = () => {
            if (!isActive) return;

            if (animationFrameId !== undefined) {
                cancelAnimationFrame(animationFrameId);
            }

            animationFrameId = requestAnimationFrame(() => {
                animationFrameId = undefined;
                fitText();
            });
        };

        // Avoid painting the inherited startup size before the measured size.
        fitText();

        const resizeObserver = new ResizeObserver(scheduleFitText);
        resizeObserver.observe(containerEl);

        if (document.fonts) {
            void document.fonts.ready.then(scheduleFitText);
        }

        return () => {
            isActive = false;
            resizeObserver.disconnect();

            if (animationFrameId !== undefined) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [children, fontSizePrecisionPx, maxFontSizePx, minFontSizePx, mode]);

    return (
        <div ref={containerRef} class={`w-full ${isReady ? "" : "invisible"}`}>
            <div ref={innerRef}>{children}</div>
        </div>
    );
};

export const Home = () => {
    return (
        <div class="w-full h-full flex flex-col">
            <div class="w-full flex flex-row flex-wrap items-start bg-red-700 p-8 md:p-12 gap-8 overflow-clip">
                <h1
                    class="w-0 grow min-w-3/5 font-bold flex flex-col select-none text-white"
                    style={{
                        lineHeight: "0.8",
                    }}
                >
                    <StableAutoTextSize maxFontSizePx={Infinity}>
                        NMNM
                    </StableAutoTextSize>
                    <StableAutoTextSize maxFontSizePx={Infinity}>
                        .CC
                        <a
                            class="text-red-600! relative inline-block h-full max-h-full"
                            href="https://github.com/NMNMCC"
                        >
                            <div class="absolute flex items-center justify-center w-full h-full aspect-square top-0 left-0 pt-[10%]">
                                <img
                                    alt="Avatar"
                                    src="https://github.com/NMNMCC.png"
                                    class="rounded-full object-cover transform-gpu transition-all hover:scale-150"
                                ></img>
                            </div>
                            &nbsp;
                        </a>
                    </StableAutoTextSize>
                </h1>
                <div
                    class={`w-full xl:w-0 xl:grow min-h-fit md:p-4  overflow-x-clip overflow-y-auto prose **:text-white`}
                    style={{
                        scrollbarWidth: "none",
                    }}
                >
                    <HomeDescription />
                </div>
            </div>
        </div>
    );
};
