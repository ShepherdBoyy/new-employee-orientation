import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
    Stepper,
    StepperIndicator,
    StepperItem,
    StepperSeparator,
    StepperTrigger,
} from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";

export default function Index({ maxFileCount, path }) {
    const steps = Array.from({ length: maxFileCount }, (_, i) => i + 1);
    const [currentStep, setCurrentStep] = useState(1);
    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 flex flex-col justify-center">
            {/* Step panels */}
            <div className="mt-6 flex justify-center">
                {steps.map(
                    (step) =>
                        currentStep === step && (
                            <img
                                key={step}
                                src={`${path}/Slide${step}.JPG`}
                                alt={`Slide ${step}`}
                                className="rounded-md object-cover w-full"
                            />
                        ),
                )}
            </div>
            {/* Stepper header */}
            <Stepper onValueChange={setCurrentStep} value={currentStep}>
                {steps.map((step) => (
                    <StepperItem
                        className="not-last:flex-1"
                        key={step}
                        step={step}
                    >
                        <StepperTrigger asChild>
                            <StepperIndicator />
                        </StepperTrigger>
                        {step < steps.length && <StepperSeparator />}
                    </StepperItem>
                ))}
            </Stepper>

            {/* Navigation buttons */}

            <div className="mt-4 flex justify-between">
                <div className="">
                    <Button>Acknowledgement</Button>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="secondary"
                        disabled={currentStep === 1}
                        onClick={() => setCurrentStep((s) => s - 1)}
                        size="lg"
                    >
                        Back
                    </Button>
                    <Button
                        disabled={currentStep === steps.length}
                        onClick={() => setCurrentStep((s) => s + 1)}
                        size="lg"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
