export const pageVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

export const itemVariants = {
    hidden: {
        opacity: 0,
        y: 8,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.22,
            ease: "easeOut",
        },
    },
};

export const listVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.04,
        },
    },
};

export const listItemVariants = {
    hidden: {
        opacity: 0,
        y: 6,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.18,
            ease: "easeOut",
        },
    },
};
