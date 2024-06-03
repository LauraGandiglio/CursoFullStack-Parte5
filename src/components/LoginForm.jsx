import PropTypes from 'prop-types'

const LoginForm = (props) => {
  return(
<form onSubmit={props.handleLogin}>
            <div>
              username{" "}
              <input
                type="text"
                value={props.username}
                name="Username"
                autoComplete="Username"
                onChange={props.handleUsername}
              />
            </div>
            <div>
              password{" "}
              <input
                type="password"
                value={props.password}
                name="Password"
                autoComplete="current-password"
                onChange={props.handlePassword}
              />
            </div>
            <button type="submit">login</button>
          </form>
  )
}
LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleUsername: PropTypes.func.isRequired,
  handlePassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm