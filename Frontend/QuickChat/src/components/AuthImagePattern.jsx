const AuthImagePattern = ({ title, subtitle }) => {
    return (
        <div className="hidden lg:flex h-full items-center justify-center bg-base-300 p-12">
            <div className="w-lg text-center">
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[...Array(9)].map((_, i) => (
                        <div
                            key={i}
                            className={`aspect-square lobster-regular pt-4 text-9xl rounded-2xl bg-primary/10 ${i % 2 === 0 ? "animate-pulse" : ""
                                }`}
                        >{i == 4 && "Q" }</div>
                    ))}
                </div>
                <h2 className="text-4xl lobster-regular font-bold mb-4">{title}</h2>
                <p className="text-base-content/60 text-sm">{subtitle}</p>
            </div>
        </div>
    );
};

export default AuthImagePattern;