import { useGlobalTransform } from "@alan404/react-workspace";
import { PropsWithChildren } from "react";

export const View = ({ children }: PropsWithChildren) => {
    const { position, scale } = useGlobalTransform();

    return (
        <div
            style={{
                overflow: "hidden",
                position: 'absolute',
                width: "100%",
                height: "100%",
            }}
        >
            <div
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: '0 0',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
            >
                {children}
            </div>
        </div>
    );
};
