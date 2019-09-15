interface Window {
    p5: import('p5');
    imgs: import('p5').Image[];
    animals: import('./animal/animal.class').default[];
    size: number;
    speed: number;
    time: number;
    averageHareSpeed: number[];
    averageFoxSpeed: number[];

    showAverageSpeedChart(): void;

    showChangeSpeedDialog(): void;

    showSpeedCurve(): void;

    showStatsOfAnimal(animal: import('./animal/animal.class').default): void;
}
