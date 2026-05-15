import { Skeleton } from "antd";

export const KPISkeleton = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array(6).fill(0).map((_, i) => (
                <div
                    key={i}
                    className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                    <Skeleton active paragraph={{ rows: 1 }} title />
                </div>
            ))}
        </div>
    );
};

export const ChartSkeleton = () => {
    return (
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <Skeleton active paragraph={{ rows: 8 }} title />
        </div>
    );
};

export const TableSkeleton = () => {
    return (
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <Skeleton active paragraph={{ rows: 6 }} title />
        </div>
    );
};

/* ================= GOOGLE KPI ================= */
export const GscKPISkeleton = () => {
    return (
        <div className="grid grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
                <div
                    key={i}
                    className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                    <Skeleton active paragraph={{ rows: 1 }} />
                </div>
            ))}
        </div>
    );
};

/* ================= GOOGLE CHART + DEVICE ================= */
export const GscChartSectionSkeleton = () => {
    return (
        <div className="grid grid-cols-12 gap-4">
            {/* LEFT CHART */}
            <div className="col-span-8 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <Skeleton active paragraph={{ rows: 6 }} title />
            </div>

            {/* RIGHT DEVICE PIE */}
            <div className="col-span-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <Skeleton.Avatar active size={180} shape="circle" />
            </div>
        </div>
    );
};

/* ================= GOOGLE TABLE + COUNTRY ================= */
export const GscTableSectionSkeleton = () => {
    return (
        <div className="grid grid-cols-12 gap-4">
            {/* TABLE */}
            <div className="col-span-8 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <Skeleton active paragraph={{ rows: 8 }} title />
            </div>

            {/* COUNTRY */}
            <div className="col-span-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <Skeleton active paragraph={{ rows: 6 }} title />
            </div>
        </div>
    );
};

/* ================= KPI ================= */
export const GaKPISkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
            {Array(6).fill(0).map((_, i) => (
                <div
                    key={i}
                    className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                    <Skeleton active paragraph={{ rows: 1 }} title />
                </div>
            ))}
        </div>
    );
};

/* ================= MAIN CHART + MAP ================= */
export const GaChartSectionSkeleton = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <Skeleton active paragraph={{ rows: 6 }} title />
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <Skeleton active paragraph={{ rows: 6 }} title />
            </div>
        </div>
    );
};

/* ================= 3 CARDS ================= */
export const GaThreeCardSkeleton = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
            {Array(3).fill(0).map((_, i) => (
                <div
                    key={i}
                    className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                    <Skeleton active paragraph={{ rows: 4 }} title />
                </div>
            ))}
        </div>
    );
};

/* ================= TABLE ================= */
export const GaTableSkeleton = () => {
    return (
        <div className="mt-6 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <Skeleton active paragraph={{ rows: 8 }} title />
        </div>
    );
};