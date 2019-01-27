import React from 'react'
import Steps, { Step } from 'rc-steps';
import 'rc-steps/assets/iconfont.css';
import './StepBar.scss'

export default function StepBar({ currentStep, page }) {
    return (

        <Steps labelPlacement='vertical' current={currentStep - 1} status='process'>
            {page == 'artist' && [
                <Step key='1' title='مشخصات هنرمند' />,
                <Step key='2' title='زندگی نامه' />,
                <Step key='3' title='نمایشگاه‌ها و آثار هنرمند' />,
                <Step key='4' title='آثار برای داوری' />,
            ]}
        </Steps>
    );
}