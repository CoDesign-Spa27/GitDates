export const LogoutButton = ({ onclick }: { onclick: () => void }) => { 
    return (
        <button
            onClick={onclick}
            className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 
            hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg
            transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            aria-label="Sign out"
        >
            <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" 
                viewBox="0 0 512 512" 
                fill="currentColor"
            >
                <path
                    d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                ></path>
            </svg>
            <span className="font-medium">Sign out</span>
        </button>
    )
}