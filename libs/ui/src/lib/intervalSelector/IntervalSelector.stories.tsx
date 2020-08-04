import React, { useState } from 'react';
import { IntervalSelector } from './IntervalSelector';

export default {
    title: 'IntervalSelector',
    component: IntervalSelector,
};

export const Default = () => {

    const [start, setStart] = useState<number>();
    const [end, setEnd] = useState<number>();

    return (
        <div>
            <IntervalSelector start={start} end={end} setStart={setStart} setEnd={setEnd} />
        </div>
    )
}