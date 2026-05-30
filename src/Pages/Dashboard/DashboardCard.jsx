import { MdKeyboardArrowRight } from "react-icons/md";
import { useSmoothCountUp } from "./useSmoothCountUp";

export const DashboardCard = ({
    config,
    count,
    data,
    onClick,
}) => {
    const Icon = config.icon?.default || config.icon;

    const animatedCount = useSmoothCountUp(count, 1000);

    const isDark =
        document.documentElement.classList.contains("dark");

    return (
        <div
            onClick={onClick}
            className={`
        relative
        overflow-hidden
        rounded-[24px]
        border
        cursor-pointer
        group
        min-h-[165px]
        p-5

        transition-all
        duration-500

        backdrop-blur-2xl

        shadow-[0_10px_30px_rgba(0,0,0,0.06)]
        dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)]

        ${isDark
                    ? config.darkColor
                    : config.lightColor
                }
      `}
        >
            {/* glass overlay */}
            <div className="absolute inset-0 bg-white/[0.08] dark:bg-white/[0.03]" />

            {/* layered smooth waves */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
                {/* wave 1 */}
                <svg
                    viewBox="0 0 1440 320"
                    className="
               absolute
               bottom-0
               left-0
               w-full
               h-35
               opacity-[0.05]
               dark:opacity-[0.08]
             "
                    preserveAspectRatio="none"
                >
                    <path
                        className="fill-current"
                        d="M0,224C120,192,240,192,360,213C480,235,600,277,720,272C840,267,960,213,1080,202C1200,192,1320,224,1440,250L1440,320L0,320Z"
                    />
                </svg>

                {/* wave 2 */}
                <svg
                    viewBox="0 0 1440 320"
                    className="
               absolute
               bottom-0
               left-0
               w-full
               h-20
               opacity-[0.08]
               dark:opacity-[0.12]
             "
                    preserveAspectRatio="none"
                >
                    <path
                        className="fill-current"
                        d="M0,256C80,224,160,202,240,208C320,214,400,246,480,256C560,267,640,256,720,229C800,203,880,160,960,160C1040,160,1120,203,1200,224C1280,246,1360,246,1440,224L1440,320L0,320Z"
                    />
                </svg>

                {/* wave 3 */}
                <svg
                    viewBox="0 0 1440 320"
                    className="
               absolute
               bottom-0
               left-0
               w-full
               h-16
               opacity-[0.12]
               dark:opacity-[0.16]
             "
                    preserveAspectRatio="none"
                >
                    <path
                        className="fill-current"
                        d="M0,288C120,250,240,224,360,224C480,224,600,250,720,245C840,240,960,203,1080,202C1200,203,1320,240,1440,256L1440,320L0,320Z"
                    />
                </svg>

                {/* wave 4 */}
                <svg
                    viewBox="0 0 1440 320"
                    className="
               relative
               w-full
               h-14
               opacity-[0.16]
               dark:opacity-[0.20]
             "
                    preserveAspectRatio="none"
                >
                    <path
                        className="fill-current"
                        d="M0,256C90,240,180,224,270,224C360,224,450,240,540,245C630,251,720,245,810,224C900,203,990,171,1080,170C1170,171,1260,203,1350,224C1395,235,1418,240,1440,245L1440,320L0,320Z"
                    />
                </svg>
            </div>

            {/* shimmer loading */}
            {!data && (
                <div className="absolute inset-0 overflow-hidden rounded-[24px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-shimmer" />
                </div>
            )}

            {/* label top right */}
            <div className="absolute top-5 right-5 z-20">
                <p
                    className="
                    text-[15px]
                    font-semibold
                    tracking-wide
                    text-slate-800
                    dark:text-white/90
                  "
                >
                    {config.label}
                </p>
            </div>

            {/* arrow bottom right */}
            <div
                className="
                  absolute
                  bottom-5
                  right-5
                  z-20
            
                  w-9
                  h-9
                  rounded-full
            
                  bg-white/60
                  dark:bg-white/10
            
                  backdrop-blur-xl
            
                  border
                  border-white/50
                  dark:border-white/10
            
                  flex
                  items-center
                  justify-center
            
                  opacity-0
                  group-hover:opacity-100
            
                  transition-all
                  duration-300
            
                  translate-y-2
                  group-hover:translate-y-0
            
                  shadow-md
                "
            >
                <MdKeyboardArrowRight
                    size={18}
                    className="
                    text-slate-700
                    dark:text-white
                  "
                />
            </div>

            {/* content */}
            <div className="relative z-10 flex flex-col justify-between h-full">
                {/* icon */}
                <div
                    className="
                  w-12
                  h-12
                  rounded-2xl
                  flex
                  items-center
                  justify-center
            
                  bg-white/60
                  dark:bg-white/10
            
                  backdrop-blur-xl
            
                  border
                  border-white/50
                  dark:border-white/10
            
                  shadow-lg
                "
                >
                    {Icon && (
                        <Icon
                            size={21}
                            className="
                          text-slate-800
                          dark:text-white
                        "
                        />
                    )}
                </div>

                {/* count */}
                <div className="mt-4">
                    <h2
                        className="
              mt-5
              text-[25px]
              leading-none
              font-black
              tracking-tight

              text-slate-950
              dark:text-white
            "
                    >
                        {data ? animatedCount : "..."}
                    </h2>
                </div>
            </div>

            <style>
                {`
          @keyframes shimmer {
            0% {
              transform: translateX(-120%);
            }

            100% {
              transform: translateX(120%);
            }
          }

          .animate-shimmer {
            animation: shimmer 1.6s ease-in-out infinite;
          }
        `}
            </style>
        </div>
    );
};