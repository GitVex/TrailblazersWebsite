import { QuartzComponentConstructor, QuartzComponentProps } from "./types";
import { classNames } from "../util/lang";
//@ts-ignore
import script from "./scripts/login.inline";
import style from "./styles/login.scss";

export default (() => {
  const Login = ({ displayClass, cfg }: QuartzComponentProps) => {
    return (
      <div class={classNames(displayClass, "login-component")}>
        <div id="logged-in" class="hidden">
          <p>Welcome, <span id="username-display"></span>!</p>
          <button id="logout-button">Logout</button>
        </div>
        <form id="login-form">
          <label for="username" style="margin-right: 1rem">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            required
          />
          <button type="submit">Login</button>
        </form>
        <dialog id="password-dialog">
          <form id="dialog-form" method="dialog">
            <label for="password">Enter Admin Password:</label>
            <input type="password" id="password" name="password" required />
            <menu>
              <button value="cancel" style={"margin-right: 1rem"}>Cancel</button>
              <button value="submit">Submit</button>
            </menu>
          </form>
        </dialog>
      </div>
    );
  };

  Login.css = style;
  Login.afterDOMLoaded = script;

  return Login;
}) satisfies QuartzComponentConstructor;