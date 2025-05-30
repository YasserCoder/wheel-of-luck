import { useEntries } from "../context/entriesContext";
import styles from "./styles/Wheel.module.css";

export default function Wheel() {
    const {
        value: { entries, colors },
    } = useEntries();
    const radius = 230;
    const center = radius;
    const angle = 360 / entries.length;

    return (
        <div className={styles.wheel}>
            <svg width={radius * 2} height={radius * 2}>
                {entries.map((entry, i) => (
                    <Slice
                        key={i}
                        i={i}
                        angle={angle}
                        radius={radius}
                        center={center}
                        content={entry}
                        color={colors[i % colors.length] || "#000"}
                        slices={entries.length}
                    />
                ))}
            </svg>
        </div>
    );
}

type SliceProps = {
    i: number;
    angle: number;
    radius: number;
    center: number;
    content: string;
    color: string;
    slices: number;
};
function Slice({
    i,
    angle,
    radius,
    center,
    content,
    color,
    slices,
}: SliceProps) {
    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    const startAngle = angle * i;
    const endAngle = startAngle + angle - 0.01; // Slightly less to avoid overlap

    const x1 = center + radius * Math.cos(toRadians(startAngle));
    const y1 = center + radius * Math.sin(toRadians(startAngle));
    const x2 = center + radius * Math.cos(toRadians(endAngle));
    const y2 = center + radius * Math.sin(toRadians(endAngle));

    const largeArc = angle > 180 ? 1 : 0;
    const midAngle = toRadians(startAngle + angle / 2);

    const pathData = `
    M ${center},${center}
    L ${x1},${y1}
    A ${radius},${radius} 0 ${largeArc} 1 ${x2},${y2}
    Z
  `;

    const contentX = center + (radius / 1.7) * Math.cos(midAngle);
    const contentY = center + (radius / 1.7) * Math.sin(midAngle);

    let maxTextLength = 20;
    let imageHeight = 20;
    let textSize = 14;

    if (slices <= 2) {
        imageHeight = 85;
        textSize = 22;
        maxTextLength = 18;
    } else if (slices <= 10) {
        imageHeight = 70;
        textSize = 19;
        maxTextLength = 17;
    } else if (slices <= 20) {
        imageHeight = 42;
        textSize = 16;
    } else if (slices <= 30) {
        imageHeight = 30;
        textSize = 14;
    } else if (slices <= 40) {
        imageHeight = 20;
        textSize = 12;
        maxTextLength = 22;
    }

    return (
        <g>
            <path d={pathData} fill={color} />
            {!content.startsWith("data:image") ? (
                <text
                    x={contentX}
                    y={contentY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={textSize}
                    fill="white"
                    transform={`rotate(${
                        startAngle + angle / 2
                    }, ${contentX}, ${contentY})`}
                >
                    {content.length > maxTextLength
                        ? `${content.slice(0, maxTextLength)}...`
                        : content}
                </text>
            ) : (
                <image
                    href={content}
                    x={contentX - imageHeight / 2}
                    y={contentY - imageHeight / 2}
                    height={imageHeight}
                    preserveAspectRatio="xMidYMid meet"
                    transform={`rotate(${
                        startAngle + angle / 2
                    }, ${contentX}, ${contentY})`}
                />
            )}
        </g>
    );
}
