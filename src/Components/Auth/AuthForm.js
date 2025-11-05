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
    <div>
      <form onSubmit={onSubmit}>
        {isRegister && (
          <>
            <div>
              <label>First Name</label>
              <br />
              <input
                type="text"
                name="firstName"
                value={user.firstName || ""}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label>Last Name</label>
              <br />
              <input
                type="text"
                name="lastName"
                value={user.lastName || ""}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label>Email</label>
              <br />
              <input
                type="email"
                name="email"
                value={user.email || ""}
                onChange={onChange}
                required
              />
            </div>
          </>
        )}
        
        <div>
          <label>Username</label>
          <br />
          <input
            type="text"
            name="username"
            value={user.username || ""}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            name="password"
            value={user.password || ""}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">{submitText}</button>
      </form>
      
      {linkText && linkPath && (
        <div style={{ marginTop: "20px" }}>
          <Link to={linkPath}>{linkText}</Link>
        </div>
      )}
    </div>
  );
};

export default AuthForm;