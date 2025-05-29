import { useEntries } from "../context/entriesContext";

export default function Wheel() {
    const {
        value: { entries, colors },
    } = useEntries();
    const radius = 220;
    const center = radius;
    const angle = 360 / entries.length;

    return (
        <div
            style={{
                border: "5px solid red",
                borderRadius: "50%",
                width: "fit-content",
                height: "fit-content",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
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
};
function Slice({ i, angle, radius, center, content, color }: SliceProps) {
    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    const startAngle = angle * i;
    const endAngle = startAngle + angle;

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

    return (
        <g>
            <path d={pathData} fill={color} />
            {!content.startsWith("data:image") ? (
                <text
                    x={contentX}
                    y={contentY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="12"
                    fill="white"
                    transform={`rotate(${
                        startAngle + angle / 2
                    }, ${contentX}, ${contentY})`}
                >
                    {content}
                </text>
            ) : (
                <image
                    href={content}
                    x={contentX - 10}
                    y={contentY - 10}
                    width="50"
                    height="50"
                    transform={`rotate(${
                        startAngle + angle / 2
                    }, ${contentX}, ${contentY})`}
                />
            )}
        </g>
    );
}
