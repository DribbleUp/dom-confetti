interface ConfettiConfig {
    angle?: number;
    spread?: number;
    width?: number;
    height?: number;
    startVelocity?: number;
    elementCount?: number;
    decay?: number;
    colors?: string[];
    random?: () => number;
}

export function confetti(root: HTMLElement, config?: ConfettiConfig): void;
