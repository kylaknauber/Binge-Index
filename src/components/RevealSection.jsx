import { motion, useInView, useAnimation } from "framer-motion"
import { useEffect, useRef } from "react"

export default function RevealSection({ title, children }) {
    const motionRef = useRef(null);
    const isInView = useInView(motionRef, { once: false });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
        else {
            mainControls.start("hidden");
        }
    }, [isInView]);

    return (
        <div ref={motionRef}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 100 },
                    visible: { opacity: 1, y: 0 }
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.5, delay: 0.25 }}
            >
                <h1 className="section-title">{title}</h1>
                <div className="homeMedia">{children}</div>
            </motion.div>
        </div>
    )
}