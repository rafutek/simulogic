import React from 'react';

export const TimeDiagramTest = () => {

    const data = {
        signal: [
            { name: "clk", wave: "p......" },
            { name: "bus", wave: "x.34.5x", data: "head body tail" },
            { name: "wire", wave: "0.1..0." },
        ]
    };

    return (
        <div>
            <h2>WaveDrom Example</h2>
            <script type="WaveDrom">
                {JSON.stringify(data)}
            </script>
        </div>
    )
}