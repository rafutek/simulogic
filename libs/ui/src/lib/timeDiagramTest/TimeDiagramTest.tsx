import React, { useEffect } from 'react';

export const TimeDiagramTest = () => {

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

    const data = {
        signal: [
            { name: "clk", wave: "p....x.." },
            { name: "bus", wave: "x.34.5xx", data: "head body tail" },
            { name: "wire", wave: "0.1..0.." },
            { name: "time", node: "123456789" },
            { name: "tme", wave: "=========", data: "1 2 3 4" },
        ],
        foot: {
            text: 'Figure 100',
            tick: 1
        }
    };

    useEffect(() => {
        const WaveDrom = window["WaveDrom"];
        if (WaveDrom) {
            WaveDrom.ProcessAll();
        } else {
            throw new Error("WaveDrom is missing");
        }
    });

    return (
        <div>
            <h2>WaveDrom Example</h2>
            <script type="WaveDrom">
                {JSON.stringify(data)}
            </script>
        </div>
    )
}