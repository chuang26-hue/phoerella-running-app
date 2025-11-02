const AuthForm = ({
  user,
  onChange,
  onSubmit,
  submitText,
  showNameFields = true,
}) => {
  return (
    <div>
      <form onSubmit={onSubmit}>
        {showNameFields && (
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
          </>
        )}
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            name="email"
            value={user.email}
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
            value={user.password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">{submitText}</button>
      </form>
    </div>
  );
};

export default AuthForm;
