import React, { useState } from 'react';
import { TimeShiftInput } from './TimeShiftInput';

export default {
    title: 'TimeShiftInput',
    component: TimeShiftInput,
};

export const Default = () => {

    return (
        <div>
            <TimeShiftInput {...null} />
        </div>
    )
}