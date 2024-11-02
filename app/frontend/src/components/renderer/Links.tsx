import { Position, useGlobalTransform } from "@alan404/react-workspace";
import { avgPos, GraphNode, RenderedLink } from "./types";

export const Links = ({
    links,
    ...props
}: {
    links: RenderedLink[];
} & JSX.IntrinsicElements["line"]) => {
    const { position, scale } = useGlobalTransform();

    return (
        <svg
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
            }}
        >
            {links.map((link, i) => {
                return (
                    <line
                        x1={(link.a.x * scale + position.x)}
                        x2={(link.b.x * scale + position.x)}
                        y1={(link.a.y * scale + position.y)}
                        y2={(link.b.y * scale + position.y)}
                        stroke={link.color || props.stroke}
                        strokeWidth={link.thickness || props.strokeWidth}
                        {...props}
                    />
                );
            })}
        </svg>
    )
};
