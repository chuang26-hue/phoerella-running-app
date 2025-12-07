import { Link } from "react-router-dom";

const AuthForm = ({
  user,
  onChange,
  onSubmit,
  submitText,
  isRegister = true,
  linkText,
  linkPath,
}) => {
  return (
    <div className="max-w-md mx-auto p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        {isRegister && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={user.firstName || ""}
                onChange={onChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={user.lastName || ""}
                onChange={onChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={user.email || ""}
                onChange={onChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={user.username || ""}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={user.password || ""}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-500 text-white py-2.5 px-4 rounded font-medium hover:bg-blue-600 transition-colors"
        >
          {submitText}
        </button>

        {!isRegister && (
          <div className="mt-2.5">
            <Link
              to="/reset-password"
              className="text-blue-500 underline hover:text-blue-700 cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>
        )}
      </form>

      {linkText && linkPath && (
        <div className="mt-5 text-center">
          <Link 
            to={linkPath}
            className="text-blue-500 hover:text-blue-700 hover:underline"
          >
            {linkText}
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthForm;