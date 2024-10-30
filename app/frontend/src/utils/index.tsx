import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import React from "react"

export const onClickDelete = (
    prompt: string,
    cb: () => void
) => (e: React.MouseEvent<HTMLElement>) => {
    if(e.shiftKey) return cb();

    modals.openConfirmModal({
        title: "Delete confirmation",
        children: (
            <Text>
                {prompt}
            </Text>
        ),
        confirmProps: { color: "red" },
        onConfirm: () => cb(),
    });
};
