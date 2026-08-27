import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import ContentFactory from "./Content"
//@ts-ignore
import script from "../scripts/protectedContent.inline"


const ProtectedContent: QuartzComponent = (componentData: QuartzComponentProps) => {
  const Content = ContentFactory()

  // Only the access control fields are needed client side. Serializing the whole
  // componentData would embed the page tree and every other file's data into every
  // page, which blows up the emit step to gigabytes of HTML.
  const accessControlData = {
    fileData: {
      frontmatter: {
        allowedUsers: componentData.fileData.frontmatter?.allowedUsers ?? "",
        elevatedUsers: componentData.fileData.frontmatter?.elevatedUsers ?? "",
      },
    },
  }

  return (<>
      <div class="protected-content">
        <div id="protected-content-unauthorized" style={{ display: "none" }}>
          <p>Oops, No peeking! Only authorized users can see this file. Go back to bed.</p>
        </div>
        <div id="protected-content-authorized" style={{ display: "none" }}>
          {Content(componentData)}
        </div>
      </div>
      {/* Serialize just the access control data */}
      <script
        type="application/json"
        id="protected-content-data"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(accessControlData),
        }}
      />
    </>
  )
}

ProtectedContent.afterDOMLoaded = script

export default (() => ProtectedContent) satisfies QuartzComponentConstructor
