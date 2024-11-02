import { Position, TransformProvider } from "@alan404/react-workspace";
import { PolyculeSystem } from "@app/common";
import { Text } from "@mantine/core";

export const SystemBackground = ({
    system,
    radius,
    position,
}: {
    system: PolyculeSystem;
    radius: number;
    position: Position;
}) => {
    if (system.members.length == 1) return;

    return (
        <TransformProvider
            position={{
                x: position.x - radius,
                y: position.y - radius,
            }}
        >
            <div
                style={{
                    width: radius * 2,
                    height: radius * 2,
                    backgroundColor: (system.color || "#aaaaaa") + "33",
                    borderRadius: radius,
                }}
            />
            <Text
                fz="sm"
                ta="center"
                c="dimmed"
                style={{
                    textWrap: "nowrap",
                    position: "absolute",
                    top: `${radius*2}px`,
                    width: `${radius*2}px`,
                    userSelect: "none",
                }}
            >
                {system.name}&
            </Text>
        </TransformProvider>
    );
};
