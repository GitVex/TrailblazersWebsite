import { QuartzComponent, QuartzComponentConstructor } from "./types"
import contentVersion from "../../contentVersion.json" with { type: "json" }

export default (() => {
  const VersionInfo: QuartzComponent = () => {
    return <p>{contentVersion.versionString}</p>
  }
  return VersionInfo
}) satisfies QuartzComponentConstructor
