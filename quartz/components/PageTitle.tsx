import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import contentVersion from "../../contentVersion.json" with { type: "json" }

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div>
      <h2 class={classNames(displayClass, "page-title")}>
        <a href={baseDir}>{title}</a>
      </h2>
      <p class={classNames(displayClass, "version-display")}>{contentVersion.versionString}</p>
    </div>
  )
}

PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
}

.version-display {
  font-size: 0.875rem;
  color: var(--gray);
  margin: 0;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
