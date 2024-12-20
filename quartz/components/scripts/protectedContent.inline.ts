import { QuartzComponentProps, users } from "../types"
import { useUser } from "./login.inline"

function auth(componentData: QuartzComponentProps, authorized: HTMLElement, unauthorized: HTMLElement) {

  const allowedUsers = componentData.fileData.frontmatter?.allowedUsers as string[] ?? []
  const user = useUser()

  /* display content if:
    1. user is logged in and is in the allowedUser list, or is logged in and is in the admin role
    2. allowedUsers list contains "all"
  */
  const adminUsers = users.filter(u => u.role === "admin").map(u => u.username)
  if ((user && (allowedUsers.includes(user) || adminUsers.includes(user))) || allowedUsers.includes("all")) {
    unauthorized.style.display = "none"
    authorized.style.display = "block"

  } else {

    unauthorized.style.display = "block"
    authorized.style.display = "none"
  }
}

export function run_auth() {
  let componentData = null

  const componentDataElement = document.getElementById("protected-content-data")
  if (!componentDataElement) return
  /* Deserialize the component data */
  if (componentDataElement) {
    if (componentDataElement.textContent != null) {
      componentData = JSON.parse(componentDataElement.textContent) as QuartzComponentProps
    }
  }

  const unauthorized = document.getElementById("protected-content-unauthorized")
  const authorized = document.getElementById("protected-content-authorized")

  if (!unauthorized || !authorized) return

  if (componentData == null) return
  setInterval(() => auth(componentData, authorized, unauthorized), 500)
}

run_auth()