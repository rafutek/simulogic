import React, { useEffect } from 'react';
import { WaveDrom } from '@simulogic/core';

export interface TimeDiagramProps {
    data: WaveDrom
}
export const TimeDiagram = (props: TimeDiagramProps) => {

    const addScript = (id: string, src: string) => {
        if (!document.getElementById(id)) {
            const script = document.createElement("script");
            script.id = id;
            script.src = src;
            script.async = true;
            document.head.appendChild(script);
        }
    }

    addScript("default-wavedrom-script", "https://cdnjs.cloudflare.com/ajax/libs/wavedrom/2.6.3/skins/default.js");
    addScript("core-wavedrom-script", "https://cdnjs.cloudflare.com/ajax/libs/wavedrom/2.6.3/wavedrom.min.js");

    useEffect(() => {
        const WaveDrom = window["WaveDrom"];
        if (WaveDrom) {
            WaveDrom.ProcessAll();
        } else {
            throw new Error("WaveDrom is missing");
        }
    }, []);

    return (
        <div>
            <script type="WaveDrom">
                {JSON.stringify(props.data)}
            </script>
        </div>
    )
}