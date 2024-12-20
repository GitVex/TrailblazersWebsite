import { ComponentType, JSX } from "preact"
import { StaticResources } from "../util/resources"
import { QuartzPluginData } from "../plugins/vfile"
import { GlobalConfiguration } from "../cfg"
import { Node } from "hast"
import { BuildCtx } from "../util/ctx"

export type QuartzComponentProps = {
  ctx: BuildCtx
  externalResources: StaticResources
  fileData: QuartzPluginData
  cfg: GlobalConfiguration
  children: (QuartzComponent | JSX.Element)[]
  tree: Node
  allFiles: QuartzPluginData[]
  displayClass?: "mobile-only" | "desktop-only"
} & JSX.IntrinsicAttributes & {
  [key: string]: any
}

export type QuartzComponent = ComponentType<QuartzComponentProps> & {
  css?: string
  beforeDOMLoaded?: string
  afterDOMLoaded?: string
}

export type QuartzComponentConstructor<Options extends object | undefined = undefined> = (
  opts: Options,
) => QuartzComponent

interface user {
  username: string,
  role: string
}

export const users: user[] = [
  { username: 'leon', role: 'player' },
  { username: 'erich', role: 'player' },
  { username: 'eric', role: 'player' },
  { username: 'tim', role: 'player' },
  { username: 'max', role: 'player' },
  { username: 'paul', role: 'admin' }

]
