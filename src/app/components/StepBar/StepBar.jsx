import React from "react"
import Steps, { Step } from 'rc-steps';
import 'rc-steps/assets/iconfont.css';
import "./StepBar.scss"

export default function StepBar({ currentStep, page }) {
    return (

        <Steps labelPlacement="vertical" current={currentStep - 1} status="process">
            {page == 'artist' && [
                <Step title="مشخصات هنرمند" />,
                <Step title="زندگی نامه" />,
                <Step title="نمایشگاه‌ها و آثار هنرمند" />,
                <Step title="آثار برای داوری" />,
            ]}
        </Steps>
    );
}