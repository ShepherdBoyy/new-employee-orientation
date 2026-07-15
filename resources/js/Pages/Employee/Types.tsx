export enum OnboardingStep {
    Welcome,
    Modules,
    Guidelines,
}

export type OnboardingUser = {
    name: string;
    jobPosition: string;
    companyName: string;
};
