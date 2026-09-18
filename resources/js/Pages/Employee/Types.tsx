export enum OnboardingStep {
    Welcome,
    Modules,
    Guidelines,
}

export type OnboardingUser = {
    name: string;
    jobPosition: string;
    companyName: string;
    jd_path: string;
    jd_viewed: boolean;
};
