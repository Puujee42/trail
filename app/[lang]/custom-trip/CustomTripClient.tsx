"use client";

import React from "react";
import CustomTripForm from "../../components/CustomTripForm";
import { motion } from "framer-motion";

const CustomTripClient = ({ dictionary }: { dictionary: any }) => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <CustomTripForm dictionary={dictionary} />
            </motion.div>
        </div>
    );
};

export default CustomTripClient;
