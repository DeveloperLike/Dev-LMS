import { useEffect, useRef, useState } from "react";

export const useSmoothCountUp = (end, duration = 800) => {
    const [value, setValue] = useState(0);
    const frame = useRef(null);
    const startTime = useRef(null);

    useEffect(() => {
        if (end === null || end === undefined || isNaN(end)) {
            setValue(0);
            return;
        }

        cancelAnimationFrame(frame.current);
        startTime.current = null;

        const animate = (timestamp) => {
            if (!startTime.current) startTime.current = timestamp;

            const progress = Math.min((timestamp - startTime.current) / duration, 1);

            const currentValue = Math.floor(progress * end);
            setValue(currentValue);

            if (progress < 1) {
                frame.current = requestAnimationFrame(animate);
            }
        };

        frame.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frame.current);
    }, [end, duration]);

    return value;
};