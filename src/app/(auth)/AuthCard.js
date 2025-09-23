const AuthCard = ({ logo, children }) => (
    <div className="flex-1 flex flex-col justify-center items-center bg-white overflow-hidden">
        <div>{logo}</div>
        <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white">
            {children}
        </div>
    </div>
)

export default AuthCard
