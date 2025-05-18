const Input = ({
    label,
    placeholder,
    icon,
    ErrorMsg,
    type,
    pattern,
    size,
    autoComplete,
    className,
    ...props
}) => {
    return (
        <div>
            <label className='text-gray-50 text-md md:text-base font-bold' htmlFor={label}>
                {label}
            </label>
            <label className="input w-full validator mt-2">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox={size}>
                    {icon}
                </svg>
                <input
                    type={type}
                    required
                    placeholder={placeholder}
                    pattern={pattern}
                    {...props} 
                    autoComplete={autoComplete}
                    className={className}
                />
            </label>
            {ErrorMsg && <p className="validator-hint text-xxs pb-1 text-red-500">{ErrorMsg}</p>}
        </div>
    );
};

export default Input;
