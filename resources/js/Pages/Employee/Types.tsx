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
    signed_jd_submitted: boolean;
};