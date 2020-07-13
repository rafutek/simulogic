import React, { useState } from 'react';
import { IntervalSelector } from './IntervalSelector';

export default {
    title: 'IntervalSelector',
    component: IntervalSelector,
};

export const Default = () => {

    const [from, setFrom] = useState<number>();
    const [to, setTo] = useState<number>();

    return (
        <div>
            <IntervalSelector setFrom={setFrom} setTo={setTo} />
            {from && to ? <p>selected interval from {from} to {to}.</p> : null}
        </div>
    )
}